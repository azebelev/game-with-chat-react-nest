/* eslint-disable @typescript-eslint/no-unused-vars */
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { eventsKeys } from 'src/constants';
import { JoinGameDto } from 'src/game/dto/join-game.dto';
import { GameHistory } from 'src/game/entities/game-history.entity';
import { Game } from 'src/game/entities/game.entity';
import { Player } from 'src/game/types/gameSchema';
import { AuthenticatedSocket } from 'src/types';
import { GatewaySessionManager } from './gateway.session';

@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_HOST || 'http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly sessions: GatewaySessionManager) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { username: socket.user.username });
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log(`${socket.user.username} disconnected.`);
    this.sessions.removeUserSocket(socket.user.id);
  }

  @SubscribeMessage(eventsKeys.connectGame)
  onJoin(
    @MessageBody() gameId: number,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.join(`game-${gameId}`);
  }

  @OnEvent(eventsKeys.newGameCreated)
  handleGameCreateEvent(payload: Game) {
    this.server.emit(eventsKeys.newGameCreated, payload);
  }

  @OnEvent(eventsKeys.startGame)
  handleGameJoinEvent(payload: JoinGameDto) {
    const recipientSocket = this.sessions.getUserSocket(payload.recipientId);
    if (recipientSocket) {
      recipientSocket.to(`game-${payload.gameId}`).emit(eventsKeys.startGame);
      this.server.emit(eventsKeys.gameFulfilled, {
        gameId: payload.gameId,
        recipientId: payload.recipientId,
      });
    }
  }

  @OnEvent(eventsKeys.turnChange)
  handleTurnChangeEvent(payload: { gameId: number; currentPlayerId: number }) {
    this.server
      .to(`game-${payload.gameId}`)
      .emit(eventsKeys.turnChange, payload.currentPlayerId);
  }

  @OnEvent(eventsKeys.addMessage)
  handleActionSavedEvent(payload: GameHistory) {
    const client = this.sessions.getUserSocket(payload.authorId);
    this.server.to(`game-${payload.gameId}`).emit(eventsKeys.addMessage, {
      message: payload.message,
      author: payload.author,
      authorId: payload.authorId,
      createdAt: payload.createdAt,
    });
  }

  @OnEvent(eventsKeys.changePlayerPosition)
  handleNewPlayerPositionEvent(
    payload: Player & { gameId: number } & { isWin: boolean },
  ) {
    const { gameId, isWin, ...player } = payload;
    this.server
      .to(`game-${payload.gameId}`)
      .emit(eventsKeys.changePlayerPosition, { player, isWin });
  }

  @OnEvent(eventsKeys.giveUp)
  handleGiveUp(payload: { id: number; username: string; gameId: number }) {
    const { id, gameId, username } = payload;
    this.server.to(`game-${gameId}`).emit(eventsKeys.giveUp, { id, username });
  }
}
