import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignin } from '../api/api';

export default function SignIn() {
    const { signin } = useSignin();
    const navigate = useNavigate();
    const [error, setError] = React.useState({ field: 0, message: '' });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        let idx = 0;
        for (var pair of data.entries()) {
          if (!pair[1]) {
            setError({ field: idx, message: 'Please fill all the fields' });
            return;
          }
          idx++;
        }

        try {
            await signin(data.get('username') as string, data.get('password') as string);
            navigate('/search');
        } catch(err: any) {
            setError(err.message);
            setError({ field: 0, message: err.message });
        }
    };

  return (
    <Stack width="100vw">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              error={error.field == 0 && !!error.message}
              helperText={error.field == 0 && error.message ? error.message : ''}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={error.field == 1 && !!error.message}
              helperText={error.field == 1 && error.message ? error.message : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link to='/auth/signup'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Stack>
  );
}