import { Box, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { BlinkingWrapper } from '../../components/styled/BlinckingWrapper';
import { GameField, GameInfo } from '../../hooks/useGameConnection';

import { MazeItem } from './MazeItem';

export function GameMaze({
  gameInfo,
  gameField,
  isUserTurn,
}: {
  gameInfo: GameInfo;
  gameField: GameField | null;
  isUserTurn: boolean;
}) {
  return (
    <>
      {gameInfo?.recipient === null ? <TimeElapsedMessage createdAt={gameInfo.createdAt} /> : null}
      {gameField ? (
        <>
          <Box height={'80vh'}>
            <Stack p={0.5} direction={'row'} justifyContent={'center'}>
              <Box>
                <Typography textAlign={'center'}>{`Game started at ${dayjs(
                  gameInfo?.startedAt
                ).format('DD MMM hh:mm')}`}</Typography>
                <TurnIndicator isUserTurn={isUserTurn} />
                <Paper>
                  {gameField.field.map((row, i) => (
                    <Stack direction={'row'} key={i}>
                      {row.map((item, j) => (
                        <MazeItem
                          key={j}
                          gameField={gameField}
                          coordinates={{ x: j, y: i }}
                          item={item}
                        />
                      ))}
                    </Stack>
                  ))}
                </Paper>
              </Box>
            </Stack>
          </Box>
        </>
      ) : null}
    </>
  );
}

function TimeElapsedMessage({ createdAt }: { createdAt: Date }) {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const durationInSeconds = now.diff(createdAt, 'second');
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const seconds = durationInSeconds % 60;
      setElapsedTime(
        `${hours ? hours + ' hours' : ''} ${minutes ? minutes + ' minutes' : ''} ${seconds} seconds`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <BlinkingWrapper>
      <Typography textAlign={'center'} p={'90px'}>
        You started a new game {elapsedTime} ago. Waiting for a second player…
      </Typography>
    </BlinkingWrapper>
  );
}

function TurnIndicator({ isUserTurn }: { isUserTurn: boolean }) {
  return isUserTurn ? (
    <Typography textAlign={'center'} color={'success.main'}>
      Now is your turn
    </Typography>
  ) : (
    <BlinkingWrapper>
      <Typography textAlign={'center'}>Now is opponent turn</Typography>
    </BlinkingWrapper>
  );
}
