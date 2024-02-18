import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { access, mkdir, writeFile, unlink } from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { MulterFile } from './dto/file.dto';

@Injectable()
export class FilesService {
  async deleteFile(fileUrl: string) {
    try {
      const folder = fileUrl.split('/')[1];
      const fileName = fileUrl.split('/')[2];
      const filePath = path.resolve(__dirname, '..', '..', 'static', folder);
      await unlink(path.join(filePath, fileName));
    } catch (err) {
      throw new HttpException(
        'Oшибка при удалении файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveFiles(files: MulterFile[]): Promise<string[]> {
    const res: string[] = await Promise.all(
      files.map(async (file): Promise<string> => {
        const type = file.originalname.split('.')[1];
        const filePath = path.resolve(__dirname, '..', '..', 'static', type);
        try {
          await access(filePath);
        } catch (e) {
          await mkdir(filePath, { recursive: true });
        }

        try {
          await writeFile(path.join(filePath, file.originalname), file.buffer);
        } catch (err) {
          throw new InternalServerErrorException('Oшибка при записи файла');
        }

        return `/${type}/${file.originalname}`;
      }),
    );
    return res;
  }

  private async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  async filterFiles(files: MulterFile[]): Promise<MulterFile[]> {
    const newFiles = await Promise.all(
      files.map(async (file) => {
        const mimetype = file.mimetype;
        const currentFileType = file.mimetype.split('/')[1];
        const newName = v4();
        // const type = file.originalname.split('.')[1];

        if (mimetype.includes('image')) {
          if (currentFileType != 'svg+xml') {
            const buffer = await this.convertToWebP(file.buffer);
            return new MulterFile({
              buffer,
              originalname: `${newName}.webp`,
              mimetype,
            });
          }
          return new MulterFile({
            buffer: file.buffer,
            originalname: `${newName}.svg`,
            mimetype,
          });
        }
        throw new BadRequestException('Файл должен быть изображением');
        // return new MulterFile({buffer: file.buffer, originalname: `${newName}.${type}`, mimetype})
      }),
    );

    return newFiles;
  }
}
