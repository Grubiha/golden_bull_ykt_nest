import TelegramBot from 'node-telegram-bot-api';

export class AppMarkup {
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
              url: `https://t.me/${this.botName}/${this.appName}`,
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
