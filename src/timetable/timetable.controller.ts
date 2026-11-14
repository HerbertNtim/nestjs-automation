
import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TimetableService } from './timetable.service';
import { ExamType, Semester } from './parser/timetable-excel-parser';

interface UploadedTimetableFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

const DEFAULT_SEMESTER: Semester = 'Second Semester';
const DEFAULT_EXAM_TYPE: ExamType = 'End of Semester';

@Controller('timetable')
export class TimetableController {
  constructor(
    private readonly timetableService: TimetableService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fields: 0,
        parts: 1,
      },
    }),
  )
  async uploadTimetable(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: UploadedTimetableFile,
  ) {
    return this.timetableService.importTimetable(file.buffer, {
      semester: DEFAULT_SEMESTER,
      examType: DEFAULT_EXAM_TYPE,
    });
  }
}
