// ============================================================================
// RentNaija - Application Entry Point
// ============================================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('FRONTEND_URL', '*'),
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RentNaija API')
    .setDescription('Nigerian Real Estate Rental Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Properties', 'Property CRUD and search')
    .addTag('Chat', 'Real-time messaging')
    .addTag('Appointments', 'Inspection booking')
    .addTag('Reviews', 'Ratings and reviews')
    .addTag('Favorites', 'Saved properties')
    .addTag('Payments', 'Payment processing')
    .addTag('Subscriptions', 'Subscription management')
    .addTag('Notifications', 'Push notifications')
    .addTag('Admin', 'Admin panel endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Start Server
  const port = configService.get('PORT', 3000);
  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║          🏠 RentNaija API Server             ║
  ║──────────────────────────────────────────────║
  ║  Status:  Running                            ║
  ║  Port:    ${String(port).padEnd(36)}║
  ║  Docs:    http://localhost:${port}/api/docs     ║
  ║  Env:     ${String(configService.get('NODE_ENV', 'development')).padEnd(36)}║
  ╚══════════════════════════════════════════════╝
  `);
}

bootstrap();
