import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { useWaitingListConnection } from '../hooks/useWaitingListConnection';

export function WaitingGameList() {
  const { waitingList, createNewGame, joinGame } = useWaitingListConnection();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joiningGameId, setJoinGameId] = useState<null | number>(null);
  return (
    <>
      <ConfirmationModal
        modalOpen={createModalOpen}
        messages={['Do you want to create new game?']}
        onClose={() => setCreateModalOpen(false)}
        handleSubmit={() => createNewGame()}
      />
      <ConfirmationModal
        modalOpen={!!joiningGameId}
        messages={['Do you want to join the game?']}
        onClose={() => setJoinGameId(null)}
        handleSubmit={() => joinGame(joiningGameId)}
      />
      <Stack flex={1} maxHeight={'100%'} alignItems={'center'}>
        <Paper
          sx={{
            width: { xs: '70%', md: '60%', xl: '40%' },
            m: 1,
            p: 3,
            height: '90%',
          }}
        >
          <Stack direction={'row'} justifyContent={'space-between'}>
            <ListSubheader>Waiting game list</ListSubheader>
            <Button onClick={() => setCreateModalOpen(true)}>Create new game</Button>
          </Stack>
          <Box overflow={'auto'} height={'95%'}>
            {waitingList?.map((game) => (
              <ListItemButton onClick={() => setJoinGameId(game.id)} key={game.id}>
                <ListItemIcon>
                  <SportsEsportsIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${game.id} Created by ${game.creator.username} at ${dayjs(game.createdAt).format(
                    'DD MMM hh:mm'
                  )}`}
                />
              </ListItemButton>
            ))}
          </Box>
        </Paper>
      </Stack>
    </>
  );
}
