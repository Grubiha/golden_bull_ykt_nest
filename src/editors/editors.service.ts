import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateEditorDto,
  findEditorByIdDto,
  findEditorByNicknameDto,
} from './dto/editors.req.dto';
import { Editor } from '@prisma/client';

@Injectable()
export class EditorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findEditorById({ telegramId }: findEditorByIdDto): Promise<Editor> {
    return this.prismaService.editor.findUnique({
      where: { telegramId },
    });
  }

  async findEditorByNickname({
    nickname,
  }: findEditorByNicknameDto): Promise<Editor> {
    return this.prismaService.editor.findUnique({
      where: { nickname },
    });
  }

  async create(dto: CreateEditorDto): Promise<Editor> {
    const foundEditor = await this.findEditorById(dto);
    if (foundEditor) {
      if (!foundEditor.nickname && dto.nickname) {
        return this.prismaService.editor.update({
          where: foundEditor,
          data: { nickname: dto.nickname },
        });
      }
      return foundEditor;
    }

    return this.prismaService.editor.create({ data: dto });
  }
}
