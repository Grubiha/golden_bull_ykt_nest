import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  AddImagesDto,
  CreateProductDto,
  DeleteProductDto,
  FindManyByCategoryDto,
  FindManyProductsParams,
} from './dto/products.req.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('all')
  getAll(@Query() params: FindManyProductsParams) {
    return this.productsService.findMany(params);
  }

  @Get('by_category')
  getByCategory(@Query() dto: FindManyByCategoryDto) {
    return this.productsService.findManyByCategory(dto);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    console.log(dto);
    return this.productsService.create(dto);
  }

  @Patch()
  @UseInterceptors(FilesInterceptor('image', 1))
  addImage(
    @Query() dto: AddImagesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.addImage(dto, files);
  }

  @Delete()
  delete(@Query() dto: DeleteProductDto) {
    return this.productsService.delete(dto);
  }
}
