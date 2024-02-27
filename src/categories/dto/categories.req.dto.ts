import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

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

export class FindManyCategoriesParams {
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly published: boolean;
}
