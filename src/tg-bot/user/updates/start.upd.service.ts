import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UserService } from '../services/user.service';

@Injectable()
export class StartUpdate implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly error: TgBotErrorService,
    private readonly userService: UserService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/start/, async (msg) => {
      this.userService.start(msg);
    });
  }
  async onModuleInit() {
    console.log('user.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('StartUpdates: run', e);
    });
  }
}
