import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from './tokens.service';
import { TgBotModule } from 'src/tg-bot/tg-bot.module';
import { AuthController } from './auth.controller';
import { ValidateTelegramModule } from 'src/validate-telegram/validate-telegram.module';

@Module({
  providers: [AuthService, PrismaService, TokensService],
  imports: [JwtModule.register({}), TgBotModule, ValidateTelegramModule],
  controllers: [AuthController],
})
export class AuthModule {}
