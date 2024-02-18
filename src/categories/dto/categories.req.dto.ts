import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class FindCategoryByIdDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  readonly title: string;
}

export class DeleteCategoryDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}
