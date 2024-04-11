import { ConfigService } from '@nestjs/config';
import { Session } from 'src/auth/entities/session.entity';
import { User } from 'src/auth/entities/user.entity';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { Game } from 'src/game/entities/game.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDbConfig = async (
  configService: ConfigService,
): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  url: configService.get('PG_DB_CONNECTION_STRING'),
  entities: [User, Session, Game, GameHistory],
  synchronize: true,
});
