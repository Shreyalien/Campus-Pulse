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
  AlertCircle,
  HelpCircle,
  ExternalLink
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
            {isPetition ? 'CAMPUS PETITION (পিটিশন)' : isObjection ? 'STUDENT OBJECTION (আপত্তি)' : 'CAMPUS REPORT (রিপোর্ট)'}
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
            <span><strong>{issue.upvotes}</strong> জন শিক্ষার্থী স্বাক্ষর করেছেন</span>
            <span>সিন্ডিকেট শুনানির লক্ষ্যমাত্রা: ১০০</span>
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
              <span>১০০টি স্বাক্ষর সম্পন্ন · সিন্ডিকেট শুনানির থ্রেশহোল্ড পূর্ণ</span>
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
          <span>{issue.is_anonymous ? 'গোপন শিক্ষার্থী (Anonymous)' : (issue.reporter_name || 'Student')}</span>
        </div>
        <div className="meta-item meta-sla" title="SLA (Service Level Agreement): বিশ্ববিদ্যালয় কর্তৃপক্ষের সর্বোচ্চ সমাধানের নির্ধারিত সময়সীমা">
          <Clock size={12} className="meta-icon text-amber" />
          <span>সমাধান সময়সীমা (SLA): <strong>{issue.sla_hours} ঘণ্টা</strong></span>
        </div>
      </div>

      <div className="card-footer-row">
        <div className="footer-timestamp">
          দাখিল: {issue.created_at?.slice(0, 16) || 'Today'}
        </div>

        <button
          className={`upvote-btn ${issue.has_voted ? 'voted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onVote(issue.id);
          }}
          title="এই আপত্তিতে আপনার সমর্থন দিন"
        >
          <ThumbsUp size={13} className="vote-icon" />
          <span>{issue.has_voted ? 'সমর্থন দিয়েছেন' : 'সমর্থন দিন (Endorse)'} ({issue.upvotes || 0})</span>
        </button>
      </div>
    </motion.div>
  );
}
