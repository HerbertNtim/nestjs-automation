
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  college: string;

  @Prop()
  building: string;

  @Prop()
  floor?: string;

  @Prop()
  capacity: number;

  @Prop({ required: true })
  qrCodeImageUrl: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
