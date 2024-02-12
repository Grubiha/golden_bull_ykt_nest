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
