'use client';

import React, { useRef, useEffect, useState } from 'react';
import Login from '@/(components)/Login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SignUp from '@/(components)/Signup';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { TypeLoggedInUser } from '@/utils/types';
import { loginUser } from '@/redux/features/currentUserSlice';
import { useRouter } from 'next/navigation';

export default function Homepage() {
  const login = useSelector((state: RootState) => state.loginReducer.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const { email, uid } = user;
        const loggedUser = { email, uid } as TypeLoggedInUser;
        dispatch(loginUser(loggedUser));
        router.push('/chatbox');
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);
  return (
    <main className='container'>
      <h1>Homepage Page</h1>
      {login ? <Login /> : <SignUp />}
    </main>
  );
}
