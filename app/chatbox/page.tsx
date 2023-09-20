'use client';

import ChatContainer from '@/(components)/ChatContainer';
import Navbar from '@/(components)/Navbar';
import Users from '@/(components)/Users';
import { RootState } from '@/redux/store';
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Chatbox() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  return (
    <main className='container'>
      <Navbar />
      <Users />
      <ChatContainer />
    </main>
  );
}
