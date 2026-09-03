import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  X,
  Shield,
  Send,
  HelpCircle,
  FileCheck,
  Building2
} from 'lucide-react';

export default function ObjectionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'student_objection',
    category: 'Academic',
    department: 'Department of CSE & Exam Committee',
    location: 'Academic Building 4th Floor',
    priority: 'High',
    is_anonymous: false,
    reporter_name: 'Shreya Golder (CR)',
    reporter_id: '251-15-467',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        is_anonymous: formData.is_anonymous ? 1 : 0
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [
    'Department of CSE & Exam Committee',
    'Transport Department & Bus Fleet',
    'Campus Facilities & Food Safety Board',
    'Campus IT & Network Operations',
    'Proctorial Body & Student Welfare',
    'Hostel & Residential Life Authority',
    'Accounts & Financial Services',
    'General Campus Operations'
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-container modal-wide"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <AlertTriangle size={18} className="text-lime" />
            </div>
            <div>
              <h2>LODGE FORMAL STUDENT OBJECTION</h2>
              <p>Official grievance and campus petition submission protocol</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-type-selector">
            <button
              type="button"
              className={`type-select-btn ${formData.type === 'student_objection' ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'student_objection' })}
            >
              <FileCheck size={16} />
              <div>
                <strong>Formal Objection</strong>
                <small>Individual / batch academic or operational dispute</small>
              </div>
            </button>
            <button
              type="button"
              className={`type-select-btn ${formData.type === 'petition' ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'petition' })}
            >
              <Building2 size={16} />
              <div>
                <strong>Campus Petition</strong>
                <small>Requires 100 student signatures for executive hearing</small>
              </div>
            </button>
          </div>

          <div className="form-group">
            <label>Objection Headline / Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g., Unfair Attendance Fine during CSE311 Portal Downtime"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Target Department / Authority *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic / Grading / Attendance</option>
                <option value="Transport">Transport & Shuttle Fleet</option>
                <option value="Cafeteria">Cafeteria & Food Hygiene</option>
                <option value="IT & Labs">IT & Lab Equipment</option>
                <option value="Facilities">Campus Facilities & Utilities</option>
                <option value="Hostel">Hostel & Accommodation</option>
                <option value="Disciplinary">Disciplinary & Conduct</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Campus Location / Hall / Room *</label>
              <input
                type="text"
                required
                placeholder="e.g., Academic Building 402, Gate B, Cafeteria L-4"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Urgency / Severity Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low (Routine Review · 72h SLA)</option>
                <option value="Medium">Medium (Standard Triage · 48h SLA)</option>
                <option value="High">High (High Priority · 36h SLA)</option>
                <option value="Critical">Critical (Immediate Escalation · 24h SLA)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Comprehensive Ground of Objection & Affected Details *</label>
            <textarea
              required
              rows={4}
              placeholder="State the detailed sequence of events, course code, instructor/authority context, and reason why administrative redressal is requested..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-anonymous-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
              />
              <div className="toggle-text">
                <strong>Protect Identity (Anonymous Filing)</strong>
                <span>Hides your name and student ID from public boards; visible only to the Ombudsperson.</span>
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Send size={14} />
              <span>{submitting ? 'Lodging Objection...' : 'Submit to Operations Desk'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
