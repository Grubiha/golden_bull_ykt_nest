import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, TgBotModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
