import { Module } from '@nestjs/common';
import { EditorsService } from './editors.service';
import { EditorsController } from './editors.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [EditorsService, PrismaService],
  controllers: [EditorsController],
  exports: [EditorsService],
  imports: [UsersModule],
})
export class EditorsModule {}
