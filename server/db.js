const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'campus-pulse.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      student_id TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student', -- 'student', 'staff', 'admin'
      department TEXT DEFAULT 'Department of CSE',
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'campus_issue', -- 'campus_issue', 'student_objection', 'petition'
      category TEXT DEFAULT 'General', -- 'Academic', 'Facilities', 'Transport', 'Cafeteria', 'IT & Labs', 'Hostel', 'Disciplinary', 'Lost & Found'
      department TEXT DEFAULT 'General Operations',
      location TEXT NOT NULL,
      lat REAL DEFAULT 23.8767,
      lng REAL DEFAULT 90.3204,
      map_x REAL DEFAULT 50,
      map_y REAL DEFAULT 50,
      priority TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
      status TEXT DEFAULT 'Reported', -- 'Reported', 'Triaged', 'Under Investigation', 'Hearing Scheduled', 'Resolved', 'Appealed'
      is_anonymous INTEGER DEFAULT 0,
      reporter_name TEXT DEFAULT 'Student',
      reporter_id TEXT DEFAULT '251-15-467',
      assignee_name TEXT DEFAULT 'Unassigned',
      sla_hours INTEGER DEFAULT 48,
      upvotes INTEGER DEFAULT 0,
      official_verdict TEXT,
      evidence_url TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS objection_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      UNIQUE(issue_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS issue_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT DEFAULT 'Staff',
      status TEXT NOT NULL,
      note TEXT NOT NULL,
      is_internal INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Migration check: add evidence_url to issues if missing
  try {
    const cols = db.prepare('PRAGMA table_info(issues)').all().map(c => c.name);
    if (!cols.includes('evidence_url')) {
      db.exec('ALTER TABLE issues ADD COLUMN evidence_url TEXT');
    }
  } catch (err) {
    // Column may already exist
  }

  // Seed default users if empty
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount === 0) {
    seedUsers();
  }

  // Seed sample issues if empty
  const issueCount = db.prepare('SELECT COUNT(*) as c FROM issues').get().c;
  if (issueCount === 0) {
    seedIssues();
  }
}

