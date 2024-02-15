import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserDto,
  SetSessionDto,
  findUserByIdDto,
  findUserByNicknameDto,
  findUserByThreadDto,
  setTreadDto,
} from './dto/users.req.dto';
import { Context, Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findUserById({ telegramId }: findUserByIdDto): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { telegramId },
    });
  }

  async findUserByNickname({ nickname }: findUserByNicknameDto): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { nickname },
    });
  }

  async findUserByThread({ threadId }: findUserByThreadDto): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { threadId },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const foundUser = await this.findUserById(dto);
    if (foundUser) {
      if (!foundUser.nickname && dto.nickname) {
        return this.prismaService.user.update({
          where: { telegramId: foundUser.telegramId },
          data: { nickname: dto.nickname },
        });
      }
      //Clear context
      this.setContext({
        telegramId: foundUser.telegramId,
        context: Context.NONE,
        json: {},
      });
      return foundUser;
    }
    return this.prismaService.user.create({ data: dto });
  }

  async setThread({ telegramId, threadId }: setTreadDto): Promise<User> {
    return this.prismaService.user.update({
      where: { telegramId },
      data: { threadId },
    });
  }

  async setContext(dto: SetSessionDto): Promise<User> {
    if (dto?.json) {
      const json = dto.json as Prisma.JsonObject;
      return this.prismaService.user.update({
        where: { telegramId: dto.telegramId },
        data: { ...dto, json },
      });
    }
    return this.prismaService.user.update({
      where: { telegramId: dto.telegramId },
      data: { ...dto },
    });
  }
}
