import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X, Send } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'campus_issue',
    category: 'Facilities',
    department: 'General Campus Operations',
    location: '',
    priority: 'Medium',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <PlusCircle size={18} className="text-lime" />
            </div>
            <div>
              <h2>REPORT CAMPUS ISSUE</h2>
              <p>Quick operational ticket for facilities, labs, and equipment</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Issue Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Wi-Fi outage — Central Library 2nd Floor"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="IT & Labs">IT & Labs / Wi-Fi</option>
                <option value="Facilities">Classroom & Facilities</option>
                <option value="Transport">Transport & Parking</option>
                <option value="Cafeteria">Cafeteria / Drinking Water</option>
                <option value="Hostel">Hostel Utilities</option>
                <option value="Lost & Found">Lost & Found</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                required
                placeholder="e.g., Academic Building Room 604"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Severity Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description & Context</label>
            <textarea
              rows={3}
              placeholder="Provide specific details so maintenance engineers can triage swiftly..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Send size={14} />
              <span>{submitting ? 'Dispatching...' : 'Dispatch Ticket'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
