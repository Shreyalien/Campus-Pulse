import React from 'react';
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  MapPin,
  Clock,
  ShieldAlert,
  UserCheck,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ObjectionCard({ issue, onSelect, onVote }) {
  const isPetition = issue.type === 'petition';
  const isObjection = issue.type === 'student_objection';

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Resolved': return 'status-resolved';
      case 'Hearing Scheduled': return 'status-hearing';
      case 'Under Investigation': return 'status-investigating';
      case 'Triaged': return 'status-triaged';
      case 'Appealed': return 'status-appealed';
      default: return 'status-reported';
    }
  };

  const petitionTarget = 100;
  const progressPercent = Math.min(100, Math.round(((issue.upvotes || 0) / petitionTarget) * 100));

  return (
    <motion.div
      layout
      className={`objection-card ${getPriorityClass(issue.priority)}`}
      onClick={() => onSelect(issue)}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
    >
      <div className="card-top-row">
        <div className="card-tags">
          <span className={`type-tag ${isPetition ? 'tag-petition' : isObjection ? 'tag-objection' : 'tag-issue'}`}>
            {isPetition ? 'CAMPUS PETITION' : isObjection ? 'STUDENT OBJECTION' : 'CAMPUS REPORT'}
          </span>
          <span className="category-tag">{issue.category}</span>
          <span className={`priority-pill ${getPriorityClass(issue.priority)}`}>
            {issue.priority}
          </span>
        </div>

        <div className={`status-pill ${getStatusClass(issue.status)}`}>
          <span className="status-dot" />
          {issue.status}
        </div>
      </div>

      <h3 className="card-title">{issue.title}</h3>
      <p className="card-desc">{issue.description}</p>

      {isPetition && (
        <div className="petition-progress-box">
          <div className="petition-progress-meta">
            <span><strong>{issue.upvotes}</strong> signatures collected</span>
            <span>Target: 100 (Threshold)</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {issue.upvotes >= 100 && (
            <div className="threshold-reached-badge">
              <CheckCircle2 size={11} />
              <span>Official Admin Escalation Threshold Reached</span>
            </div>
          )}
        </div>
      )}

      <div className="card-meta-row">
        <div className="meta-item">
          <MapPin size={12} className="meta-icon" />
          <span>{issue.location}</span>
        </div>
        <div className="meta-item">
          <Building size={12} className="meta-icon" />
          <span>{issue.department || 'General Ops'}</span>
        </div>
        <div className="meta-item">
          <UserCheck size={12} className="meta-icon" />
          <span>{issue.is_anonymous ? 'Anonymous Student' : (issue.reporter_name || 'Student')}</span>
        </div>
        <div className="meta-item">
          <Clock size={12} className="meta-icon" />
          <span>Target SLA: {issue.sla_hours}h</span>
        </div>
      </div>

      <div className="card-footer-row">
        <div className="footer-timestamp">
          Logged: {issue.created_at?.slice(0, 16) || 'Today'}
        </div>

        <button
          className={`upvote-btn ${issue.has_voted ? 'voted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onVote(issue.id);
          }}
          title="Support / Upvote this objection"
        >
          <ThumbsUp size={13} className="vote-icon" />
          <span>{issue.has_voted ? 'Supported' : 'Endorse'} ({issue.upvotes || 0})</span>
        </button>
      </div>
    </motion.div>
  );
}
