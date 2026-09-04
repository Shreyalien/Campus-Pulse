import React from 'react';
import {
  LayoutDashboard,
  AlertOctagon,
  MapPin,
  FileText,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  Radio,
  UserCheck,
  LogOut,
  Sparkles,
  Bookmark
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
  objectionCount = 0,
  myObjectionCount = 0,
  openObjectionModal,
  openReportModal
}) {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'staff';

  const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Objections', label: 'Student Objections', icon: AlertOctagon, badge: objectionCount },
    { id: 'MyCases', label: 'My Filed Cases', icon: Bookmark, badge: myObjectionCount > 0 ? myObjectionCount : undefined },
    { id: 'Live Map', label: 'Live Campus Map', icon: MapPin },
    { id: 'Reports', label: 'Issue Directory', icon: FileText },
    { id: 'Admin', label: 'Admin Triage & SLA', icon: ShieldCheck, badge: 'Ops' }
  ];

  return (
    <aside className="sidebar">
      <div className="brand-wrap">
        <div className="brand">
          <span className="pulse-dot" />
          CAMPUS<span className="brand-accent">PULSE</span>
        </div>
        <div className="brand-tag">DIU CAMPUS INTELLIGENCE · OPS V2</div>
      </div>

      <div className="action-buttons">
        <button className="btn-objection-primary" onClick={openObjectionModal}>
          <AlertTriangle size={15} />
          <span>Raise Objection</span>
        </button>
        <button className="btn-quick-report" onClick={openReportModal}>
          <PlusCircle size={14} />
          <span>Quick Issue Report</span>
        </button>
      </div>

      <nav className="nav-menu">
        <div className="nav-group-title">COMMAND NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon size={16} className="nav-icon" />
              <span className="nav-text">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`nav-badge ${item.badge === 'Ops' ? 'badge-ops' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="system-card">
        <div className="system-header">
          <Radio size={12} className="pulse-signal text-lime" />
          <span>LIVE TELEMETRY ACTIVE</span>
        </div>
        <p className="system-desc">DIU Ashulia gateway socket streaming in real-time</p>
        <div className="system-status">
          <span className="status-ping" />
          <span>NOC Core Active · 99.4% SLA</span>
        </div>
      </div>

      {/* User Profile & Auth Section */}
      <div className="user-profile-card">
        {currentUser ? (
          <>
            <div className="user-card-main">
              <div className="avatar-circle">
                {currentUser.avatar || currentUser.name?.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="user-info">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role-label">
                  {currentUser.role === 'admin'
                    ? 'Chief Operations Lead'
                    : `${currentUser.department || 'CSE'} (${currentUser.student_id || 'Student'})`}
                </div>
              </div>
            </div>

            <div className="user-card-actions">
              <button
                className="role-switch-btn"
                title="Switch between Student and Admin demo accounts"
                onClick={onOpenAuthModal}
              >
                <Sparkles size={11} />
                <span>Switch / Login</span>
              </button>
              <button
                className="logout-icon-btn"
                title="Sign Out"
                onClick={onLogout}
              >
                <LogOut size={13} />
              </button>
            </div>
          </>
        ) : (
          <button className="btn-primary full" onClick={onOpenAuthModal}>
            <UserCheck size={14} />
            <span>Sign In to Portal</span>
          </button>
        )}
      </div>
    </aside>
  );
}
