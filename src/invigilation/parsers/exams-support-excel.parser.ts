import { Types } from 'mongoose';

import { ExcelParser } from '../../common/parsers/excel-parser';
import { ExamSupportUserType } from '../schemas/exams-support.schema';

export interface ExamSupportImportRecord {
  name: string;
  category: string;
  hours: number;
  numberOfSessionsDone?: number;
  paymentConfig: Types.ObjectId;
  role: string;
  userType: ExamSupportUserType;
  payStatus: 'CASH' | 'PAYROLL';
  nssNumber: string | null;
  bankName: string;
  bankBranch: string;
  bankAccNumber: string;
}

export class ExamsSupportExcelParser extends ExcelParser {
  private readonly defaultConfig = {
    hours: 0,
    paymentConfig: new Types.ObjectId('621b7025ed183c7853cd245a'),
    role: 'invigilator',
  };

  async parse(buffer: Uint8Array): Promise<ExamSupportImportRecord[]> {
    const worksheet = await this.getWorkSheet({ buffer });

    if (!worksheet) {
      throw new Error('Unable to read the uploaded Excel file.');
    }

    const records: ExamSupportImportRecord[] = [];

    for (let row = 2; row <= worksheet.actualRowCount; row++) {
      const name = this.getRowCellValue(worksheet, row, 2);
      const staffType = this.getRowCellValue(worksheet, row, 5);
      const bankName = this.getRowCellValue(worksheet, row, 6);
      const bankBranch = this.getRowCellValue(worksheet, row, 7);
      const bankAccNumber = this.getRowCellValue(worksheet, row, 8);

      // Skip incomplete rows, matching the old parser's behaviour.
      if (!name || !staffType || !bankName || !bankBranch || !bankAccNumber) {
        continue;
      }

      const isSeniorMember = staffType === 'SM';

      const formattedName = name
        .replace(/\([^)]*\)/, '')
        .replace(')', ' ')
        .trim();

      records.push({
        ...this.defaultConfig,
        name: formattedName,
        category: isSeniorMember ? 'SM' : 'NSM/attd',
        bankName,
        bankBranch,
        bankAccNumber,
        userType: isSeniorMember
          ? ExamSupportUserType.PROCTOR
          : ExamSupportUserType.ATTENDANT,
        payStatus: 'PAYROLL',
        nssNumber: null,
      });
    }

    return records;
  }
}
