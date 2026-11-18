import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ExamSupportDocument = HydratedDocument<ExamSupport>;

export enum ExamSupportPayStatus {
  CASH = 'CASH',
  PAYROLL = 'PAYROLL',
}

export enum ExamSupportUserType {
  ATTENDANT = 'attendant',
  NSS_PERSONNEL = 'nssPersonnel',
  PROCTOR = 'proctor',
}

@Schema()
export class ExamSupport {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  category: string;

  @Prop({
    type: String,
    enum: Object.values(ExamSupportPayStatus),
    required: true,
  })
  payStatus: ExamSupportPayStatus;

  @Prop({ type: Number, default: 0, required: true })
  hours: number;

  @Prop({
    type: String,
    enum: Object.values(ExamSupportUserType),
    required: true,
  })
  userType: ExamSupportUserType;

  @Prop({ type: String })
  nssNumber?: string;

  @Prop({ type: String })
  role?: string;

  @Prop({ type: Number, default: 0 })
  numOfSessionDone: number;

  @Prop({ type: Types.ObjectId, ref: 'paymentConfig' })
  paymentConfig?: Types.ObjectId;

  @Prop({ type: String })
  bankBranch?: string;

  @Prop({ type: String })
  bankAccNumber?: string;

  @Prop({ type: String })
  bankName?: string;
}

export const ExamSupportSchema = SchemaFactory.createForClass(ExamSupport);
