
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { InvigilationService } from './invigilation.service';
import {
  PAYMENT_CONFIG_MODEL,
} from './schemas/payment-config.schema';
import { ExamSupport } from './schemas/exams-support.schema';

describe('InvigilationService', () => {
  let service: InvigilationService;

  const mockExamSupportModel = {
    insertMany: vi.fn(),
  };

  const mockPaymentConfigModel = {
    findOne: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvigilationService,
        {
          provide: getModelToken(ExamSupport.name),
          useValue: mockExamSupportModel,
        },
        {
          provide: getModelToken(PAYMENT_CONFIG_MODEL),
          useValue: mockPaymentConfigModel,
        },
      ],
    }).compile();

    service = module.get<InvigilationService>(InvigilationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
