require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { MainModule } from '~main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('Zapper Studio API')
    .setDescription(
      'The Zapper API provides some of the most robust Defi related data, everything from liquidity and prices on different AMMs to complex Defi protocol balances all in one convenient place. In addition, the API also supports bridging between different networks as well as formatted Zap transaction endpoints.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(5002);
}

bootstrap().catch(err => {
  throw err;
});
