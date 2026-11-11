import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor('file'))
  async uploadRooms(@UploadedFile() file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  }) {
    if (!file) {
      throw new BadRequestException('Please upload a valid Excel file.');
    }

    return this.roomService.importRooms(file.buffer);
  }
}
