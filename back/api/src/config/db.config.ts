import { ConfigService } from '@nestjs/config';
import { Session } from 'src/auth/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const getDbConfig = async (
  configService: ConfigService,
): Promise<PostgresConnectionOptions> => ({
  type: 'postgres',
  url: configService.get('PG_DB_CONNECTION_STRING'),
  metadataTableName: 'meta',
  entities: [User, Session],
  synchronize: true,
});
