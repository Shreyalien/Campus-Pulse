const API_BASE = '/api';

export async function fetchIssues(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val && val !== 'all') query.append(key, val);
  });
  const res = await fetch(`${API_BASE}/issues?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function fetchIssueById(id) {
  const res = await fetch(`${API_BASE}/issues/${id}`);
  if (!res.ok) throw new Error('Failed to fetch issue details');
  return res.json();
}

export async function createIssue(data) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create report');
  return res.json();
}

export async function voteIssue(id, userId = '251-15-467') {
  const res = await fetch(`${API_BASE}/issues/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function appealIssue(id, appeal_reason, student_name = 'Student') {
  const res = await fetch(`${API_BASE}/issues/${id}/appeal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appeal_reason, student_name })
  });
  if (!res.ok) throw new Error('Failed to appeal');
  return res.json();
}

export async function updateIssue(id, data) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationsRead() {
  const res = await fetch(`${API_BASE}/notifications/mark-read`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to mark read');
  return res.json();
}

export async function fetchAnalyticsSummary() {
  const res = await fetch(`${API_BASE}/analytics/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function fetchAnalyticsTrends() {
  const res = await fetch(`${API_BASE}/analytics/trends`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}

export async function fetchAnalyticsCategories() {
  const res = await fetch(`${API_BASE}/analytics/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchAnalyticsDepartments() {
  const res = await fetch(`${API_BASE}/analytics/departments`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
}
