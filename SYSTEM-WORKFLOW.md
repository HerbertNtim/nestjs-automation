# System Workflow: GraphQL and MongoDB

## Technology used in this repository

This backend is implemented with Node.js and TypeScript, using **Express**, **Apollo Server GraphQL**, **Mongoose**, and **MongoDB**. It does **not** currently use NestJS. The workflow below describes the code that exists in this repository, rather than a NestJS design.

## GraphQL request flow

```text
Client
  -> POST /graphql
  -> Apollo Server
  -> JWT context (when a bearer token is supplied)
  -> GraphQL Shield permissions
  -> schema resolver
  -> Mongoose model
  -> MongoDB
  -> resolver result
  -> GraphQL response to client
```

1. **Client sends an operation.** The client sends a GraphQL query or mutation to `/graphql`, including operation variables and, for authenticated operations, an HTTP authorization header containing a bearer token.
2. **Apollo receives the request.** Apollo Server is attached to the Express application at `/graphql`.
3. **The request context is created.** The server verifies a supplied JWT using the configured access-token secret and places the decoded claims in the GraphQL context. If there is no token or verification fails, the context has no decoded token.
4. **Permissions are checked.** GraphQL Shield evaluates rules configured for the operation, such as whether the caller is authenticated or has claims associated with a student, invigilator, sentinel, or administrator.
5. **The resolver runs.** The schema declares available GraphQL types and operations. Resolvers implement those operations and contain or call the application logic.
6. **Mongoose accesses MongoDB.** The resolver or related service uses a Mongoose model to find, create, update, or delete documents in the relevant collection.
7. **The result returns to the client.** The resolver result is shaped according to the GraphQL schema and Apollo returns it in a GraphQL response.

## Spreadsheet upload flow (REST)

Spreadsheet uploads are a separate REST API flow; they do not go through GraphQL:

1. Send a `POST` request to an upload endpoint under `/api/upload-data` using `multipart/form-data`. The uploaded file field is named `file`.
2. Express file-upload middleware exposes the uploaded file to the route handler as `req.files.file`.
3. The route calls the matching method in the upload service.
4. An ExcelJS parser reads the workbook bytes and maps worksheet values into domain records.
5. A collection service uses Mongoose to persist the parsed records in MongoDB.
6. The request handler returns a response, or reports an error if processing fails.

For example, `POST /api/upload-data/room` parses room names, capacities, QR-code links, and room details. It then deletes existing room records and inserts the parsed rooms. Other imports differ: some insert data without first clearing their collection, so check the corresponding service before repeating an upload.

### Upload endpoints

| Endpoint | Data handled |
|---|---|
| `/api/upload-data/room` | Room information |
| `/api/upload-data/exams-support` | Exams support personnel |
| `/api/upload-data/teaching-assistants` | Teaching-assistant personnel |
| `/api/upload-data/timetable` | Exam timetable/paper information |
| `/api/upload-data/invigilation-schedule` | Invigilation schedule |
| `/api/upload-data/attendant-sheets` | Student attendant-sheet data |
| `/api/upload-data/missing-allocations` | Missing student allocations |
| `/api/upload-data/script-collection-data` | Script collection information |
| `/api/upload-data/obuasi` | Obuasi script information |

## Application startup

1. `src/index.ts` loads environment configuration.
2. The application connects to MongoDB through Mongoose.
3. Express is configured with middleware and the REST routes are mounted under `/api`.
4. Apollo Server is created from the GraphQL type definitions and merged resolvers, with GraphQL Shield permissions applied, then mounted at `/graphql`.
5. The HTTP or HTTPS server starts listening on its configured port.

## Main implementation files

- Server startup, MongoDB connection, and Apollo setup: `src/index.ts`
- Express middleware: `src/setupServer.ts`
- REST route mounting: `src/routes/index.ts`
- Upload endpoints: `src/routes/upload-data.ts`
- GraphQL schema and resolver composition: `src/graphQL/typeDefs/index.ts` and `src/graphQL/resolvers/index.ts`
- GraphQL permissions: `src/lib/permissions.ts`
- Mongoose models: `src/models/`
- MongoDB connection service: `src/services/DatabaseService.ts`
- Upload processing: `src/services/UploadDataService.ts`
- Spreadsheet parsers: `src/services/data-upload-services/`
