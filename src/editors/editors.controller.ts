import { Body, Controller, Post } from '@nestjs/common';
import { EditorsService } from './editors.service';
import {
  AddEditorByIdDto,
  AddEditorByNicknameDto,
} from './dto/editors.req.dto';
import { Editor } from '@prisma/client';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('editors')
export class EditorsController {
  constructor(private readonly editorsService: EditorsService) {}

  @Post('add-by-id')
  @ApiOkResponse()
  async addById(@Body() dto: AddEditorByIdDto): Promise<Editor> {
    return await this.editorsService.addById(dto);
  }

  @Post('add-by-nickname')
  @ApiOkResponse()
  async addByNickname(@Body() dto: AddEditorByNicknameDto): Promise<Editor> {
    return await this.editorsService.addByNickname(dto);
  }
}
