import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ExcelParser,
  GetFileParams,
} from '../../common/parsers/excel-parser';
import {
  Room,
  RoomDocument,
} from '../../rooms/schemas/room.schema';
import { Timetable } from '../schemas/timetable.schema';

export type Semester =
  | 'First Semester'
  | 'Second Semester'
  | 'Supplementary';

export type ExamType =
  | 'Mid Semester'
  | 'End of Semester'
  | 'Supplementary Exams';

export interface TimetableImportConfig {
  semester: Semester;
  examType: ExamType;
}

type ParsedTimetable = Pick<
  Timetable,
  | 'courseCode'
  | 'courseName'
  | 'session'
  | 'rooms'
  | 'examType'
  | 'semester'
  | 'date'
  | 'sortParam'
  | 'time'
  | 'examiners'
  | 'class'
  | 'allocationSchedule'
>;

@Injectable()
export class TimetableExcelParser extends ExcelParser {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {
    super();
  }

  async parse(
    params: GetFileParams,
    config: TimetableImportConfig,
  ): Promise<ParsedTimetable[]> {
    const worksheet = await this.getWorkSheet(params);

    if (!worksheet) {
      throw new BadRequestException('No Excel file was provided.');
    }

    const existingRooms = await this.roomModel
      .find()
      .select('_id name')
      .lean()
      .exec();

    const roomMap = new Map(
      existingRooms.map((room) => [room.name, room._id]),
    );

    const timetables: ParsedTimetable[] = [];

    worksheet.getColumn(1).eachCell((cell) => {
      const paperDetails = cell.text.trim();

      if (!paperDetails) return;

      const parts = paperDetails.split('%');

      if (parts.length < 9) {
        throw new BadRequestException(
          `Invalid timetable data at row ${cell.row}. Expected at least 9 fields.`,
        );
      }

      const courseCode = parts[0].trim();
      const courseName = parts[1].trim();
      const examinerName = parts[2].trim();
      const paperClass = parts[3].trim();

      const roomNames = parts[5]
        .split('/')
        .map((name) => name.trim())
        .filter(Boolean);

      const date = parts[6].trim();
      const sessionAndTime = parts[7].trim().split(/\s+/);
      const session = Number.parseInt(sessionAndTime[1], 10);
      const time = sessionAndTime.slice(2).join('');
      const allocationSchedule = parts[8].trim();

      if (
        !courseCode ||
        !courseName ||
        !examinerName ||
        !paperClass ||
        !date ||
        !Number.isInteger(session) ||
        !time
      ) {
        throw new BadRequestException(
          `Incomplete timetable data at row ${cell.row}.`,
        );
      }

      const sortParam = Date.parse(date);

      if (Number.isNaN(sortParam)) {
        throw new BadRequestException(
          `Invalid date "${date}" at row ${cell.row}.`,
        );
      }

      const roomIds: Types.ObjectId[] = roomNames.map((roomName) => {
        const roomId = roomMap.get(roomName);

        if (!roomId) {
          throw new BadRequestException(
            `Room "${roomName}" was not found in the database at row ${cell.row}.`,
          );
        }

        return roomId;
      });

      if (roomIds.length === 0) {
        throw new BadRequestException(
          `No rooms specified at row ${cell.row}.`,
        );
      }

      timetables.push({
        courseCode,
        courseName,
        class: paperClass,
        date,
        sortParam,
        session,
        time,
        rooms: roomIds,
        examType: config.examType,
        semester: config.semester,
        examiners: [examinerName],
        allocationSchedule,
      });
    });

    if (timetables.length === 0) {
      throw new BadRequestException(
        'The Excel file contains no timetable records.',
      );
    }

    return timetables;
  }
}
