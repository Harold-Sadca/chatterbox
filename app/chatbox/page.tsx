'use client';

import React, { useState, useEffect } from 'react';
import ChatContainer from '@/(components)/ChatContainer';
import Navbar from '@/(components)/Navbar';
import Users from '@/(components)/Users';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export default function Chatbox() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );

  const recipient = useSelector(
    (state: RootState) => state.recipientSliceReducer.value
  );

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const hideChat = screenWidth < 1200 && recipient.uid == '';
  useEffect(() => {
    // Add a window resize event listener to update the screen dimensions
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className='container'>
      <Navbar />
      <section className='chat-body'>
        <Users />
        {hideChat ? null : <ChatContainer />}
      </section>
    </main>
  );
}
