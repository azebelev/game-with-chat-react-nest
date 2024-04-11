import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

export function ConfirmationModal({
  messages,
  modalOpen,
  handleSubmit,
  onClose,
  submitButtonText,
  submitButtonDisabled,
}: {
  messages: string[];
  modalOpen: boolean;
  onClose: () => void;
  handleSubmit: () => void;
  submitButtonText?: string;
  submitButtonDisabled?: boolean;
}) {
  return (
    <Dialog
      open={modalOpen}
      onClose={onClose}
      sx={{
        '.MuiPaper-root': {
          minWidth: '430px',
          maxWidth: '600px !important',
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        {messages.map((message) => (
          <Typography key={message} align='center' pb={1} fontSize={16}>
            {message}
          </Typography>
        ))}
      </DialogContent>
      <Stack direction={'row'} gap={3} paddingBottom={3} justifyContent={'center'}>
        <Button sx={{ color: grey[800] }} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          disabled={submitButtonDisabled}
        >
          {submitButtonText ?? 'Confirm'}
        </Button>
      </Stack>
    </Dialog>
  );
}
