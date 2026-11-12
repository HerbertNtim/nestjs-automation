
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Room, RoomDocument } from './schemas/room.schema';
import {
  RoomExcelParser,
  RoomImportData,
} from './parser/room-excel.parser';
import { CloudinaryService } from './parser/cloudinary';
import { QrCodeService } from './parser/qr-code';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    private readonly qrCodeService: QrCodeService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async importRooms(buffer: Buffer) {
    // 1. Parse and validate the Excel file.
    const roomParser = new RoomExcelParser(buffer);

    let rooms: RoomImportData[];

    try {
      rooms = await roomParser.initializeWorkSheetData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to process the Excel file.';

      throw new BadRequestException(message);
    }

    // 2. Generate QR codes and upload them to Cloudinary.
    const roomsToInsert: Array<
      RoomImportData & { qrCodeImageUrl: string }
    > = [];

    for (const room of rooms) {
      const { image } =
        await this.qrCodeService.generateRoomQRCode();

      const { imageUrl } = await this.cloudinaryService.uploadImage(
        image,
        'rooms/qr-codes',
      );

      roomsToInsert.push({
        ...room,
        qrCodeImageUrl: imageUrl,
      });
    }

    // 3. Replace existing room records.
    await this.roomModel.deleteMany({});

    const insertedRooms =
      await this.roomModel.insertMany(roomsToInsert);

    return {
      message: 'Rooms imported successfully',
      total: insertedRooms.length,
    };
  }

  async getAllRooms() {
    return this.roomModel.find().exec();
  }
}
