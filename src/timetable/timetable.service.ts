import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rooms, RoomsDocument } from './schemas/rooms.schema';
import { RoomSheetExcelParser } from './parser/room-sheet-parser';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Rooms.name)
    private readonly roomsModel: Model<RoomsDocument>,
  ) {}

  getHello(): string {
    return 'Hello Timetable!';
  }

  async uploadRooms(buffer: Buffer) {
    const roomParser = new RoomSheetExcelParser(buffer);

    await roomParser.initializeWorkSheetData();

    const rooms = roomParser.data;

    if (rooms.length === 0) {
      throw new BadRequestException('No valid room records found in the Excel file.');
    }

    // Remove existing room records before inserting the new ones.
    await this.roomsModel.deleteMany({});

    const uploadedRooms = await this.roomsModel.insertMany(rooms);

    return {
      message: 'Rooms uploaded successfully.',
      count: uploadedRooms.length,
    };
  }
}
