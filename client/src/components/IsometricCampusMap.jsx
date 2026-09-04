import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MapPin, Wifi, AlertTriangle, Layers } from 'lucide-react';

export default function IsometricCampusMap({ issues = [], onSelectIssue }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [campusMode, setCampusMode] = useState('diu'); // 'diu' or 'universal'

  // Building metadata supporting both DIU Ashulia landmarks and Universal names
  const buildings = {
    library: {
      diu: 'Knowledge Tower / Library',
      univ: 'Central Library',
      sub: 'Research Repositories & Study Floors'
    },
    dorms: {
      diu: 'Yunus Khan Scholar Garden (Dorms)',
      univ: 'Residential Dorms',
      sub: 'Student Hostels & Living Quarters'
    },
    union: {
      diu: 'Student Union & Food Court',
      univ: 'Campus Union',
      sub: 'Auditorium & Student Amenities'
    },
    admin: {
      diu: 'Academic & Admin Complex',
      univ: 'Administration & Exam Wing',
      sub: 'Deans Office, Labs & Syndicate'
    }
  };

  const beacons = [
    {
      id: 'dorm-a-1',
      x: 180,
      y: 220,
      label: 'Facility Issue - Dorm A',
      building: 'dorms',
      color: '#00e676',
      icon: Bell,
      issue: issues.find(i => i.building === 'Dorms' || i.category === 'Facilities') || {
        id: 1,
        title: 'Dorm A Facility Issue — Elevator Hydraulic Vibration',
        status: 'Reported',
        priority: 'High'
      }
    },
    {
      id: 'dorm-a-2',
      x: 230,
      y: 260,
      label: 'Facility Issue - Dorm A',
      building: 'dorms',
      color: '#00e676',
      icon: Bell,
      issue: issues.find(i => i.location?.includes('Dorm')) || {
        id: 1,
        title: 'Dorm A Facility Issue — Water Heater Sensor Check',
        status: 'Reported',
        priority: 'High'
      }
    },
    {
      id: 'union-center',
      x: 340,
      y: 270,
      label: 'Union',
      building: 'union',
      color: '#00e676',
      icon: MapPin,
      issue: issues.find(i => i.building === 'Union' || i.type === 'petition') || {
        id: 5,
        title: 'Campus Petition: Shuttle Route from Mirpur',
        status: 'Hearing Scheduled',
        priority: 'High'
      }
    },
    {
      id: 'library-wifi-1',
      x: 295,
      y: 165,
      label: 'WiFi Down - Library',
      building: 'library',
      color: '#00f2fe',
      icon: Bell,
      issue: issues.find(i => i.building === 'Library' || i.category === 'IT & Labs') || {
        id: 2,
        title: 'Library WiFi Down — 2nd Floor Silent Study Section',
        status: 'Under Investigation',
        priority: 'Medium'
      }
    },
    {
      id: 'library-wifi-2',
      x: 430,
      y: 275,
      label: 'WiFi Down - Library B',
      building: 'library',
      color: '#00f2fe',
      icon: Bell,
      issue: issues.find(i => i.building === 'Library') || {
        id: 2,
        title: 'Library WiFi Down — AP DNS Resolution Glitch',
        status: 'Under Investigation',
        priority: 'Medium'
      }
    },
    {
      id: 'admin-gate',
      x: 395,
      y: 310,
      label: 'Admin',
      building: 'admin',
      color: '#00e676',
      icon: MapPin,
      issue: issues.find(i => i.building === 'Admin') || {
        id: 4,
        title: 'Student Objection: Attendance Fine for CSE311',
        status: 'Under Investigation',
        priority: 'Critical'
      }
    }
  ];

  return (
    <div className="iso-map-container">
      <div className="iso-map-header">
        <div>
          <span className="iso-map-title">LIVE UNIVERSITY CAMPUS MAP</span>
          <div className="iso-map-sub">
            {campusMode === 'diu'
              ? 'DIU Ashulia Permanent Smart Campus (Universal Blueprint)'
              : 'Universal Central University Campus'}
          </div>
        </div>

        <div className="iso-badges-row">
          <button
            className="campus-preset-toggle"
            onClick={() => setCampusMode(campusMode === 'diu' ? 'univ' : 'diu')}
            title="Toggle between DIU Ashulia Campus view and Universal Campus view"
          >
            <Layers size={12} className="text-lime" />
            <span>{campusMode === 'diu' ? 'Preset: DIU Ashulia' : 'Preset: Universal'}</span>
          </button>
          <span className="badge-pill badge-urgent">
            <span className="pill-dot red" /> 3 Urgent
          </span>
          <span className="badge-pill badge-minor">
            <span className="pill-dot cyan" /> 7 Minor
          </span>
        </div>
      </div>

      <div className="iso-canvas-wrap">
        <svg
          viewBox="0 0 620 400"
          className="iso-canvas-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c151f" />
              <stop offset="100%" stopColor="#080e14" />
            </linearGradient>

            <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e3328" />
              <stop offset="100%" stopColor="#08231a" />
            </linearGradient>

            <linearGradient id="wallTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#253549" />
              <stop offset="100%" stopColor="#1c2838" />
            </linearGradient>
            <linearGradient id="wallLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#182330" />
              <stop offset="100%" stopColor="#111924" />
            </linearGradient>
            <linearGradient id="wallRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2c3d" />
              <stop offset="100%" stopColor="#151e2a" />
            </linearGradient>

            <filter id="beaconGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="beaconGlowCyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Isometric Ground Baseplate */}
          <polygon
            points="310,40 580,195 310,350 40,195"
            fill="url(#groundGrad)"
            stroke="#1b2a3a"
            strokeWidth="1.5"
          />

          {/* Isometric Roads Grid Lines */}
          <g stroke="#14212e" strokeWidth="1" strokeDasharray="3 3">
            <line x1="175" y1="118" x2="445" y2="273" />
            <line x1="220" y1="92" x2="490" y2="247" />
            <line x1="445" y1="118" x2="175" y2="273" />
            <line x1="400" y1="92" x2="130" y2="247" />
          </g>

          {/* Central Green Courtyard */}
          <polygon
            points="310,140 440,215 310,290 180,215"
            fill="url(#lawnGrad)"
            stroke="#164d3b"
            strokeWidth="1.2"
          />

          {/* ---------------- 1. KNOWLEDGE TOWER / CENTRAL LIBRARY (Center-Back) ---------------- */}
          <g className="iso-building" transform="translate(0, -10)">
            <polygon points="310,135 365,167 310,198 255,167" fill="#060b10" opacity="0.6" />
            <polygon points="255,167 310,198 310,145 255,114" fill="url(#wallLeft)" stroke="#223447" strokeWidth="0.8" />
            <polygon points="310,198 365,167 365,114 310,145" fill="url(#wallRight)" stroke="#2a3f55" strokeWidth="0.8" />
            <polygon points="310,145 365,114 310,83 255,114" fill="url(#wallTop)" stroke="#3b526d" strokeWidth="1" />
            <line x1="272" y1="130" x2="272" y2="155" stroke="#486585" strokeWidth="1.5" />
            <line x1="290" y1="140" x2="290" y2="165" stroke="#486585" strokeWidth="1.5" />
            <line x1="330" y1="140" x2="330" y2="165" stroke="#5b7b9e" strokeWidth="1.5" />
            <line x1="348" y1="130" x2="348" y2="155" stroke="#5b7b9e" strokeWidth="1.5" />
            <text x="310" y="210" textAnchor="middle" fill="#8ba0b5" fontSize="9.5" fontWeight="700">
              {campusMode === 'diu' ? 'Knowledge Tower' : 'Library'}
            </text>
          </g>

          {/* ---------------- 2. YUNUS KHAN SCHOLAR GARDEN / DORMS (Left) ---------------- */}
          <g className="iso-building">
            <polygon points="170,225 220,254 220,195 170,166" fill="url(#wallLeft)" stroke="#223447" strokeWidth="0.8" />
            <polygon points="220,254 260,231 260,172 220,195" fill="url(#wallRight)" stroke="#2a3f55" strokeWidth="0.8" />
            <polygon points="220,195 260,172 210,143 170,166" fill="url(#wallTop)" stroke="#3b526d" strokeWidth="1" />
            <rect x="180" y="178" width="6" height="5" fill="#5eead4" opacity="0.3" transform="skewY(18)" />
            <rect x="195" y="186" width="6" height="5" fill="#5eead4" opacity="0.5" transform="skewY(18)" />
            <rect x="180" y="196" width="6" height="5" fill="#5eead4" opacity="0.4" transform="skewY(18)" />
            <rect x="195" y="204" width="6" height="5" fill="#5eead4" opacity="0.3" transform="skewY(18)" />
            <text x="215" y="267" textAnchor="middle" fill="#8ba0b5" fontSize="9.5" fontWeight="700">
              {campusMode === 'diu' ? 'Scholar Garden' : 'Dorms'}
            </text>
          </g>

          {/* ---------------- 3. AUDITORIUM & STUDENT UNION (Center) ---------------- */}
          <g className="iso-building" transform="translate(30, 20)">
            <polygon points="280,205 320,228 320,185 280,162" fill="url(#wallLeft)" stroke="#223447" strokeWidth="0.8" />
            <polygon points="320,228 355,208 355,165 320,185" fill="url(#wallRight)" stroke="#2a3f55" strokeWidth="0.8" />
            <polygon points="320,185 355,165 315,142 280,162" fill="url(#wallTop)" stroke="#3b526d" strokeWidth="1" />
            <text x="317" y="240" textAnchor="middle" fill="#8ba0b5" fontSize="9.5" fontWeight="700">
              {campusMode === 'diu' ? 'Smart Auditorium' : 'Union'}
            </text>
          </g>

          {/* ---------------- 4. ACADEMIC & ADMIN COMPLEX (Right) ---------------- */}
          <g className="iso-building">
            <polygon points="360,265 410,294 410,235 360,206" fill="url(#wallLeft)" stroke="#223447" strokeWidth="0.8" />
            <polygon points="410,294 455,268 455,209 410,235" fill="url(#wallRight)" stroke="#2a3f55" strokeWidth="0.8" />
            <polygon points="410,235 455,209 405,180 360,206" fill="url(#wallTop)" stroke="#3b526d" strokeWidth="1" />
            <rect x="375" y="222" width="6" height="5" fill="#00e5ff" opacity="0.3" transform="skewY(18)" />
            <rect x="390" y="230" width="6" height="5" fill="#00e5ff" opacity="0.6" transform="skewY(18)" />
            <text x="410" y="306" textAnchor="middle" fill="#8ba0b5" fontSize="9.5" fontWeight="700">
              {campusMode === 'diu' ? 'Academic & Admin' : 'Admin'}
            </text>
          </g>

          {/* ---------------- FLOATING GLOWING BEACONS ---------------- */}
          {beacons.map((b) => {
            const isHovered = hoveredNode === b.id;
            const isCyan = b.color === '#00f2fe';
            return (
              <g
                key={b.id}
                className="map-beacon-pin"
                transform={`translate(${b.x}, ${b.y})`}
                onMouseEnter={() => setHoveredNode(b.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectIssue && onSelectIssue(b.issue)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="0" cy="18" rx="8" ry="4" fill="#000" opacity="0.6" />
                <line x1="0" y1="0" x2="0" y2="18" stroke={b.color} strokeWidth="1.5" opacity="0.6" />

                <circle
                  cx="0"
                  cy="0"
                  r="14"
                  fill={b.color}
                  opacity="0.2"
                  filter={isCyan ? 'url(#beaconGlowCyan)' : 'url(#beaconGlowGreen)'}
                />

                <circle
                  cx="0"
                  cy="0"
                  r="9"
                  fill={b.color}
                  stroke="#fff"
                  strokeWidth="1.5"
                />

                <circle cx="0" cy="0" r="3.5" fill="#081017" />

                <g transform="translate(14, -6)">
                  <rect
                    x="0"
                    y="-10"
                    width={b.label.length * 7 + 16}
                    height="20"
                    rx="10"
                    fill="#0c1622"
                    stroke={b.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="8"
                    y="4"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.2"
                  >
                    {b.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
