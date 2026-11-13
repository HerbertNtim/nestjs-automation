import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Timetable, TimetableDocument } from './schemas/timetable.schema';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private readonly timetableModel: Model<TimetableDocument>,
  ) {}

  async getTimetables() {
    return this.timetableModel.find().lean().exec();
  }
}
