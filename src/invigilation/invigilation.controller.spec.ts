
import { Test, TestingModule } from '@nestjs/testing';
import { InvigilationController } from './invigilation.controller';
import { InvigilationService } from './invigilation.service';

describe('InvigilationController', () => {
  let controller: InvigilationController;

  const mockInvigilationService = {
    uploadExamsSupport: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvigilationController],
      providers: [
        {
          provide: InvigilationService,
          useValue: mockInvigilationService,
        },
      ],
    }).compile();

    controller = module.get<InvigilationController>(
      InvigilationController,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadExamsSupport', () => {
    it('should pass the uploaded file buffer to the service', async () => {
      const buffer = Buffer.from('test excel data');

      mockInvigilationService.uploadExamsSupport.mockResolvedValue({
        message: 'Exams support data uploaded successfully.',
        importedCount: 10,
      });

      const result = await controller.uploadExamsSupport({
        buffer,
        originalname: 'exams-support.xlsx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
      });

      expect(
        mockInvigilationService.uploadExamsSupport,
      ).toHaveBeenCalledWith(buffer);

      expect(result).toEqual({
        message: 'Exams support data uploaded successfully.',
        importedCount: 10,
      });
    });
  });
});
