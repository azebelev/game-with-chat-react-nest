import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { GameHistory } from './entities/game-history.entity';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User, GameHistory])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
