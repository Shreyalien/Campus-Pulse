import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Send,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function Admin({
  issues = [],
  summary = {},
  departments = [],
  onSelectIssue,
  onUpdateStatus
}) {
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [actionStatus, setActionStatus] = useState('Under Investigation');
  const [assignee, setAssignee] = useState('');
  const [verdict, setVerdict] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Issues needing immediate triage or action
  const pendingTriage = issues.filter(i => i.status === 'Reported' || i.status === 'Triaged' || i.status === 'Appealed');
  const criticalTickets = issues.filter(i => (i.priority === 'Critical' || i.priority === 'High') && i.status !== 'Resolved');

  const handleQuickResolve = async (e) => {
    e.preventDefault();
    if (!selectedIssueId) return;
    setSubmitting(true);
    try {
      await onUpdateStatus(selectedIssueId, {
        status: actionStatus,
        assignee_name: assignee,
        official_verdict: verdict,
        update_note: note || `Admin updated status to ${actionStatus}`
      });
      setSelectedIssueId(null);
      setVerdict('');
      setNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container admin-layout">
      {/* Admin Operations Top Hero Banner */}
      <div className="admin-hero-banner">
        <div className="admin-hero-content">
          <div className="admin-badge">
            <ShieldAlert size={14} className="text-lime" />
            <span>OPERATIONS COMMAND & SLA ENFORCEMENT</span>
          </div>
          <h2>Campus Operations & Grievance Triage Queue</h2>
          <p>
            Monitor high-risk student objections, coordinate university departmental response,
            and publish binding administrative verdicts with automated audit trails.
          </p>
        </div>

        <div className="admin-stats-summary">
          <div className="admin-stat-unit">
            <span className="text-amber">{pendingTriage.length}</span>
            <small>Pending Triage</small>
          </div>
          <div className="admin-stat-unit">
            <span className="text-red">{criticalTickets.length}</span>
            <small>Critical SLA Risks</small>
          </div>
          <div className="admin-stat-unit">
            <span className="text-lime">{summary.resolution_rate || '92%'}</span>
            <small>Resolution Rate</small>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="admin-grid-layout">
        {/* Left: Triage Queue */}
        <section className="dashboard-panel queue-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">ACTIVE ESCALATIONS</span>
              <h3 className="panel-title">Cases Requiring Administrative Action</h3>
            </div>
            <span className="queue-count-badge">{pendingTriage.length} Cases</span>
          </div>

          <div className="admin-queue-list">
            {pendingTriage.length === 0 ? (
              <div className="empty-queue-box">
                <CheckCircle size={32} className="text-lime" />
                <h4>All Grievances & Reports Triaged</h4>
                <p>No unhandled tickets currently in queue.</p>
              </div>
            ) : (
              pendingTriage.map((item) => (
                <div
                  key={item.id}
                  className={`admin-queue-card ${selectedIssueId === item.id ? 'active' : ''} ${item.priority === 'Critical' ? 'border-critical' : ''}`}
                  onClick={() => {
                    setSelectedIssueId(item.id);
                    setActionStatus(item.status === 'Reported' ? 'Under Investigation' : 'Hearing Scheduled');
                    setAssignee(item.assignee_name || '');
                    setVerdict(item.official_verdict || '');
                  }}
                >
                  <div className="queue-card-top">
                    <span className="font-mono text-lime">#{item.id}</span>
                    <span className={`type-tag ${item.type === 'student_objection' ? 'tag-objection' : item.type === 'petition' ? 'tag-petition' : 'tag-issue'}`}>
                      {item.type?.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className={`priority-tag-${item.priority?.toLowerCase()}`}>
                      {item.priority}
                    </span>
                    <span className="queue-status-text">{item.status}</span>
                  </div>

                  <h4 className="queue-card-title">{item.title}</h4>
                  <p className="queue-card-desc">{item.description}</p>

                  <div className="queue-card-footer">
                    <span>{item.department}</span>
                    <span>·</span>
                    <span>SLA: {item.sla_hours}h</span>
                    <span>·</span>
                    <span>{item.upvotes || 0} Endorsements</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right: Quick Action & Dispatch Panel */}
        <section className="dashboard-panel action-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">VERDICT & DISPATCH CONSOLE</span>
              <h3 className="panel-title">
                {selectedIssueId ? `Manage Case #${selectedIssueId}` : 'Select a Case from Queue'}
              </h3>
            </div>
          </div>

          {selectedIssueId ? (
            <form onSubmit={handleQuickResolve} className="admin-dispatch-form">
              <div className="form-group">
                <label>Update Lifecycle Status *</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                >
                  <option value="Triaged">Triaged (Awaiting Committee)</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Hearing Scheduled">Hearing Scheduled</option>
                  <option value="Resolved">Resolved & Concluded</option>
                  <option value="Appealed">Appealed to Syndicate</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Officer / Faculty Lead</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Shamsul (Proctor Office)"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Official Resolution Statement / Syndicate Verdict</label>
                <textarea
                  rows={3}
                  placeholder="Write the official administrative decision visible to students..."
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Investigation Log Note (Appends to Timeline)</label>
                <input
                  type="text"
                  placeholder="e.g. Committee reviewed lab CCTV and server logs."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedIssueId(null)}
                >
                  Deselect
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  <Send size={14} />
                  <span>{submitting ? 'Applying...' : 'Dispatch Verdict & Notify Students'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="dispatch-placeholder">
              <Clock size={36} className="text-dim" />
              <p>Click on any pending objection or report in the left queue to open the administrative dispatch controls.</p>
            </div>
          )}

          {/* Department Breakdown list */}
          <div className="department-breakdown-box">
            <h4>DEPARTMENT PERFORMANCE & WORKLOAD</h4>
            <div className="dept-list">
              {departments.map((d, i) => (
                <div key={i} className="dept-item">
                  <div className="dept-name">
                    <Building size={13} className="text-lime" />
                    <span>{d.department}</span>
                  </div>
                  <div className="dept-meta">
                    <span className="badge-obj">{d.objections || 0} Objections</span>
                    <span className="badge-tot">{d.total || 0} Total Tickets</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
