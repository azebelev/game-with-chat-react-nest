import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getDbConfig } from './config/db.config';
import { GatewayGateway } from './gateway/gateway.gateway';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
//const envFilePath = '.env';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDbConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GatewayGateway],
})
export class AppModule {}
