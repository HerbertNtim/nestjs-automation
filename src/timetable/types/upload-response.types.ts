import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field()
  message: string;

  @Field(() => Int)
  count: number;
}
