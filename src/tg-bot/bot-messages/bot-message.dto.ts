import TelegramBot from 'node-telegram-bot-api';

export type ExceptionUser = {
  nickname: string;
  telegramId: number;
};

export class CopyAllDto {
  readonly messageId: number;
  readonly fromChatId: TelegramBot.ChatId;
}
