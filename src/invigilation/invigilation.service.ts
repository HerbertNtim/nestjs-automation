
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ExamsSupportExcelParser } from './parsers/exams-support-excel.parser';
import { ExamSupport, ExamSupportDocument } from './schemas/exams-support.schema';
import { PAYMENT_CONFIG_MODEL, PaymentConfigDocument } from './schemas/payment-config.schema';

@Injectable()
export class InvigilationService {
  private readonly examsSupportParser = new ExamsSupportExcelParser();

  constructor(
    @InjectModel(ExamSupport.name)
    private readonly examSupportModel: Model<ExamSupportDocument>,

    @InjectModel(PAYMENT_CONFIG_MODEL)
    private readonly paymentConfigModel: Model<PaymentConfigDocument>,
  ) {}

  async uploadExamsSupport(buffer: Buffer) {
    const records = await this.examsSupportParser.parse(buffer);

    if (records.length === 0) {
      throw new NotFoundException(
        'No valid exam support records were found in the uploaded file.',
      );
    }

    const paymentConfig = await this.paymentConfigModel.findOne().exec();

    if (!paymentConfig) {
      throw new NotFoundException(
        'No payment configuration found. Please create a payment configuration first.',
      );
    }

    try {
      const documents = records.map((record) => ({
        ...record,
        paymentConfig: paymentConfig._id,
      }));

      const result = await this.examSupportModel.insertMany(documents);

      return {
        message: 'Exams support data uploaded successfully.',
        importedCount: result.length,
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to save exam support records.',
      );
    }
  }
}
