import React from 'react';
import { Bot, User } from 'lucide-react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai';
  
  return (
    <div className={`message-wrapper ${isAI ? 'message-ai' : 'message-user'}`}>
      <div className="message-container">
        <div className="avatar">
          {isAI ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className="message-content glass">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
