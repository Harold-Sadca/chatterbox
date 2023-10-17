import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { TypeLoggedInUser } from '@/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/features/currentUserSlice';
import { RootState } from '@/redux/store';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );

  useEffect(() => {
    if (currentUser.uid) {
      return;
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid } = user;
        currentUser = { email, uid } as TypeLoggedInUser;
        dispatch(loginUser(currentUser));
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position='static'
        sx={{ backgroundColor: 'var(--secondary-colour)' }}
      >
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, color: 'var(--secondary-colour)' }}
          >
            Contacts
          </Typography>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem>{currentUser.email}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
