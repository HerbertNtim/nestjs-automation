import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { TimetableModule } from './timetable/timetable.module';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

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
          lazyConnection: true,
          family: 4,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,

          connectionFactory: (connection) => {
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

            return connection;
          },
        };
      },
    }),

    TimetableModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({
          maxFileSize: 10 * 1024 * 1024,
          maxFiles: 1,
        }),
      )
      .forRoutes('graphql');
  }
}
