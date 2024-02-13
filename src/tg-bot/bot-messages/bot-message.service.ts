import { Injectable } from '@nestjs/common';
import { TgBotService } from '../tg-bot.service';
import {
  CopyAllDto,
  CopyOneDto,
  ExceptionUser,
  SendOneDto,
  SendOneResp,
} from './bot-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BotMessagesService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
  ) {}

  async copyOne({
    toChatId,
    fromChatId,
    messageId,
  }: CopyOneDto): Promise<CopyOneDto> {
    const bot = this.botService.getBot();
    //@ts-ignore
    return bot.copyMessage(toChatId, fromChatId, messageId);
  }

  async copyToAllUsers({ messageId, fromChatId }: CopyAllDto) {
    const users = await this.usersService.findAll();
    const exceprions: ExceptionUser[] = [];
    users.forEach(async (user) => {
      await this.copyOne({
        toChatId: user.telegramId,
        fromChatId,
        messageId,
      }).catch(() => {
        exceprions.push({
          nickname: user.nickname,
          telegramId: user.telegramId,
        });
      });
    });
    return exceprions;
  }

  async sendOne({
    chatId,
    message,
    options = {},
  }: SendOneDto): Promise<SendOneResp> {
    const bot = this.botService.getBot();
    //@ts-ignore
    return bot.sendMessage(chatId, message, options);
  }

  async sendToAllUsers(message: string): Promise<ExceptionUser[]> {
    const users = await this.usersService.findAll();
    const exceprions: ExceptionUser[] = [];
    users.forEach(async (user) => {
      await this.sendOne({ chatId: user.telegramId, message }).catch(() => {
        exceprions.push({
          nickname: user.nickname,
          telegramId: user.telegramId,
        });
      });
    });
    return exceprions;
  }
}
