import { TopicService } from './services/topic.service';
import { TopicToUserUpdate } from './updates/topic-to-user.upd.service';
import { UserToTopicUpdate } from './updates/user-to-topic.upd.service';

export {
  TopicToUserUpdate as BotTopicTopicToUserUpdate,
  UserToTopicUpdate as BotTopicUserToTopicUpdate,
  TopicService as BotTopicTopicService,
};
