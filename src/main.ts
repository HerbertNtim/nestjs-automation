import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = Number(process.env.PORT) || 3000;

  logger.log('Starting application');
  logger.log(`Configured application port: ${port}`);

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
}

void bootstrap();
