import { Game } from 'src/game/entities/game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  username: string;

  @OneToMany(() => Game, (game) => game.creator, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  createdGames: Game[];

  @OneToMany(() => Game, (game) => game.recipient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  receivedGames: Game[];
}
