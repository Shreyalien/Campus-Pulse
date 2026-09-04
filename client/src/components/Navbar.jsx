import React from 'react';
import { Bell, Search, Shield, User, Sparkles, GraduationCap } from 'lucide-react';

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
  const isStaff = currentUser?.role === 'staff';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="date-breadcrumb">
          <span className="live-dot" />
          <span>REALTIME CAMPUS TELEMETRY · DIU ASHULIA PERMANENT CAMPUS</span>
        </div>
        <h1 className="tab-title">
          {currentTab === 'MyCases' ? 'My Filed Cases & Appeals' : currentTab}
        </h1>
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

        {currentUser ? (
          <div
            className={`role-pill ${isAdmin ? 'role-admin' : isStaff ? 'role-staff' : 'role-student'} cursor-pointer`}
            onClick={onOpenAuthModal}
            title="Click to switch between Student and Admin accounts"
          >
            {isAdmin ? (
              <>
                <Shield size={12} />
                <span>ADMIN OPS MODE ({currentUser.name.split(' ')[0]})</span>
              </>
            ) : isStaff ? (
              <>
                <GraduationCap size={12} />
                <span>FACULTY BOARD</span>
              </>
            ) : (
              <>
                <User size={12} />
                <span>STUDENT DESK ({currentUser.student_id || currentUser.name.split(' ')[0]})</span>
              </>
            )}
            <Sparkles size={11} className="pill-sparkle" />
          </div>
        ) : (
          <button className="btn-signin-nav" onClick={onOpenAuthModal}>
            <Sparkles size={13} className="text-lime" />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
}
