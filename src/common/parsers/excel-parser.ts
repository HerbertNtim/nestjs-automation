
import Excel from 'exceljs';

export interface GetFileParams {
  path?: string;
  buffer?: Uint8Array;
}

export class ExcelParser {
  protected async readFileFirstSheet(
    relativeFilePath: string,
  ): Promise<Excel.Worksheet> {
    const workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(relativeFilePath);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('No worksheet found in the Excel file.');
    }

    return worksheet;
  }

  protected async readFileFirstSheetWithPaperDetails(
    relativeFilePath: string,
  ) {
    const worksheet = await this.readFileFirstSheet(relativeFilePath);

    const fileName = relativeFilePath.split(/[\\/]/).pop()?.split('.')[0];

    if (!fileName) {
      throw new Error('Invalid Excel file path.');
    }

    const [courseDetails, fullClass] = fileName.split('-');

    if (!courseDetails || !fullClass || courseDetails.length < 4) {
      throw new Error('Invalid paper filename format.');
    }

    const noSpaceCourseCode = courseDetails;
    const courseCode = `${noSpaceCourseCode.slice(0, -3)} ${noSpaceCourseCode.slice(-3)}`;

    const className = fullClass.slice(0, -1).toUpperCase();
    const yearGroup = fullClass.slice(-1);

    return {
      worksheet,
      className: `ED${yearGroup}-${className}`,
      courseCode,
    };
  }

  protected async readFileFirstSheet_Buffer(
    buffer: Uint8Array,
  ): Promise<Excel.Worksheet> {
    const workbook = new Excel.Workbook();

    // Convert the uploaded data into a Node.js Buffer.
    const excelBuffer = Buffer.from(buffer);

    // Work around the ExcelJS 4.4.0 Buffer type declaration conflict.
    await workbook.xlsx.load(
      excelBuffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
    );

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('No worksheet found in the Excel file.');
    }

    return worksheet;
  }




  protected async getWorkSheet({
    path,
    buffer,
  }: GetFileParams): Promise<Excel.Worksheet | null> {
    if (buffer) {
      return this.readFileFirstSheet_Buffer(buffer);
    }

    if (path) {
      return this.readFileFirstSheet(path);
    }

    return null;
  }

  protected getRowCellValue(
    worksheet: Excel.Worksheet,
    row: number,
    cellIndex: number,
    config?: {
      failValue?: string;
    },
  ): string | undefined {
    const value = worksheet.getRow(row).getCell(cellIndex).text.trim();

    return !value || value === config?.failValue ? undefined : value;
  }
}

export { Excel };
