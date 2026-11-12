
import { ExcelParser } from '../../common/parsers/excel-parser';
import { Room } from '../schemas/room.schema';

export type RoomImportData = Pick<
  Room,
  'name' | 'capacity' | 'building' | 'college' | 'floor'
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

    for (
      let rowNumber = 1;
      rowNumber <= worksheet.actualRowCount;
      rowNumber++
    ) {
      const name = this.getRowCellValue(
        worksheet,
        rowNumber,
        roomNameIndex,
      );

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

      // Skip completely empty rows.
      if (!name && !capacityValue && !roomDetails) {
        continue;
      }

      // Reject partially completed rows.
      if (!name || !capacityValue || !roomDetails) {
        throw new Error(
          `Incomplete room data at spreadsheet row ${rowNumber}.`,
        );
      }

      // Validate capacity.
      if (!/^\d+$/.test(capacityValue)) {
        throw new Error(
          `Invalid room capacity at spreadsheet row ${rowNumber}.`,
        );
      }

      const capacity = Number(capacityValue);

      if (!Number.isSafeInteger(capacity) || capacity <= 0) {
        throw new Error(
          `Invalid room capacity at spreadsheet row ${rowNumber}.`,
        );
      }

      // Validate room details.
      const details = roomDetails
        .split(',')
        .map((value) => value.trim());

      if (details.length !== 3) {
        throw new Error(
          `Invalid room details at spreadsheet row ${rowNumber}. Expected building, college and floor.`,
        );
      }

      const [building, college, floor] = details;

      if (!building || !college) {
        throw new Error(
          `Building and college are required at spreadsheet row ${rowNumber}.`,
        );
      }

      this.data.push({
        name: name.trim(),
        capacity,
        building,
        college,
        floor,
      });
    }

    if (this.data.length === 0) {
      throw new Error(
        'No valid room records were found in the spreadsheet.',
      );
    }
  }

  async initializeWorkSheetData(): Promise<RoomImportData[]> {
    await this.setSheetData();
    return this.data;
  }
}
