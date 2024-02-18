import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
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

export class findManyByCategoryDto {
  @ApiProperty()
  @IsUUID()
  readonly id: string;
}
