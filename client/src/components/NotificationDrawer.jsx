import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell, CheckCheck, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onSelectIssue
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <motion.div
        className="drawer-panel drawer-narrow"
        initial={{ x: 400, opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <Bell size={18} className="text-lime" />
            <h3 className="notif-heading">NOTIFICATIONS</h3>
          </div>
          <div className="notif-header-actions">
            <button className="btn-text-action" onClick={onMarkRead}>
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button className="drawer-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-card ${n.is_read ? 'read' : 'unread'} notif-${n.type || 'info'}`}
                onClick={() => {
                  if (n.issue_id && onSelectIssue) onSelectIssue(n.issue_id);
                  onClose();
                }}
              >
                <div className="notif-top">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-time">{n.created_at?.slice(11, 16) || 'Just now'}</span>
                </div>
                <p className="notif-message">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
