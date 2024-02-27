import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 5000;

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors(); //мб
  app.enableShutdownHooks(); //МБ

  const config = new DocumentBuilder().setTitle('Api List').build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(PORT, () =>
    console.log(`Приложение запустилось на ${PORT} порту`),
  );
}
bootstrap();
