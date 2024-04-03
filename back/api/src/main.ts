import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeormStore } from 'connect-typeorm/out/app/TypeormStore/TypeormStore';
import * as session from 'express-session';
import * as passport from 'passport';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { Session } from './auth/entities/session.entity';
import { swaggerConfig } from './config/swagger.config';
import { WebsocketAdapter } from './gateway/gateway.adapter';

async function bootstrap() {
  const { PORT, COOKIE_SECRET } = process.env;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const sessionRepo = app.get(DataSource).getRepository(Session);
  const adapter = new WebsocketAdapter(app, sessionRepo);
  app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      name: 'CHAT_APP_SESSION_ID',
      cookie: {
        maxAge: 86400000, // cookie expires 1 day later
      },
      store: new TypeormStore().connect(sessionRepo),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT || 3001);
}

bootstrap();
