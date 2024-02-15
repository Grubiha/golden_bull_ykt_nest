import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { TopicService } from '../services/topic.service';

@Injectable()
export class UserToTopicUpdate implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly error: TgBotErrorService,
    private readonly topicService: TopicService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^[^\/]/, async (msg) => {
      this.topicService.userToTopic(msg);
    });
    bot.on('photo', async (msg) => {
      this.topicService.userToTopic(msg);
    });

    bot.on('sticker', async (msg) => {
      this.topicService.userToTopic(msg);
    });

    bot.on('video', async (msg) => {
      this.topicService.userToTopic(msg);
    });

    bot.on('video_note', async (msg) => {
      this.topicService.userToTopic(msg);
    });

    bot.on('document', async (msg) => {
      this.topicService.userToTopic(msg);
    });
  }

  async onModuleInit() {
    console.log('topic.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('UserToTopicUpdates: run', e);
    });
  }
}
