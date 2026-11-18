import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentConfigDocument = HydratedDocument<PaymentConfig>;

@Schema({ timestamps: true })
export class PaymentConfig {
  @Prop({ type: Number, required: true })
  snackRate: number;

  @Prop({ type: Number, required: true })
  tax: number;

  @Prop({ type: Number, required: true })
  smInvigilationRate: number;

  @Prop({ type: Number, required: true })
  nsmInvigilationRate: number;
}

export const PaymentConfigSchema =
  SchemaFactory.createForClass(PaymentConfig);
