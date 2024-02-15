import { Injectable } from '@nestjs/common';

@Injectable()
export class TgBotErrorService {
  async regist(message: string) {
    console.log(`ERROR: ${message}`);
  }
}
