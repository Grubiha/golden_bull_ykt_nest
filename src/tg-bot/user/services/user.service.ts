import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UsersService } from 'src/users/users.service';
import { Role, User } from '@prisma/client';
import { AppMarkup } from '../types/app-makup';

@Injectable()
export class UserService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
  ) {}

  registUser(telegramId: number, nickname: string) {
    this.usersService
      .create({
        telegramId,
        nickname,
      })
      .catch((e) => {
        this.error.regist('StartUpdates: registUser: db-create', e);
      });
  }

  sendApp(chatId: number, firstName: string) {
    const bot = this.botService.getBot();
    const markup = new AppMarkup('App', process.env.APP_NAME);
    bot
      .sendMessage(chatId, `Hi ${firstName}`, markup.getOptions())
      .catch((e) => {
        this.error.regist('StartUpdates: sendApp: bot-sendMessage', e);
      });
  }

  isRegist(chatId: number, user: User): boolean {
    const bot = this.botService.getBot();
    if (user) return true;
    bot.sendMessage(chatId, 'Вы не зарегистрированы').catch((e) => {
      this.error.regist('CopyToAllUpdate: isRegist: bot-sendMessage', e);
    });
    return false;
  }

  checkRole(chatId: number, userRole: Role, allow: Role[]): boolean {
    const bot = this.botService.getBot();
    if (allow.includes(userRole)) return true;
    bot.sendMessage(chatId, 'Нет доступа').catch((e) => {
      this.error.regist('CopyToAllUpdate: checkRole: bot-sendMessage', e);
    });
    return false;
  }

  start(msg: TelegramBot.Message) {
    if (msg.chat.id < 0) return;
    this.registUser(msg.from.id, msg.from.username);
    this.sendApp(msg.chat.id, msg.from.first_name);
  }
}
