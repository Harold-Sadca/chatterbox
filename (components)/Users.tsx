import React, { useState, useEffect } from 'react';
import { getUsers } from '@/utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { TypeLoggedInUser } from '@/utils/types';
import Loading from './Loading';
import Avatar from '@mui/material/Avatar';
import { setRecipient } from '@/redux/features/recipientSlice';
import { RootState } from '@/redux/store';

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

export default function Users() {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  const [users, setUsersState] = useState<TypeLoggedInUser[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!currentUser.uid) {
      return;
    }
    const unsubscribe = getUsers(currentUser.uid, setUsersState);
    setLoaded(true);
  }, [currentUser.uid]);
  if (!loaded) {
    return <Loading />;
  }

  const handleSetRecipient = (user: TypeLoggedInUser) => {
    dispatch(setRecipient(user));
  };
  return (
    <section className='users-body'>
      <h4>Users</h4>
      <div className='users-container'>
        {users.map((user) => {
          return (
            <section
              key={user.uid}
              className='chat-recipient user'
              onClick={() => handleSetRecipient(user)}
            >
              <Avatar>{user.email.split('')[0].toLocaleUpperCase()}</Avatar>
              <p className='chat-recipient-name'>{user.email}</p>
            </section>
          );
        })}
      </div>
    </section>
  );
}
