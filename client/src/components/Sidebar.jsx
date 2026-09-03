import React from 'react';
import {
  LayoutDashboard,
  AlertOctagon,
  MapPin,
  FileText,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  Radio
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setTab,
  userRole,
  setUserRole,
  objectionCount = 0,
  openObjectionModal,
  openReportModal
}) {
  const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Objections', label: 'Student Objections', icon: AlertOctagon, badge: objectionCount },
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
        <div className="brand-tag">DIU CAMPUS INTELLIGENCE</div>
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
          <span>LIVE CAMPUS SIGNAL</span>
        </div>
        <p className="system-desc">All DIU gateway telemetry streaming via Socket.IO</p>
        <div className="system-status">
          <span className="status-ping" />
          <span>NOC Core Active · 99.4% SLA</span>
        </div>
      </div>

      <div className="user-profile-card">
        <div className="avatar-circle">
          {userRole === 'admin' ? 'OP' : 'SG'}
        </div>
        <div className="user-info">
          <div className="user-name">
            {userRole === 'admin' ? 'Engr. M. Rafiq' : 'Shreya Golder'}
          </div>
          <div className="user-role-label">
            {userRole === 'admin' ? 'Chief Operations Lead' : 'Dept. of CSE (251-15-467)'}
          </div>
        </div>
        <button
          className="role-switch-btn"
          title="Switch view between Student and Admin"
          onClick={() => setUserRole(userRole === 'student' ? 'admin' : 'student')}
        >
          {userRole === 'student' ? 'Switch to Admin' : 'Switch to Student'}
        </button>
      </div>
    </aside>
  );
}
