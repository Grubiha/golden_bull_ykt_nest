import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserDto,
  findUserByIdDto,
  findUserByNicknameDto,
} from './dto/users.req.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async create(dto: CreateUserDto): Promise<User> {
    const foundUser = await this.findUserById(dto);
    if (foundUser) {
      if (!foundUser.nickname && dto.nickname) {
        return this.prismaService.user.update({
          where: foundUser,
          data: { nickname: dto.nickname },
        });
      }
      return foundUser;
    }
    return this.prismaService.user.create({ data: dto });
  }
}
