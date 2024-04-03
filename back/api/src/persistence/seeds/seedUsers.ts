import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { QueryRunner } from 'typeorm';

export async function seedUsers(queryRunner: QueryRunner) {
  const password = await bcrypt.hash('123', 10);
  await queryRunner.manager.getRepository(User).save([
    {
      name: 'UserName',
      password,
      email: 'admin@gmail.com',
    },
  ]);
}
