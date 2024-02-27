import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from './tokens.service';
import { AuthDto } from './dto/auth,dto';
import { TgBotService } from 'src/tg-bot/tg-bot.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService,
    private botService: TgBotService,
  ) {}

  async login({ nickname, verify }: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { nickname },
    });
    if (!user) throw new UnauthorizedException('Нет доступа');

    const botVeryfy = this.botService.getVeryfy();
    if (botVeryfy != verify) throw new UnauthorizedException('Нет доступа');

    return this.tokensService.setTokens({
      nickname,
      telegramId: user.telegramId,
      role: user.role,
    });
  }

  async refresh(refreshToken: string) {
    const foundToken = await this.tokensService.findByToken(refreshToken);
    if (!foundToken) throw new UnauthorizedException('Нет доступа');

    const userData =
      await this.tokensService.validateRefreshToken(refreshToken);

    if (!userData) throw new UnauthorizedException('Нет доступа');

    return this.tokensService.setTokens({
      nickname: userData.nickname,
      telegramId: userData.telegramId,
      role: userData.role,
    });
  }
}
