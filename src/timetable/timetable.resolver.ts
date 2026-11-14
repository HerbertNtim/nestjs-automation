import { TimetableType } from './types/timetable.types';
import { Query, Resolver } from '@nestjs/graphql';

import { TimetableService } from './timetable.service';

@Resolver(() => TimetableType)
export class TimetableResolver {
  constructor(
    private readonly timetableService: TimetableService,
  ) {}

  @Query(() => [TimetableType], { name: 'timetables' })
  async getTimetables() {
    return this.timetableService.getTimetables();
  }
}
