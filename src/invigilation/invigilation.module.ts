import { Module } from '@nestjs/common';
import { InvigilationController } from './invigilation.controller';
import { InvigilationService } from './invigilation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSupport, ExamSupportSchema } from './schemas/exams-support.schema';
import { PaymentConfig, PaymentConfigSchema, PAYMENT_CONFIG_MODEL } from './schemas/payment-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExamSupport.name,
        schema: ExamSupportSchema,
      },
      {
        name: PAYMENT_CONFIG_MODEL,
        schema: PaymentConfigSchema,
      },
    ]),
  ],

  controllers: [InvigilationController],
  providers: [InvigilationService],
})
export class InvigilationModule {}
