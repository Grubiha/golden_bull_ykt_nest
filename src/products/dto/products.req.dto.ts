import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  readonly title: string;
  @ApiProperty()
  @IsString()
  readonly description: string;
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly categories: string[];
}

export class AddImagesDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}

export class DeleteProductDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}

export class FindProductByIdDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}

export class FindManyByCategoryDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly published: boolean;
}

export class FindManyProductsParams {
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  readonly published: boolean;
  // @ApiProperty()
  // @IsUUID()
  // readonly id: string;
}
