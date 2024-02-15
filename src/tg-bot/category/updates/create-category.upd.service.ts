import { Injectable, OnModuleInit } from '@nestjs/common';
// import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';

@Injectable()
export class CopyToAllUpdate implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly error: TgBotErrorService,
  ) {}

  // async run(bot: TelegramBot) {
  //   // bot.onText(/^\/copy_all/, async (msg) => {
  //   //   this.copyToAllService.step0(bot, msg);
  //   // });

  //   // bot.onText(/^[^\/]/, async (msg) => {
  //   //   this.copyToAllService.step1(bot, msg);
  //   // });
  // }
  async onModuleInit() {
    console.log('messages.updates: init');
    // this.run(this.botService.getBot()).catch((e) => {
    //   this.error.regist('CopyToAllUpdate: run', e);
    // });
  }
}
