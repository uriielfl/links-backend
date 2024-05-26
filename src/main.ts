import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Forwarded-For',
      'x-forwarded-for',
      'origin',
      'Origin',
    ],
    origin: 'http://localhost:5173',
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3015, '0.0.0.0');
}
bootstrap();
