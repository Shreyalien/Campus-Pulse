const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// Realtime connection handler
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  const issueCount = db.prepare('SELECT COUNT(*) as c FROM issues').get().c;
  const objectionCount = db.prepare("SELECT COUNT(*) as c FROM issues WHERE type IN ('student_objection', 'petition')").get().c;
  res.json({
    ok: true,
    service: 'Campus Pulse Enterprise API',
    total_records: issueCount,
    objection_records: objectionCount,
    timestamp: new Date().toISOString()
  });
});

// GET Issues & Objections with rich multi-filter
app.get('/api/issues', (req, res) => {
  try {
    const { type, category, status, priority, search, department } = req.query;
    let sql = 'SELECT * FROM issues WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (priority && priority !== 'all') {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (department && department !== 'all') {
      sql += ' AND department LIKE ?';
      params.push(`%${department}%`);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const issues = db.prepare(sql).all(...params);

    // Fetch user votes for current session
    const currentUserId = req.headers['x-user-id'] || '251-15-467';
    const userVotes = new Set(
      db.prepare('SELECT issue_id FROM objection_votes WHERE user_id = ?').all(currentUserId).map(r => r.issue_id)
    );

    const enriched = issues.map(item => ({
      ...item,
      has_voted: userVotes.has(item.id)
    }));

    res.json(enriched);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// GET single issue with updates timeline
app.get('/api/issues/:id', (req, res) => {
  try {
    const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(req.params.id);
    if (!issue) return res.status(404).json({ error: 'Issue not found' });

    const updates = db.prepare('SELECT * FROM issue_updates WHERE issue_id = ? ORDER BY id ASC').all(req.params.id);
    const currentUserId = req.headers['x-user-id'] || '251-15-467';
    const hasVoted = !!db.prepare('SELECT 1 FROM objection_votes WHERE issue_id = ? AND user_id = ?').get(req.params.id, currentUserId);

    res.json({
      ...issue,
      has_voted: hasVoted,
      updates
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch issue details' });
  }
});

// POST new issue or student objection
app.post('/api/issues', (req, res) => {
  try {
    const {
      title,
      description = '',
      type = 'campus_issue', // 'campus_issue', 'student_objection', 'petition'
      category = 'Academic',
      department = 'General Operations',
      location = '',
      map_x = Math.floor(Math.random() * 60 + 20),
      map_y = Math.floor(Math.random() * 60 + 20),
      priority = 'Medium',
      is_anonymous = 0,
      reporter_name = 'Student',
      reporter_id = '251-15-467',
      sla_hours = priority === 'Critical' ? 24 : priority === 'High' ? 36 : 48
    } = req.body;

    if (!title || !location) {
      return res.status(400).json({ error: 'Title and location are required' });
    }

    const displayName = is_anonymous ? 'Anonymous Student' : (reporter_name || 'Student Reporter');
    const displayId = is_anonymous ? 'ANON-' + Math.floor(100 + Math.random() * 900) : reporter_id;

    const stmt = db.prepare(`
      INSERT INTO issues (
        title, description, type, category, department, location, map_x, map_y,
        priority, status, is_anonymous, reporter_name, reporter_id, assignee_name,
        sla_hours, upvotes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Reported', ?, ?, ?, 'Unassigned', ?, 1)
    `);

    const result = stmt.run(
      title, description, type, category, department, location, map_x, map_y,
      priority, is_anonymous ? 1 : 0, displayName, displayId, sla_hours
    );

    const issueId = result.lastInsertRowid;

    // Initial timeline entry
    db.prepare(`
      INSERT INTO issue_updates (issue_id, author_name, author_role, status, note)
      VALUES (?, ?, ?, 'Reported', ?)
    `).run(
      issueId,
      displayName,
      type === 'student_objection' ? 'Student CR' : 'Reporter',
      type === 'student_objection' ? 'Formal Student Objection logged and submitted for administrative triage.' : 'New campus issue report submitted.'
    );

    // Automatic self-vote
    db.prepare('INSERT OR IGNORE INTO objection_votes (issue_id, user_id) VALUES (?, ?)').run(issueId, reporter_id);

    // Create system notification
    db.prepare(`
      INSERT INTO notifications (issue_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `).run(
      issueId,
      type === 'student_objection' ? 'New Student Objection' : 'New Campus Issue',
      `"${title}" submitted for ${location}.`,
      priority === 'Critical' ? 'urgent' : 'info'
    );

    const newRecord = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    const updates = db.prepare('SELECT * FROM issue_updates WHERE issue_id = ?').all(issueId);

    const fullIssue = { ...newRecord, has_voted: true, updates };

    // Realtime broadcast
    io.emit('issue:new', fullIssue);
    io.emit('notification:new', {
      id: Date.now(),
      issue_id: issueId,
      title: type === 'student_objection' ? 'New Objection Filed' : 'New Report Filed',
      message: title,
      type: priority === 'Critical' ? 'urgent' : 'info',
      created_at: new Date().toLocaleTimeString()
    });

    res.status(201).json(fullIssue);
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// POST Vote/Support Student Objection or Petition
app.post('/api/issues/:id/vote', (req, res) => {
  try {
    const issueId = req.params.id;
    const userId = req.body.user_id || req.headers['x-user-id'] || '251-15-467';

    const existing = db.prepare('SELECT 1 FROM objection_votes WHERE issue_id = ? AND user_id = ?').get(issueId, userId);

    let hasVoted = false;
    if (existing) {
      // Remove vote
      db.prepare('DELETE FROM objection_votes WHERE issue_id = ? AND user_id = ?').run(issueId, userId);
      db.prepare('UPDATE issues SET upvotes = MAX(0, upvotes - 1) WHERE id = ?').run(issueId);
      hasVoted = false;
    } else {
      // Add vote
      db.prepare('INSERT INTO objection_votes (issue_id, user_id) VALUES (?, ?)').run(issueId, userId);
      db.prepare('UPDATE issues SET upvotes = upvotes + 1 WHERE id = ?').run(issueId);
      hasVoted = true;
    }

    const updatedIssue = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    io.emit('objection:voted', {
      issue_id: Number(issueId),
      upvotes: updatedIssue.upvotes
    });

    res.json({
      success: true,
      has_voted: hasVoted,
      upvotes: updatedIssue.upvotes
    });
  } catch (err) {
    console.error('Error handling vote:', err);
    res.status(500).json({ error: 'Vote processing failed' });
  }
});

// POST Student Appeal for an objection resolution
app.post('/api/issues/:id/appeal', (req, res) => {
  try {
    const issueId = req.params.id;
    const { appeal_reason, student_name = 'Student' } = req.body;

    if (!appeal_reason) {
      return res.status(400).json({ error: 'Appeal reason is required' });
    }

    db.prepare(`
      UPDATE issues
      SET status = 'Appealed', updated_at = (datetime('now', 'localtime'))
      WHERE id = ?
    `).run(issueId);

    db.prepare(`
      INSERT INTO issue_updates (issue_id, author_name, author_role, status, note)
      VALUES (?, ?, 'Student', 'Appealed', ?)
    `).run(issueId, student_name, `Resolution Appeal: ${appeal_reason}`);

    const updatedIssue = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    const updates = db.prepare('SELECT * FROM issue_updates WHERE issue_id = ?').all(issueId);
    const fullIssue = { ...updatedIssue, updates };

    io.emit('issue:updated', fullIssue);
    io.emit('notification:new', {
      id: Date.now(),
      issue_id: Number(issueId),
      title: 'Resolution Appealed',
      message: `Student filed an appeal on objection #${issueId}.`,
      type: 'warning',
      created_at: new Date().toLocaleTimeString()
    });

    res.json(fullIssue);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit appeal' });
  }
});

// PATCH update status, assignee, priority, resolution verdict
app.patch('/api/issues/:id', (req, res) => {
  try {
    const issueId = req.params.id;
    const { status, assignee_name, priority, official_verdict, department, update_note, author_name = 'Ops Staff' } = req.body;

    const current = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    if (!current) return res.status(404).json({ error: 'Issue not found' });

    let resolvedAt = current.resolved_at;
    if (status === 'Resolved' && !resolvedAt) {
      resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    db.prepare(`
      UPDATE issues
      SET status = COALESCE(?, status),
          assignee_name = COALESCE(?, assignee_name),
          priority = COALESCE(?, priority),
          official_verdict = COALESCE(?, official_verdict),
          department = COALESCE(?, department),
          resolved_at = ?,
          updated_at = (datetime('now', 'localtime'))
      WHERE id = ?
    `).run(
      status || null,
      assignee_name || null,
      priority || null,
      official_verdict || null,
      department || null,
      resolvedAt,
      issueId
    );

    if (update_note || status) {
      db.prepare(`
        INSERT INTO issue_updates (issue_id, author_name, author_role, status, note)
        VALUES (?, ?, 'Operations Admin', ?, ?)
      `).run(
        issueId,
        author_name,
        status || current.status,
        update_note || (official_verdict ? `Verdict Published: ${official_verdict}` : `Status updated to ${status}`)
      );
    }

    const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(issueId);
    const updates = db.prepare('SELECT * FROM issue_updates WHERE issue_id = ? ORDER BY id ASC').all(issueId);
    const fullIssue = { ...updated, updates };

    io.emit('issue:updated', fullIssue);
    io.emit('notification:new', {
      id: Date.now(),
      issue_id: Number(issueId),
      title: `Issue #${issueId} Status Changed`,
      message: `Now marked as "${status || current.status}".`,
      type: status === 'Resolved' ? 'success' : 'info',
      created_at: new Date().toLocaleTimeString()
    });

    res.json(fullIssue);
  } catch (err) {
    console.error('Error updating issue:', err);
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

// Notifications
app.get('/api/notifications', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM notifications ORDER BY id DESC LIMIT 20').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/mark-read', (req, res) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1').run();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// Analytics Summary
app.get('/api/analytics/summary', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as c FROM issues').get().c;
    const active = db.prepare("SELECT COUNT(*) as c FROM issues WHERE status != 'Resolved'").get().c;
    const resolved = db.prepare("SELECT COUNT(*) as c FROM issues WHERE status = 'Resolved'").get().c;
    const objections = db.prepare("SELECT COUNT(*) as c FROM issues WHERE type = 'student_objection'").get().c;
    const petitions = db.prepare("SELECT COUNT(*) as c FROM issues WHERE type = 'petition'").get().c;
    const totalVotes = db.prepare("SELECT SUM(upvotes) as s FROM issues WHERE type IN ('student_objection', 'petition')").get().s || 0;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      total_reports: total,
      active_issues: active,
      resolved_issues: resolved,
      student_objections: objections,
      active_petitions: petitions,
      total_student_endorsements: totalVotes,
      avg_response_time: '18m',
      resolution_rate: `${resolutionRate}%`,
      system_health: '99.4%'
    });
  } catch (err) {
    res.status(500).json({ error: 'Analytics error' });
  }
});

// Analytics 7-day Trend
app.get('/api/analytics/trends', (req, res) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [
    { d: 'Mon', reports: 8, objections: 3 },
    { d: 'Tue', reports: 12, objections: 5 },
    { d: 'Wed', reports: 10, objections: 4 },
    { d: 'Thu', reports: 16, objections: 9 },
    { d: 'Fri', reports: 14, objections: 6 },
    { d: 'Sat', reports: 7, objections: 2 },
    { d: 'Sun', reports: 11, objections: 4 }
  ];
  res.json(data);
});

// Analytics Categories Breakdown
app.get('/api/analytics/categories', (req, res) => {
  try {
    const cats = db.prepare(`
      SELECT category as n, COUNT(*) as v
      FROM issues
      GROUP BY category
      ORDER BY v DESC
    `).all();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: 'Category analytics error' });
  }
});

// Analytics Department SLA & Objections
app.get('/api/analytics/departments', (req, res) => {
  try {
    const depts = db.prepare(`
      SELECT department,
             COUNT(*) as total,
             SUM(CASE WHEN type = 'student_objection' THEN 1 ELSE 0 END) as objections,
             SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
      FROM issues
      GROUP BY department
      ORDER BY total DESC
    `).all();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: 'Department analytics error' });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Campus Pulse] Server running on http://localhost:${PORT}`);
});
