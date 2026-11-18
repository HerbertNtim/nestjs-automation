import { Test, TestingModule } from '@nestjs/testing';
import { InvigilationService } from './invigilation.service';

describe('InvigilationService', () => {
  let service: InvigilationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvigilationService],
    }).compile();

    service = module.get<InvigilationService>(InvigilationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
