
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomsDocument = HydratedDocument<Rooms>;

@Schema({
  timestamps: true,
  collection: 'rooms',
})
export class Rooms {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String })
  college?: string;

  @Prop({ type: String })
  building?: string;

  @Prop({ type: String })
  floor?: string;

  @Prop({ type: Number })
  capacity?: number;

  @Prop({ type: String, required: true })
  qrCodeImageUrl: string;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
