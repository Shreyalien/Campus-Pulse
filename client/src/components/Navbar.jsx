import React, { useState } from 'react';
import { Bell, Search, Shield, User, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  currentTab,
  userRole,
  notifications = [],
  unreadCount = 0,
  onOpenNotifications,
  searchTerm,
  setSearchTerm
}) {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="date-breadcrumb">
          <span className="live-dot" />
          <span>REALTIME CAMPUS TELEMETRY · DIU ASHULIA PERMANENT CAMPUS</span>
        </div>
        <h1 className="tab-title">{currentTab}</h1>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search objections, tickets, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>

        <button className="notif-btn" onClick={onOpenNotifications} title="Notifications">
          <Bell size={16} />
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        <div className={`role-pill ${userRole === 'admin' ? 'role-admin' : 'role-student'}`}>
          {userRole === 'admin' ? (
            <>
              <Shield size={12} />
              <span>ADMIN OPS MODE</span>
            </>
          ) : (
            <>
              <User size={12} />
              <span>STUDENT DESK</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
