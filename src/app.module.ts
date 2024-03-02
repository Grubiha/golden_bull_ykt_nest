import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ValidateTelegramModule } from './validate-telegram/validate-telegram.module';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    UsersModule,
    TgBotModule,
    CategoriesModule,
    ProductsModule,
    FilesModule,
    AuthModule,
    ValidateTelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
