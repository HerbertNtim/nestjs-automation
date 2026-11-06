import { Controller, Get } from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get()
  getTimetable() {
    // Logic to retrieve the timetable
    return this.timetableService.getHello(); // Placeholder response
  }
}
