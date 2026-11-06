
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExaminerDocument = HydratedDocument<Examiners>;

@Schema({
  timestamps: true,
  collection: 'examiners',
})
export class Examiners {
  @Prop({ type: String, required: true })
  name: string;

  // For remuneration
  @Prop({ type: Number, required: true })
  actualNumOfStudents: number;

  @Prop({ type: Number, required: true })
  amountPerPaper: number;

  @Prop({ type: Number, required: true })
  amountPerMarking: number;
}

export const ExaminersSchema = SchemaFactory.createForClass(Examiners);
