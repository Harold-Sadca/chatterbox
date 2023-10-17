import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TypeMessage } from '@/utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { v4 as uuid } from 'uuid';
import Avatar from '@mui/material/Avatar';
import { db } from '@/firebase';
import { collection, Timestamp, addDoc } from 'firebase/firestore';
import { fetchAllMessages } from '@/utils/utils';
import Loading from './Loading';
import '../(css)/chatbox.css';

export default function ChatContainer() {
  const currentUser = useSelector(
    (state: RootState) => state.currentUserReducer.value
  );
  const recipient = useSelector(
    (state: RootState) => state.recipientSliceReducer.value
  );

  const scrollToBottom = () => {
    console.log('called');
    document
      .getElementById('messages-container')
      ?.scrollTo(0, document.body.scrollHeight);
  };

  const [displayMessage, setDisplayMessage] = useState<TypeMessage[]>([]);
  const [messages, setMessages] = useState<TypeMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const hideBackButton = screenWidth > 1200;

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
    setDisplayMessage([...displayMessage, message]);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  useEffect(() => {
    if (!currentUser.uid) {
      return;
    }

    const unsubscribe = fetchAllMessages(currentUser.uid, setMessages);
    setLoading(false);
  }, [currentUser.uid]);

  useEffect(() => {
    setDisplayMessage(
      messages.filter(
        (mes: TypeMessage) =>
          mes.senderUid === recipient.uid || mes.recipientUid === recipient.uid
      )
    );
    scrollToBottom();
  }, [recipient.uid, messages]);

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

  console.log(hideBackButton);

  return (
    <div className='chat-container'>
      {loading ? (
        <Loading />
      ) : (
        <>
          {recipient.uid ? (
            <div className='chats'>
              <section className='chat-recipient'>
                <Avatar>
                  {recipient.email.split('')[0].toLocaleUpperCase()}
                </Avatar>
                <p className='chat-recipient-name'>{recipient.email}</p>
                {hideBackButton ? null : (
                  <Button
                    style={{
                      backgroundColor: 'var(--primary-colour)',
                      color: 'var(--secondary-colour)',
                    }}
                    className='back-button'
                    variant='contained'
                    onClick={() => {
                      console.log('this');
                    }}
                    endIcon={<ArrowBackIcon />}
                  ></Button>
                )}
              </section>
              <div id='messages-container' className='messages-container'>
                {displayMessage.map((message) =>
                  message.senderUid == currentUser.uid ? (
                    <section key={message.id} className='sent'>
                      <section className='msgs'>
                        <p className='content'>{message.text}</p>
                      </section>
                    </section>
                  ) : (
                    <section key={message.id} className='received'>
                      <section className='msgs'>
                        <p className='content'>{message.text}</p>
                      </section>
                    </section>
                  )
                )}
              </div>
              <div className='input-container'>
                <TextField
                  className='text-input'
                  style={{
                    backgroundColor: 'var(--background-colour)',
                    color: 'var(--text-colour)',
                  }}
                  fullWidth
                  label='Type your message...'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  id='fullWidth'
                />

                <Button
                  style={{
                    backgroundColor: 'var(--primary-colour)',
                    color: 'var(--secondary-colour)',
                  }}
                  className='send-button'
                  variant='contained'
                  onClick={handleSendMessage}
                  endIcon={<SendIcon />}
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
