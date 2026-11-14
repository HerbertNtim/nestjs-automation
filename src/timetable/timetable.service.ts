
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Timetable,
  TimetableDocument,
} from './schemas/timetable.schema';
import { TimetableExcelParser, TimetableImportConfig } from './parser/timetable-excel-parser';
;

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private readonly timetableModel: Model<TimetableDocument>,

    private readonly timetableExcelParser: TimetableExcelParser,
  ) {}

  async getTimetables() {
    return this.timetableModel.find().lean().exec();
  }

  async importTimetable(
    buffer: Buffer,
    config: TimetableImportConfig,
  ) {
    const timetables = await this.timetableExcelParser.parse(
      { buffer },
      config,
    );

    return this.timetableModel.insertMany(timetables);
  }
}
