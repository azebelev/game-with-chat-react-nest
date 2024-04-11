import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Session } from 'src/auth/entities/session.entity';
import { User } from 'src/auth/entities/user.entity';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { Game } from 'src/game/entities/game.entity';
import { DataSource } from 'typeorm';
config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('PG_DB_CONNECTION_STRING'),
  entities: [User, Session, Game, GameHistory],
  logging: true,
});

export default dataSource;
