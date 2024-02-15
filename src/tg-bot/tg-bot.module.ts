import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { UsersModule } from 'src/users/users.module';
import { IndexUpdates } from './index.upd.service';
import { TgBotErrorService } from './tg-bot-error.service';
import { CopyToAllUpdate } from './copy-message/updates/copy-to-all.upd.service';
import { CopyToAllService } from './copy-message/services/copy-to-all.service';
import { TopicToUserUpdates } from './topic/updates/topic-to-user.upd.service';
import { UserToTopicUpdates } from './topic/updates/user-to-topic.upd.service';
import { StartUpdates } from './user/updates/start.upd.service';

@Module({
  providers: [
    TgBotService,
    TgBotErrorService,
    IndexUpdates,
    StartUpdates,
    TopicToUserUpdates,
    UserToTopicUpdates,
    CopyToAllService,
    CopyToAllUpdate,
  ],
  imports: [UsersModule],
})
export class TgBotModule {}
