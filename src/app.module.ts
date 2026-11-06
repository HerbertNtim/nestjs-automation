import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { TimetableModule } from './timetable/timetable.module';

const logger = new Logger('MongoDB');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>('MONGODB_URI');

        return {
          uri,
          onConnectionCreate: (connection) => {
            logger.log('Connecting to MongoDB');

            connection.on('connected', () => {
              logger.log('Connected successfully');
            });

            connection.on('disconnected', () => {
              logger.warn('Disconnected');
            });

            connection.on('error', (error: Error) => {
              logger.error(`Connection error: ${error.message}`, error.stack);
            });
          },
        };
      },
    }),
    TimetableModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
