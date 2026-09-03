import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X, Send, Clock, MapPin } from 'lucide-react';

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
              <h2>ক্যাম্পাস সমস্যা অনলাইন রিপোর্ট</h2>
              <p>Quick Online Campus Issue & Maintenance Ticket</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>সমস্যার শিরোনাম (Issue Title) *</label>
            <input
              type="text"
              required
              placeholder="যেমন: সেন্ট্রাল লাইব্রেরি ৩য় তলার ওয়াইফাই কাজ করছে না"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>ক্যাটাগরি (Category) *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="IT & Labs">IT & Labs / Wi-Fi</option>
                <option value="Facilities">Classroom & Facilities</option>
                <option value="Transport">Transport & Shuttle</option>
                <option value="Cafeteria">Cafeteria / Water</option>
                <option value="Hostel">Hostel Utilities</option>
                <option value="Lost & Found">Lost & Found</option>
              </select>
            </div>

            <div className="form-group">
              <label>লোকেশন / রুম নং (Location) *</label>
              <input
                type="text"
                required
                placeholder="যেমন: একাডেমিক বিল্ডিং রুম ৬০৪"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>জরুরিতা (Priority)</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low">Low (সাধারণ রক্ষণাবেক্ষণ · ৭২ ঘণ্টা SLA)</option>
              <option value="Medium">Medium (স্ট্যান্ডার্ড · ৪৮ ঘণ্টা SLA)</option>
              <option value="High">High (জরুরি সমস্যা · ৩৬ ঘণ্টা SLA)</option>
              <option value="Critical">Critical (অতি জরুরি · ২৪ ঘণ্টা SLA)</option>
            </select>
          </div>

          <div className="form-group">
            <label>বিবরণ (Description & Details)</label>
            <textarea
              rows={3}
              placeholder="রক্ষণাবেক্ষণ টিমের সুবিধার জন্য বিস্তারিত বিবরণ দিন..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              বাতিল (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Send size={14} />
              <span>{submitting ? 'পাঠানো হচ্ছে...' : 'অনলাইনে রিপোর্ট জমা দিন'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
