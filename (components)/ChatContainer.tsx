import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

interface Message {
  text: string;
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage }]);
      setNewMessage('');
    }
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
