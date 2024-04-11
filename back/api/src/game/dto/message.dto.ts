import { IsInt, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  message: string;

  @IsInt()
  gameId: number;
}
