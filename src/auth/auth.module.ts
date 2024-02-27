import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from './tokens.service';
import { TgBotModule } from 'src/tg-bot/tg-bot.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, PrismaService, TokensService],
  imports: [JwtModule.register({}), TgBotModule],
  controllers: [AuthController],
})
export class AuthModule {}
