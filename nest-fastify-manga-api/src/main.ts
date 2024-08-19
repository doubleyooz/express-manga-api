import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { Logger } from 'nestjs-pino';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from './app.module';

async function bootstrap() {
  const CORS_OPTIONS = {
    origin: [process.env.CLIENT], // or '*' or whatever is required
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
  };

  const adapter = new FastifyAdapter();

  adapter.enableCors(CORS_OPTIONS);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.register(fastifyCookie);
  app.useLogger(app.get(Logger));
  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
