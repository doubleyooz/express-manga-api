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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.number().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.number().required(),
        HASH_SALT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    FastifyMulterModule,
    LoggerModule.forRoot(),
    UsersModule,
    MangasModule,
    AuthModule,
    ChaptersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
