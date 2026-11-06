
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaperDocument = HydratedDocument<Papers>;

@Schema({
  timestamps: true,
  collection: 'papers',
})
export class Papers {
  @Prop({ type: String, required: true })
  courseName: string;

  @Prop({ type: String, required: true })
  courseCode: string;

  @Prop({
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  })
  session: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    required: true,
  })
  rooms: Types.ObjectId[];

  @Prop({
    type: String,
    required: true,
    enum: ['Mid Semester', 'End of Semester', 'Supplementary Exams'],
  })
  examType: string;

  @Prop({
    type: String,
    required: true,
    enum: ['First Semester', 'Second Semester', 'Supplementary'],
  })
  semester: string;

  @Prop({ type: String, required: true })
  date: string;

  @Prop({ type: Number, required: true })
  sortParam: number;

  @Prop({ type: String, required: true })
  time: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Examiner' }],
  })
  examiners: Types.ObjectId[];

  @Prop({ type: String })
  class?: string;

  @Prop({ type: String })
  allocationSchedule?: string;
}

export const PapersSchema = SchemaFactory.createForClass(Papers);
