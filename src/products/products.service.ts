import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  AddImagesDto,
  CreateProductDto,
  DeleteProductDto,
  FindManyByCategoryDto,
  FindManyProductsParams,
  FindProductByIdDto,
} from './dto/products.req.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private fileService: FilesService,
  ) {}

  async findMany(params: FindManyProductsParams): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: params,
    });
  }

  async findManyByCategory({
    id,
    published,
  }: FindManyByCategoryDto): Promise<Product[]> {
    console.log('findProducts');
    return this.prismaService.product.findMany({
      where: {
        published,
        categories: { some: { id } },
      },
    });
  }

  async findOneById({ id }: FindProductByIdDto): Promise<Product> {
    return this.prismaService.product.findUnique({
      where: { id },
    });
  }

  async create(
    dto: CreateProductDto,
    // files: Express.Multer.File[],
  ): Promise<Product> {
    const [foundProduct, categories] = await Promise.all([
      this.prismaService.product.findUnique({
        where: { title: dto.title },
      }),
      Promise.all(
        dto.categories.map(async (categoryId) => {
          const category = await this.prismaService.category
            .findUnique({
              where: { id: categoryId },
            })
            .catch(() => {
              throw new BadRequestException('Категория не найдена');
            });
          if (category) return { id: categoryId };
        }),
      ),
    ]);

    if (foundProduct)
      throw new BadRequestException('Пользователь уже существует');
    // console.log(foundCategory);

    return this.prismaService.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        categories: {
          connect: categories,
        },
      },
    });
  }

  async addImage(
    dto: AddImagesDto,
    files: Express.Multer.File[],
  ): Promise<Product> {
    const foundProduct = await this.findOneById({ id: dto.id });
    if (!foundProduct) throw new NotFoundException('Продукт не найден');

    const newFiles = await this.fileService.filterFiles(files);
    const images = await this.fileService.saveFiles(newFiles);

    return this.prismaService.product.update({
      where: { id: dto.id },
      data: { images },
    });
  }

  async delete({ id }: DeleteProductDto): Promise<Product> {
    const foundProduct = await this.findOneById({ id });
    if (!foundProduct) throw new NotFoundException('Продукт не найден');
    for (const url of foundProduct.images)
      await this.fileService.deleteFile(url);
    return this.prismaService.product.delete({ where: { id } });
  }
}
