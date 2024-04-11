import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { eventsKeys } from 'src/constants';
import { Action } from 'src/enums';
import { ActionDto } from './dto/action.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { GiveUpDto } from './dto/give.up.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { MessageDto } from './dto/message.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Post('create')
  async create(@Body() createGameDto: CreateGameDto) {
    const game = await this.gameService.create(createGameDto);
    this.eventEmitter.emit(eventsKeys.newGameCreated, game);
    return game;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('join')
  async join(@Body() joinGameDto: JoinGameDto) {
    const game = await this.gameService.joinGame(joinGameDto);
    this.eventEmitter.emit(eventsKeys.startGame, joinGameDto);
    return game.id;
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  findAll() {
    return this.gameService.findAllPending();
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const game = await this.gameService.findGameById(id);
    const { gameSchema, ...rest } = game;
    if (game.startedAt) {
      const field = this.gameService.recoverGameState(
        game,
        req.session.user.id,
      );
      const schema = {
        player1: gameSchema.player1,
        player2: gameSchema.player2,
        field,
      };
      return { ...rest, gameSchema: schema };
    }
    return { ...rest, gameSchema: null };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('action')
  async manageAction(@Body() dto: ActionDto, @Req() req: Request) {
    const { id, username } = req.session.user;
    const { message, gameId, userX, userY, action } = dto;
    const { x, y, wall, isWin } = await this.gameService.definePosition(
      gameId,
      userX,
      userY,
      action,
    );

    const newItem = await this.gameService.createGameHistoryItem({
      action,
      message,
      gameId,
      authorId: id,
      author: username,
      ...(isWin ? { finishedAt: new Date() } : {}),
    });

    const success = x !== userX || y !== userY;
    if (success)
      this.eventEmitter.emit(eventsKeys.changePlayerPosition, {
        id,
        x,
        y,
        gameId: dto.gameId,
        isWin,
      });
    this.eventEmitter.emit(eventsKeys.addMessage, newItem);
    this.eventEmitter.emit(eventsKeys.turnChange, {
      gameId,
      currentPlayerId: id,
    });
    return { wall, success };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('message')
  async message(@Body() dto: MessageDto, @Req() req: Request) {
    const { id, username } = req.session.user;
    const { message, gameId } = dto;
    const newItem = await this.gameService.createGameHistoryItem({
      action: Action.Message,
      message,
      gameId,
      authorId: id,
      author: username,
    });
    this.eventEmitter.emit(eventsKeys.addMessage, newItem);

    return;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('give-up')
  async giveUp(@Body() dto: GiveUpDto, @Req() req: Request) {
    const { id, username } = req.session.user;
    const result = await this.gameService.update(dto.gameId, {
      finishedAt: new Date(),
    });
    if (result.affected) {
      this.eventEmitter.emit(eventsKeys.giveUp, {
        id,
        username,
        gameId: dto.gameId,
      });
      return;
    } else {
      throw new NotFoundException('Game not set as finished');
    }
  }
}
