
import Excel from 'exceljs';
import { GetFileParams } from './excel-parser.types';

export class ExcelParser {
  /**
   * Reads the first worksheet from an Excel file path.
   */
  protected async readFileFirstSheet(
    relativeFilePath: string,
  ): Promise<Excel.Worksheet | undefined> {
    const workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(relativeFilePath);

    return workbook.worksheets[0];
  }

  /**
   * Reads the first worksheet and extracts paper details
   * from the Excel file path.
   */
  protected async readFileFirstSheetWithPaperDetails(
    relativeFilePath: string,
  ) {
    const worksheet = await this.readFileFirstSheet(relativeFilePath);

    const details = relativeFilePath.split('/')[2].split('.')[0];
    const noSpaceCourseCode = details.split('-')[0];

    const courseCode = `${noSpaceCourseCode.slice(0, -3)} ${noSpaceCourseCode.slice(-3)}`;

    const fullClass = details.split('-')[1];
    const className = fullClass.slice(0, -1).toUpperCase();
    const yearGroup = fullClass.slice(-1);

    return {
      worksheet,
      className: `ED${yearGroup}-${className}`,
      courseCode,
    };
  }

  /**
   * Reads the first worksheet from an uploaded Excel buffer.
   */
  protected async readFileFirstSheet_Buffer(
    buffer: Buffer,
  ): Promise<Excel.Worksheet | undefined> {
    const workbook = new Excel.Workbook();

    const arrayBuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(arrayBuffer).set(buffer);

    await workbook.xlsx.load(arrayBuffer);

    return workbook.worksheets[0];
  }

  /**
   * Reads a worksheet from either a file path or buffer.
   * If both are supplied, the buffer takes priority.
   */
  protected async getWorkSheet({
    path,
    buffer,
  }: GetFileParams): Promise<Excel.Worksheet | null | undefined> {
    let worksheet: Excel.Worksheet | null | undefined = null;

    if (path) {
      worksheet = await this.readFileFirstSheet(path);
    }

    if (buffer) {
      worksheet = await this.readFileFirstSheet_Buffer(buffer);
    }

    return worksheet;
  }

  /**
   * Extracts a cell's text value.
   */
  protected getRowCellValue(
    worksheet: Excel.Worksheet,
    row: number,
    cellIndex: number,
    config?: {
      failValue?: unknown;
    },
  ): string | undefined {
    const value = worksheet.getRow(row).getCell(cellIndex).text;

    return !value || value === config?.failValue
      ? undefined
      : value;
  }
}

export { Excel };
