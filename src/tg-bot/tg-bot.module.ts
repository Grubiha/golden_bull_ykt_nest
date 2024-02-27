import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { UsersModule } from 'src/users/users.module';
import { BotIndexUpdates } from './index.upd.service';
import { TgBotErrorService } from './tg-bot-error.service';
import { BotUserService, BotUserStartUpdate } from './user';
import {
  BotTopicTopicService,
  BotTopicTopicToUserUpdate,
  BotTopicUserToTopicUpdate,
} from './topic';
import {
  BotCopyMessageCopyMessageService,
  BotCopyMessageCopyToAllUpdate,
} from './copy-message';

@Module({
  providers: [
    TgBotService,
    TgBotErrorService,
    BotIndexUpdates,
    BotUserService,
    BotUserStartUpdate,
    BotTopicTopicService,
    BotTopicTopicToUserUpdate,
    BotTopicUserToTopicUpdate,
    BotCopyMessageCopyMessageService,
    BotCopyMessageCopyToAllUpdate,
  ],
  imports: [UsersModule],
  exports: [TgBotService],
})
export class TgBotModule {}
