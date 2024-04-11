import { User } from 'src/auth/entities/user.entity';
import { QueryRunner } from 'typeorm';

export async function seedUsers(queryRunner: QueryRunner) {
  await queryRunner.manager.getRepository(User).save([
    {
      username: 'UserName',
    },
  ]);
}
