import { Module } from '@nestjs/common';
import { InvigilationController } from './invigilation.controller';
import { InvigilationService } from './invigilation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSupport, ExamSupportSchema } from './schemas/exams-support.schema';
import { PaymentConfig, PaymentConfigSchema, } from './schemas/payment-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExamSupport.name,
        schema: ExamSupportSchema,
      },
      {
        name: PaymentConfig.name,
        schema: PaymentConfigSchema,
      },
    ]),
  ],

  controllers: [InvigilationController],
  providers: [InvigilationService],
})
export class InvigilationModule {}
