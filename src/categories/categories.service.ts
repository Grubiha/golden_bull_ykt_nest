import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  FindCategoryByIdDto,
  FindManyCategoriesParams,
} from './dto/categories.req.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(params: FindManyCategoriesParams): Promise<Category[]> {
    console.log('findCategories');
    return this.prismaService.category.findMany({
      where: params,
    });
  }

  async findOneById({ id }: FindCategoryByIdDto): Promise<Category> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async create({ title }: CreateCategoryDto): Promise<Category> {
    const foundCategory = await this.prismaService.category.findUnique({
      where: { title },
    });
    if (foundCategory)
      throw new BadRequestException('Пользователь уже существует');
    return this.prismaService.category.create({
      data: { title },
    });
  }

  async delete({ id }: DeleteCategoryDto): Promise<Category> {
    const foundCategory = await this.findOneById({ id });
    if (!foundCategory)
      throw new NotFoundException('Пользователя не существует');
    return this.prismaService.category.delete({ where: { id } });
  }
}
