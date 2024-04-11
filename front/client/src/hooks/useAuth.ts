import { HttpStatusCode } from 'axios';
import { useEffect, useState } from 'react';
import { apiLogin, getStatus } from '../api';
import useUserStore from '../store/userStore';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { setUser, socket } = useUserStore(({ setUser, socket }) => ({ setUser, socket }));

  const tryToFetchUser = async () => {
    setLoading(true);
    const response = await getStatus().finally(() => setLoading(false));
    if (response.data) {
      setUser(response.data);
    }
  };

  const login = async (username: string) => {
    setLoading(true);
    const response = await apiLogin(username);
    if (response.status === HttpStatusCode.Ok) {
      await tryToFetchUser();
      socket.connect();
      setLoading(false);
      return true;
    }
    setLoading(false);
  };
  
  useEffect(() => {
    tryToFetchUser();
  }, []);

  return { loading, login };
}
