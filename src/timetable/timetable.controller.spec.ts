
import { Test, TestingModule } from '@nestjs/testing';

import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

describe('TimetableController', () => {
  let controller: TimetableController;

  const mockTimetableService = {
    importTimetable: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetableController],
      providers: [
        {
          provide: TimetableService,
          useValue: mockTimetableService,
        },
      ],
    }).compile();

    controller = module.get<TimetableController>(TimetableController);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
