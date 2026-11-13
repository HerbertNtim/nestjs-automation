
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { TimetableService } from './timetable.service';
import { Timetable } from './schemas/timetable.schema';
import { TimetableExcelParser } from './parser/timetable-excel-parser';

describe('TimetableService', () => {
  let service: TimetableService;

  const mockTimetableModel = {
    find: vi.fn(),
    insertMany: vi.fn(),
  };

  const mockTimetableExcelParser = {
    parse: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetableService,
        {
          provide: getModelToken(Timetable.name),
          useValue: mockTimetableModel,
        },
        {
          provide: TimetableExcelParser,
          useValue: mockTimetableExcelParser,
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
