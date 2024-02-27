import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { CreateTokenDto, Tokens } from './dto/tokens.dto';
import { UserDto } from './dto/auth,dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async setTokens({ telegramId, nickname, role }: UserDto) {
    const { refreshToken, accessToken } = await this.generateTokens({
      telegramId,
      nickname,
      role,
    });
    this.saveRefreshToken({ refreshToken, telegramId });
    return { accessToken, refreshToken, user: { telegramId, nickname, role } };
  }

  async findByToken(refreshToken: string) {
    return this.prismaService.token.findUnique({
      where: { refreshToken },
    });
  }

  async generateTokens(payload: UserDto): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRE + 'm',
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRE + 'd',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async saveRefreshToken({
    refreshToken,
    telegramId,
  }: CreateTokenDto): Promise<Token> {
    const foundToken = await this.prismaService.token.findUnique({
      where: { telegramId },
    });
    if (foundToken) {
      return this.prismaService.token.update({
        where: { telegramId },
        data: { refreshToken },
      });
    }
    return this.prismaService.token.create({
      data: { telegramId, refreshToken },
    });
  }

  async deleteByToken(refreshToken: string): Promise<Token> {
    return this.prismaService.token.delete({ where: { refreshToken } });
  }

  async validateRefreshToken(refreshToken: string): Promise<UserDto> {
    if (!refreshToken) {
      return null;
    }
    try {
      const { telegramId, nickname, role } = await this.jwtService.verify(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      return { telegramId, nickname, role };
    } catch (e) {
      return null;
    }
  }
}
