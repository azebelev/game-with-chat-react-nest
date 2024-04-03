import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Game api')
  .setDescription('API')
  .setVersion('1.0')
  .addTag('game')
  .build();
