import { User } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

export class SendOneDto {
  readonly chatId: TelegramBot.ChatId;
  readonly message: string;
  readonly options?: TelegramBot.SendMessageOptions;
}

export class SendOneResp {
  message_id: number;
}

export type ExceptionUser = Pick<User, 'nickname' | 'telegramId'>;

export class CopyOneDto {
  readonly toChatId: TelegramBot.ChatId;
  readonly fromChatId: TelegramBot.ChatId;
  readonly messageId: number;
}

export class CopyAllDto {
  readonly messageId: number;
  readonly fromChatId: TelegramBot.ChatId;
}

export class CopyOneResp {
  message_id: number;
}
