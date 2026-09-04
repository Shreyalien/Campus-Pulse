import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MapPin,
  Wifi,
  AlertTriangle,
  Layers,
  Building,
  GraduationCap,
  Coffee,
  Home,
  Bus,
  Search,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function IsometricCampusMap({ issues = [], onSelectIssue }) {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all'); // 'all', 'academic', 'halls', 'amenities', 'transport'
  const [campusMode, setCampusMode] = useState('diu'); // 'diu' or 'universal'

  // Comprehensive DIU Ashulia Smart City landmark data
  const landmarks = useMemo(() => [
    {
      id: 'knowledge-tower',
      zone: 'academic',
      name: campusMode === 'diu' ? 'Knowledge Tower & Central Library' : 'Knowledge Tower & Library',
      shortName: 'Knowledge Tower',
      code: 'KT',
      sub: 'Central Library, Research Center & Digital Archive',
      x: 440,
      y: 110,
      width: 70,
      height: 90,
      roofColor: '#3b526d',
      wallColor: '#1e2c3d',
      issues: issues.filter(i => i.building?.toLowerCase().includes('library') || i.category === 'IT & Labs'),
      beacons: [
        {
          id: 'b-kt-1',
          x: 475,
          y: 85,
          label: 'WiFi AP-04 Down',
          color: '#00f2fe',
          priority: 'Medium'
        }
      ]
    },
    {
      id: 'ab-1',
      zone: 'academic',
      name: campusMode === 'diu' ? 'Academic Building 1 (FSIT & CSE Labs)' : 'Academic Complex 1 (Science & Tech)',
      shortName: 'Academic Bldg 1',
      code: 'AB-1',
      sub: 'CSE Faculty, AI & Software Labs, Exam Halls',
      x: 320,
      y: 160,
      width: 85,
      height: 70,
      roofColor: '#2d445e',
      wallColor: '#172433',
      issues: issues.filter(i => i.category === 'Academic' || i.department?.includes('CSE')),
      beacons: [
        {
          id: 'b-ab1-1',
          x: 360,
          y: 135,
          label: 'CSE311 Attendance Dispute',
          color: '#ef4444',
          priority: 'Critical'
        }
      ]
    },
    {
      id: 'ab-2',
      zone: 'academic',
      name: campusMode === 'diu' ? 'Academic Building 2 & Engineering Wings' : 'Academic Complex 2 (Engineering)',
      shortName: 'Academic Bldg 2',
      code: 'AB-2',
      sub: 'EEE, Textile, Civil Labs & Workshops',
      x: 550,
      y: 180,
      width: 80,
      height: 65,
      roofColor: '#2b3f54',
      wallColor: '#16222e',
      issues: issues.filter(i => i.location?.includes('AB-2') || i.location?.includes('Engineering')),
      beacons: []
    },
    {
      id: 'yunus-hall-1',
      zone: 'halls',
      name: campusMode === 'diu' ? 'Yunus Khan Scholar Garden - Tower 1' : 'Scholar Residential Tower 1',
      shortName: 'Yunus Khan Hall 1',
      code: 'YK-1',
      sub: 'Male Student Dormitory Block A & Dining',
      x: 180,
      y: 220,
      width: 65,
      height: 75,
      roofColor: '#2f4963',
      wallColor: '#192634',
      issues: issues.filter(i => i.location?.includes('Dorm') || i.building === 'Dorms'),
      beacons: [
        {
          id: 'b-yk1-1',
          x: 210,
          y: 195,
          label: 'Dorm A Elevator Fault',
          color: '#00e676',
          priority: 'High'
        }
      ]
    },
    {
      id: 'yunus-hall-2',
      zone: 'halls',
      name: campusMode === 'diu' ? 'Yunus Khan Scholar Garden - Tower 2' : 'Scholar Residential Tower 2',
      shortName: 'Yunus Khan Hall 2',
      code: 'YK-2',
      sub: 'Male Student Dormitory Block B & Common Room',
      x: 120,
      y: 270,
      width: 65,
      height: 70,
      roofColor: '#273c52',
      wallColor: '#141e2b',
      issues: [],
      beacons: []
    },
    {
      id: 'rowshan-hall',
      zone: 'halls',
      name: campusMode === 'diu' ? 'Rowshan Ara Scholar Garden (Girls Hall)' : 'Female Residential Garden Hall',
      shortName: 'Rowshan Ara Hall',
      code: 'RA-H',
      sub: 'Female Student Residential Complex & Study Lounge',
      x: 230,
      y: 310,
      width: 75,
      height: 65,
      roofColor: '#2d455d',
      wallColor: '#172534',
      issues: [],
      beacons: []
    },
    {
      id: 'auditorium',
      zone: 'amenities',
      name: campusMode === 'diu' ? 'Daffodil Smart Auditorium & Conference Center' : 'Central Auditorium & Arena',
      shortName: 'Smart Auditorium',
      code: 'AUD',
      sub: '3,000 Capacity Grand Hall & Convocation Arena',
      x: 350,
      y: 280,
      width: 90,
      height: 60,
      roofColor: '#364f6b',
      wallColor: '#1b2a3a',
      issues: [],
      beacons: []
    },
    {
      id: 'food-court',
      zone: 'amenities',
      name: campusMode === 'diu' ? 'DIU Food Court, Lake Side & Badam Tola' : 'Student Union, Food Court & Plaza',
      shortName: 'Food Court & Lake',
      code: 'FC',
      sub: 'Multi-vendor Eatery, Lakeside Walkway & Student Hub',
      x: 470,
      y: 280,
      width: 80,
      height: 55,
      roofColor: '#284055',
      wallColor: '#14202c',
      issues: issues.filter(i => i.category === 'Cafeteria'),
      beacons: [
        {
          id: 'b-fc-1',
          x: 510,
          y: 255,
          label: 'Cafeteria Price Dispute',
          color: '#fbbf24',
          priority: 'High'
        }
      ]
    },
    {
      id: 'playground',
      zone: 'amenities',
      name: campusMode === 'diu' ? 'Central Cricket Stadium & Green Oval' : 'Athletic Stadium & Green Oval',
      shortName: 'Central Playground',
      code: 'STAD',
      sub: 'Floodlit Cricket Field, Football Turf & Running Track',
      x: 620,
      y: 280,
      width: 110,
      height: 70,
      roofColor: '#114a36',
      wallColor: '#0a2e22',
      issues: [],
      beacons: []
    },
    {
      id: 'transport-terminal',
      zone: 'transport',
      name: campusMode === 'diu' ? 'Main Gate & Transport Shuttle Depot' : 'Main Gate & Transit Terminal',
      shortName: 'Transport Terminal',
      code: 'GATE-1',
      sub: 'DIU Bus Fleet Parking Bay & Security Command Post',
      x: 420,
      y: 390,
      width: 100,
      height: 50,
      roofColor: '#24374a',
      wallColor: '#131e29',
      issues: issues.filter(i => i.category === 'Transport'),
      beacons: [
        {
          id: 'b-tt-1',
          x: 470,
          y: 365,
          label: 'Mirpur Shuttle Petition (140+)',
          color: '#00e676',
          priority: 'High'
        }
      ]
    }
  ], [campusMode, issues]);

  const filteredLandmarks = useMemo(() => {
    if (selectedZone === 'all') return landmarks;
    return landmarks.filter(l => l.zone === selectedZone);
  }, [landmarks, selectedZone]);

  const totalUrgent = issues.filter(i => i.priority === 'Critical' || i.priority === 'High').length;
  const totalMinor = issues.filter(i => i.priority === 'Medium' || i.priority === 'Low').length;

  return (
    <div className="iso-map-container">
      {/* Map Control Toolbar */}
      <div className="iso-map-header">
        <div>
          <div className="iso-map-title-row">
            <span className="iso-map-title">EXPANSIVE CAMPUS TELEMETRY BLUEPRINT</span>
            <span className="campus-badge-tag">
              {campusMode === 'diu' ? 'Daffodil Smart City (Ashulia)' : 'Universal Metropolitan Campus'}
            </span>
          </div>
          <div className="iso-map-sub">
            {campusMode === 'diu'
              ? 'Academic Towers · Yunus Khan & Rowshan Ara Halls · Smart Auditorium · Lake Plaza · Stadium'
              : 'Multi-Wing Academic Quadrant · Residential Quarters · Conference Arena · Transit Depot'}
          </div>
        </div>

        <div className="iso-badges-row">
          <button
            className="campus-preset-toggle"
            onClick={() => setCampusMode(campusMode === 'diu' ? 'universal' : 'diu')}
            title="Toggle between DIU Ashulia Campus and Universal Campus"
          >
            <Layers size={12} className="text-lime" />
            <span>{campusMode === 'diu' ? 'Preset: DIU Ashulia' : 'Preset: Universal'}</span>
          </button>

          <span className="badge-pill badge-urgent">
            <span className="pill-dot red" /> {totalUrgent} Urgent
          </span>
          <span className="badge-pill badge-minor">
            <span className="pill-dot cyan" /> {totalMinor} Minor
          </span>
        </div>
      </div>

      {/* Zone Category Quick Filter */}
      <div className="map-zone-filter-bar">
        <button
          className={`zone-pill-btn ${selectedZone === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedZone('all')}
        >
          All Zones ({landmarks.length})
        </button>
        <button
          className={`zone-pill-btn ${selectedZone === 'academic' ? 'active' : ''}`}
          onClick={() => setSelectedZone('academic')}
        >
          <GraduationCap size={12} />
          <span>Academic Towers (KT, AB-1, AB-2)</span>
        </button>
        <button
          className={`zone-pill-btn ${selectedZone === 'halls' ? 'active' : ''}`}
          onClick={() => setSelectedZone('halls')}
        >
          <Home size={12} />
          <span>Residential Halls (Yunus & Rowshan Ara)</span>
        </button>
        <button
          className={`zone-pill-btn ${selectedZone === 'amenities' ? 'active' : ''}`}
          onClick={() => setSelectedZone('amenities')}
        >
          <Coffee size={12} />
          <span>Food Court, Lake & Stadium</span>
        </button>
        <button
          className={`zone-pill-btn ${selectedZone === 'transport' ? 'active' : ''}`}
          onClick={() => setSelectedZone('transport')}
        >
          <Bus size={12} />
          <span>Transport Terminal (Gate 1)</span>
        </button>
      </div>

      {/* 3D Isometric SVG Canvas */}
      <div className="iso-canvas-wrap">
        <svg
          viewBox="0 0 840 480"
          className="iso-canvas-svg expansive-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="groundGradBig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b131c" />
              <stop offset="100%" stopColor="#060a0f" />
            </linearGradient>

            <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="50%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>

            <linearGradient id="turfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#042f24" />
            </linearGradient>

            <linearGradient id="towerGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glowG" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowC" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glowR" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Master Isometric Baseplate */}
          <polygon
            points="420,30 810,235 420,440 30,235"
            fill="url(#groundGradBig)"
            stroke="#1b2a3a"
            strokeWidth="1.8"
          />

          {/* Intersecting Campus Avenues & Roads Grid */}
          <g stroke="#14212e" strokeWidth="1.2" strokeDasharray="4 4">
            <line x1="220" y1="130" x2="620" y2="340" />
            <line x1="280" y1="95" x2="680" y2="305" />
            <line x1="620" y1="130" x2="220" y2="340" />
            <line x1="560" y1="95" x2="160" y2="305" />
          </g>

          {/* DIU Campus Lake Feature (Water reflection with concentric rings) */}
          <g className="campus-lake" transform="translate(470, 240)">
            <ellipse cx="40" cy="20" rx="60" ry="24" fill="url(#lakeGrad)" stroke="#164e63" strokeWidth="1.5" />
            <ellipse cx="40" cy="20" rx="42" ry="15" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
            <text x="40" y="24" fill="#a5f3fc" fontSize="9" fontWeight="700" textAnchor="middle" opacity="0.8">DIU Lake Plaza</text>
          </g>

          {/* Central Cricket & Athletic Stadium Oval */}
          <g className="campus-stadium" transform="translate(610, 250)">
            <ellipse cx="45" cy="25" rx="65" ry="32" fill="url(#turfGrad)" stroke="#10b981" strokeWidth="1.5" />
            <ellipse cx="45" cy="25" rx="48" ry="20" fill="none" stroke="#fff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
            <rect x="40" y="16" width="10" height="18" fill="#d97706" opacity="0.8" rx="1" />
            <text x="45" y="30" fill="#a7f3d0" fontSize="9" fontWeight="800" textAnchor="middle">Cricket Oval</text>
          </g>

          {/* ---------------- RENDER 3D BUILDINGS ---------------- */}
          {landmarks.map((b) => {
            const isHovered = hoveredBuilding === b.id;
            const isFiltered = selectedZone !== 'all' && b.zone !== selectedZone;
            const opacity = isFiltered ? 0.25 : 1;

            return (
              <g
                key={b.id}
                className="building-3d-node"
                style={{ opacity, cursor: 'pointer', transition: 'opacity 0.3s' }}
                onMouseEnter={() => setHoveredBuilding(b.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={() => {
                  if (b.issues && b.issues.length > 0) {
                    onSelectIssue(b.issues[0]);
                  }
                }}
              >
                {/* 3D Isometric Extrusion */}
                {b.id === 'knowledge-tower' ? (
                  // Tall Multi-Storey Glass Tower
                  <g transform={`translate(${b.x}, ${b.y})`}>
                    {/* Shadow */}
                    <polygon points="35,65 70,82 35,99 0,82" fill="#03070b" opacity="0.6" />
                    {/* Tower base columns */}
                    <polygon points="0,82 35,99 35,0 0,-17" fill="#131e2b" stroke="#2a3f55" strokeWidth="1" />
                    <polygon points="35,99 70,82 70,-17 35,0" fill="#1c2c3e" stroke="#37526f" strokeWidth="1" />
                    {/* Glass facade with vertical windows */}
                    <polygon points="5,75 30,88 30,-5 5,-17" fill="url(#towerGlassGrad)" />
                    <polygon points="40,88 65,75 65,-17 40,-5" fill="url(#towerGlassGrad)" />
                    {/* Roof Crown */}
                    <polygon points="35,0 70,-17 35,-34 0,-17" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="1.5" />
                    {/* Antenna spire with beacon */}
                    <line x1="35" y1="-34" x2="35" y2="-52" stroke="#00e676" strokeWidth="2" />
                    <circle cx="35" cy="-52" r="3" fill="#00e676" filter="url(#glowG)" />
                    <text x="35" y="112" fill={isHovered ? '#00f2fe' : '#94a3b8'} fontSize="9" fontWeight="800" textAnchor="middle">
                      {b.shortName}
                    </text>
                  </g>
                ) : (
                  // Standard Modern Building Block
                  <g transform={`translate(${b.x}, ${b.y})`}>
                    <polygon points="0,35 40,55 80,35 40,15" fill="#03070b" opacity="0.5" />
                    {/* Left wall */}
                    <polygon points="0,35 40,55 40,10 0,-10" fill={b.wallColor} stroke="#22364a" strokeWidth="0.8" />
                    {/* Right wall */}
                    <polygon points="40,55 80,35 80,-10 40,10" fill="#203042" stroke="#2e4863" strokeWidth="0.8" />
                    {/* Roof */}
                    <polygon
                      points="40,10 80,-10 40,-30 0,-10"
                      fill={isHovered ? '#00e676' : b.roofColor}
                      stroke={isHovered ? '#fff' : '#3d5c7e'}
                      strokeWidth={isHovered ? 2 : 1}
                      style={{ transition: 'all 0.2s' }}
                    />
                    {/* Labeled Code Badge */}
                    <rect x="25" y="18" width="30" height="14" rx="3" fill="#070f17" stroke="#1b2a3a" />
                    <text x="40" y="29" fill="#00e676" fontSize="8" fontWeight="800" textAnchor="middle">{b.code}</text>
                    <text x="40" y="68" fill={isHovered ? '#fff' : '#8fa2b3'} fontSize="8.5" fontWeight="700" textAnchor="middle">
                      {b.shortName}
                    </text>
                  </g>
                )}

                {/* Floating Beacons attached to this landmark */}
                {b.beacons.map((beacon) => {
                  const isCritical = beacon.priority === 'Critical';
                  const isCyan = beacon.color === '#00f2fe';
                  return (
                    <g
                      key={beacon.id}
                      className="map-floating-pin"
                      transform={`translate(${beacon.x}, ${beacon.y})`}
                    >
                      <ellipse cx="0" cy="18" rx="8" ry="4" fill="#000" opacity="0.6" />
                      <line x1="0" y1="0" x2="0" y2="18" stroke={beacon.color} strokeWidth="1.5" />

                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill={beacon.color}
                        opacity="0.22"
                        filter={isCritical ? 'url(#glowR)' : isCyan ? 'url(#glowC)' : 'url(#glowG)'}
                      />
                      <circle cx="0" cy="0" r="9" fill={beacon.color} stroke="#fff" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="3.5" fill="#060c12" />

                      {/* Beacon Tag Pill */}
                      <g transform="translate(14, -6)">
                        <rect
                          x="0"
                          y="-10"
                          width={beacon.label.length * 6.5 + 16}
                          height="20"
                          rx="10"
                          fill="#09121a"
                          stroke={beacon.color}
                          strokeWidth="1.2"
                        />
                        <text x="8" y="4" fill="#ffffff" fontSize="9" fontWeight="700">
                          {beacon.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Hover Information HUD Card */}
        <AnimatePresence>
          {hoveredBuilding && (
            <motion.div
              className="building-hover-hud"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              {(() => {
                const b = landmarks.find(l => l.id === hoveredBuilding);
                if (!b) return null;
                return (
                  <div>
                    <div className="hud-title-row">
                      <Building size={14} className="text-lime" />
                      <strong>{b.name}</strong>
                      <span className="hud-code">[{b.code}]</span>
                    </div>
                    <p className="hud-sub">{b.sub}</p>
                    <div className="hud-issues-count">
                      {b.issues.length > 0 ? (
                        <span className="hud-has-issues text-amber">
                          <AlertTriangle size={12} />
                          <span>{b.issues.length} Active Tickets / Objections under review</span>
                        </span>
                      ) : (
                        <span className="hud-clean text-lime">
                          <CheckCircle2 size={12} />
                          <span>Normal Operations · Zero Reported Critical Faults</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
