import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { getUsers } from '@/utils/utils';
import { useDispatch } from 'react-redux';
import { TypeLoggedInUser } from '@/utils/types';
import Loading from './Loading';
import { setUsers } from '@/redux/features/allUsersSlice';
import { setRecipient } from '@/redux/features/recipientSlice';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

export default function Users() {
  const [users, setUsersState] = useState<TypeLoggedInUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getUsers().then((res) => {
      dispatch(setUsers(res));
      setUsersState(res);
      setLoaded(true);
    });
  }, []);
  if (!loaded) {
    return <Loading />;
  }

  const handleSetRecipient = (user: TypeLoggedInUser) => {
    dispatch(setRecipient(user));
  };
  return (
    <List sx={style} component='nav' aria-label='users'>
      {users.map((user, idx) => {
        return (
          <div key={user.uid}>
            <ListItem button onClick={() => handleSetRecipient(user)}>
              <ListItemText primary={user.email} />
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );
}
