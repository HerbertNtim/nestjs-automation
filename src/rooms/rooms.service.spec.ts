import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Room } from './schemas/room.schema';

describe('RoomsService', () => {
  let service: RoomsService;

  const mockRoomModel = {
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    insertMany: vi.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService, {
        provide: getModelToken(Room.name),
        useValue: mockRoomModel, // You can define a mock model for testing purposes
      }],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