function seedUsers() {
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, student_id, password_hash, role, department, avatar)
    VALUES (@name, @email, @student_id, @password_hash, @role, @department, @avatar)
  `);

  const users = [
    {
      name: 'Shreya Golder',
      email: 'student@diu.edu.bd',
      student_id: '251-15-467',
      password_hash: bcrypt.hashSync('password123', 10),
      role: 'student',
      department: 'Department of CSE',
      avatar: 'SG'
    },
    {
      name: 'Engr. M. Rafiq',
      email: 'admin@diu.edu.bd',
      student_id: 'OPS-LEAD-01',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      department: 'Campus Operations & Proctorial Board',
      avatar: 'MR'
    },
    {
      name: 'Dr. M. Rahman',
      email: 'faculty@diu.edu.bd',
      student_id: 'FAC-CSE-102',
      password_hash: bcrypt.hashSync('faculty123', 10),
      role: 'staff',
      department: 'Department of CSE & Exam Committee',
      avatar: 'DR'
    }
  ];

  for (const u of users) {
    insertUser.run(u);
  }
}

function seedIssues() {
  const insertIssue = db.prepare(`
    INSERT INTO issues (
      title, description, type, category, department, location, map_x, map_y,
      priority, status, is_anonymous, reporter_name, reporter_id, assignee_name,
      sla_hours, upvotes, official_verdict, evidence_url, created_at, updated_at
    ) VALUES (
      @title, @description, @type, @category, @department, @location, @map_x, @map_y,
      @priority, @status, @is_anonymous, @reporter_name, @reporter_id, @assignee_name,
      @sla_hours, @upvotes, @official_verdict, @evidence_url, @created_at, @updated_at
    )
  `);

  const insertUpdate = db.prepare(`
    INSERT INTO issue_updates (issue_id, author_name, author_role, status, note, is_internal, created_at)
    VALUES (@issue_id, @author_name, @author_role, @status, @note, @is_internal, @created_at)
  `);

  const insertNotification = db.prepare(`
    INSERT INTO notifications (issue_id, title, message, type, is_read, created_at)
    VALUES (@issue_id, @title, @message, @type, @is_read, @created_at)
  `);

  const sampleIssues = [
    {
      title: 'Student Objection: Unfair Attendance Fine for CSE311 (Portal Server Crash)',
      description: 'During the mid-term submission deadline on Sunday 11:50 PM, the university portal threw 502 Bad Gateway. 45 students were marked absent or penalized unfairly with attendance fines. We demand immediate fine revocation and review.',
      type: 'student_objection',
      category: 'Academic',
      department: 'Department of CSE & Exam Committee',
      location: 'Academic Building Room 402',
      map_x: 32,
      map_y: 28,
      priority: 'Critical',
      status: 'Under Investigation',
      is_anonymous: 0,
      reporter_name: 'Shreya Golder (CR)',
      reporter_id: '251-15-467',
      assignee_name: 'Dr. M. Rahman (Head of CSE)',
      sla_hours: 24,
      upvotes: 68,
      official_verdict: null,
      evidence_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
      created_at: '2026-09-02 10:15:00',
      updated_at: '2026-09-03 11:30:00',
      updates: [
        { author_name: 'System', author_role: 'System', status: 'Reported', note: 'Formal student objection received and verified by Class Representative.', is_internal: 0, created_at: '2026-09-02 10:15:00' },
        { author_name: 'Dean Office', author_role: 'Admin', status: 'Triaged', note: 'Objection forwarded with high priority to Department Exam Controller.', is_internal: 0, created_at: '2026-09-02 14:00:00' },
        { author_name: 'IT Ops Team', author_role: 'Staff', status: 'Under Investigation', note: 'Server logs confirm a 23-minute nginx timeout between 11:42 PM - 12:05 AM. Audit in progress.', is_internal: 0, created_at: '2026-09-03 11:30:00' }
      ]
    },
    {
      title: 'Campus Petition: Introduce 7:30 AM & 8:15 AM Shuttle Route from Mirpur 10',
      description: 'Current 8:00 AM bus gets overcrowded and students from Mirpur, Kazipara and Agargaon cannot board, resulting in missed first-period labs. We request two staggered morning shuttles.',
      type: 'petition',
      category: 'Transport',
      department: 'Transport Department',
      location: 'Transport Terminal / Gate B',
      map_x: 68,
      map_y: 64,
      priority: 'High',
      status: 'Hearing Scheduled',
      is_anonymous: 0,
      reporter_name: 'Student Welfare Committee',
      reporter_id: '243-15-112',
      assignee_name: 'Mr. Kabir (Transport Officer)',
      sla_hours: 48,
      upvotes: 142,
      official_verdict: 'Transport board meeting scheduled for Sunday 11:00 AM to allocate 2 additional AC buses.',
      evidence_url: null,
      created_at: '2026-08-30 09:00:00',
      updated_at: '2026-09-03 14:20:00',
      updates: [
        { author_name: 'System', author_role: 'System', status: 'Reported', note: 'Petition reached threshold (>100 signatures). Escalated to Director.', is_internal: 0, created_at: '2026-09-01 16:20:00' },
        { author_name: 'Transport Directorate', author_role: 'Staff', status: 'Hearing Scheduled', note: 'Delegation meeting with student representatives arranged.', is_internal: 0, created_at: '2026-09-03 14:20:00' }
      ]
    },
    {
      title: 'Formal Objection: High Prices and Lack of Fresh Food in 4th Floor Cafeteria',
      description: 'Cafeteria vendors have increased meal prices by 35% without student committee consent, and recent food inspections showed improper refrigeration of dairy products.',
      type: 'student_objection',
      category: 'Cafeteria',
      department: 'Campus Facilities & Food Safety Board',
      location: 'Main Cafeteria (Level 4)',
      map_x: 45,
      map_y: 72,
      priority: 'High',
      status: 'Triaged',
      is_anonymous: 1,
      reporter_name: 'Anonymous Student',
      reporter_id: 'ANON-781',
      assignee_name: 'Hygiene & Commercial Inspector',
      sla_hours: 36,
      upvotes: 94,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-03 08:30:00',
      updated_at: '2026-09-03 12:00:00',
      updates: [
        { author_name: 'Student Desk', author_role: 'Student', status: 'Reported', note: 'Anonymous complaint filed with photographic evidence.', is_internal: 0, created_at: '2026-09-03 08:30:00' },
        { author_name: 'Facility Supervisor', author_role: 'Staff', status: 'Triaged', note: 'Vendor issued show-cause notice regarding price capping.', is_internal: 0, created_at: '2026-09-03 12:00:00' }
      ]
    },
    {
      title: 'Wi-Fi Outage — Central Library 2nd & 3rd Floor Quiet Study Zones',
      description: 'SSID Campus-Student connects but DNS resolution fails. Students working on IEEE research papers unable to access scholarly repositories.',
      type: 'campus_issue',
      category: 'IT & Labs',
      department: 'Campus IT Infrastructure',
      location: 'Central Library',
      map_x: 58,
      map_y: 22,
      priority: 'High',
      status: 'Under Investigation',
      is_anonymous: 0,
      reporter_name: 'Tanvir Hossain',
      reporter_id: '241-20-890',
      assignee_name: 'Network Operations Center (NOC)',
      sla_hours: 12,
      upvotes: 29,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-03 13:10:00',
      updated_at: '2026-09-03 14:00:00',
      updates: [
        { author_name: 'NOC Admin', author_role: 'Staff', status: 'Under Investigation', note: 'Cisco Core Switch PoE overload detected on rack 3B. Technicians dispatched.', is_internal: 0, created_at: '2026-09-03 14:00:00' }
      ]
    },
    {
      title: 'Overhead Projector Lamp Blown & HDMI Port Broken — Room AB-501',
      description: 'Projector blinks yellow lamp failure indicator. Classes had to be shifted or conducted without visual aids.',
      type: 'campus_issue',
      category: 'Facilities',
      department: 'AV & Classroom Support',
      location: 'Academic Building 5th Floor',
      map_x: 24,
      map_y: 42,
      priority: 'Medium',
      status: 'Reported',
      is_anonymous: 0,
      reporter_name: 'Faculty Assistant',
      reporter_id: 'FAC-209',
      assignee_name: 'Classroom Support',
      sla_hours: 24,
      upvotes: 11,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-03 15:40:00',
      updated_at: '2026-09-03 15:40:00',
      updates: [
        { author_name: 'System', author_role: 'System', status: 'Reported', note: 'Automated ticket dispatched to engineering support.', is_internal: 0, created_at: '2026-09-03 15:40:00' }
      ]
    },
    {
      title: 'Water Cooler Dispenser Leakage causing slippery hazard',
      description: 'Fresh drinking water cooler near Room 204 was leaking. Fixed with new valve seal and floor dried.',
      type: 'campus_issue',
      category: 'Facilities',
      department: 'Sanitation & Maintenance',
      location: 'Engineering Building L-2',
      map_x: 76,
      map_y: 38,
      priority: 'Low',
      status: 'Resolved',
      is_anonymous: 0,
      reporter_name: 'Campus Guard',
      reporter_id: 'SEC-019',
      assignee_name: 'Plumbing Team',
      sla_hours: 48,
      upvotes: 5,
      official_verdict: 'Faulty intake valve replaced and inspected by estate supervisor.',
      evidence_url: null,
      created_at: '2026-09-01 11:00:00',
      updated_at: '2026-09-02 16:30:00',
      updates: [
        { author_name: 'Plumbing Lead', author_role: 'Staff', status: 'Resolved', note: 'Valve replaced. Work verified and signed off.', is_internal: 0, created_at: '2026-09-02 16:30:00' }
      ]
    }
  ];

  const insertTx = db.transaction(() => {
    for (const item of sampleIssues) {
      const { updates, ...issueData } = item;
      const res = insertIssue.run(issueData);
      const issueId = res.lastInsertRowid;

      if (updates && updates.length > 0) {
        for (const u of updates) {
          insertUpdate.run({ ...u, issue_id: issueId });
        }
      }

      if (item.type === 'student_objection' && item.upvotes > 50) {
        db.prepare('INSERT OR IGNORE INTO objection_votes (issue_id, user_id) VALUES (?, ?)').run(issueId, '251-15-467');
      }
    }

    insertNotification.run({
      issue_id: 1,
      title: 'Critical Objection Update',
      message: 'IT Ops Team confirmed server log downtime for CSE311 attendance objection.',
      type: 'urgent',
      is_read: 0,
      created_at: '2026-09-03 11:30:00'
    });
    insertNotification.run({
      issue_id: 2,
      title: 'Petition Threshold Reached',
      message: 'Mirpur shuttle bus petition reached 140+ signatures. Hearing scheduled.',
      type: 'success',
      is_read: 0,
      created_at: '2026-09-03 14:20:00'
    });
  });

  insertTx();
}

initDb();

module.exports = db;
