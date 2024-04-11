import { io } from 'socket.io-client';
import { create } from 'zustand';

export type User = {
  username: string;
  id: number;
};

type UserStore = {
  user: User | null;
  socket: ReturnType<typeof io>;
  setUser: (user: User | null) => void;
};

const socket = io(process.env.REACT_APP_WEBSOCKET_URL!, {
  withCredentials: true,
});

const useUserStore = create<UserStore>((set) => ({
  user: null,
  socket: socket,
  setUser: (user) => {
    set({ user });
  },
}));

export default useUserStore;
