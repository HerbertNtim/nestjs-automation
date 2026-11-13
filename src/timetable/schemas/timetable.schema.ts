
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TimetableDocument = HydratedDocument<Timetable>;

@Schema({ timestamps: true })
export class Timetable {
  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  courseCode: string;

  @Prop({
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  })
  session: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Room' }],
    required: true,
  })
  rooms: Types.ObjectId[];

  @Prop({
    required: true,
    enum: ['Mid Semester', 'End of Semester', 'Supplementary Exams'],
  })
  examType: string;

  @Prop({
    required: true,
    enum: ['First Semester', 'Second Semester', 'Supplementary'],
  })
  semester: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  sortParam: number;

  @Prop({ required: true })
  time: string;

  @Prop({ type: [String], default: [] })
  examiners: string[];

  @Prop()
  class?: string;

  @Prop()
  allocationSchedule?: string;
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
