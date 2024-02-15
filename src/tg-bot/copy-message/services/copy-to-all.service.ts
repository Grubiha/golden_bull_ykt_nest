import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UsersService } from 'src/users/users.service';

import { setTimeout } from 'timers/promises';

interface ExceptionUser {
  nickname: string;
  telegramId: number;
}

class CopyAllDto {
  readonly messageId: number;
  readonly fromChatId: TelegramBot.ChatId;
}

@Injectable()
export class CopyToAllService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
  ) {}

  async copyToAllUsers({ messageId, fromChatId }: CopyAllDto) {
    const bot = this.botService.getBot();
    const users = await this.usersService.findAll();
    const exceprions: ExceptionUser[] = [];

    for (const user of users) {
      await Promise.all([
        bot.copyMessage(user.telegramId, fromChatId, messageId).catch((e) => {
          console.log(e.message);
          exceprions.push({
            nickname: user.nickname,
            telegramId: user.telegramId,
          });
        }),
        setTimeout(1000),
      ]);
    }
    console.log(exceprions);
    return exceprions;
  }
}
