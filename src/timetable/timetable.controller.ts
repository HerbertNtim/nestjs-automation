
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TimetableService } from './timetable.service';

interface UploadedExcelFile {
  buffer: Buffer;
}

@Controller('timetable')
export class TimetableController {
  constructor(
    private readonly timetableService: TimetableService,
  ) {}

  @Post('/rooms')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRooms(@UploadedFile() file: UploadedExcelFile) {
    if (!file) {
      throw new BadRequestException('Please upload an Excel file.');
    }

    return this.timetableService.uploadRooms(file.buffer);
  }
}
