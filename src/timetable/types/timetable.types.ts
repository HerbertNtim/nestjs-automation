import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimetableType {
  @Field(() => ID)
  _id: string;

  @Field()
  courseCode: string;

  @Field()
  courseName: string;

  @Field(() => Int)
  session: number;

  @Field(() => [ID])
  rooms: string[];

  @Field()
  examType: string;

  @Field()
  semester: string;

  @Field()
  date: string;

  @Field(() => Int)
  sortParam: number;

  @Field()
  time: string;

  @Field(() => [ID])
  examiners: string[];

  @Field({ nullable: true })
  class?: string;

  @Field({ nullable: true })
  allocationSchedule?: string;
}
