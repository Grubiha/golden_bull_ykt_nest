import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from './tokens.service';
import { AuthDto } from './dto/auth,dto';
import { ValidateTelegramService } from 'src/validate-telegram/validate-telegram.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private tokensService: TokensService,
    private validateService: ValidateTelegramService,
  ) {}

  async login(dto: AuthDto) {
    console.log(dto);
    const data = await this.validateService.validateHash(dto);
    console.log(data);
    if (!data['id']) throw new BadRequestException('Не валидный токен');
    const telegramId = +data['id'];

    const user = await this.prismaService.user.findUnique({
      where: { telegramId },
    });
    if (!user) throw new UnauthorizedException('Не авторизован');

    return this.tokensService.setTokens({
      nickname: user.nickname,
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
