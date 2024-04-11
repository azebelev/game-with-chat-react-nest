import { Box, Button, Input, InputLabel, Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { DebouncedComponent } from '../components/DebouncedComponent';
import { CircularLoader } from '../components/loaders/CircularLoader';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { loading, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string }>();

  const onSubmit = async (formData: { username: string }) => {
   if(await login(formData.username)) navigate('/waiting-list')

  };
  return (
    <>
      <DebouncedComponent showChild>
        {loading && <CircularLoader />}
        <Stack flex={1} alignItems={'center'} justifyContent={'center'}>
          <Paper sx={{ p: 5, width: { xs: '70%', md: '50%', xl: '30%' } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputLabel
                sx={{ fontSize: '18px', color: errors.username ? 'error.main' : 'inherit' }}
              >
                Enter you name
              </InputLabel>
              <Box position={'relative'}>
                <Input
                  error={!!errors.username}
                  {...register('username', {
                    required: 'name is required',
                    minLength: {
                      value: 3,
                      message: 'the name length should be 3 or more',
                    },
                    maxLength: {
                      value: 20,
                      message: 'the name length should be less than 20',
                    },
                  })}
                  sx={{ mt: 2 }}
                  fullWidth
                />
                {errors.username ? (
                  <Box sx={{ position: 'absolute', color: 'error.main' }}>
                    {errors.username.message}
                  </Box>
                ) : null}
              </Box>

              <Button type='submit' sx={{ mt: 4 }} variant='outlined'>
                Confirm
              </Button>
            </form>
          </Paper>
        </Stack>
      </DebouncedComponent>
    </>
  );
}
