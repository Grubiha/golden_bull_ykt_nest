import { Role } from '@prisma/client';

export class CreateEditorDto {
  readonly telegramId: number;
  readonly nickname?: string;
  readonly role?: Role;
}

export class findEditorByIdDto {
  readonly telegramId: number;
}

export class findEditorByNicknameDto {
  readonly nickname: string;
}
