
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { TimetableService } from './timetable.service';
import { Timetable } from './schemas/timetable.schema';

describe('TimetableService', () => {
  let service: TimetableService;

  const mockTimetableModel = {
    find: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetableService,
        {
          provide: getModelToken(Timetable.name),
          useValue: mockTimetableModel,
        },
      ],
    }).compile();

    service = module.get<TimetableService>(TimetableService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
