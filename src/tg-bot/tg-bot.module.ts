import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { UsersModule } from 'src/users/users.module';
import { IndexUpdates } from './index.updates/index.service';
import { UsersUpdates } from './users.updates/users.update.service';
import { TopicUpdates } from './topics.updates/topic.service';
import { BotMessagesService } from './bot-messages/bot-message.service';

@Module({
  providers: [
    TgBotService,
    IndexUpdates,
    UsersUpdates,
    TopicUpdates,
    BotMessagesService,
  ],
  imports: [UsersModule],
})
export class TgBotModule {}
