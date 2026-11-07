import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TimetableService } from './timetable.service';
import { UploadResponse } from './types/upload-response.types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@Resolver()
export class TimetableResolver {
  constructor(
    private readonly timetableService: TimetableService,
  ) {}

  @Mutation(() => UploadResponse)
  async uploadRooms(
    @Args('file', { type: () => GraphQLUpload })
    file: Promise<FileUpload>,
  ): Promise<UploadResponse> {
    const { createReadStream } = await file;

    const chunks: Buffer[] = [];

    for await (const chunk of createReadStream()) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    return this.timetableService.uploadRooms(buffer);
  }
}
