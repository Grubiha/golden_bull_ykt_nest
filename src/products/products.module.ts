import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [ProductsService, PrismaService],
  controllers: [ProductsController],
  imports: [FilesModule],
})
export class ProductsModule {}
