import React from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
  RotateCcw,
  ArrowRight,
  Shield,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import ObjectionCard from '../components/ObjectionCard';

export default function MyCases({
  currentUser,
  issues = [],
  onSelectIssue,
  onVote,
  onOpenObjectionModal,
  onOpenAuthModal
}) {
  if (!currentUser) {
    return (
      <div className="page-container">
        <div className="empty-panel auth-prompt-panel">
          <Bookmark size={40} className="text-lime" />
          <h2>Sign In to View Your Filed Cases</h2>
          <p>You need to be logged into your student account to track your formal objections, petitions, and resolution appeals.</p>
          <button className="btn-primary" onClick={onOpenAuthModal}>
            Sign In / Demo Login
          </button>
        </div>
      </div>
    );
  }

  // Filter issues filed by this student
  const studentId = currentUser.student_id;
  const studentName = currentUser.name;
  const myIssues = issues.filter(i =>
    (studentId && i.reporter_id === studentId) ||
    (studentName && i.reporter_name?.toLowerCase().includes(studentName.toLowerCase()))
  );

  const activeCases = myIssues.filter(i => i.status !== 'Resolved');
  const resolvedCases = myIssues.filter(i => i.status === 'Resolved');
  const totalVotesReceived = myIssues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  return (
    <div className="page-container">
      {/* Student Personal Desk Hero */}
      <div className="portal-hero-card">
        <div className="portal-hero-left">
          <div className="hero-tag">
            <Bookmark size={14} className="text-lime" />
            <span>MY STUDENT OBJECTION & PETITIONS DESK</span>
          </div>
          <h2 className="hero-title">{currentUser.name}’s Active Cases</h2>
          <p className="hero-subtitle">
            Track real-time administrative progress, departmental hearing schedules, SLA countdowns,
            and exercise your right to dispute verdicts with the University Syndicate.
          </p>

          <div className="hero-stats">
            <div className="hero-stat-box">
              <strong>{myIssues.length}</strong>
              <small>Total Filed</small>
            </div>
            <div className="hero-stat-box">
              <strong>{activeCases.length}</strong>
              <small>In Active Triage</small>
            </div>
            <div className="hero-stat-box">
              <strong>{resolvedCases.length}</strong>
              <small>Concluded</small>
            </div>
            <div className="hero-stat-box">
              <strong>{totalVotesReceived}</strong>
              <small>Peer Signatures</small>
            </div>
          </div>
        </div>

        <div className="portal-hero-right">
          <button className="btn-hero-lodge" onClick={onOpenObjectionModal}>
            <Plus size={16} />
            <span>Lodge New Objection</span>
          </button>
          <div className="hero-guarantee">
            <CheckCircle2 size={12} className="text-lime" />
            <span>Encrypted Case Tracking · Protected Student Rights</span>
          </div>
        </div>
      </div>

      {/* Cases List */}
      {myIssues.length === 0 ? (
        <div className="empty-panel">
          <FileCheck size={40} className="text-dim" />
          <h3>No Formal Objections Filed Yet</h3>
          <p>
            Have an issue with grading, attendance fines, lab equipment, or campus facilities?
            Lodge a formal objection now and receive an administrative SLA response within 24-48 hours.
          </p>
          <button className="btn-primary" onClick={onOpenObjectionModal}>
            <Plus size={15} />
            <span>Lodge Formal Student Objection</span>
          </button>
        </div>
      ) : (
        <div className="objections-grid">
          {myIssues.map((item) => (
            <ObjectionCard
              key={item.id}
              issue={item}
              onSelect={onSelectIssue}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
