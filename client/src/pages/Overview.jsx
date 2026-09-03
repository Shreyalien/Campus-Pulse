import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  Activity, CheckCircle2, Clock, AlertOctagon, TrendingUp, Radio, ArrowUpRight
} from 'lucide-react';

export default function Overview({
  summary = {},
  trends = [],
  categories = [],
  issues = [],
  onSelectIssue,
  onOpenObjectionModal,
  onNavigateTab
}) {
  const statCards = [
    {
      label: 'ACTIVE ISSUES',
      value: summary.active_issues || '0',
      meta: 'Realtime on Campus',
      icon: Activity,
      color: 'text-lime'
    },
    {
      label: 'STUDENT OBJECTIONS',
      value: summary.student_objections || '0',
      meta: `${summary.active_petitions || 0} active petitions`,
      icon: AlertOctagon,
      color: 'text-amber'
    },
    {
      label: 'STUDENT ENDORSEMENTS',
      value: summary.total_student_endorsements || '0',
      meta: 'Peer signatures logged',
      icon: TrendingUp,
      color: 'text-emerald'
    },
    {
      label: 'AVG RESPONSE SLA',
      value: summary.avg_response_time || '18m',
      meta: '99.4% resolution compliance',
      icon: Clock,
      color: 'text-cyan'
    }
  ];

  const activeIssuesForMap = issues.filter(i => i.status !== 'Resolved');

  return (
    <div className="page-container">
      {/* Top Banner Alert for Student Objections */}
      {summary.student_objections > 0 && (
        <div className="objection-alert-strip">
          <div className="strip-left">
            <span className="strip-badge">PRIORITY REDRESSAL</span>
            <p>
              <strong>{summary.student_objections} Formal Student Objections & Petitions</strong> are currently open for administrative hearing.
            </p>
          </div>
          <button className="btn-strip-action" onClick={() => onNavigateTab('Objections')}>
            View Objections Desk <ArrowUpRight size={14} />
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="stats-row">
        {statCards.map((st, i) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.label}
              className="stat-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="stat-card-header">
                <span className="stat-card-label">{st.label}</span>
                <Icon size={16} className={st.color} />
              </div>
              <div className="stat-card-value">{st.value}</div>
              <div className="stat-card-meta">{st.meta}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Live Map & Live Feed */}
      <div className="overview-main-grid">
        <section className="dashboard-panel map-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">DIU ASHULIA PERMANENT CAMPUS</span>
              <h2 className="panel-title">Live Incident & Objection Activity</h2>
            </div>
            <div className="live-telemetry-tag">
              <span className="telemetry-ping" />
              <span>LIVE TELEMETRY</span>
            </div>
          </div>

          <div className="campus-map-wrapper">
            {/* Campus SVG Plan Overlay */}
            <div className="campus-building ab1">
              <span>ACADEMIC BLDG 1</span>
              <small>CSE & EEE LABS</small>
            </div>
            <div className="campus-building ab2">
              <span>ACADEMIC BLDG 2</span>
              <small>LECTURE HALLS</small>
            </div>
            <div className="campus-building lib">
              <span>CENTRAL LIBRARY</span>
              <small>QUIET STUDY & NOC</small>
            </div>
            <div className="campus-building sc">
              <span>STUDENT CAFETERIA</span>
              <small>LEVEL 1–4 FOOD COURT</small>
            </div>
            <div className="campus-building gate-b">
              <span>TRANSPORT TERMINAL</span>
              <small>SHUTTLE BUS GATE B</small>
            </div>
            <div className="campus-building hostel">
              <span>STUDENT RESIDENCE</span>
              <small>YUNUS KHAN HOSTEL</small>
            </div>

            <div className="campus-road road-horizontal" />
            <div className="campus-road road-vertical" />
            <div className="campus-road road-diagonal" />

            {/* Pulsing Markers */}
            {activeIssuesForMap.map((item, idx) => (
              <motion.button
                key={item.id}
                className={`map-marker marker-${item.priority?.toLowerCase()} ${item.type === 'student_objection' ? 'marker-objection' : ''}`}
                style={{ left: `${item.map_x || 50}%`, top: `${item.map_y || 50}%` }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: idx * 0.15 }}
                onClick={() => onSelectIssue(item)}
                title={`${item.title} (${item.priority})`}
              >
                <span className="marker-core" />
                <span className="marker-pulse-ring" />
              </motion.button>
            ))}
          </div>

          <div className="map-legend">
            <span className="legend-item"><span className="legend-dot dot-critical" /> Critical / Formal Objection</span>
            <span className="legend-item"><span className="legend-dot dot-high" /> High Priority</span>
            <span className="legend-item"><span className="legend-dot dot-medium" /> Medium</span>
            <span className="legend-item"><span className="legend-dot dot-low" /> Low</span>
          </div>
        </section>

        {/* Live Incident & Grievance Stream */}
        <section className="dashboard-panel feed-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">REALTIME STREAM</span>
              <h2 className="panel-title">Recent Tickets & Objections</h2>
            </div>
            <button className="btn-link-action" onClick={() => onNavigateTab('Reports')}>
              All Records →
            </button>
          </div>

          <div className="feed-list">
            {issues.slice(0, 6).map((item) => (
              <motion.div
                layout
                key={item.id}
                className="feed-item"
                onClick={() => onSelectIssue(item)}
              >
                <div className={`feed-icon-box ${item.type === 'student_objection' ? 'icon-objection' : 'icon-issue'}`}>
                  {item.category ? item.category[0] : 'C'}
                </div>
                <div className="feed-content">
                  <div className="feed-title-line">
                    <span className="feed-title">{item.title}</span>
                  </div>
                  <div className="feed-meta">
                    <span>{item.location}</span>
                    <span>·</span>
                    <span>{item.type === 'student_objection' ? `${item.upvotes || 0} votes` : item.priority}</span>
                  </div>
                </div>
                <div className={`feed-status status-${item.status?.toLowerCase().replace(' ', '-')}`}>
                  {item.status}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Analytics Charts Row */}
      <div className="charts-row">
        <section className="dashboard-panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">7-DAY INCIDENT VELOCITY</span>
              <h3 className="panel-title">Reports & Objections Over Time</h3>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d9ff62" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d9ff62" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorObjections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="#526071" fontSize={11} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#0e141c', borderColor: '#263445', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="reports" stroke="#d9ff62" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" name="Total Reports" />
                <Area type="monotone" dataKey="objections" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorObjections)" name="Student Objections" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dashboard-panel chart-panel">
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">CAMPUS HOTSPOT TAXONOMY</span>
              <h3 className="panel-title">Grievance & Issue Categories</h3>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categories} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="n" type="category" width={90} stroke="#7b8998" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0e141c', borderColor: '#263445', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="v" fill="#d9ff62" radius={[0, 6, 6, 0]} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
