import { Box, Button, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GamesIcon from '@mui/icons-material/Games';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { Action } from '../../enums';

export function GameControls({
  dispatchRequest,
  active,
  giveUp,
  isFinished,
}: {
  dispatchRequest: (message: string) => Promise<void>;
  active: boolean;
  giveUp: () => void;
  isFinished: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleMovingClick = (action: Action) => {
    if (!active) return;
    switch (action) {
      case Action.Up:
        dispatchRequest('/up');
        break;
      case Action.Down:
        dispatchRequest('/down');
        break;
      case Action.Left:
        dispatchRequest('/left');
        break;
      case Action.Right:
        dispatchRequest('/right');
        break;
      default:
        break;
    }
  };

  const handleExit = () => navigate('/waiting-list');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          handleMovingClick(Action.Up);
          break;
        case 'ArrowDown':
          handleMovingClick(Action.Down);
          break;
        case 'ArrowLeft':
          handleMovingClick(Action.Left);
          break;
        case 'ArrowRight':
          handleMovingClick(Action.Right);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatchRequest]);

  return (
    <>
      <ConfirmationModal
        modalOpen={modalOpen}
        messages={['Do you want to give up?']}
        onClose={() => setModalOpen(false)}
        handleSubmit={giveUp}
      />
      <Stack direction={'row'} justifyContent={'center'}>
        <Box width={'120px'}>
          <Grid columns={3} container gap={0}>
            <Grid xs={1}></Grid>
            <Grid xs={1}>
              <IconButton
                disabled={!active}
                onClick={() => handleMovingClick(Action.Up)}
                color={'primary'}
              >
                <ArrowBackIosIcon sx={{ transform: 'rotate(90deg) translate(5px,0px)' }} />
              </IconButton>
            </Grid>
            <Grid xs={1}></Grid>
            <Grid xs={1}>
              <IconButton
                disabled={!active}
                onClick={() => handleMovingClick(Action.Left)}
                color={'primary'}
              >
                <ArrowBackIosIcon sx={{ transform: 'translate(4px,0px)' }} />
              </IconButton>
            </Grid>
            <Grid textAlign={'center'} alignContent={'center'} xs={1}>
              <GamesIcon color={'disabled'} sx={{ transform: 'translate(0px,0px)' }} />
            </Grid>
            <Grid xs={1}>
              <IconButton
                disabled={!active}
                onClick={() => handleMovingClick(Action.Right)}
                color={'primary'}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
            <Grid xs={1}></Grid>
            <Grid xs={1}>
              <IconButton
                disabled={!active}
                onClick={() => handleMovingClick(Action.Down)}
                color={'primary'}
                sx={{ transform: 'rotate(90deg) translate(0px,0px)' }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
        <Stack marginLeft={6} justifyContent={'center'}>
          {isFinished ? (
            <Button onClick={handleExit} variant={'contained'}>
              Exit
            </Button>
          ) : (
            <Button onClick={() => setModalOpen(true)} color='error' variant={'contained'}>
              Give up
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
}
