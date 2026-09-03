import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Layers, Navigation, Info, AlertTriangle } from 'lucide-react';

export default function LiveMap({ issues = [], onSelectIssue }) {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [hoveredIssue, setHoveredIssue] = useState(null);

  const filteredMarkers = issues.filter((item) => {
    if (item.status === 'Resolved') return false; // Show only active incidents
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (typeFilter === 'objections' && item.type !== 'student_objection' && item.type !== 'petition') return false;
    if (typeFilter === 'issues' && (item.type === 'student_objection' || item.type === 'petition')) return false;
    return true;
  });

  return (
    <div className="page-container map-page-layout">
      {/* Map Control Bar */}
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <div className="toolbar-label">
            <Layers size={15} className="text-lime" />
            <span>CAMPUS GEOSPATIAL INTELLIGENCE · PERMANENT CAMPUS</span>
          </div>
        </div>

        <div className="map-toolbar-right">
          <div className="filter-pill-group">
            <button
              className={`pill-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All Incidents ({issues.filter(i => i.status !== 'Resolved').length})
            </button>
            <button
              className={`pill-btn ${typeFilter === 'objections' ? 'active' : ''}`}
              onClick={() => setTypeFilter('objections')}
            >
              Student Objections ({issues.filter(i => i.status !== 'Resolved' && (i.type === 'student_objection' || i.type === 'petition')).length})
            </button>
            <button
              className={`pill-btn ${typeFilter === 'issues' ? 'active' : ''}`}
              onClick={() => setTypeFilter('issues')}
            >
              Facility Issues ({issues.filter(i => i.status !== 'Resolved' && i.type === 'campus_issue').length})
            </button>
          </div>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Full Interactive Campus Canvas */}
      <div className="fullscreen-map-wrapper">
        <div className="campus-grid-bg" />

        {/* Campus Buildings & Landmarks */}
        <div className="map-building b-academic1">
          <div className="b-label">ACADEMIC BUILDING 1</div>
          <div className="b-sub">CSE · EEE · ARCHITECTURE</div>
        </div>

        <div className="map-building b-academic2">
          <div className="b-label">ACADEMIC BUILDING 2</div>
          <div className="b-sub">BUSINESS · LAW · PHARMACY</div>
        </div>

        <div className="map-building b-library">
          <div className="b-label">CENTRAL LIBRARY & NOC</div>
          <div className="b-sub">DIGITAL REPOSITORY & AUDITORIUM</div>
        </div>

        <div className="map-building b-cafeteria">
          <div className="b-label">STUDENT COMMONS & CAFETERIA</div>
          <div className="b-sub">FOOD COURT & RECREATION ZONE</div>
        </div>

        <div className="map-building b-transport">
          <div className="b-label">TRANSPORT HUB · GATE B</div>
          <div className="b-sub">BUS FLEET & SHUTTLE DISPATCH</div>
        </div>

        <div className="map-building b-hostel">
          <div className="b-label">YUNUS KHAN RESIDENCE</div>
          <div className="b-sub">STUDENT HALL & MEDICAL UNIT</div>
        </div>

        <div className="map-building b-sports">
          <div className="b-label">CAMPUS PLAYGROUND & STADIUM</div>
          <div className="b-sub">OUTDOOR SPORTS PAVILION</div>
        </div>

        {/* Road networks */}
        <div className="road-strip road-main-avenue" />
        <div className="road-strip road-library-loop" />
        <div className="road-strip road-cross-connector" />

        {/* Map Markers */}
        {filteredMarkers.map((item, idx) => (
          <motion.button
            key={item.id}
            className={`fullmap-marker marker-${item.priority?.toLowerCase()} ${item.type === 'student_objection' ? 'is-objection' : ''}`}
            style={{ left: `${item.map_x}%`, top: `${item.map_y}%` }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.12 }}
            onClick={() => onSelectIssue(item)}
            onMouseEnter={() => setHoveredIssue(item)}
            onMouseLeave={() => setHoveredIssue(null)}
          >
            <span className="fullmap-core" />
            <span className="fullmap-ripple" />
            <span className="marker-pin-label">{item.id}</span>
          </motion.button>
        ))}

        {/* Hover Tooltip Card */}
        {hoveredIssue && (
          <motion.div
            className="map-hover-card"
            style={{ left: `${hoveredIssue.map_x}%`, top: `${Math.max(10, hoveredIssue.map_y - 12)}%` }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hover-type-badge">
              {hoveredIssue.type === 'student_objection' ? 'STUDENT OBJECTION' : 'CAMPUS TICKET'} · #{hoveredIssue.id}
            </div>
            <strong className="hover-title">{hoveredIssue.title}</strong>
            <div className="hover-meta">
              <span>{hoveredIssue.location}</span>
              <span>·</span>
              <span className={`priority-tag-${hoveredIssue.priority?.toLowerCase()}`}>{hoveredIssue.priority}</span>
            </div>
            <p className="hover-hint">Click to inspect investigation drawer</p>
          </motion.div>
        )}

        {/* Bottom Legend Overlay */}
        <div className="map-floating-legend">
          <div className="legend-title">SIGNAL SEVERITY INDEX</div>
          <div className="legend-items-row">
            <div className="legend-pill"><span className="legend-dot dot-critical" /> Critical Objection (24h SLA)</div>
            <div className="legend-pill"><span className="legend-dot dot-high" /> High Priority (36h SLA)</div>
            <div className="legend-pill"><span className="legend-dot dot-medium" /> Medium (48h SLA)</div>
            <div className="legend-pill"><span className="legend-dot dot-low" /> Low (72h SLA)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
