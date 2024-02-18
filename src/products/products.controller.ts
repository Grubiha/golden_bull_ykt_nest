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
  findManyByCategoryDto,
} from './dto/products.req.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get('all')
  getAll() {
    return this.productsService.findAll();
  }

  @Get('pub')
  getMany() {
    return this.productsService.findManyPublished();
  }

  @Get('by_category')
  getByCategory(@Query() dto: findManyByCategoryDto) {
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
