import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  FileText,
  Table,
  Grid,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ArrowRight
} from 'lucide-react';

export default function Reports({ issues = [], onSelectIssue, onVote }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');

  const filtered = issues.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (status !== 'all' && item.status !== status) return false;
    if (priority !== 'all' && item.priority !== priority) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = item.title?.toLowerCase().includes(q) ||
                    item.location?.toLowerCase().includes(q) ||
                    item.department?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* Search & Filter Header */}
      <div className="reports-filter-bar">
        <div className="reports-search-box">
          <Search size={15} className="text-dim" />
          <input
            type="text"
            placeholder="Search by title, location, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="reports-selects">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Facilities">Facilities</option>
            <option value="Transport">Transport</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="IT & Labs">IT & Labs</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Triaged">Triaged</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Hearing Scheduled">Hearing Scheduled</option>
            <option value="Resolved">Resolved</option>
            <option value="Appealed">Appealed</option>
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="view-toggle-btns">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <Table size={15} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {viewMode === 'table' ? (
        <div className="reports-table-panel">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>TYPE</th>
                <th>TITLE & GROUNDS</th>
                <th>CATEGORY</th>
                <th>LOCATION / DEPT</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>ENDORSEMENTS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty-cell">No matching reports found.</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} onClick={() => onSelectIssue(item)} className="clickable-row">
                    <td className="font-mono text-lime">#{item.id}</td>
                    <td>
                      <span className={`table-type-pill ${item.type === 'student_objection' ? 'pill-obj' : item.type === 'petition' ? 'pill-pet' : 'pill-rep'}`}>
                        {item.type === 'student_objection' ? 'OBJECTION' : item.type === 'petition' ? 'PETITION' : 'REPORT'}
                      </span>
                    </td>
                    <td>
                      <div className="table-title-wrap">
                        <strong>{item.title}</strong>
                        <span className="table-reporter-name">
                          By {item.is_anonymous ? 'Anonymous Student' : (item.reporter_name || 'Student')}
                        </span>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <div>
                        <strong>{item.location}</strong>
                        <small className="table-dept-text">{item.department}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-tag-${item.priority?.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`table-status-badge status-${item.status?.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="table-votes">
                        <ThumbsUp size={12} className="text-lime" /> {item.upvotes || 0}
                      </span>
                    </td>
                    <td>
                      <button className="btn-table-inspect" onClick={(e) => { e.stopPropagation(); onSelectIssue(item); }}>
                        Inspect <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="reports-grid-view">
          {filtered.map((item) => (
            <div key={item.id} className="report-grid-card" onClick={() => onSelectIssue(item)}>
              <div className="grid-card-top">
                <span className="font-mono text-lime">#{item.id}</span>
                <span className={`status-pill status-${item.status?.toLowerCase().replace(' ', '-')}`}>
                  {item.status}
                </span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <div className="grid-card-footer">
                <span>{item.location}</span>
                <span>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
