import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';
import { TimetableResolver } from './timetable.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Timetable, TimetableSchema } from './schemas/timetable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Timetable.name,
        schema: TimetableSchema
      }
    ])
  ],
  controllers: [TimetableController],
  providers: [TimetableService, TimetableResolver]
})
export class TimetableModule {}
