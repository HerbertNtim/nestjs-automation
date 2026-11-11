import { Injectable } from '@nestjs/common';
import { Room } from './schemas/room.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomExcelParser } from './parser/room-excel.parser';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) {}

  async importRooms(buffer: Buffer) {
     // 1. Initialize the Excel parser.
    const roomParser = new RoomExcelParser(buffer);

    // 2. Parse the Excel spreadsheet.
    const rooms = await roomParser.initializeWorkSheetData();

    // 3. Remove existing room records.
    await this.roomModel.deleteMany({});

    // 4. Insert the newly parsed records.
    const insertedRooms = await this.roomModel.insertMany(rooms);

    // 5. Return the import summary.
    return {
      message: 'Rooms imported successfully',
      total: insertedRooms.length,
    };
  }

  async getAllRooms() {
    return this.roomModel.find().exec();
  }
}
