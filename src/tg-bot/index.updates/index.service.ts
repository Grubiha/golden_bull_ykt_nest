import { Injectable, OnModuleInit } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class IndexUpdates implements OnModuleInit {
  constructor(private readonly botService: TgBotService) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/get_my_id/, async (msg) => {
      bot.sendMessage(msg.chat.id, `Your telegram id: ${msg.from.id}`);
    });
    bot.onText(/^\/get_chat_id/, async (msg) => {
      bot.sendMessage(msg.chat.id, `Your chat id: ${msg.chat.id}`);
    });
    bot.onText(/^\/get_topic_id/, async (msg) => {
      bot.sendMessage(msg.chat.id, `Your topic id: ${msg.message_thread_id}`);
    });
  }

  async onModuleInit() {
    console.log('index.updates: init');
    this.run(this.botService.getBot());
  }
}
