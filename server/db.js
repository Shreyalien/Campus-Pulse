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
      ticket_code TEXT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'campus_issue', -- 'campus_issue', 'student_objection', 'petition'
      category TEXT DEFAULT 'General', -- 'Academic', 'Facilities', 'Transport', 'Cafeteria', 'IT & Labs', 'Hostel', 'Disciplinary', 'Lost & Found'
      department TEXT DEFAULT 'General Operations',
      location TEXT NOT NULL,
      building TEXT DEFAULT 'Central Campus',
      lat REAL DEFAULT 23.8767,
      lng REAL DEFAULT 90.3204,
      map_x REAL DEFAULT 50,
      map_y REAL DEFAULT 50,
      priority TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'Critical'
      status TEXT DEFAULT 'Reported', -- 'Reported', 'Triaged', 'Under Investigation', 'Hearing Scheduled', 'Resolved', 'Appealed'
      is_anonymous INTEGER DEFAULT 0,
      reporter_name TEXT DEFAULT 'Student',
      reporter_id TEXT DEFAULT 'STU-2041',
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

  // Migration check: add ticket_code, building, evidence_url to issues if missing
  try {
    const cols = db.prepare('PRAGMA table_info(issues)').all().map(c => c.name);
    if (!cols.includes('ticket_code')) {
      db.exec('ALTER TABLE issues ADD COLUMN ticket_code TEXT');
    }
    if (!cols.includes('building')) {
      db.exec('ALTER TABLE issues ADD COLUMN building TEXT DEFAULT "Central Campus"');
    }
    if (!cols.includes('evidence_url')) {
      db.exec('ALTER TABLE issues ADD COLUMN evidence_url TEXT');
    }
  } catch (err) {
    // Columns may already exist
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
      name: 'Tanvir Ahmed (CR)',
      email: 'student@campus.edu',
      student_id: 'STU-2041',
      password_hash: bcrypt.hashSync('password123', 10),
      role: 'student',
      department: 'Department of CSE',
      avatar: 'TA'
    },
    {
      name: 'Engr. M. Rafiq',
      email: 'admin@campus.edu',
      student_id: 'OPS-LEAD-01',
      password_hash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      department: 'Campus Operations & Proctorial Board',
      avatar: 'MR'
    },
    {
      name: 'Dr. M. Rahman',
      email: 'faculty@campus.edu',
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
      ticket_code, title, description, type, category, department, location, building,
      map_x, map_y, priority, status, is_anonymous, reporter_name, reporter_id, assignee_name,
      sla_hours, upvotes, official_verdict, evidence_url, created_at, updated_at
    ) VALUES (
      @ticket_code, @title, @description, @type, @category, @department, @location, @building,
      @map_x, @map_y, @priority, @status, @is_anonymous, @reporter_name, @reporter_id, @assignee_name,
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
      ticket_code: 'CP2485',
      title: 'Dorm A Facility Issue — Elevator Hydraulic Vibration',
      description: 'Elevator in Dorm A building B wing produces severe shuddering between 3rd and 5th floor. Safety interlock inspected. Immediate technician check required.',
      type: 'campus_issue',
      category: 'Facilities',
      department: 'Estate Maintenance & Dormitory Support',
      location: 'Dorm A, Wing B',
      building: 'Dorms',
      map_x: 28,
      map_y: 48,
      priority: 'High',
      status: 'Reported',
      is_anonymous: 0,
      reporter_name: 'Tanvir Ahmed (CR)',
      reporter_id: 'STU-2041',
      assignee_name: 'Unassigned',
      sla_hours: 24,
      upvotes: 24,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-04 14:32:00',
      updated_at: '2026-09-04 14:32:00',
      updates: [
        { author_name: 'Campus Guard Desk', author_role: 'Reporter', status: 'Reported', note: 'Issue logged via campus mobile terminal. Triage in progress.', is_internal: 0, created_at: '2026-09-04 14:32:00' }
      ]
    },
    {
      ticket_code: 'CP2484',
      title: 'Library WiFi Down — 2nd Floor Silent Study Section',
      description: 'Access Point AP-LIB-04 DNS resolution failing. 60+ students unable to access IEEE scholarly papers and midterm study materials.',
      type: 'campus_issue',
      category: 'IT & Labs',
      department: 'Campus IT Infrastructure & NOC',
      location: 'Central Library, 2nd Floor',
      building: 'Library',
      map_x: 52,
      map_y: 28,
      priority: 'Medium',
      status: 'Under Investigation',
      is_anonymous: 0,
      reporter_name: 'Tanvir Ahmed (CR)',
      reporter_id: 'STU-2041',
      assignee_name: 'Engr. M. Rafiq (NOC Lead)',
      sla_hours: 36,
      upvotes: 42,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-04 14:23:00',
      updated_at: '2026-09-04 14:25:00',
      updates: [
        { author_name: 'Student Helpdesk', author_role: 'Student', status: 'Reported', note: 'Multiple student complaints logged regarding Wi-Fi SSID connectivity.', is_internal: 0, created_at: '2026-09-04 14:23:00' },
        { author_name: 'NOC Lead', author_role: 'Admin', status: 'Under Investigation', note: 'PoE Switch cycle in progress. Field technician dispatched.', is_internal: 0, created_at: '2026-09-04 14:25:00' }
      ]
    },
    {
      ticket_code: 'CP2483',
      title: 'Parking Ticket Dispute & Shuttle Access Fee',
      description: 'Automated barrier system erroneously billed monthly pass holders for student parking. Accounts verified and automated refunds queued.',
      type: 'student_objection',
      category: 'Transport',
      department: 'Transport Department',
      location: 'Transport Gate B',
      building: 'Admin',
      map_x: 74,
      map_y: 65,
      priority: 'Low',
      status: 'Resolved',
      is_anonymous: 0,
      reporter_name: 'Student Union Rep',
      reporter_id: 'STU-1099',
      assignee_name: 'Mr. Kabir (Transport Officer)',
      sla_hours: 48,
      upvotes: 18,
      official_verdict: 'All 14 erroneous fines revoked. Automated RFID gate firmware updated.',
      evidence_url: null,
      created_at: '2026-09-04 13:59:00',
      updated_at: '2026-09-04 14:30:00',
      updates: [
        { author_name: 'Student Desk', author_role: 'Student', status: 'Reported', note: 'Dispute submitted with gate CCTV reference.', is_internal: 0, created_at: '2026-09-04 13:59:00' },
        { author_name: 'Transport Directorate', author_role: 'Staff', status: 'Resolved', note: 'Refund transaction batch processed.', is_internal: 0, created_at: '2026-09-04 14:30:00' }
      ]
    },
    {
      ticket_code: 'CP2482',
      title: 'Student Objection: Attendance Fine for CSE311 (Portal Crash)',
      description: 'During the mid-term submission deadline on Sunday 11:50 PM, the university portal threw 502 Bad Gateway. 45 students were penalized unfairly. Immediate revocation requested.',
      type: 'student_objection',
      category: 'Academic',
      department: 'Department of CSE & Exam Committee',
      location: 'Academic Admin Building Room 402',
      building: 'Admin',
      map_x: 62,
      map_y: 72,
      priority: 'Critical',
      status: 'Under Investigation',
      is_anonymous: 0,
      reporter_name: 'Tanvir Ahmed (CR)',
      reporter_id: 'STU-2041',
      assignee_name: 'Dr. M. Rahman (Head of CSE)',
      sla_hours: 24,
      upvotes: 68,
      official_verdict: null,
      evidence_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
      created_at: '2026-09-04 10:15:00',
      updated_at: '2026-09-04 11:30:00',
      updates: [
        { author_name: 'System', author_role: 'System', status: 'Reported', note: 'Formal student objection received and verified by Class Representative.', is_internal: 0, created_at: '2026-09-04 10:15:00' },
        { author_name: 'Dean Office', author_role: 'Admin', status: 'Triaged', note: 'Objection forwarded with high priority to Department Exam Controller.', is_internal: 0, created_at: '2026-09-04 11:00:00' },
        { author_name: 'IT Ops Team', author_role: 'Staff', status: 'Under Investigation', note: 'Server logs confirm a 23-minute nginx timeout. Investigation report in review.', is_internal: 0, created_at: '2026-09-04 11:30:00' }
      ]
    },
    {
      ticket_code: 'CP2481',
      title: 'Campus Petition: Introduce 7:30 AM & 8:15 AM Shuttle Route from Mirpur',
      description: 'Overcrowded morning buses result in missed 8:30 AM classes for 150+ students. We request two staggered morning shuttles.',
      type: 'petition',
      category: 'Transport',
      department: 'Transport Department',
      location: 'Student Union Building',
      building: 'Union',
      map_x: 48,
      map_y: 52,
      priority: 'High',
      status: 'Hearing Scheduled',
      is_anonymous: 0,
      reporter_name: 'Student Welfare Committee',
      reporter_id: 'STU-5510',
      assignee_name: 'Transport Officer',
      sla_hours: 48,
      upvotes: 142,
      official_verdict: 'Transport board meeting scheduled for Sunday 11:00 AM to allocate 2 additional buses.',
      evidence_url: null,
      created_at: '2026-09-03 09:00:00',
      updated_at: '2026-09-04 12:20:00',
      updates: [
        { author_name: 'System', author_role: 'System', status: 'Reported', note: 'Petition reached threshold (>100 signatures). Escalated to Director.', is_internal: 0, created_at: '2026-09-03 09:00:00' },
        { author_name: 'Transport Directorate', author_role: 'Staff', status: 'Hearing Scheduled', note: 'Delegation meeting arranged with student representatives.', is_internal: 0, created_at: '2026-09-04 12:20:00' }
      ]
    },
    {
      ticket_code: 'CP2480',
      title: 'Cafeteria Price Hike & Quality Review Request',
      description: 'Meal prices increased by 35% without student consultation. Student welfare committee demands price capping and inspection.',
      type: 'student_objection',
      category: 'Cafeteria',
      department: 'Campus Facilities & Food Safety Board',
      location: 'Central Cafeteria (Union Building)',
      building: 'Union',
      map_x: 46,
      map_y: 54,
      priority: 'High',
      status: 'Triaged',
      is_anonymous: 1,
      reporter_name: 'Anonymous Student',
      reporter_id: 'ANON-781',
      assignee_name: 'Food Inspector',
      sla_hours: 36,
      upvotes: 94,
      official_verdict: null,
      evidence_url: null,
      created_at: '2026-09-04 08:30:00',
      updated_at: '2026-09-04 12:00:00',
      updates: [
        { author_name: 'Student Desk', author_role: 'Student', status: 'Reported', note: 'Anonymous complaint filed with photographic evidence.', is_internal: 0, created_at: '2026-09-04 08:30:00' }
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
        db.prepare('INSERT OR IGNORE INTO objection_votes (issue_id, user_id) VALUES (?, ?)').run(issueId, 'STU-2041');
      }
    }

    insertNotification.run({
      issue_id: 1,
      title: 'High Priority Alert',
      message: '#CP2485 - Dorm A Facility Issue requires immediate maintenance dispatch.',
      type: 'urgent',
      is_read: 0,
      created_at: '2026-09-04 14:32:00'
    });
    insertNotification.run({
      issue_id: 2,
      title: 'NOC Dispatch',
      message: '#CP2484 - Library WiFi Down under investigation by field team.',
      type: 'info',
      is_read: 0,
      created_at: '2026-09-04 14:25:00'
    });
  });

  insertTx();
}

initDb();

module.exports = db;
