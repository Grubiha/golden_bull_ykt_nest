import { Role } from '@prisma/client';

export class AddEditorByIdDto {
  readonly telegramId: number;
  readonly role?: Role;
}

export class AddEditorByNicknameDto {
  readonly nickname: string;
  readonly role?: Role;
}

export class findEditorByIdDto {
  readonly telegramId: number;
}

export class findEditorByNicknameDto {
  readonly nickname: string;
}
