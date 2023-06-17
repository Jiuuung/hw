import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ validateCustomDecorators: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  require('dotenv');
  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('N.T.H')
    .setDescription('Nest Tutorial Homeword')
    .setVersion('0.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.PORT;
  console.log(port);
  await app.listen(port);
}
bootstrap();
