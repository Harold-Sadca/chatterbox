import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { TypeMessage } from '@/utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { v4 as uuid } from 'uuid';
import { db, storage } from '@/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
  addDoc,
  getDoc,
} from 'firebase/firestore';
import { getUsers } from '@/utils/utils';

const initialValue: TypeMessage = {
  id: '',
  text: '',
  sender: {
    email: '',
    uid: '',
  },
};

export default function ChatContainer() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  console.log(currentUser);
  const [messages, setMessages] = useState<TypeMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = async () => {
    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, currentUser.uid);
    const messagesCollectionRef = collection(userDocRef, 'messages');
    const message = {
      id: uuid(),
      text: newMessage,
      sender: currentUser,
      date: Timestamp.now(),
    };
    await addDoc(messagesCollectionRef, message);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  useEffect(() => {
    const userMessages = getUsers().then((res) => {
      console.log(res);
    });
    console.log(userMessages);
  }, []);

  return (
    <div className='chat-container'>
      <div className='message-container'>
        {messages.map((message, index) => (
          <div className='message' key={index}>
            {message.text}
          </div>
        ))}
      </div>
      <div className='input-container'>
        <TextField
          fullWidth
          label='Type your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          id='fullWidth'
        />
        <Button
          variant='contained'
          onClick={handleSendMessage}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
