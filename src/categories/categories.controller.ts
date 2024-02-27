import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  FindManyCategoriesParams,
} from './dto/categories.req.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  getAll(@Query() params: FindManyCategoriesParams) {
    return this.categoriesService.findMany(params);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Delete()
  delete(@Query() dto: DeleteCategoryDto) {
    return this.categoriesService.delete(dto);
  }
}
