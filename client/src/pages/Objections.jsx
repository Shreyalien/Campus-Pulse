import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertOctagon,
  FileCheck,
  Building2,
  Filter,
  Plus,
  ArrowUpDown,
  Search,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import ObjectionCard from '../components/ObjectionCard';

export default function Objections({
  issues = [],
  onSelectIssue,
  onVote,
  onOpenObjectionModal
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('upvotes'); // 'upvotes', 'recent', 'priority'
  const [filterSearch, setFilterSearch] = useState('');

  // Filter only student objections and petitions
  const filteredList = useMemo(() => {
    return issues.filter((item) => {
      // Must be an objection or petition
      const isObj = item.type === 'student_objection' || item.type === 'petition';
      if (!isObj) return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (filterSearch) {
        const query = filterSearch.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchLoc = item.location?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchLoc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortBy === 'recent') return (b.id || 0) - (a.id || 0);
      if (sortBy === 'priority') {
        const pMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      return 0;
    });
  }, [issues, selectedCategory, selectedType, selectedStatus, sortBy, filterSearch]);

  const totalObjections = issues.filter(i => i.type === 'student_objection').length;
  const totalPetitions = issues.filter(i => i.type === 'petition').length;
  const totalEndorsements = issues.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  return (
    <div className="page-container">
      {/* Student Objection Portal Hero Header */}
      <div className="portal-hero-card">
        <div className="portal-hero-left">
          <div className="hero-tag">
            <AlertOctagon size={14} className="text-lime" />
            <span>OFFICIAL UNIVERSITY GRIEVANCE & PETITIONS DESK</span>
          </div>
          <h2 className="hero-title">Student Objection Redressal Board</h2>
          <p className="hero-subtitle">
            A transparent platform for DIU students to lodge formal academic disputes, raise campus welfare objections,
            and launch peer-supported petitions with guaranteed administrative SLA response times.
          </p>

          <div className="hero-stats">
            <div className="hero-stat-box">
              <strong>{totalObjections}</strong>
              <small>Formal Objections</small>
            </div>
            <div className="hero-stat-box">
              <strong>{totalPetitions}</strong>
              <small>Active Petitions</small>
            </div>
            <div className="hero-stat-box">
              <strong>{totalEndorsements}</strong>
              <small>Student Signatures</small>
            </div>
          </div>
        </div>

        <div className="portal-hero-right">
          <button className="btn-hero-lodge" onClick={onOpenObjectionModal}>
            <Plus size={16} />
            <span>Lodge Formal Objection</span>
          </button>
          <div className="hero-guarantee">
            <CheckCircle size={12} className="text-lime" />
            <span>Encrypted submission · Optional Anonymous Whistleblower Protection</span>
          </div>
        </div>
      </div>

      {/* Student Online Reporting & SLA Guide Banner */}
      <div className="student-guide-panel">
        <div className="guide-header">
          <HelpCircle size={15} className="text-lime" />
          <h4>ছাত্রছাত্রীদের জন্য অনলাইন আপত্তি দাখিল ও SLA নির্দেশিকা (Student Guide)</h4>
        </div>
        <div className="guide-steps-grid">
          <div className="guide-step-card">
            <span className="step-num">১</span>
            <div>
              <strong>অনলাইনে আপত্তি দাখিল</strong>
              <p>বিষয় ও বিভাগ (Academic, Transport, Cafeteria) নির্বাচন করে বিবরণ দিন।</p>
            </div>
          </div>
          <div className="guide-step-card">
            <span className="step-num">২</span>
            <div>
              <strong>গোপনীয়তা রক্ষা (Anonymous)</strong>
              <p>ইচ্ছা হলে নিজের নাম ও আইডি সম্পূর্ণ গোপন রেখে রিপোর্ট করার সুযোগ।</p>
            </div>
          </div>
          <div className="guide-step-card">
            <span className="step-num">৩</span>
            <div>
              <strong>SLA সময়সীমা কাউন্টডাউন</strong>
              <p>SLA মানে প্রতিশ্রুত সময়—কর্তৃপক্ষ সর্বোচ্চ ২৪-৪৮ ঘণ্টার মধ্যে পদক্ষেপ নিতে বাধ্য।</p>
            </div>
          </div>
          <div className="guide-step-card">
            <span className="step-num">৪</span>
            <div>
              <strong>শুনানি ও আপিল অধিকার</strong>
              <p>সিদ্ধান্তে আপত্তি থাকলে ছাত্রছাত্রীরা সিন্ডিকেটে সরাসরি আপিল করতে পারবেন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <div className="controls-bar">
        <div className="controls-left">
          <div className="type-toggle-group">
            <button
              className={`pill-btn ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All Cases ({totalObjections + totalPetitions})
            </button>
            <button
              className={`pill-btn ${selectedType === 'student_objection' ? 'active' : ''}`}
              onClick={() => setSelectedType('student_objection')}
            >
              Objections ({totalObjections})
            </button>
            <button
              className={`pill-btn ${selectedType === 'petition' ? 'active' : ''}`}
              onClick={() => setSelectedType('petition')}
            >
              Petitions ({totalPetitions})
            </button>
          </div>

          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Departments / Categories</option>
            <option value="Academic">Academic & Grading</option>
            <option value="Transport">Transport & Buses</option>
            <option value="Cafeteria">Cafeteria & Food Hygiene</option>
            <option value="IT & Labs">IT & Labs</option>
            <option value="Facilities">Facilities</option>
          </select>

          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Lifecycle Statuses</option>
            <option value="Reported">Reported / Pending</option>
            <option value="Triaged">Triaged by Admin</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Resolved">Resolved / Concluded</option>
            <option value="Appealed">Appealed by Student</option>
          </select>
        </div>

        <div className="controls-right">
          <div className="sort-box">
            <ArrowUpDown size={14} className="sort-icon" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="upvotes">Sort by: Most Student Upvotes</option>
              <option value="recent">Sort by: Most Recent</option>
              <option value="priority">Sort by: Highest Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Objection Cards Grid */}
      <div className="objections-grid">
        {filteredList.length === 0 ? (
          <div className="empty-panel">
            <AlertOctagon size={36} className="text-dim" />
            <h3>No Objections Match Your Filter</h3>
            <p>Try resetting the category filter or lodge a new formal objection.</p>
            <button className="btn-primary" onClick={onOpenObjectionModal}>
              Lodge New Objection
            </button>
          </div>
        ) : (
          filteredList.map((item) => (
            <ObjectionCard
              key={item.id}
              issue={item}
              onSelect={onSelectIssue}
              onVote={onVote}
            />
          ))
        )}
      </div>
    </div>
  );
}
