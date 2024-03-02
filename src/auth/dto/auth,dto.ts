import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDto {
  readonly telegramId: number;
  readonly nickname: string;
  readonly role: string;
}

export class AuthDto {
  @ApiProperty()
  @IsString()
  readonly hash: string;
}
