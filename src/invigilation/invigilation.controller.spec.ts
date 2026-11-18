import { Test, TestingModule } from '@nestjs/testing';
import { InvigilationController } from './invigilation.controller';

describe('InvigilationController', () => {
  let controller: InvigilationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvigilationController],
    }).compile();

    controller = module.get<InvigilationController>(InvigilationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
