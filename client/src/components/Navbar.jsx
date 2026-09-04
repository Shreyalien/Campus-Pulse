import React from 'react';
import { Bell, Search, Shield, User, Sparkles, AlertCircle } from 'lucide-react';

export default function Navbar({
  currentTab,
  currentUser,
  onOpenAuthModal,
  unreadCount = 0,
  onOpenNotifications,
  searchTerm,
  setSearchTerm
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="mockup-top-header">
      {/* Left title matching the image */}
      <div className="header-branding-group">
        <div className="header-accent-bar" />
        <div className="header-text-block">
          <h1 className="header-main-title">Campus Pulse</h1>
          <p className="header-main-subtitle">Live University Operations & Student Objection Redressal</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="header-controls-group">
        <div className="search-pill-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search tickets, buildings, complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>

        <button
          className="header-icon-pill-btn"
          onClick={onOpenNotifications}
          title="Live Notifications"
        >
          <Bell size={15} />
          {unreadCount > 0 && <span className="pill-badge-red">{unreadCount}</span>}
        </button>

        {currentUser ? (
          <div
            className="user-profile-pill"
            onClick={onOpenAuthModal}
            title="Click to switch account"
          >
            <span className="profile-dot" />
            <span className="profile-name">
              {isAdmin ? 'ADMIN OPS' : currentUser.name.split(' ')[0]}
            </span>
            <Sparkles size={12} className="text-lime" />
          </div>
        ) : (
          <button className="btn-signin-header" onClick={onOpenAuthModal}>
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
