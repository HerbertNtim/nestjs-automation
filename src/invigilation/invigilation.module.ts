import { Module } from '@nestjs/common';
import { InvigilationController } from './invigilation.controller';
import { InvigilationService } from './invigilation.service';

@Module({
  controllers: [InvigilationController],
  providers: [InvigilationService]
})
export class InvigilationModule {}
