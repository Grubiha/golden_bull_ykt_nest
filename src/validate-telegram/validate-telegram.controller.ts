import { Body, Controller, Post } from '@nestjs/common';
import { ValidateTelegramService } from './validate-telegram.service';
import { ValidateTelegramDto } from './dto';

@Controller('validate-telegram')
export class ValidateTelegramController {
  constructor(private readonly validateService: ValidateTelegramService) {}

  @Post()
  validate(@Body() dto: ValidateTelegramDto) {
    return this.validateService.validateHash(dto);
  }
}
