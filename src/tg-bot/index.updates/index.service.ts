import { Injectable, OnModuleInit } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotErrorService } from '../tg-bot-error.service';

@Injectable()
export class IndexUpdates implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly error: TgBotErrorService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/get_my_id/, async (msg) => {
      bot
        .sendMessage(msg.chat.id, `Your telegram id: ${msg.from.id}`)
        .catch(() => {
          this.error.regist('index updates: get_my_id: bot-sendMessage');
        });
    });
    bot.onText(/^\/get_chat_id/, async (msg) => {
      bot.sendMessage(msg.chat.id, `Your chat id: ${msg.chat.id}`).catch(() => {
        this.error.regist('index updates: get_chat_id: bot-sendMessage');
      });
    });
    bot.onText(/^\/get_topic_id/, async (msg) => {
      bot
        .sendMessage(msg.chat.id, `Your topic id: ${msg.message_thread_id}`)
        .catch(() => {
          this.error.regist('index updates: get_topic_id: bot-sendMessage');
        });
    });
  }

  async onModuleInit() {
    console.log('index.updates: init');
    this.run(this.botService.getBot()).catch(() => {
      this.error.regist('index updates: run');
    });
  }
}
