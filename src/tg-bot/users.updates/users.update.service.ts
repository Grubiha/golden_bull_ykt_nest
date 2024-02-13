import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from '../tg-bot.service';
import { UsersService } from 'src/users/users.service';
import { AppMarkup } from './app.markup';

@Injectable()
export class UsersUpdates implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/start/, async (msg) => {
      this.usersService.create({
        telegramId: msg.from.id,
        nickname: msg.from.username,
      });

      const markup = new AppMarkup('App', process.env.APP_NAME);

      bot.sendMessage(
        msg.chat.id,
        `Hi ${msg.from.first_name}`,
        markup.getOptions(),
      );
    });
  }

  async onModuleInit() {
    console.log('user.updates: init');
    this.run(this.botService.getBot());
  }
}
