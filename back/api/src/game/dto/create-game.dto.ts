import { IsInt } from 'class-validator';

export class CreateGameDto {
  @IsInt()
  creatorId: number;
}
