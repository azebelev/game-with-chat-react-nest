/* eslint-disable react-hooks/exhaustive-deps */
import { HttpStatusCode } from 'axios';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GamePeer, createNewGameRequest, getWaitingGameList, joinGameRequest } from '../api';
import { eventsKeys } from '../constants/eventsKeys';
import useUserStore from '../store/userStore';

export function useWaitingListConnection() {
  const navigate = useNavigate();
  const [waitingList, setWaitingList] = useState<GamePeer[]>([]);
  const { socket, user } = useUserStore(({ socket, user }) => ({ socket, user }));
  const { enqueueSnackbar } = useSnackbar();

  const createNewGame = async () => {
    if (user) {
      const response = await createNewGameRequest(user.id);
      if (response.status === HttpStatusCode.Created) {
        enqueueSnackbar('Game created', {
          variant: 'success',
        });
      }
    }
  };

  const joinGame = async (gameId: number | null) => {
    if (user && gameId !== null) {
      const response = await joinGameRequest(gameId, user.id);
      if (response.status === HttpStatusCode.Created) {
        enqueueSnackbar('You have joined the game', {
          variant: 'success',
        });
        navigate(`/game/${response.data}`);
      }
    }
  };

  useEffect(() => {
    getWaitingGameList().then((response) => {
      if (response.status === HttpStatusCode.Ok) setWaitingList(response.data);
    });
  }, []);

  useEffect(() => {
    socket.on(eventsKeys.newGameCreated, (game: GamePeer) => {
      if (game.creator.id !== user?.id) {
        setWaitingList((prev) => {
          const copy = [...prev];
          copy.unshift(game);
          return copy;
        });
      } else navigate(`/game/${game.id}`);
    });
    socket.on(eventsKeys.gameFulfilled, (data: { gameId: number; recipientId: number }) => {
      setWaitingList((prev) => ({ ...prev.filter((g) => g.id !== data.gameId) }));
    });
    return () => {
      socket.off(eventsKeys.newGameCreated);
      socket.off(eventsKeys.gameFulfilled);
    };
  }, []);

  return { waitingList, createNewGame, joinGame };
}
