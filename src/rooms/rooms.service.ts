import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

import { Room, RoomDocument } from './schemas/room.schema';
import { RoomExcelParser, RoomImportData } from './parser/room-excel.parser';
import { CloudinaryService } from './parser/cloudinary';
import { QrCodeService } from './parser/qr-code';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

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

    const uploadedPublicIds: string[] = [];

    let session: ClientSession | undefined;
    let transactionCommitted = false;

    try {
      // 2. Generate QR codes and upload them to Cloudinary.
      const roomsToInsert: Array<RoomImportData & { qrCodeImageUrl: string }> =
        [];

      for (const room of rooms) {
        const { image } = await this.qrCodeService.generateRoomQRCode();

        const { imageUrl, publicId } = await this.cloudinaryService.uploadImage(
          image,
          'rooms/qr-codes',
        );

        uploadedPublicIds.push(publicId);

        roomsToInsert.push({
          ...room,
          qrCodeImageUrl: imageUrl,
        });
      }

      // 3. Replace existing room records using a transaction.
      session = await this.roomModel.db.startSession();

      let insertedRooms: RoomDocument[] = [];

      await session.withTransaction(async () => {
        await this.roomModel.deleteMany({}, { session });

        insertedRooms = await this.roomModel.insertMany(roomsToInsert, {
          session,
        });
      });

      transactionCommitted = true;

      return {
        message: 'Rooms imported successfully',
        total: insertedRooms.length,
      };
    } catch (error) {
      // 4. Clean up uploaded images if the import fails.
      if (!transactionCommitted) {
        await this.cleanupUploadedImages(uploadedPublicIds);
      }

      throw error;
    } finally {
      // 5. Always close the MongoDB session.
      if (session) {
        try {
          await session.endSession();
        } catch (error) {
          this.logger.error(
            'Failed to close MongoDB session.',
            error instanceof Error ? error.stack : undefined,
          );
        }
      }
    }
  }

  private async cleanupUploadedImages(publicIds: string[]): Promise<void> {
    const results = await Promise.allSettled(
      publicIds.map((publicId) => this.cloudinaryService.deleteImage(publicId)),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Failed to clean up Cloudinary image: ${publicIds[index]}`,
          result.reason instanceof Error ? result.reason.stack : undefined,
        );
      }
    });
  }

  async getAllRooms() {
    const rooms = await this.roomModel.find().lean().exec();
    return rooms.map((room) => ({
      ...room,
      id: room._id.toString(),
    }));
  }
}
