import { IsEnum, IsInt } from 'class-validator';
import { Action } from 'src/enums';
import { MessageDto } from './message.dto';

export class ActionDto extends MessageDto {
  @IsInt()
  userX: number;

  @IsInt()
  userY: number;

  @IsEnum(Action)
  action: Action;
}
