import { Context } from '@prisma/client';

export class CreateUserDto {
  readonly telegramId: number;
  readonly nickname?: string;
}

export class findUserByIdDto {
  readonly telegramId: number;
}

export class findUserByNicknameDto {
  readonly nickname: string;
}

export class setTreadDto {
  readonly telegramId: number;
  readonly threadId: number;
}

export class findUserByThreadDto {
  readonly threadId: number;
}

export class SetSessionDto {
  readonly context?: Context;
  readonly telegramId: number;
  readonly json?: object;
}
