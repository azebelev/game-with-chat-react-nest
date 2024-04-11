import { Action } from 'src/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  action: Action;

  @Column()
  author: string;

  @Column()
  authorId: number;

  @Column()
  gameId: number;

  @ManyToOne(() => Game, (game) => game.history, { nullable: false })
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @CreateDateColumn()
  createdAt: Date;
}
