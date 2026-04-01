import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="input-container glass">
      <form onSubmit={handleSubmit} className="input-form">
        <button type="button" className="icon-btn tool-btn" aria-label="Attach file">
          <Paperclip size={20} />
        </button>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="chat-textarea"
          rows="1"
        />
        
        {input.trim() ? (
          <button 
            type="submit" 
            className="icon-btn send-btn active" 
            disabled={isTyping}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        ) : (
          <button type="button" className="icon-btn tool-btn" aria-label="Use microphone">
            <Mic size={20} />
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
