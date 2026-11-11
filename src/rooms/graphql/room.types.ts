import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoomType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  college: string;

  @Field()
  building: string;

  @Field({ nullable: true })
  floor?: string;

  @Field(() => Int)
  capacity: number;

  @Field()
  qrCodeImageUrl: string;
}
