import { Module } from '@nestjs/common';
import { EditorsService } from './editors.service';
import { EditorsController } from './editors.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EditorsService, PrismaService],
  controllers: [EditorsController],
  exports: [EditorsService],
})
export class EditorsModule {}
