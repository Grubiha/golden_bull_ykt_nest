import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';

@Injectable()
export class TopicToUserUpdates implements OnModuleInit {
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

  async onModuleInit() {
    console.log('topic.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('TopicToUserUpdates: run', e);
    });
  }
}
