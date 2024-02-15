import { Injectable } from '@nestjs/common';

@Injectable()
export class TgBotErrorService {
  async regist(message: string, e: any) {
    console.log(`ERROR: ${message}`);
    if (e?.message) console.log(e);
  }
}
