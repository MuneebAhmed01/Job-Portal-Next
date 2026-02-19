import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Trust proxy (Essential for many deployment environments)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.enableCors({
    origin: 'http://localhost:3000', // Try to be specific
    credentials: true,
  });

  app.use(cookieParser());
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'fallback-dev-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Auto-switch
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours is usually more user-friendly
      },
      name: 'linkedin-session',
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
