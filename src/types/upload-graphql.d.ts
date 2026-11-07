
declare module 'graphql-upload/GraphQLUpload.mjs' {
  import { GraphQLScalarType } from 'graphql';

  const GraphQLUpload: GraphQLScalarType;
  export default GraphQLUpload;
}

declare module 'graphql-upload/processRequest.mjs' {
  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => NodeJS.ReadableStream;
  }
}
