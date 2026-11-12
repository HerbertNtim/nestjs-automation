import { Room, RoomSchema } from './schemas/room.schema';
import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { QrCodeService } from './parser/qr-code';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsResolver, QrCodeService]
})
export class RoomsModule {
  
}
