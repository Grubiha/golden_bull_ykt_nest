import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  FindCategoryByIdDto,
} from './dto/categories.req.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<Category[]> {
    return this.prismaService.category.findMany();
  }
  async findOneById({ id }: FindCategoryByIdDto): Promise<Category> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async create({ name }: CreateCategoryDto): Promise<Category> {
    const foundCategory = this.prismaService.category.findUnique({
      where: { name },
    });
    if (foundCategory) return;
    return this.prismaService.category.create({
      data: { name },
    });
  }

  async delete({ id }: DeleteCategoryDto): Promise<Category> {
    const foundCategory = this.findOneById({ id });
    if (!foundCategory) return;
    return this.prismaService.category.delete({ where: { id } });
  }
}
