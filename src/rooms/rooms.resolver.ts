import { ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { RoomType } from './graphql/room.types';

@Resolver()
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Query(() => [RoomType], { name: 'rooms' })
  rooms() {
    return this.roomsService.getAllRooms();
  }
}
