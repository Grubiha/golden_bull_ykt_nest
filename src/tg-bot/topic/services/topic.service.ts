import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UsersService } from 'src/users/users.service';
import { Context } from '@prisma/client';

interface Topic {
  message_thread_id: number;
  name: string;
  icon_color: number;
}

@Injectable()
export class TopicService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
  ) {}
  async topicToUser(msg: TelegramBot.Message) {
    const bot = this.botService.getBot();
    const chatThreadId = msg?.message_thread_id;
    const mainGroupId = -process.env.MAIN_GROUP_ID;
    const messageId = msg.message_id;
    const chatId = msg.chat.id;

    if (chatThreadId && mainGroupId === chatId) {
      const user = await this.usersService.findUserByThread({
        threadId: chatThreadId,
      });
      if (!user) {
        bot
          .sendMessage(mainGroupId, 'Пользователь не найден', {
            message_thread_id: chatThreadId,
          })
          .catch((e) => {
            this.error.regist('TopicToUserUpdates: start: bot-sendMessage', e);
          });
        return;
      }
      bot
        .copyMessage(user.telegramId, mainGroupId, messageId, {})
        .catch((e) => {
          this.error.regist('TopicToUserUpdates: start: bot-copyMessage', e);
        });
      return;
    }
  }

  async userToTopic(msg: TelegramBot.Message) {
    const bot = this.botService.getBot();
    const mainGroupId = -process.env.MAIN_GROUP_ID;
    const messageId = msg.message_id;
    const chatId = msg.chat.id;
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
          .catch((e) => {
            this.error.regist(
              'UserToTopicUpdates: start: bot-createForumTopic',
              e,
            );
            return;
          });
        this.usersService
          .setThread({
            telegramId: user.telegramId,
            threadId: topic.message_thread_id,
          })
          .catch((e) => {
            this.error.regist('UserToTopicUpdates: start: bot-setThread', e);
          });
        bot
          .copyMessage(mainGroupId, chatId, messageId, {
            message_thread_id: topic.message_thread_id,
          })
          .catch((e) => {
            this.error.regist('UserToTopicUpdates: start: bot-copyMessage', e);
          });
      });
  }
}
