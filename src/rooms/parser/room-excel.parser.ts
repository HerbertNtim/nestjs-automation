
import { ExcelParser } from '../../common/parsers/excel-parser';
import { Room } from '../schemas/room.schema';

export type RoomImportData = Pick<
  Room,
  'name' | 'capacity' | 'building' | 'college' | 'floor' | 'qrCodeImageUrl'
>;

export class RoomExcelParser extends ExcelParser {
  data: RoomImportData[] = [];

  constructor(private readonly buffer: Buffer) {
    super();
  }

  private async setSheetData(): Promise<void> {
    const worksheet = await this.getWorkSheet({
      buffer: this.buffer,
    });

    if (!worksheet) {
      throw new Error('Unable to read the Excel worksheet.');
    }

    const roomNameIndex = 1;
    const roomCapacityIndex = 2;
    const roomDetailsIndex = 3;
    const roomQRCodeIndex = 4;

    for (let rowNumber = 1; rowNumber <= worksheet.actualRowCount; rowNumber++) {
      const name = this.getRowCellValue(worksheet, rowNumber, roomNameIndex);
      const capacityValue = this.getRowCellValue(
        worksheet,
        rowNumber,
        roomCapacityIndex,
      );
      const roomDetails = this.getRowCellValue(
        worksheet,
        rowNumber,
        roomDetailsIndex,
      );

      const qrCodeImageUrl = worksheet
        .getRow(rowNumber)
        .getCell(roomQRCodeIndex).hyperlink;

      // Skip incomplete rows, preserving the original behavior.
      if (!name || !capacityValue || !roomDetails || !qrCodeImageUrl) {
        continue;
      }

      const capacity = Number.parseInt(capacityValue, 10);

      if (!Number.isSafeInteger(capacity) || capacity <= 0) {
        throw new Error(
          `Invalid room capacity at spreadsheet row ${rowNumber}.`,
        );
      }

      const [building = '', college = '', floor = ''] = roomDetails
        .split(',')
        .map((value) => value.trim());

      this.data.push({
        name: name.trim(),
        capacity,
        building,
        college,
        floor,
        qrCodeImageUrl: qrCodeImageUrl.trim(),
      });
    }

    if (this.data.length === 0) {
      throw new Error('No valid room records were found in the spreadsheet.');
    }
  }

  async initializeWorkSheetData(): Promise<RoomImportData[]> {
    await this.setSheetData();
    return this.data;
  }
}
