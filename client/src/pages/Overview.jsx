import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Activity,
  CheckCircle2,
  Clock,
  Star,
  MoreVertical,
  Radio,
  ChevronDown,
  AlertTriangle,
  Flame,
  ThumbsUp
} from 'lucide-react';
import IsometricCampusMap from '../components/IsometricCampusMap';

export default function Overview({
  summary = {},
  issues = [],
  onSelectIssue,
  onOpenObjectionModal,
  onNavigateTab
}) {
  const [timeFilter, setTimeFilter] = useState('Hourly');

  // Dual line volume graph matching the mockup
  const volumeData = [
    { time: '10AM', cyan: 25, green: 40 },
    { time: '', cyan: 38, green: 22 },
    { time: '08AM', cyan: 48, green: 75 },
    { time: '', cyan: 78, green: 65 },
    { time: '12PM', cyan: 88, green: 52 },
    { time: '', cyan: 65, green: 80 },
    { time: '15PM', cyan: 92, green: 68 }
  ];

  // Donut chart data matching mockup (In Progress 45%, Resolved 55%)
  const statusDonutData = [
    { name: 'In Progress', value: 45, color: '#00f2fe' },
    { name: 'Resolved', value: 55, color: '#00e676' }
  ];

  // Recent incident feed items
  const feedIssues = issues.slice(0, 5);

  const getPriorityTagClass = (p) => {
    switch (p?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'tag-priority-high';
      case 'medium':
        return 'tag-priority-medium';
      default:
        return 'tag-priority-low';
    }
  };

  const getStatusPrefix = (s) => {
    if (s === 'Resolved') return { text: '[Resolved]', color: 'text-resolved' };
    if (s === 'Under Investigation' || s === 'Triaged') return { text: '[In Progress]', color: 'text-progress' };
    return { text: '[New]', color: 'text-new' };
  };

  return (
    <div className="overview-mockup-layout">
      {/* ---------------- TOP 4 STAT CARDS ---------------- */}
      <div className="stat-cards-row">
        {/* Card 1: Active Incidents (Highlighted with glow) */}
        <div className="stat-kpi-card active-glow-card">
          <div className="kpi-top">
            <span className="kpi-label">Active Incidents</span>
            <MoreVertical size={14} className="kpi-menu-icon" />
          </div>
          <div className="kpi-value-row">
            <Activity size={22} className="ecg-pulse-icon" />
            <span className="kpi-number">{summary.active_issues || 14}</span>
          </div>
        </div>

        {/* Card 2: Resolved Today */}
        <div className="stat-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Resolved Today</span>
          </div>
          <div className="kpi-value-row">
            <CheckCircle2 size={22} className="kpi-check-icon" />
            <span className="kpi-number">{summary.resolved_issues || 31}</span>
          </div>
        </div>

        {/* Card 3: Average Resolution Time */}
        <div className="stat-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Resolution Time</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number text-white">{summary.avg_response_time || '48m'}</span>
          </div>
        </div>

        {/* Card 4: Student Feedback */}
        <div className="stat-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Student Feedback</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number text-white">4.6/5</span>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN TWO-COLUMN DASHBOARD ---------------- */}
      <div className="overview-main-grid">
        {/* LEFT COLUMN: 3D Campus Map + Incident Triage Feed */}
        <div className="overview-left-col">
          {/* Isometric 3D Map Component */}
          <div className="dashboard-subcard">
            <IsometricCampusMap issues={issues} onSelectIssue={onSelectIssue} />
          </div>

          {/* Incident Triage Feed */}
          <div className="dashboard-subcard incident-feed-card">
            <div className="feed-header-row">
              <span className="feed-title">INCIDENT TRIAGE FEED</span>
              <div className="feed-live-indicator">
                <span className="feed-live-dot" />
                <span>Live</span>
              </div>
            </div>

            <div className="feed-list">
              {feedIssues.map((item) => {
                const prefix = getStatusPrefix(item.status);
                const code = item.ticket_code || `CP${2480 + item.id}`;
                return (
                  <div
                    key={item.id}
                    className="feed-row"
                    onClick={() => onSelectIssue(item)}
                  >
                    <div className="feed-row-left">
                      <span className={`feed-prefix ${prefix.color}`}>{prefix.text}</span>
                      <span className="feed-ticket-id">#{code}</span>
                      <span className="feed-dash">-</span>
                      <span className="feed-item-title">{item.title}</span>
                      <span className="feed-dash">-</span>
                      <span className="feed-time">
                        {item.created_at ? '2m ago' : 'Just now'}
                      </span>
                      <span className="feed-dash">-</span>
                      <span className={`feed-priority-pill ${getPriorityTagClass(item.priority)}`}>
                        {item.priority?.toUpperCase()} PRIORITY
                      </span>
                      <span className="feed-dash">-</span>
                      <span className="feed-assignee-text">
                        {item.status === 'Resolved' ? 'Student Notified' : item.status === 'Under Investigation' ? 'Technician Assigned' : 'Pending'}
                      </span>
                    </div>

                    <div className="feed-row-right">
                      <button
                        className="feed-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIssue(item);
                        }}
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket Analytics & Donut Status */}
        <div className="overview-right-col">
          <div className="dashboard-subcard analytics-card-wrap">
            <div className="analytics-header-row">
              <span className="analytics-title">TICKET ANALYTICS</span>
              <div className="analytics-header-right">
                <span className="live-graph-label">Live Graph</span>
                <div className="hourly-dropdown-btn">
                  <span>Hourly</span>
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>

            {/* Subheader: Report Volume */}
            <div className="chart-section-label">Report Volume</div>

            {/* Dual curved area chart */}
            <div className="report-volume-chart-box">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="volGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#485c72"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#1c2836' }}
                  />
                  <YAxis
                    stroke="#485c72"
                    fontSize={10}
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0e1622',
                      borderColor: '#1e2c3c',
                      borderRadius: 8,
                      fontSize: 11
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="green"
                    stroke="#00e676"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volGreen)"
                  />
                  <Area
                    type="monotone"
                    dataKey="cyan"
                    stroke="#00f2fe"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volCyan)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Subheader: Ticket Status Donut */}
            <div className="chart-section-label" style={{ marginTop: 24 }}>Ticket Status</div>

            <div className="donut-chart-container">
              <div className="donut-center-legend">
                <div className="donut-legend-item left">
                  <span className="legend-label">In Progress</span>
                  <strong className="legend-val text-cyan">45%</strong>
                </div>

                <div className="donut-render-box">
                  <ResponsiveContainer width={130} height={130}>
                    <PieChart>
                      <Pie
                        data={statusDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={58}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="donut-legend-item right">
                  <span className="legend-label">Resolved</span>
                  <strong className="legend-val text-lime">55%</strong>
                </div>
              </div>

              {/* Carousel dots below */}
              <div className="carousel-dots-row">
                <span className="dot active" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Credits */}
      <footer className="mockup-footer">
        <span>Developed by <strong>Shreya Golder</strong> · University Campus Operations Intelligence</span>
      </footer>
    </div>
  );
}
