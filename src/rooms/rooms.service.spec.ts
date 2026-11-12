
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import Excel from 'exceljs';

import { RoomsService } from './rooms.service';
import { Room } from './schemas/room.schema';
import { QrCodeService } from './parser/qr-code';
import { CloudinaryService } from './parser/cloudinary';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockSession = {
    withTransaction: vi.fn(),
    endSession: vi.fn(),
  };

  const mockRoomModel = {
    deleteMany: vi.fn(),
    insertMany: vi.fn(),
    find: vi.fn(),
    db: {
      startSession: vi.fn().mockResolvedValue(mockSession),
    },
  };

  const mockQrCodeService = {
    generateRoomQRCode: vi.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockSession.withTransaction.mockImplementation(
      async (callback: () => Promise<void>) => callback(),
    );

    mockRoomModel.db.startSession.mockResolvedValue(mockSession);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken(Room.name),
          useValue: mockRoomModel,
        },
        {
          provide: QrCodeService,
          useValue: mockQrCodeService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate QR codes, upload them and import rooms', async () => {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Rooms');

    worksheet.addRow([
      'Room 101',
      50,
      'Block A, College of Engineering, 1st Floor',
    ]);

    worksheet.addRow([
      'Room 102',
      40,
      'Block B, College of Engineering, 2nd Floor',
    ]);

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    mockQrCodeService.generateRoomQRCode.mockResolvedValue({
      identifier: 'test-identifier',
      image: Buffer.from('test-image'),
    });

    mockCloudinaryService.uploadImage.mockResolvedValue({
      imageUrl: 'https://cloudinary.com/room-qr.png',
      publicId: 'rooms/test-qr',
    });

    mockRoomModel.deleteMany.mockResolvedValue({
      acknowledged: true,
    });

    mockRoomModel.insertMany.mockImplementation(
      async (rooms) => rooms,
    );

    const result = await service.importRooms(buffer);

    // QR code generation
    expect(
      mockQrCodeService.generateRoomQRCode,
    ).toHaveBeenCalledTimes(2);

    // Cloudinary uploads
    expect(
      mockCloudinaryService.uploadImage,
    ).toHaveBeenCalledTimes(2);

    expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
      Buffer.from('test-image'),
      'rooms/qr-codes',
    );

    // MongoDB transaction
    expect(mockRoomModel.db.startSession).toHaveBeenCalledTimes(1);
    expect(mockSession.withTransaction).toHaveBeenCalledTimes(1);

    expect(mockRoomModel.deleteMany).toHaveBeenCalledWith(
      {},
      { session: mockSession },
    );

    expect(mockRoomModel.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Room 101',
          capacity: 50,
          building: 'Block A',
          college: 'College of Engineering',
          floor: '1st Floor',
          qrCodeImageUrl: 'https://cloudinary.com/room-qr.png',
        }),
        expect.objectContaining({
          name: 'Room 102',
          capacity: 40,
          building: 'Block B',
          college: 'College of Engineering',
          floor: '2nd Floor',
          qrCodeImageUrl: 'https://cloudinary.com/room-qr.png',
        }),
      ]),
      { session: mockSession },
    );

    // Session cleanup
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);

    // Import response
    expect(result).toEqual({
      message: 'Rooms imported successfully',
      total: 2,
    });
  });
});
