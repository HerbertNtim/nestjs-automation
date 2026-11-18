import { Module } from '@nestjs/common';
import { InvigilationController } from './invigilation.controller';
import { InvigilationService } from './invigilation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSupport, ExamSupportSchema } from './schemas/exams-support.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExamSupport.name,
        schema: ExamSupportSchema,
      },
    ]),
  ],

  controllers: [InvigilationController],
  providers: [InvigilationService]
})
export class InvigilationModule {}
