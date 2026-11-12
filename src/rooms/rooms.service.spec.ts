import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';
import { QrCodeService } from './parser/qr-code';
import { CloudinaryService } from './parser/cloudinary';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockRoomModel = {
    deleteMany: vi.fn(),
    insertMany: vi.fn(),
    find: vi.fn(),
  };

  const mockQrCodeService = {
    generateRoomQRCode: vi.fn(),
  };

  const mockCloudinaryService = {
    uploadImage: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        {
          provide: getModelToken(Room.name),
          useValue: mockRoomModel, // You can define a mock model for testing purposes
        },
        {
          provide: QrCodeService,
          useValue: mockQrCodeService, // You can define a mock service for testing purposes
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService, // You can define a mock service for testing purposes
        }
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
