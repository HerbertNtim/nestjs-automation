
import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
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

@Controller('timetable')
export class TimetableController {
  constructor(
    private readonly timetableService: TimetableService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        files: 1,
        fields: 2,
        parts: 3,
      },
    }),
  )
  async uploadTimetable(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: UploadedTimetableFile,

    @Body('semester') semester: string,
    @Body('examType') examType: string,
  ) {
    const validSemesters: Semester[] = [
      'First Semester',
      'Second Semester',
      'Supplementary',
    ];

    const validExamTypes: ExamType[] = [
      'Mid Semester',
      'End of Semester',
      'Supplementary Exams',
    ];

    if (!validSemesters.includes(semester as Semester)) {
      throw new BadRequestException('Invalid semester provided.');
    }

    if (!validExamTypes.includes(examType as ExamType)) {
      throw new BadRequestException('Invalid exam type provided.');
    }

    return this.timetableService.importTimetable(file.buffer, {
      semester: semester as Semester,
      examType: examType as ExamType,
    });
  }
}
