import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { CopyMessageService } from '../services/copy-message.service';

@Injectable()
export class CopyToAllUpdate implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly copyMessageService: CopyMessageService,
    private readonly error: TgBotErrorService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/copy_all/, async (msg) => {
      this.copyMessageService.step0(msg);
    });

    bot.onText(/^[^\/]/, async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('photo', async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('sticker', async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('video', async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('video_note', async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('document', async (msg) => {
      this.copyMessageService.step1(msg);
    });

    bot.on('callback_query', async (msg) => {
      this.copyMessageService.step2(msg);
    });
  }

  async onModuleInit() {
    console.log('messages.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('CopyToAllUpdate: run', e);
    });
  }
}
