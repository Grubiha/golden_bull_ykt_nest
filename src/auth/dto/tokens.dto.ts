export class Tokens {
  accessToken: string;
  refreshToken: string;
}

export class CreateTokenDto {
  refreshToken: string;
  telegramId: number;
}
