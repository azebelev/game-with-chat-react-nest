import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameSchema } from '../types/gameSchema';
import { GameHistory } from './game-history.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: number;

  @Column({ nullable: true })
  recipientId: number;

  @ManyToOne(() => User, (user) => user.createdGames, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => User, (user) => user.receivedGames, { nullable: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column('jsonb', { nullable: true })
  gameSchema: GameSchema;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt: Date;

  @OneToMany(() => GameHistory, (gameHistory) => gameHistory.game, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  history: GameHistory[];
}
