
import { Test, TestingModule } from '@nestjs/testing';

import { TimetableResolver } from './timetable.resolver';
import { TimetableService } from './timetable.service';

describe('TimetableResolver', () => {
  let resolver: TimetableResolver;
  let timetableService: TimetableService;

  const mockTimetables = [
    {
      _id: '673a12345678901234567890',
      courseCode: 'CHE 258',
      courseName: 'DRAWING FOR ENGINEERS',
      session: 1,
      rooms: [],
      examiners: [],
      examType: 'End of Semester',
      semester: 'First Semester',
      date: 'Monday, 17 August 2026',
      sortParam: 1787011200000,
      time: '(8:30 AM - 10:30 AM)',
      class: 'ED2-CHE',
      allocationSchedule: '45/30/22/22/22/20',
    },
  ];

  const mockTimetableService = {
    getTimetables: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetableResolver,
        {
          provide: TimetableService,
          useValue: mockTimetableService,
        },
      ],
    }).compile();

    resolver = module.get<TimetableResolver>(TimetableResolver);
    timetableService = module.get<TimetableService>(TimetableService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getTimetables', () => {
    it('should return all timetables', async () => {
      mockTimetableService.getTimetables.mockResolvedValue(mockTimetables);

      const result = await resolver.getTimetables();

      expect(result).toEqual(mockTimetables);
      expect(timetableService.getTimetables).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no timetables exist', async () => {
      mockTimetableService.getTimetables.mockResolvedValue([]);

      const result = await resolver.getTimetables();

      expect(result).toEqual([]);
      expect(timetableService.getTimetables).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from the service', async () => {
      const error = new Error('Failed to retrieve timetables');

      mockTimetableService.getTimetables.mockRejectedValue(error);

      await expect(resolver.getTimetables()).rejects.toThrow(error);
    });
  });
});
