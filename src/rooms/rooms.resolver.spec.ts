import { Test, TestingModule } from '@nestjs/testing';
import { RoomsResolver } from './rooms.resolver';
import { RoomsService } from './rooms.service';


describe('RoomsResolver', () => {
  let resolver: RoomsResolver;

  const mockRoomsService = {
    getAllRooms: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsResolver, {
        provide: RoomsService,
        useValue: mockRoomsService
      }],
    }).compile();

    resolver = module.get<RoomsResolver>(RoomsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
