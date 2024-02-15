import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { UsersModule } from 'src/users/users.module';
import { IndexUpdates } from './index.updates/index.service';
import { UsersUpdates } from './users.updates/users.update.service';
import { TopicUpdates } from './topics.updates/topic.service';
import { BotMessagesService } from './bot-messages/bot-message.service';
import { MessagesUpdates } from './messages.updates/messages.service';
import { TgBotErrorService } from './tg-bot-error.service';

@Module({
  providers: [
    TgBotService,
    TgBotErrorService,
    IndexUpdates,
    UsersUpdates,
    TopicUpdates,
    BotMessagesService,
    MessagesUpdates,
  ],
  imports: [UsersModule],
})
export class TgBotModule {}
