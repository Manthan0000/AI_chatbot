import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import './ChatWindow.css';

const ChatWindow = ({ messages, isTyping, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <main className="chat-window">
      <header className="chat-header glass">
        <div className="header-info">
          <h2>AI Assistant</h2>
          <span className="status">Online</span>
        </div>
      </header>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-logo glass">
              <span className="sparkle">✨</span>
            </div>
            <h2>How can I help you today?</h2>
            <p>I can write code, answer questions, or help you brainstorm.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            
            {isTyping && (
              <div className="typing-indicator-wrapper message-ai">
                <div className="message-container">
                  <div className="avatar typing-avatar">
                   <div className="dot"></div>
                   <div className="dot"></div>
                   <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-area">
        <ChatInput onSendMessage={onSendMessage} isTyping={isTyping} />
        <p className="disclaimer">AI responses may be inaccurate. Please verify important information.</p>
      </div>
    </main>
  );
};

export default ChatWindow;
