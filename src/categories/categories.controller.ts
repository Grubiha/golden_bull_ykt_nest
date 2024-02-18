import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, DeleteCategoryDto } from './dto/categories.req.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get('all')
  getAll() {
    return this.categoriesService.findAll();
  }

  @Get('pub')
  getMany() {
    return this.categoriesService.findManyPublished();
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
