import { Papers, PapersSchema } from './schemas/paper.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Papers.name, schema: PapersSchema }])],
  controllers: [TimetableController],
  providers: [TimetableService]
})
export class TimetableModule {}
