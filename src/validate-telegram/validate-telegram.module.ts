import { Module } from '@nestjs/common';
import { ValidateTelegramController } from './validate-telegram.controller';
import { ValidateTelegramService } from './validate-telegram.service';

@Module({
  controllers: [ValidateTelegramController],
  providers: [ValidateTelegramService],
  exports: [ValidateTelegramService],
})
export class ValidateTelegramModule {}
