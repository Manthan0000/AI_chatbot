import { UserButton, useClerk, useUser } from '@clerk/nextjs';
import { MessageSquarePlus, MessageSquare, Sparkles, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ sessions, activeSessionId, onNewChat, onSelectChat }) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'My Account';

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="sidebar-branding">
          <div className="brand-icon">
            <span>A</span>
          </div>
          <span className="brand-name">AI Chatbot</span>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <MessageSquarePlus size={20} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="sidebar-content">
        <div className="history-group">
          <h3 className="history-title">Recent Chats</h3>
          <ul className="history-list">
            {sessions.map(session => (
              <li 
                key={session.id} 
                className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onSelectChat(session.id)}
              >
                <MessageSquare size={16} className="history-icon" />
                <span className="history-text">{session.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <div 
          className="sidebar-user-profile" 
          title={userEmail}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', 
            padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-input)', 
            marginBottom: '0.5rem', border: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
        >
          <UserButton />
          <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', flex: 1 }}>My Account</span>
        </div>
        <button className="sidebar-action-btn" onClick={() => signOut()}>
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
