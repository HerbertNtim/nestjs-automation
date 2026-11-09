import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`GraphQL Server is running on http://localhost:${process.env.PORT ?? 3000}/graphql`);
    console.log(`General Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  });
}
void bootstrap();
