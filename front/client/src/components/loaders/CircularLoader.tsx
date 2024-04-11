import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';

export const CircularLoader: React.FC = () => (
    <Box
        sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor:grey[500],
            width: '100%',
            height: '100%',
            opacity: 0.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex:1000
        }}
    >
        <CircularProgress size={'6em'} />
    </Box>
);
