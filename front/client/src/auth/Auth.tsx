import { Outlet } from 'react-router-dom';
import { AppContainer } from '../components/styled/AppContainer';
import useUserStore from '../store/userStore';
import { LoginPage } from './LoginPage';

export function Auth() {
  const { user } = useUserStore(({ user }) => ({ user }));

  return <AppContainer>{user ? <Outlet /> : <LoginPage />}</AppContainer>;
}
