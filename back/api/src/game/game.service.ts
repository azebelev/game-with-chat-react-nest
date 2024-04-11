import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Action } from 'src/enums';
import { IsNull, Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { JoinGameDto } from './dto/join-game.dto';
import { GameHistory } from './entities/game-history.entity';
import { Game } from './entities/game.entity';
import { getGameSchemaMock } from './mock/gameTemplateMock';
import { GameField } from './types/gameSchema';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepo: Repository<GameHistory>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const creator = await this.userRepo.findOneBy({
      id: createGameDto.creatorId,
    });
    const game = this.gameRepo.create({ creator });
    return await this.gameRepo.save(game);
  }

  async joinGame(joinGameDto: JoinGameDto) {
    const game = await this.gameRepo.findOneBy({ id: joinGameDto.gameId });
    if (!game) throw new NotFoundException();
    if (game.recipientId) throw new ConflictException();
    game.recipientId = joinGameDto.recipientId;
    game.startedAt = new Date();
    game.gameSchema = getGameSchemaMock(game.recipientId, game.creatorId);
    return await this.gameRepo.save(game);
  }

  findAllPending() {
    return this.gameRepo.find({
      where: { finishedAt: IsNull(), startedAt: IsNull() },
      relations: { creator: true },
    });
  }

  findGameById(id: number) {
    return this.gameRepo.findOne({
      where: { id },
      relations: { history: true, creator: true, recipient: true },
    });
  }

  async createGameHistoryItem(
    historyCreateObj: Omit<GameHistory, 'id' | 'game' | 'createdAt'>,
  ) {
    const newHistoryItem = this.gameHistoryRepo.create(historyCreateObj);
    return await this.gameHistoryRepo.save(newHistoryItem);
  }

  async definePosition(
    gameId: number,
    userX: number,
    userY: number,
    action: Action,
  ) {
    const { gameSchema } = await this.gameRepo.findOneBy({ id: gameId });
    return this.calcPosition(action, gameSchema.field, userX, userY);
  }

  private calcPosition(
    action: Action,
    field: GameField,
    userX: number,
    userY: number,
  ) {
    const pos = { x: userX, y: userY };
    switch (action) {
      case Action.Down:
        pos.y++;
        break;
      case Action.Up:
        pos.y--;
        break;
      case Action.Left:
        pos.x--;
        break;
      case Action.Right:
        pos.x++;
        break;
    }
    const cell = field[pos.y]?.[pos.x];
    const isWall = cell === true;
    const isWin = cell === null;
    const isOutOfRange = cell === undefined;
    if (isOutOfRange) return { x: userX, y: userY, wall: null, isWin };
    if (isWall) return { x: userX, y: userY, wall: pos, isWin };
    return { ...pos, wall: null, isWin };
  }

  recoverGameState(game: Game, userId: number) {
    const field = game.gameSchema.field;
    const sanitizedField: {
      isWall: boolean;
      breadcrumbs: boolean;
    }[][] = game.gameSchema.field.map((row) =>
      row.map((item) => ({
        isWall: item === null ? null : false,
        breadcrumbs: null,
      })),
    );
    const { player1, player2 } = game.gameSchema;
    const userPlayer = player1.id === userId ? player1 : player2;
    const opponent = player1.id !== userId ? player1 : player2;
    const userActionHistory = game.history.filter(
      (v) => v.action !== Action.Message && v.authorId === userPlayer.id,
    );
    const opponentActionHistory = game.history.filter(
      (v) => v.action !== Action.Message && v.authorId === opponent.id,
    );

    userActionHistory.forEach((h) => {
      const res = this.calcPosition(
        h.action,
        field,
        userPlayer.x,
        userPlayer.y,
      );
      const success = res.x !== userPlayer.x || res.y !== userPlayer.y;
      if (success) {
        sanitizedField[userPlayer.y][userPlayer.x] = {
          isWall: false,
          breadcrumbs: true,
        };
        userPlayer.x = res.x;
        userPlayer.y = res.y;
      } else if (res.wall)
        sanitizedField[res.wall.y][res.wall.x] = {
          isWall: true,
          breadcrumbs: false,
        };
    });
    opponentActionHistory.forEach((h) => {
      const res = this.calcPosition(h.action, field, opponent.x, opponent.y);
      const success = res.x !== userPlayer.x || res.y !== userPlayer.y;
      if (success) {
        opponent.x = res.x;
        opponent.y = res.y;
      }
    });
    return sanitizedField;
  }

  update(id: number, updateGameDto: Omit<Partial<Game>, 'id'>) {
    return this.gameRepo.update(id, updateGameDto);
  }
}
