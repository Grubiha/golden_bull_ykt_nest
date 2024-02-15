import { Injectable } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import { CopyAllDto, ExceptionUser } from './bot-message.dto';
import { UsersService } from 'src/users/users.service';
import { TgBotErrorService } from '../tg-bot-error.service';
import { setTimeout } from 'timers/promises';

@Injectable()
export class BotMessagesService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
  ) {}

  async copyToAllUsers({ messageId, fromChatId }: CopyAllDto) {
    const bot = this.botService.getBot();
    const users = await this.usersService.findAll();
    const exceprions: ExceptionUser[] = [];

    for (const user of users) {
      await Promise.all([
        bot.copyMessage(user.telegramId, fromChatId, messageId).catch(() => {
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
