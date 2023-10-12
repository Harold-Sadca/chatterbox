import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { TypeMessage } from '@/utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { v4 as uuid } from 'uuid';
import { db } from '@/firebase';
import {
  collection,
  Timestamp,
  addDoc,
  where,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { fetchAllMessages, getUsers } from '@/utils/utils';
import Loading from './Loading';
import '../(css)/chatbox.css';

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
  const [displayMessage, setDisplayMessage] = useState<TypeMessage[]>([]);

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
    const messagesCollectionRef = collection(db, 'messages');
    const q = query(
      messagesCollectionRef,
      where('recipientUid', '==', currentUser.uid),
      orderBy('date', 'desc') // Order by date
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot
        .docChanges()
        .map((change) => change.doc.data()) as TypeMessage[];

      setMessages((prevMessages: TypeMessage[]) => [
        ...prevMessages,
        ...newMessages,
      ]);
    });

    return () => {
      // Unsubscribe from the real-time listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser.uid]);

  useEffect(() => {
    setDisplayMessage(
      messages.filter(
        (mes) =>
          mes.senderUid == recipient.uid || mes.senderUid == recipient.uid
      )
    );
  }, [recipient.uid]);

  return (
    <div className='chat-container'>
      {loading ? (
        <Loading />
      ) : (
        <>
          {recipient.uid ? (
            <div className='chats'>
              {' '}
              <div className='messages-container'>
                {displayMessage.map((message, index) =>
                  message.senderUid == currentUser.uid ? (
                    <div className='sent' key={index}>
                      {message.text}
                    </div>
                  ) : (
                    <div className='received' key={index}>
                      {message.text}
                    </div>
                  )
                )}
              </div>
              <div className='input-container'>
                <TextField
                  fullWidth
                  label='Type your message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  id='fullWidth'
                  style={{
                    backgroundColor: 'var(--background-colour)',
                    color: 'var(--text-colour)',
                    margin: '0 2rem 0 0',
                  }}
                />

                <Button
                  variant='contained'
                  onClick={handleSendMessage}
                  endIcon={<SendIcon />}
                  style={{
                    backgroundColor: 'var(--secondary-colour)',
                    color: 'var(--text-colour)',
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
