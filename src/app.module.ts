import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EditorsModule } from './editors/editors.module';
import { TgBotModule } from './tg-bot/tg-bot.module';

@Module({
  imports: [UsersModule, EditorsModule, TgBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
