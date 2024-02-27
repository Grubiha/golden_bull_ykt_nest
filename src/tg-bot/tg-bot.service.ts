import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TgBotService implements OnModuleInit {
  private bot: TelegramBot;
  private verify: string;
  getBot(): TelegramBot {
    return this.bot;
  }
  getVeryfy(): string {
    return this.verify;
  }
  genVeryfy() {
    this.verify = randomBytes(8).toString('hex');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  resetVeryfy() {
    this.genVeryfy();
  }

  async onModuleInit() {
    console.log('TgBotService: init');
    this.bot = new TelegramBot(process.env.BOT_API_TOKEN, { polling: true });
    this.genVeryfy();
    console.log(this.verify);
  }
}
