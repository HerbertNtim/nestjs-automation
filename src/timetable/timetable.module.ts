import { TimetableResolver } from './timetable.resolver';
import { Papers, PapersSchema } from './schemas/papers.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';
import { Examiners, ExaminersSchema } from './schemas/examiners.schema';
import { Rooms, RoomsSchema } from './schemas/rooms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Papers.name, schema: PapersSchema },
      { name: Rooms.name, schema: RoomsSchema },
      { name: Examiners.name, schema: ExaminersSchema },
    ]),
  ],
  controllers: [TimetableController],
  providers: [TimetableResolver, TimetableService],
})
export class TimetableModule {}
