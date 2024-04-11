import axios, { AxiosRequestConfig } from 'axios';
import { Action } from './enums';
import { GameDto } from './hooks/useGameConnection';
import { User } from './store/userStore';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({ baseURL: API_URL });
const config: AxiosRequestConfig = { withCredentials: true };

export type GamePeer = {
  creator: User;
  createdAt: string;
  id: number;
};

export const apiLogin = (username: string) => api.post('/auth/login', { username }, config);
export const getStatus = () => api.get<User>('/auth/status', config);

export const createNewGameRequest = (userId: number) =>
  api.post('/game/create', { creatorId: userId }, config);

export const joinGameRequest = (gameId: number, recipientId: number) =>
  api.post<number>('/game/join', { gameId, recipientId }, config);

export const getWaitingGameList = () => api.get<GamePeer[]>('/game', config);
export const getGame = (gameId: number) => api.get<GameDto>(`/game/${gameId}`, config);

export const makeActionRequest = (dto: {
  message: string;
  gameId: number;
  userX: number;
  userY: number;
  action: Action;
}) =>
  api.post<{ wall: null | { x: number; y: number }; success: boolean }>(
    `/game/action`,
    dto,
    config
  );

export const makeMessageRequest = (dto: { message: string; gameId: number }) =>
  api.post(`/game/message`, dto, config);

export const giveUpRequest = (gameId: number) => api.post('/game/give-up', { gameId }, config);
