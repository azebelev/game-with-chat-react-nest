import { Module } from '@nestjs/common';
import { GameGateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';

@Module({
  providers: [GameGateway, GatewaySessionManager],
  exports: [GameGateway, GatewaySessionManager],
})
export class GatewayModule {}
