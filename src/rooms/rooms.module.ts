import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsResolver } from './rooms.resolver';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, RoomsResolver]
})
export class RoomsModule {}
