import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const log = new Logger();

process.on('unhandledRejection', (reason, p) =>
  log.error('Unhandled Rejection at:', p, reason)
);

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {});

  log.log(`env:\n${JSON.stringify(process.env, null, 2)}`)

  app.enableCors()
  await app.listen(3000);
}
bootstrap();
