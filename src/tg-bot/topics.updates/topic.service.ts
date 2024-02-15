import { Injectable, OnModuleInit } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';
import { Context } from '@prisma/client';
import { TgBotErrorService } from '../tg-bot-error.service';

interface Topic {
  message_thread_id: number;
  name: string;
  icon_color: number;
}

@Injectable()
export class TopicUpdates implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^[^\/]/, async (msg) => {
      this.start(bot, msg);
    });
    bot.on('photo', async (msg) => {
      this.start(bot, msg);
    });

    bot.on('sticker', async (msg) => {
      this.start(bot, msg);
    });

    bot.on('video', async (msg) => {
      this.start(bot, msg);
    });

    bot.on('video_note', async (msg) => {
      this.start(bot, msg);
    });

    bot.on('document', async (msg) => {
      this.start(bot, msg);
    });
  }

  private async start(bot: TelegramBot, msg: TelegramBot.Message) {
    const chatThreadId = msg?.message_thread_id;
    const mainGroupId = -process.env.MAIN_GROUP_ID;
    const messageId = msg.message_id;
    const chatId = msg.chat.id;

    //Пишем из топика группы
    if (chatThreadId && mainGroupId === chatId) {
      const user = await this.usersService.findUserByThread({
        threadId: chatThreadId,
      });
      if (!user) {
        bot
          .sendMessage(mainGroupId, 'Пользователь не найден', {
            message_thread_id: chatThreadId,
          })
          .catch(() => {
            this.error.regist(
              'topic-user updates: start: from topic: bot-пользователь не найден',
            );
          });
        return;
      }
      bot.copyMessage(user.telegramId, mainGroupId, messageId, {}).catch(() => {
        this.error.regist(
          'topic-user updates: start: from topic: bot-copyMessage',
        );
      });
      return;
    }
    //Пишем из бота
    if (chatId < 0) return;

    const user = await this.usersService.findUserById({
      telegramId: chatId,
    });
    //Только зарегистрированные
    if (!user) {
      bot.sendMessage(chatId, '/start');
      return;
    }

    //Только без контекста
    if (user.context != Context.NONE) return;

    bot
      .copyMessage(mainGroupId, chatId, messageId, {
        message_thread_id: user.threadId,
      })
      .catch(async () => {
        // @ts-ignore
        const topic: Topic = await bot
          .createForumTopic(mainGroupId, `Ник: ${msg.from.username}`)
          .catch(() => {
            this.error.regist(
              'topic-user updates: start: from chat-bot: bot-createForumTopic',
            );
            return;
          });
        this.usersService
          .setThread({
            telegramId: user.telegramId,
            threadId: topic.message_thread_id,
          })
          .catch(() => {
            this.error.regist(
              'topic-user updates: start: from chat-bot: bot-setThread',
            );
          });
        bot
          .copyMessage(mainGroupId, chatId, messageId, {
            message_thread_id: topic.message_thread_id,
          })
          .catch(() => {
            this.error.regist(
              'topic-user updates: start: from chat-bot: bot-copyMessage',
            );
          });
      });
  }

  async onModuleInit() {
    console.log('topic.updates: init');
    this.run(this.botService.getBot()).catch(() => {
      this.error.regist('topic updates: run');
    });
  }
}
