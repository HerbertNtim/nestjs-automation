import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Timetable, TimetableDocument } from './schemas/timetable.schema';
import {
  TimetableExcelParser,
  TimetableImportConfig,
} from './parser/timetable-excel-parser';

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

  // Upload timetable from Excel file
  async importTimetable(buffer: Buffer, config: TimetableImportConfig) {
    const timetableRecords = await this.timetableExcelParser.parse(
      { buffer },
      config,
    );

    const session = await this.timetableModel.db.startSession();

    try {
      let insertedRecords: TimetableDocument[] = [];

      await session.withTransaction(async () => {
        // Remove the existing timetable for this semester and exam type.
        await this.timetableModel
          .deleteMany({
            semester: config.semester,
            examType: config.examType,
          })
          .session(session);

        // Insert the new timetable.
        insertedRecords = await this.timetableModel.insertMany(
          timetableRecords,
          {
            ordered: true,
            session,
          },
        );
      });

      return insertedRecords;
    } finally {
      await session.endSession();
    }
  }

  // Update timetable from Excel file
  async updateTimetable(buffer: Buffer, config: TimetableImportConfig) {
    const timetableRecords = await this.timetableExcelParser.parse(
      { buffer },
      config,
    );

    const operations = [];
    const unmatchedRecords: {
      courseCode: string;
      class: string;
    }[] = [];

    for (const record of timetableRecords) {
      const existingRecords = await this.timetableModel
        .find({
          courseCode: record.courseCode,
          class: record.class,
          semester: config.semester,
          examType: config.examType,
        })
        .select('_id')
        .lean()
        .exec();

      if (existingRecords.length === 0) {
        unmatchedRecords.push({
          courseCode: record.courseCode,
          class: record.class ?? '',
        });
        continue;
      }

      if (existingRecords.length > 1) {
        throw new BadRequestException(
          `Multiple timetable records found for course "${record.courseCode}" and class "${record.class}". Update cannot proceed safely.`,
        );
      }

      operations.push({
        updateOne: {
          filter: { _id: existingRecords[0]._id },
          update: {
            $set: {
              courseCode: record.courseCode,
              courseName: record.courseName,
              session: record.session,
              rooms: record.rooms,
              class: record.class,
              examiners: record.examiners,
              allocationSchedule: record.allocationSchedule,
              date: record.date,
              sortParam: record.sortParam,
            },
          },
        },
      });
    }

    const result = operations.length
      ? await this.timetableModel.bulkWrite(operations, {
          ordered: true,
        })
      : null;

    return {
      message: 'Timetable update completed.',
      updatedCount: result?.modifiedCount ?? 0,
      unmatchedCount: unmatchedRecords.length,
      unmatchedRecords,
    };
  }
}
