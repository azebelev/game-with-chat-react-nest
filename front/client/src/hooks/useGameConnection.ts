/* eslint-disable react-hooks/exhaustive-deps */
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGame, giveUpRequest, makeActionRequest, makeMessageRequest } from '../api';
import { eventsKeys } from '../constants/eventsKeys';
import { Action } from '../enums';
import useUserStore, { User } from '../store/userStore';
import { getActionDescriptor } from '../utils/getActionDescriptor';

export type Player = { id: number; x: number; y: number };

export type GameFieldItem = {
  isWall: boolean | null; // null means
  breadcrumbs: boolean;
};

export type GameField = {
  userPlayer: Player;
  opponent: Player;
  field: GameFieldItem[][];
};

export type GameSchema = {
  player1: Player;
  player2: Player;
  field: GameFieldItem[][]; // detect wall position or exit(null);
};

export type ChatItem = {
  message: string;
  author: string;
  authorId: number;
  createdAt: Date;
  action: Action;
};

export type GameDto = {
  id: number;
  createdAt: Date;
  creator: User;
  recipient: User | null;
  gameSchema: GameSchema | null;
  history: ChatItem[] | null;
  startedAt: Date | null;
};

export type GameInfo = Omit<GameDto, 'history' | 'gameSchema'> | null;

export type ActionDto = {
  message: string;
  gameId: number;
  userX: number;
  userY: number;
};

export function useGameConnection(gameId: number) {
  const navigate = useNavigate();
  const [gameInfo, setGameInfo] = useState<GameInfo>(null);
  const [gameField, setGameField] = useState<GameField | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const { socket, user } = useUserStore(({ socket, user }) => ({ socket, user }));
  const { enqueueSnackbar } = useSnackbar();
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [gameResult, setGameResult] = useState<null | { win: boolean; surrendered: string }>(null);

  const updateStates = (gameDto: GameDto) => {
    const { history, gameSchema, ...rest } = gameDto;
    setGameInfo(rest);
    if (gameSchema) {
      const { player1, player2 } = gameSchema;
      setChatHistory(history ?? []);
      setGameField({
        userPlayer: player1.id === user?.id ? player1 : player2,
        opponent: player1.id !== user?.id ? player1 : player2,
        field: gameSchema.field,
      });
      if (history) {
        const lastTurn = (history as any).findLast((h: ChatItem) => h.action !== Action.Message);
        lastTurn && setIsUserTurn(lastTurn.authorId !== user?.id);
      }
    }
  };

  const fetchGame = () => {
    getGame(gameId)
      .then((res) => {
        updateStates(res.data);
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar('GameDto fetching failed', {
          variant: 'error',
        });
      });
  };

  const dispatchRequest = async (message: string) => {
    const descriptor = getActionDescriptor(message);
    if (descriptor.action !== Action.Message) {
      !gameResult && manageAction(descriptor);
    } else await makeMessageRequest({ message, gameId });
  };

  const manageAction = async (descriptor: { action: Action; message: string }) => {
    const userX = gameField?.userPlayer.x;
    const userY = gameField?.userPlayer.y;
    if (userX !== undefined && userY !== undefined) {
      const response = await makeActionRequest({
        message: descriptor.message,
        gameId,
        userX,
        userY,
        action: descriptor.action,
      });
      const { wall } = response.data;
      if (wall) {
        setGameField((prev) => {
          const field = { ...gameField?.field };
          field[wall.y][wall.x].isWall = true;
          return { ...(prev as any), ...field };
        });
        enqueueSnackbar('You have met the wall(', {
          variant: 'error',
        });
      } else if (!response.data.success) {
        enqueueSnackbar('You have tried to go out of field and lost your turn(', {
          variant: 'error',
        });
      }
    }
  };

  const updatePlayerPosition = (player: Player) => {
    setGameField((prev) => {
      const updatedField = { ...prev };
      if (
        updatedField.userPlayer &&
        updatedField.field &&
        updatedField.userPlayer.id === player.id
      ) {
        updatedField.field[updatedField.userPlayer.y][updatedField.userPlayer.x].breadcrumbs = true;
        updatedField.userPlayer = player;
      }
      if (updatedField.opponent?.id === player.id) updatedField.opponent = player;
      return updatedField as any;
    });
  };

  const giveUp = () => {
    giveUpRequest(gameId).catch((error) => {
      console.log(error);
      enqueueSnackbar('error during giving up', {
        variant: 'error',
      });
    });
  };

  useEffect(() => {
    socket.emit(eventsKeys.connectGame, gameId);
    fetchGame();
  }, []);

  useEffect(() => {
    socket.on(eventsKeys.startGame, () => {
      setIsUserTurn(true);
      fetchGame();
    });
    socket.on(eventsKeys.addMessage, (data: ChatItem) => {
      setChatHistory((prev) => {
        const copy = [...prev];
        copy.push(data);
        return copy;
      });
    });
    socket.on(eventsKeys.changePlayerPosition, (data: { player: Player; isWin: boolean }) => {
      updatePlayerPosition(data.player);
      data.isWin && setGameResult({ win: data.player.id === user?.id, surrendered: '' });
    });
    socket.on(eventsKeys.turnChange, (currentPlayerId: number) => {
      setIsUserTurn(currentPlayerId !== user?.id);
    });
    socket.on(eventsKeys.giveUp, (payload: { id: number; username: string }) => {
      setGameResult({
        win: payload.id !== user?.id,
        surrendered: payload.id === user?.id ? 'You' : payload.username,
      });
    });

    return () => {
      socket.off(eventsKeys.gameFulfilled);
      socket.off(eventsKeys.addMessage);
      socket.off(eventsKeys.changePlayerPosition);
      socket.off(eventsKeys.turnChange);
      socket.off(eventsKeys.giveUp);
    };
  }, []);

  return { gameInfo, gameField, chatHistory, dispatchRequest, isUserTurn, giveUp, gameResult };
}
