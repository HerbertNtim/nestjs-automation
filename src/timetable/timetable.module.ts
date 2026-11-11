import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';
import { TimetableResolver } from './timetable.resolver';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, TimetableResolver]
})
export class TimetableModule {}
