import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChaptersModule } from './models/chapters/chapters.module';
import { MangasModule } from './models/mangas/mangas.module';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { CoversModule } from './models/covers/covers.module';
import { ReviewsModule } from './models/reviews/reviews.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        HASH_SALT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_CLUSTER: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>('DB_USER')}:${configService.get<string>('DB_PASS')}@${configService.get<string>('DB_CLUSTER')}/${configService.get<string>('DB_NAME')}?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService],
    }),
    FastifyMulterModule,
    LoggerModule.forRoot(),
    UsersModule,
    MangasModule,
    CoversModule,
    AuthModule,
    ChaptersModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
