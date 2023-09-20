import React, { useState } from 'react';
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
  // const messagesRef = doc(db, 'chats', currentUser.uid);

  const handleSendMessage = async () => {
    console.log('clicked');
    const ref = doc(db, 'users', 'JrBfNIbYeBcnQRCYYT9d');
    const docSnap = await getDoc(ref);
    console.log(docSnap.data());
    // try {
    //   console.log('try', currentUser.uid);
    //   const docRef = await addDoc(collection(db, 'users'), {
    //     first: 'Ada',
    //     last: 'Lovelace',
    //     // born: 1815,
    //   });
    //   console.log('after');
    //   console.log(docRef.id);
    // } catch (error) {
    //   console.log('');
    //   console.error('Error adding document: ', error);
    //   if (error.code === 'permission-denied') {
    //     console.error(
    //       'Firestore security rules might be blocking this operation.'
    //     );
    //   }
    // }
    // if (newMessage.trim() !== '') {
    //   const message = { id: uuid(), text: newMessage, sender: currentUser };
    //   setMessages([...messages, message]);
    //   console.log(message);
    //   await updateDoc(messagesRef, {
    //     messages: arrayUnion(message),
    //   });
    //   setNewMessage('');
    // }
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
  };

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
