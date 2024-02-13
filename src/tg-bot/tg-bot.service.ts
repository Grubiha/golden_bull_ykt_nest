import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TgBotService implements OnModuleInit {
  private bot: TelegramBot;

  getBot(): TelegramBot {
    return this.bot;
  }

  async onModuleInit() {
    console.log('TgBotService: init');
    this.bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });
  }
}
