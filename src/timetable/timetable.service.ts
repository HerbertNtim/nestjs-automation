import { Injectable } from '@nestjs/common';

@Injectable()
export class TimetableService {
  getHello(): string {
    return 'Hello Timetable!';
  }
}
