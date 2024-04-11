import { IsInt } from 'class-validator';

export class JoinGameDto {
  @IsInt()
  gameId: number;

  @IsInt()
  recipientId: number;
}
