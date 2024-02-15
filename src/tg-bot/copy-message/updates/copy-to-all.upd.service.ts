import { Injectable, OnModuleInit } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';
import { Context, Prisma, Role, User } from '@prisma/client';
import { TgBotService } from 'src/tg-bot/tg-bot.service';
import { TgBotErrorService } from 'src/tg-bot/tg-bot-error.service';
import { CopyToAllService } from '../services/copy-to-all.service';

interface MessagesContext {
  step?: number;
  messageId?: number;
}

@Injectable()
export class CopyToAllUpdate implements OnModuleInit {
  constructor(
    private readonly botService: TgBotService,
    private readonly botMessagesService: CopyToAllService,
    private readonly error: TgBotErrorService,
    private readonly usersService: UsersService,
  ) {}

  async run(bot: TelegramBot) {
    bot.onText(/^\/copy_all/, async (msg) => {
      this.step0(bot, msg);
    });

    bot.onText(/^[^\/]/, async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('photo', async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('sticker', async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('video', async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('video_note', async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('document', async (msg) => {
      this.step1(bot, msg);
    });

    bot.on('callback_query', async (msg) => {
      const telegramId = msg.from.id;
      //Только личка бота
      const messageId = msg.message.message_id;
      const data = msg.data;

      if (data === 'send') {
        await this.botMessagesService
          .copyToAllUsers({
            messageId,
            fromChatId: telegramId,
          })
          .catch((e) => {
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
    });
  }

  private async step0(
    bot: TelegramBot,
    msg: TelegramBot.Message,
  ): Promise<void> {
    const chatId = msg.chat.id;
    //Только личка бота
    if (chatId < 0) return;
    const telegramId = msg.from.id;
    const user = await this.usersService.findUserById({ telegramId });
    //Только зарегистрированные
    if (!this.isRegist(bot, chatId, user)) return;
    //Только EDITOR или ADMIN
    if (!this.checkRole(bot, chatId, user.role, [Role.ADMIN, Role.EDITOR]))
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

  private async step1(
    bot: TelegramBot,
    msg: TelegramBot.Message,
  ): Promise<void> {
    const chatId = msg.chat.id;
    //Только личка бота
    if (chatId < 0) return;
    const telegramId = msg.from.id;
    const user = await this.usersService.findUserById({ telegramId });
    //Только зарегистрированные
    if (!this.isRegist(bot, chatId, user)) return;
    //Только с контекстом
    if (user.context != Context.COPY_ALL) return;
    //Только step: 1
    const pastJson: MessagesContext = user?.json as Prisma.JsonObject;
    if (pastJson?.step != 1) return;
    //Только EDITOR или ADMIN
    if (!this.checkRole(bot, chatId, user.role, [Role.ADMIN, Role.EDITOR]))
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
    const json: MessagesContext = {};
    this.usersService
      .setContext({ telegramId, json, context: Context.NONE })
      .catch((e) => {
        this.error.regist('CopyToAllUpdate: step1: db-setContext', e);
      });
  }

  private isRegist(bot: TelegramBot, chatId: number, user: User): boolean {
    if (user) return true;
    bot.sendMessage(chatId, 'Вы не зарегистрированы').catch((e) => {
      this.error.regist('CopyToAllUpdate: isRegist: bot-sendMessage', e);
    });
    return false;
  }

  private checkRole(
    bot: TelegramBot,
    chatId: number,
    userRole: Role,
    allow: Role[],
  ): boolean {
    if (allow.includes(userRole)) return true;
    bot.sendMessage(chatId, 'Нет доступа').catch((e) => {
      this.error.regist('CopyToAllUpdate: checkRole: bot-sendMessage', e);
    });
    return false;
  }

  async onModuleInit() {
    console.log('messages.updates: init');
    this.run(this.botService.getBot()).catch((e) => {
      this.error.regist('CopyToAllUpdate: run', e);
    });
  }
}
