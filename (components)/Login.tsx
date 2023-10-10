'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/redux/features/currentUserSlice';
import { TypeLoggedInUser } from '@/utils/types';
import { auth, db } from '@/firebase';
import { signup } from '@/redux/features/loginSlice';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    ></Typography>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function Login() {
  const dispatch = useDispatch();
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const { email, uid } = result.user;

      const usersCollectionRef = collection(db, 'users');
      const userDocRef = doc(usersCollectionRef, uid); // Reference the user document by UID

      const userSnapshot = await getDoc(userDocRef); // Check if the document exists

      if (userSnapshot.exists()) {
        // The user document already exists, you can update it here if needed
        console.log('User already exists:', userSnapshot.data());
      } else {
        // The user document doesn't exist, create a new one
        const user = { email, uid };
        await setDoc(userDocRef, user); // Use setDoc to create a new document
        console.log('New user created:', user);
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = (error as FirebaseError).customData?.email; // Cast to FirebaseError.
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(
          error as FirebaseError
        );
        console.log({
          errorCode,
          errorMessage,
          email,
          credential,
        });
      } else {
        console.log(error);
      }
    }
  };

  const handleEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signInWithEmailAndPassword(
      auth,
      data.get('email') as string,
      data.get('password') as string
    )
      .then((userCredential) => {
        const { email, uid } = userCredential.user;
        const user = { email, uid } as TypeLoggedInUser;
        dispatch(loginUser(user));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component='main' maxWidth='xs'>
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
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleEmailLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              type='button'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleGoogleLogin()}
            >
              Sign In With Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <a
                  href='#'
                  onClick={() => {
                    dispatch(signup(false));
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </a>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
