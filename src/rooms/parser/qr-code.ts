
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { randomUUID } from 'node:crypto';

@Injectable()
export class QrCodeService {
  async generateRoomQRCode(): Promise<{
    identifier: string;
    image: Buffer;
  }> {
    const identifier = randomUUID();

    const image = await QRCode.toBuffer(identifier, {
      type: 'png',
      errorCorrectionLevel: 'H',
      width: 500,
      margin: 2,
    });

    return {
      identifier,
      image,
    };
  }
}
