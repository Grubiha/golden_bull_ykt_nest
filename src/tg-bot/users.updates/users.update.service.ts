import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from '../tg-bot.service';
import { UsersService } from 'src/users/users.service';
import { AppMarkup } from './app.markup';
import { TgBotErrorService } from '../tg-bot-error.service';

@Injectable()
export class UsersUpdates implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/start/, async (msg) => {
      // Только личка
      if (msg.chat.id < 0) return;
      this.registUser(msg.from.id, msg.from.username);
      this.sendApp(bot, msg.chat.id, msg.from.first_name);
    });
  }

  private registUser(telegramId: number, nickname: string) {
    this.usersService
      .create({
        telegramId,
        nickname,
      })
      .catch(() => {
        this.error.regist('users updates: registUser: db-create');
      });
  }

  private sendApp(bot: TelegramBot, chatId: number, firstName: string) {
    const markup = new AppMarkup('App', process.env.APP_NAME);
    bot
      .sendMessage(chatId, `Hi ${firstName}`, markup.getOptions())
      .catch(() => {
        this.error.regist('users updates: aendApp: bot-sendMessage');
      });
  }

  async onModuleInit() {
    console.log('user.updates: init');
    this.run(this.botService.getBot()).catch(() => {
      this.error.regist('users updates: run');
    });
  }
}
