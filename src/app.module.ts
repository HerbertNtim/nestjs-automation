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
        return {
          uri: configService.getOrThrow<string>('MONGODB_URI'),
          dbName: configService.get<string>(
            'MONGODB_DATABASE',
            'examination_db',
          ),
          onConnectionCreate: (connection) => {
            connection.on('connected', () => logger.log('Connected to MongoDB'));
            connection.on('disconnected', () =>
              logger.warn('Disconnected from MongoDB'),
            );
            connection.on('error', (error: Error) =>
              logger.error('MongoDB connection error', error.stack),
            );
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
