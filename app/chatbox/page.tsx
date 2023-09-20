'use client';

import ChatContainer from '@/(components)/ChatContainer';
import Users from '@/(components)/Users';
import { RootState } from '@/redux/store';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Chatbox() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  console.log(currentUser);
  return (
    <main className='container'>
      <h1>Chatbox Page</h1>
      <Users />
      <ChatContainer />
    </main>
  );
}
