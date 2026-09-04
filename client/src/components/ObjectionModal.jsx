import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  X,
  Shield,
  Send,
  HelpCircle,
  FileCheck,
  Building2,
  Image as ImageIcon,
  Clock
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
    reporter_name: 'Tanvir Ahmed (CR)',
    reporter_id: 'STU-2041',
    description: '',
    evidence_url: ''
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

  const getSlaHours = (p) => {
    if (p === 'Critical') return 24;
    if (p === 'High') return 36;
    if (p === 'Medium') return 48;
    return 72;
  };

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
              <h2>অনলাইন স্টুডেন্ট আপত্তি ও অভিযোগ দাখিল</h2>
              <p>Lodge Formal Student Objection & Campus Petition Online</p>
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
                <strong>Formal Objection (ব্যক্তিগত/ব্যাচ আপত্তি)</strong>
                <small>একাডেমিক গ্রেডিং, এটেন্ডেন্স বা সুনির্দিষ্ট সমস্যা</small>
              </div>
            </button>
            <button
              type="button"
              className={`type-select-btn ${formData.type === 'petition' ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'petition' })}
            >
              <Building2 size={16} />
              <div>
                <strong>Campus Petition (সম্মিলিত পিটিশন)</strong>
                <small>১০০ জন ছাত্রছাত্রীর স্বাক্ষরে সিন্ডিকেট শুনানির জন্য</small>
              </div>
            </button>
          </div>

          <div className="form-group">
            <label>আপত্তির বিষয় বা শিরোনাম (Subject / Title) *</label>
            <input
              type="text"
              required
              placeholder="যেমন: পোর্টাল ডাউন থাকায় CSE311 অ্যাসাইনমেন্ট জরিমানা প্রত্যাহার"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>সংশ্লিষ্ট বিভাগ বা কর্তৃপক্ষ (Target Department) *</label>
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
              <label>ক্যাটাগরি (Category) *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic (পরীক্ষা, গ্রেডিং, এটেন্ডেন্স)</option>
                <option value="Transport">Transport (বাস ও শাটল রুট)</option>
                <option value="Cafeteria">Cafeteria (খাবারের মান ও দাম)</option>
                <option value="IT & Labs">IT & Labs (ল্যাব পিসি, সফটওয়্যার, ওয়াইফাই)</option>
                <option value="Facilities">Facilities (ক্লাসরুম প্রজেক্টর, ওয়াশরুম, পানি)</option>
                <option value="Hostel">Hostel (আবাসিক হল সংক্রান্ত)</option>
                <option value="Disciplinary">Disciplinary (হয়রানি/শৃঙ্খলা)</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>ক্যাম্পাস লোকেশন (Location) *</label>
              <input
                type="text"
                required
                placeholder="যেমন: একাডেমিক বিল্ডিং ৪০২, গেট বি, লাইব্রেরি ২য় তলা"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>জরুরিতা ও সমাধানের সময়সীমা (Priority & SLA)</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low (সাধারণ বিষয় · ৭২ ঘণ্টা SLA)</option>
                <option value="Medium">Medium (স্ট্যান্ডার্ড · ৪৮ ঘণ্টা SLA)</option>
                <option value="High">High (উচ্চ অগ্রাধিকার · ৩৬ ঘণ্টা SLA)</option>
                <option value="Critical">Critical (জরুরি হস্তক্ষেপ · ২৪ ঘণ্টা SLA)</option>
              </select>
            </div>
          </div>

          {/* SLA Explainer Callout */}
          <div className="modal-sla-callout">
            <Clock size={14} className="text-lime" />
            <div>
              <strong>প্রশাসনের সর্বোচ্চ নিষ্পত্তির সময়সীমা (SLA): {getSlaHours(formData.priority)} ঘণ্টা</strong>
              <p>SLA (Service Level Agreement) হলো বিশ্ববিদ্যালয় প্রশাসনের প্রতিশ্রুতি—অভিযোগ জমা দেওয়ার সর্বোচ্চ এই সময়ের মধ্যে কর্তৃপক্ষ পদক্ষেপ নিতে বাধ্য।</p>
            </div>
          </div>

          <div className="form-group">
            <label>বিস্তারিত বিবরণ ও আপত্তির কারণ (Detailed Grounds) *</label>
            <textarea
              required
              rows={3}
              placeholder="ঘটনার সময়, কোর্স কোড, সংশ্লিষ্ট শিক্ষক/কর্মকর্তার প্রসঙ্গ এবং আপনি কী প্রতিকার চাচ্ছেন তা স্পষ্টভাবে লিখুন..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>প্রমাণ বা স্ক্রিনশট লিংক (Evidence Image / Screenshot URL - Optional)</label>
            <div className="evidence-input-wrap">
              <ImageIcon size={15} className="text-dim" />
              <input
                type="text"
                placeholder="https://... (ল্যাব ইরর, নোটিশ বা পেমেন্ট রসিদের লিংক)"
                value={formData.evidence_url}
                onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
              />
            </div>
          </div>

          <div className="form-anonymous-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
              />
              <div className="toggle-text">
                <strong>গোপনীয়তা রক্ষা করুন (Anonymous Whistleblower Mode)</strong>
                <span>পাবলিক বোর্ডে আপনার নাম ও স্টুডেন্ট আইডি গোপন থাকবে; শুধু তদন্তকারী অমবুডস্পারসন দেখতে পাবেন।</span>
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              বাতিল (Cancel)
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <Send size={14} />
              <span>{submitting ? 'জমা হচ্ছে...' : 'অনলাইনে জমা দিন (Submit Online)'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
