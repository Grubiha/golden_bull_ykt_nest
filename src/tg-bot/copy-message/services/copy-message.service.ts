import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { UsersService } from 'src/users/users.service';
import { Context, Prisma, Role } from '@prisma/client';
import { setTimeout } from 'timers/promises';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { BotUserService } from 'src/tg-bot/user';
import {
  CopyAllDto,
  ExceptionUser,
  MessagesContext,
} from '../types/copy-message';

@Injectable()
export class CopyMessageService {
  constructor(
    private readonly botService: TgBotService,
    private readonly usersService: UsersService,
    private readonly error: TgBotErrorService,
    private readonly botUserService: BotUserService,
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

  async step0(msg: TelegramBot.Message): Promise<void> {
    const bot = this.botService.getBot();
    const chatId = msg.chat.id;
    //Только личка бота
    if (chatId < 0) return;
    const telegramId = msg.from.id;
    const user = await this.usersService.findUserById({ telegramId });
    //Только зарегистрированные
    if (!this.botUserService.isRegist(chatId, user)) return;
    //Только EDITOR или ADMIN
    if (
      !this.botUserService.checkRole(chatId, user.role, [
        Role.ADMIN,
        Role.EDITOR,
      ])
    )
      return;

    bot.sendMessage(chatId, 'Отправьте сообщение').catch((e) => {
      this.error.regist('CopyToAllUpdate: step0: bot-sendMessage', e);
    });
    const json: MessagesContext = { step: 1 };
    this.usersService
      .setContext({
        telegramId,
        context: Context.COPY_ALL,
        json,
      })
      .catch((e) => {
        this.error.regist('CopyToAllUpdate: step0: db-setContext', e);
      });
  }

  async step1(msg: TelegramBot.Message): Promise<void> {
    const bot = this.botService.getBot();
    const chatId = msg.chat.id;
    //Только личка бота
    if (chatId < 0) return;
    const telegramId = msg.from.id;
    const user = await this.usersService.findUserById({ telegramId });
    //Только зарегистрированные
    if (!this.botUserService.isRegist(chatId, user)) return;
    //Только с контекстом
    if (user.context != Context.COPY_ALL) return;
    //Только step: 1
    const pastJson: MessagesContext = user?.json as Prisma.JsonObject;
    if (pastJson?.step != 1) return;
    //Только EDITOR или ADMIN
    if (
      !this.botUserService.checkRole(chatId, user.role, [
        Role.ADMIN,
        Role.EDITOR,
      ])
    )
      return;

    const messageId = msg.message_id;
    bot
      .copyMessage(chatId, chatId, messageId, {
        reply_markup: {
          inline_keyboard: [[{ text: 'отправить', callback_data: 'send' }]],
        },
      })
      .catch((e) => {
        this.error.regist('CopyToAllUpdate: step1: bot-copyMessage', e);
      });

    this.usersService
      .setContext({ telegramId, json: {}, context: Context.NONE })
      .catch((e) => {
        this.error.regist('CopyToAllUpdate: step1: db-setContext', e);
      });
  }

  async step2(msg: TelegramBot.CallbackQuery) {
    const bot = this.botService.getBot();
    const telegramId = msg.from.id;
    //Только личка бота
    const messageId = msg.message.message_id;
    const data = msg.data;

    if (data === 'send') {
      bot.editMessageReplyMarkup(
        { inline_keyboard: [] },
        { chat_id: telegramId, message_id: messageId },
      );
      await this.copyToAllUsers({
        messageId,
        fromChatId: telegramId,
      }).catch((e) => {
        this.error.regist(
          'CopyToAllUpdate: callback_query: app-copyToAllUsers',
          e,
        );
      });
      bot.deleteMessage(telegramId, messageId).catch((e) => {
        this.error.regist(
          'CopyToAllUpdate: callback_query: bot-deleteMessage',
          e,
        );
      });
    }
  }
}
