import TelegramBot from 'node-telegram-bot-api';

export interface ExceptionUser {
  nickname: string;
  telegramId: number;
}

export class CopyAllDto {
  readonly messageId: number;
  readonly fromChatId: TelegramBot.ChatId;
}

export interface MessagesContext {
  step?: number;
  messageId?: number;
}
