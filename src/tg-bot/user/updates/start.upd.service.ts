import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UsersService } from 'src/users/users.service';

class AppMarkup {
  readonly text: string;
  readonly appName: string;
  readonly botName: string;

  getOptions(): TelegramBot.SendMessageOptions {
    const options: TelegramBot.SendMessageOptions = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: this.text,
              url: `https://t.me/${this.botName}/${this.appName}/`,
            },
          ],
        ],
      },
    };
    return options;
  }

  constructor(text: string, appName: string) {
    this.text = text;
    this.appName = appName;
    this.botName = process.env.BOT_NAME;
  }
}

@Injectable()
export class StartUpdates implements OnModuleInit {
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
      .catch((e) => {
        this.error.regist('StartUpdates: registUser: db-create', e);
      });
  }

  private sendApp(bot: TelegramBot, chatId: number, firstName: string) {
    const markup = new AppMarkup('App', process.env.APP_NAME);
    bot
      .sendMessage(chatId, `Hi ${firstName}`, markup.getOptions())
      .catch((e) => {
        this.error.regist('StartUpdates: sendApp: bot-sendMessage', e);
      });
  }

  async onModuleInit() {
    console.log('user.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('StartUpdates: run', e);
    });
  }
}
