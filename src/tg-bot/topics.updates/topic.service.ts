import { Injectable, OnModuleInit } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';

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
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^[^\/]/, async (msg) => {
      const chatThreadId = msg?.message_thread_id;
      const mainGroupId = -process.env.MAIN_GROUP_ID;
      const messageId = msg.message_id;
      const chatId = msg.chat.id;

      if (chatThreadId && mainGroupId === chatId) {
        const user = await this.usersService.findUserByThread({
          threadId: chatThreadId,
        });
        if (!user) {
          bot.sendMessage(mainGroupId, 'Пользователь не найден').catch(() => {
            return;
          });
          return;
        }
        bot.copyMessage(user.telegramId, mainGroupId, messageId).catch(() => {
          return;
        });
        return;
      }

      if (chatId < 0) return;

      const user = await this.usersService.findUserById({
        telegramId: chatId,
      });
      if (!user) return;

      bot
        .copyMessage(mainGroupId, chatId, messageId, {
          message_thread_id: user.threadId,
        })
        .catch(async () => {
          // @ts-ignore
          const topic: Topic = await bot
            .createForumTopic(mainGroupId, `Ник: ${msg.from.username}`)
            .catch(() => {
              return;
            });
          console.log(topic.message_thread_id);
          this.usersService.setThread({
            telegramId: user.telegramId,
            threadId: topic.message_thread_id,
          });
          bot
            .copyMessage(mainGroupId, chatId, messageId, {
              message_thread_id: topic.message_thread_id,
            })
            .catch(() => {
              return;
            });
        });
    });
  }

  async onModuleInit() {
    console.log('topic.updates: init');
    this.run(this.botService.getBot());
  }
}
