import { IsInt } from 'class-validator';

export class GiveUpDto {
  @IsInt()
  gameId: number;
}
