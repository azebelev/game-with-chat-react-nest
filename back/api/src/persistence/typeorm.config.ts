import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Session } from 'src/auth/entities/session.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  url: configService.get<string>('PG_DB_CONNECTION_STRING'),
  entities: [User, Session],
  logging: true,
});

export default dataSource;
