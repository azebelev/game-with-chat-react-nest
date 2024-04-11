import { ChevronLeft } from '@mui/icons-material';
import { Box, Button, IconButton, OutlinedInput, Paper, Stack, Typography } from '@mui/material';
import { blueGrey, grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { ChatItem } from '../../hooks/useGameConnection';
import useUserStore from '../../store/userStore';

export function Chat({
  chatHistory,
  onClose,
  sendMessage,
}: {
  chatHistory: ChatItem[];
  onClose: () => void;
  sendMessage: (message: string) => Promise<void>;
}) {
  const { user } = useUserStore(({ user }) => ({ user }));
  const [message, setMessage] = useState('');
  const chatContainer = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (message) {
      sendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    if (chatContainer.current) chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }, [chatHistory]);

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography color={grey[600]} ml={2} variant='h6'>
          Chat
        </Typography>
        <IconButton onClick={() => onClose()}>
          <ChevronLeft />
        </IconButton>
      </Stack>
      <Box p={1} sx={{ width: { xs: '30vw', md: '25vw', xl: '20vw' } }}>
        <Box ref={chatContainer} sx={{ height: '80vh', overflow: 'auto' }}>
          {chatHistory.map((item, i) => (
            <MessageBlock
              key={i}
              author={item.author}
              date={item.createdAt}
              isUser={item.authorId === user?.id}
              message={item.message}
            />
          ))}
        </Box>
        <Stack pt={2} direction={'row'}>
          <OutlinedInput
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            onChange={(e) => setMessage(e.target.value)}
            size={'small'}
            value={message}
            sx={{ width: 'calc(100% - 40px)' }}
          />
          <Button onClick={handleSendMessage} size='small'>
            send
          </Button>
        </Stack>
      </Box>
    </>
  );
}

function MessageBlock({
  author,
  date,
  isUser,
  message,
}: {
  author: string;
  date: Date;
  isUser: boolean;
  message: string;
}) {
  return (
    <>
      <Stack direction={'row'} justifyContent={isUser ? 'right' : 'left'}>
        <Box sx={{ width: '80%', p: 1 }}>
          <Typography color={grey[500]} variant='body2'>{`${isUser ? '' : author} ${dayjs(
            date
          ).format('DD MMM hh:mm')}`}</Typography>
          <Paper
            sx={{
              backgroundColor: isUser ? blueGrey[50] : 'inherit',
              p: 1,
            }}
          >
            <Typography variant='body2'>{message}</Typography>
          </Paper>
        </Box>
      </Stack>
    </>
  );
}
