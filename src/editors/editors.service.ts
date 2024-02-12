import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  AddEditorByIdDto,
  AddEditorByNicknameDto,
  findEditorByIdDto,
  findEditorByNicknameDto,
} from './dto/editors.req.dto';
import { Editor } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EditorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findEditorById({ telegramId }: findEditorByIdDto): Promise<Editor> {
    return this.prismaService.editor.findUnique({
      where: { telegramId },
    });
  }

  async findEditorByNickname({
    nickname,
  }: findEditorByNicknameDto): Promise<Editor> {
    return this.prismaService.editor.findFirst({
      where: {
        user: { nickname },
      },
    });
  }

  async addById(dto: AddEditorByIdDto): Promise<Editor> {
    const [foundUser, foundEditor] = await Promise.all([
      this.usersService.findUserById(dto),
      this.findEditorById(dto),
    ]);
    if (foundEditor) throw new Error('Уже существует');
    if (!foundUser) throw new Error('Пользователь не найден');

    return this.prismaService.editor.create({ data: dto });
  }

  async addByNickname(dto: AddEditorByNicknameDto): Promise<Editor> {
    const [foundUser, foundEditor] = await Promise.all([
      this.usersService.findUserByNickname(dto),
      this.findEditorByNickname(dto),
    ]);
    if (foundEditor) throw new Error('Уже существует');
    if (!foundUser) throw new Error('Пользователь не найден');

    return this.prismaService.editor.create({
      data: { ...dto, telegramId: foundUser.telegramId },
    });
  }
}
