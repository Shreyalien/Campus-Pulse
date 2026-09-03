import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  MapPin,
  Building,
  User,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
  Send,
  CheckCircle2,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

export default function IssueDrawer({
  issue,
  onClose,
  onVote,
  onAppeal,
  onUpdateStatus,
  userRole
}) {
  const [appealReason, setAppealReason] = useState('');
  const [showAppealBox, setShowAppealBox] = useState(false);
  const [submittingAppeal, setSubmittingAppeal] = useState(false);

  // Admin fast update states
  const [newStatus, setNewStatus] = useState(issue?.status || 'Reported');
  const [adminNote, setAdminNote] = useState('');
  const [assignee, setAssignee] = useState(issue?.assignee_name || '');
  const [verdict, setVerdict] = useState(issue?.official_verdict || '');
  const [updating, setUpdating] = useState(false);

  if (!issue) return null;

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    setSubmittingAppeal(true);
    try {
      await onAppeal(issue.id, appealReason);
      setShowAppealBox(false);
      setAppealReason('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAppeal(false);
    }
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await onUpdateStatus(issue.id, {
        status: newStatus,
        assignee_name: assignee,
        official_verdict: verdict,
        update_note: adminNote
      });
      setAdminNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const isObjection = issue.type === 'student_objection' || issue.type === 'petition';

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <motion.div
        className="drawer-panel"
        initial={{ x: 500, opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 500, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-id-tag">TICKET #{issue.id}</span>
            <span className={`drawer-type-tag ${isObjection ? 'tag-objection' : 'tag-issue'}`}>
              {issue.type?.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <button className="drawer-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="drawer-body">
          <h2 className="drawer-title">{issue.title}</h2>
          <div className="drawer-location-row">
            <MapPin size={13} className="text-lime" />
            <span>{issue.location}</span>
          </div>

          <div className="drawer-stats-grid">
            <div className="drawer-stat-card">
              <small>CURRENT STATUS</small>
              <strong>{issue.status}</strong>
            </div>
            <div className="drawer-stat-card">
              <small>PRIORITY</small>
              <strong className={`priority-text-${issue.priority?.toLowerCase()}`}>
                {issue.priority}
              </strong>
            </div>
            <div className="drawer-stat-card">
              <small>CATEGORY</small>
              <strong>{issue.category}</strong>
            </div>
            <div className="drawer-stat-card">
              <small>SLA TARGET</small>
              <strong>{issue.sla_hours} Hours</strong>
            </div>
          </div>

          <div className="drawer-meta-section">
            <div className="meta-line">
              <Building size={14} />
              <div>
                <small>Assigned Department</small>
                <span>{issue.department || 'General Operations'}</span>
              </div>
            </div>
            <div className="meta-line">
              <ShieldCheck size={14} />
              <div>
                <small>Investigating Officer</small>
                <span>{issue.assignee_name || 'Pending assignment'}</span>
              </div>
            </div>
            <div className="meta-line">
              <User size={14} />
              <div>
                <small>Filed By</small>
                <span>{issue.is_anonymous ? 'Anonymous Student (Protected)' : (issue.reporter_name || 'Student')}</span>
              </div>
            </div>
          </div>

          <div className="drawer-section">
            <h4>CASE DESCRIPTION & GROUNDS</h4>
            <p className="drawer-description">{issue.description}</p>
          </div>

          {/* Endorsement bar */}
          <div className="drawer-endorse-bar">
            <div>
              <strong>{issue.upvotes || 0} Student Endorsements</strong>
              <small>Backing this case for administrative resolution</small>
            </div>
            <button
              className={`upvote-btn ${issue.has_voted ? 'voted' : ''}`}
              onClick={() => onVote(issue.id)}
            >
              <ThumbsUp size={14} />
              <span>{issue.has_voted ? 'Supported' : 'Support Case'}</span>
            </button>
          </div>

          {/* Official Verdict or Resolution if available */}
          {issue.official_verdict && (
            <div className="official-verdict-box">
              <div className="verdict-header">
                <CheckCircle2 size={16} className="text-lime" />
                <strong>OFFICIAL ADMINISTRATIVE VERDICT / ACTION</strong>
              </div>
              <p>{issue.official_verdict}</p>
              {issue.resolved_at && (
                <small className="verdict-date">Concluded on: {issue.resolved_at}</small>
              )}
            </div>
          )}

          {/* Student Appeal Button */}
          {userRole === 'student' && issue.status === 'Resolved' && (
            <div className="appeal-action-box">
              {!showAppealBox ? (
                <button
                  className="btn-appeal"
                  onClick={() => setShowAppealBox(true)}
                >
                  <RotateCcw size={14} />
                  <span>Dissatisfied with verdict? File Formal Appeal</span>
                </button>
              ) : (
                <form onSubmit={handleAppealSubmit} className="appeal-form">
                  <h5>FILE EXECUTIVE APPEAL</h5>
                  <textarea
                    rows={3}
                    placeholder="Specify grounds of dispute with the official verdict..."
                    value={appealReason}
                    onChange={(e) => setAppealReason(e.target.value)}
                    required
                  />
                  <div className="appeal-form-buttons">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowAppealBox(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={submittingAppeal}>
                      {submittingAppeal ? 'Submitting...' : 'Submit to Syndicate'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Admin Fast Actions if in Admin Mode */}
          {userRole === 'admin' && (
            <div className="admin-action-section">
              <div className="admin-action-header">
                <ShieldCheck size={16} className="text-lime" />
                <h4>OPERATIONS TRIAGE & VERDICT DISPATCH</h4>
              </div>
              <form onSubmit={handleAdminUpdate} className="admin-fast-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Transition Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Reported">Reported</option>
                      <option value="Triaged">Triaged</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Hearing Scheduled">Hearing Scheduled</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Appealed">Appealed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Assign Officer / Team</label>
                    <input
                      type="text"
                      placeholder="e.g., Prof. Asaduzzaman / IT Lead"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Verdict / Concluding Note</label>
                  <textarea
                    rows={2}
                    placeholder="Document administrative resolution or action taken..."
                    value={verdict}
                    onChange={(e) => setVerdict(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Investigation Log Note (Timeline)</label>
                  <input
                    type="text"
                    placeholder="e.g., Exam committee convened; verified system logs."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary full" disabled={updating}>
                  <RefreshCw size={14} className={updating ? 'spin' : ''} />
                  <span>{updating ? 'Publishing Updates...' : 'Apply Status & Publish to Pulse'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Investigation Timeline */}
          <div className="drawer-section">
            <h4>INVESTIGATION & ACTION TIMELINE</h4>
            <div className="timeline-trail">
              {issue.updates && issue.updates.length > 0 ? (
                issue.updates.map((update, idx) => (
                  <div key={update.id || idx} className="timeline-node">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-author">{update.author_name}</span>
                        <span className="timeline-role">({update.author_role})</span>
                        <span className="timeline-status-badge">{update.status}</span>
                        <span className="timeline-time">{update.created_at?.slice(0, 16)}</span>
                      </div>
                      <p className="timeline-note">{update.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="timeline-node">
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-meta">
                      <span className="timeline-author">System</span>
                      <span className="timeline-status-badge">Reported</span>
                      <span className="timeline-time">{issue.created_at?.slice(0, 16)}</span>
                    </div>
                    <p className="timeline-note">Issue registered and added to campus operations queue.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
