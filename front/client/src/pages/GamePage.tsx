import { ChevronRight } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Dispatch, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameConnection } from '../hooks/useGameConnection';
import { Chat } from './GamePage/Chat';
import { GameControls } from './GamePage/GameControls';
import { GameMaze } from './GamePage/GameMaze';

export function GamePage() {
  const { id } = useParams();
  const { gameInfo, gameField, chatHistory, dispatchRequest, isUserTurn, gameResult, giveUp } =
    useGameConnection(parseInt(id!!));
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <>
      <ChatExpandButton setChatOpen={setChatOpen} />
      <Drawer variant='persistent' anchor='left' open={chatOpen}>
        <Chat
          sendMessage={dispatchRequest}
          chatHistory={chatHistory}
          onClose={() => setChatOpen(false)}
        />
      </Drawer>
      <Box sx={{ ml: chatOpen ? { xs: '30vw', md: '25vw', xl: '20vw' } : '' }}>
        {gameResult ? (
          <GameResultIndicator gameResult={gameResult} />
        ) : (
          <GameMaze isUserTurn={isUserTurn} gameInfo={gameInfo} gameField={gameField} />
        )}
        {gameInfo?.startedAt && (
          <GameControls
            active={!gameResult && isUserTurn}
            dispatchRequest={dispatchRequest}
            giveUp={giveUp}
            isFinished={Boolean(gameResult)}
          />
        )}
      </Box>
    </>
  );
}

function ChatExpandButton({ setChatOpen }: { setChatOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <Button
      onClick={() => setChatOpen(true)}
      size='small'
      endIcon={<ChevronRight />}
      sx={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}
      variant='contained'
    >
      Chat
    </Button>
  );
}

function GameResultIndicator({
  gameResult,
}: {
  gameResult: {
    win: boolean;
    surrendered: string;
  };
}) {
  return (
    <Box height={'80vh'}>
      <Typography
        width={'100%'}
        fontWeight={900}
        textAlign={'center'}
        variant={'h3'}
        component={'p'}
        color={gameResult.win ? 'success.main' : 'error.main'}
      >
        {gameResult.win ? 'You win!!!' : 'You loose((('}
      </Typography>
      {gameResult.surrendered ? (
        <Typography
          fontWeight={900}
          width={'100%'}
          textAlign={'center'}
          variant={'h3'}
          component={'p'}
          mt={4}
        >
          {`${gameResult.surrendered} ${
            gameResult.surrendered === 'You' ? 'have' : 'has'
          } given up`}
        </Typography>
      ) : null}
    </Box>
  );
}
