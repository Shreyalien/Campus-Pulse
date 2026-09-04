import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  MessageSquare,
  BarChart2,
  FileText,
  Settings,
  Activity,
  PlusCircle,
  AlertTriangle,
  UserCheck,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  objectionCount = 0,
  openObjectionModal,
  openReportModal
}) {
  const navItems = [
    { id: 'Overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Live Map', label: 'Live Map', icon: MapPin },
    { id: 'Objections', label: 'Tickets', icon: MessageSquare, badge: objectionCount > 0 ? objectionCount : undefined },
    { id: 'Admin', label: 'Analytics', icon: BarChart2 },
    { id: 'Reports', label: 'Reports', icon: FileText },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    if (id === 'Settings') {
      onOpenAuthModal();
    } else {
      setTab(id);
    }
  };

  return (
    <aside className="sidebar-mockup-style">
      {/* Brand Header with ECG icon */}
      <div className="sidebar-brand-box">
        <div className="brand-pulse-icon-wrap">
          <Activity size={24} className="ecg-pulse-logo" />
        </div>
        <div className="brand-title-stacked">
          <span>Campus</span>
          <span>Pulse</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.id === currentTab) || (item.id === 'Overview' && currentTab === 'Dashboard');
          return (
            <button
              key={item.id}
              className={`mockup-nav-item ${isActive ? 'active-cyan-pill' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={17} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
              {item.badge !== undefined && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Action shortcuts */}
      <div className="sidebar-actions-wrap">
        <button className="btn-raise-objection-mockup" onClick={openObjectionModal}>
          <AlertTriangle size={14} />
          <span>Raise Objection</span>
        </button>
        <button className="btn-quick-report-mockup" onClick={openReportModal}>
          <PlusCircle size={14} />
          <span>Quick Report</span>
        </button>
      </div>

      {/* User Session Profile & Switcher */}
      <div className="sidebar-user-footer">
        {currentUser ? (
          <div className="sidebar-user-card">
            <div className="avatar-chip">
              {currentUser.avatar || currentUser.name?.substring(0, 2).toUpperCase() || 'ST'}
            </div>
            <div className="user-details-stacked">
              <span className="user-name-line">{currentUser.name}</span>
              <span className="user-role-line">
                {currentUser.role === 'admin' ? 'Chief Ops' : currentUser.student_id || 'Student'}
              </span>
            </div>
            <button
              className="user-logout-btn"
              title="Sign Out"
              onClick={onLogout}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button className="btn-signin-sidebar" onClick={onOpenAuthModal}>
            <UserCheck size={14} />
            <span>Sign In / Demo</span>
          </button>
        )}

        <div className="sidebar-footer-credit">
          Developed by <strong>Shreya Golder</strong>
        </div>
      </div>
    </aside>
  );
}
