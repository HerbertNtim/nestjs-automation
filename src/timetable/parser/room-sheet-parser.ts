import { ExcelParser } from '../../common/parser/excel-parser';
import { RoomType } from '../types/room-type';

export class RoomSheetExcelParser
  extends ExcelParser {
  data: RoomType[] = [];

  constructor(private readonly buffer: Buffer) {
    super();
  }

  private async setSheetData(buffer: Buffer): Promise<void> {
    const worksheet = await this.readFileFirstSheet_Buffer(buffer);

    if (!worksheet) {
      throw new Error('No worksheet found in the uploaded Excel file.');
    }

    const roomNameIndex = 1;
    const roomCapacityIndex = 2;
    const roomDetailsIndex = 3;
    const roomQRCodeIndex = 4;

    for (let row = 1; row <= worksheet.actualRowCount; row++) {
      const name = worksheet.getRow(row).getCell(roomNameIndex).text.trim();
      const capacity = worksheet.getRow(row).getCell(roomCapacityIndex).text.trim();
      const qrCodeImageUrl = worksheet.getRow(row).getCell(roomQRCodeIndex).hyperlink;
      const roomDetails = worksheet.getRow(row).getCell(roomDetailsIndex).text;

      if (name && capacity && qrCodeImageUrl && roomDetails) {
        const [building = '', college = '', floor = ''] = roomDetails
          .split(',')
          .map((detail) => detail.trim());

        const parsedCapacity = Number.parseInt(capacity, 10);

        if (Number.isNaN(parsedCapacity)) {
          continue;
        }

        const roomDocument: RoomType = {
          name,
          capacity: parsedCapacity,
          qrCodeImageUrl: qrCodeImageUrl.trim(),
          building,
          college,
          floor,
        };

        this.data.push(roomDocument);
      }
    }
  }

  async initializeWorkSheetData(): Promise<void> {
    await this.setSheetData(this.buffer);
  }
}
