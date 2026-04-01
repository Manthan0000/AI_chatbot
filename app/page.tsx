"use client";

import React, { useState, useEffect } from 'react';
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Bot, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Home() {
  // State for all saved sessions
  const [sessions, setSessions] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('ai-chat-sessions');
    if (saved) return JSON.parse(saved);
    return [{ id: generateId(), title: 'New Chat', messages: [], updatedAt: Date.now() }];
  });

  // State for currently active session
  const [activeSessionId, setActiveSessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem('ai-chat-active-id');
    return saved || (sessions[0]?.id || '');
  });

  const [isTyping, setIsTyping] = useState(false);

  // Persist sessions whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions));
      localStorage.setItem('ai-chat-active-id', activeSessionId);
    }
  }, [sessions, activeSessionId]);

  // Derived state for the active session's messages
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeMessages = activeSession ? activeSession.messages : [];

  const handleNewChat = () => {
    const newSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectChat = (id) => {
    setActiveSessionId(id);
  };

  const updateActiveSession = (newMessages, autoTitle = null) => {
    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: newMessages,
          updatedAt: Date.now(),
          title: autoTitle || session.title
        };
      }
      return session;
    }).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const handleSendMessage = async (content) => {
    const userMessage = { role: 'user', content };
    const updatedMessages = [...activeMessages, userMessage];
    
    let newTitle = null;
    if (activeMessages.length === 0) {
      newTitle = content.length > 25 ? content.substring(0, 25) + '...' : content;
    }
    
    updateActiveSession(updatedMessages, newTitle);
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: activeMessages })
      });

      const data = await response.json();
      const aiMessage = { role: 'ai', content: data.reply || 'Sorry, I couldn\'t generate a response.' };
      
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMessage], updatedAt: Date.now() } : s));
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMsg = { role: 'ai', content: 'Connection error. Make sure the backend is running.' };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Show when="signed-out">
        <div className="signed-out-container" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          minHeight: '100vh', padding: '2rem', textAlign: 'center',
          background: 'radial-gradient(circle at top right, #1a1b2e 0%, var(--bg-dark) 100%)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px',
            background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: '0.15', pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px',
            background: 'var(--accent-secondary)', filter: 'blur(120px)', opacity: '0.1', pointerEvents: 'none'
          }}></div>

          <div className="glass animate-float" style={{
            padding: '3.5rem 2.5rem',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '540px',
            width: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
            zIndex: 1
          }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '24px',
              background: 'var(--gradient-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 15px 35px var(--accent-glow)',
              marginBottom: '0.5rem'
            }}>
              <Bot size={48} color="white" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h1 style={{ 
                fontSize: '3.5rem', fontWeight: '800', color: 'white', margin: 0, 
                letterSpacing: '-0.03em', lineHeight: '1.1',
                background: 'linear-gradient(to bottom, #fff 40%, #a1a1aa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                AI Chatbot
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', fontSize: '1.25rem', margin: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                fontWeight: '500'
              }}>
                <Sparkles size={22} style={{ color: 'var(--accent-secondary)' }} />
                Experience the next generation.
              </p>
            </div>

            <div style={{ 
              display: 'flex', gap: '1.25rem', width: '100%', marginTop: '1rem',
              flexWrap: 'wrap', justifyContent: 'center'
            }}>
              <SignInButton mode="modal">
                <button className="btn-secondary" style={{ flex: '1', minWidth: '160px', fontSize: '1.05rem', padding: '0.85rem' }}>
                  Log In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="btn-primary" style={{ flex: '1', minWidth: '160px', fontSize: '1.05rem', padding: '0.85rem' }}>
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
          
          <div style={{ marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem', zIndex: 1 }}>
            Trusted by developers worldwide. Built with precision.
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="app-layout">
          <Sidebar 
            sessions={sessions} 
            activeSessionId={activeSessionId} 
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
          <div className="main-content">
            <ChatWindow 
              messages={activeMessages} 
              isTyping={isTyping} 
              onSendMessage={handleSendMessage} 
            />
          </div>
        </div>
      </Show>
    </>
  );
}
