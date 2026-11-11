import { Query, Resolver } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { RoomType } from './graphql/room.types';

@Resolver()
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Query(() => [RoomType],  { name: 'rooms'})
  async getAllRooms() {
    return this.roomsService.getAllRooms();
  }
}
