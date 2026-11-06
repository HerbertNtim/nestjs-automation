import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  console.log(`Server is running on: ${await app.getUrl()}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
}

void bootstrap();
