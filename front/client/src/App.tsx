import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Auth } from './auth/Auth';
import { WaitingGameList } from './pages/WaitingGameList';
import { SnackbarProvider } from 'notistack';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Routes>
        <Route element={<Auth />}>
          <Route path='/' element={<Navigate to='/waiting-list' />} />
          <Route path='/waiting-list' element={<WaitingGameList />} />
          <Route path='/game/:id' element={<GamePage/>} />
        </Route>
      </Routes>
    </SnackbarProvider>
  );
}

export default App;
