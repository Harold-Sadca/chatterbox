import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { TypeMessage } from '@/utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { v4 as uuid } from 'uuid';
import { db } from '@/firebase';
import { collection, Timestamp, addDoc } from 'firebase/firestore';
import { fetchAllMessages, getUsers } from '@/utils/utils';
import Loading from './Loading';

export default function ChatContainer() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  const recipient = useSelector(
    (state: RootState) => state.recipientSliceReducer.value
  );
  const [messages, setMessages] = useState<TypeMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const handleSendMessage = async () => {
    const messagesCollectionRef = collection(db, 'messages'); // Reference the "messages" collection

    const message = {
      id: uuid(),
      text: newMessage,
      senderUid: currentUser.uid,
      recipientUid: recipient.uid,
      date: Timestamp.now(),
    };

    await addDoc(messagesCollectionRef, message); // Add the message to the "messages" collection
    setMessages([...messages, message]);
    setNewMessage('');
  };

  useEffect(() => {
    if (!currentUser.uid) {
      return;
    }
    fetchAllMessages(currentUser.uid).then((res) => {
      setMessages([...messages, ...res]);
      setLoading(false);
    });
  }, [currentUser.uid]);

  return (
    <div className='chat-container'>
      {loading ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
