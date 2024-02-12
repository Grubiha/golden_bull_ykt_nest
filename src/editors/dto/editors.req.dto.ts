import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddEditorByIdDto {
  @ApiProperty()
  @IsNumber() //правильно ли передавать NULL?
  @Type(() => Number)
  readonly telegramId: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly role?: Role;
}

export class AddEditorByNicknameDto {
  @ApiProperty()
  @IsString()
  readonly nickname: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly role?: Role;
}

export class findEditorByIdDto {
  readonly telegramId: number;
}

export class findEditorByNicknameDto {
  readonly nickname: string;
}
