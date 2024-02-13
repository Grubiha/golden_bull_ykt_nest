import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { UsersModule } from 'src/users/users.module';
import { IndexUpdates } from './index.updates/index.service';
import { UsersUpdates } from './users.updates/users.update.service';
import { TopicUpdates } from './topics.updates/topic.service';

@Module({
  providers: [TgBotService, IndexUpdates, UsersUpdates, TopicUpdates],
  imports: [UsersModule],
})
export class TgBotModule {}
