const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('campus_pulse_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('campus_pulse_token', token);
  } else {
    localStorage.removeItem('campus_pulse_token');
  }
}

function getAuthHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ---------------- AUTH ----------------
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  setAuthToken(data.token);
  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  setAuthToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    setAuthToken(null);
    return null;
  }
  const data = await res.json();
  return data.user;
}

export async function fetchDemoAccounts() {
  const res = await fetch(`${API_BASE}/auth/demo-users`);
  if (!res.ok) throw new Error('Failed to fetch demo accounts');
  return res.json();
}

export function logoutUser() {
  setAuthToken(null);
}

// ---------------- ISSUES & OBJECTIONS ----------------
export async function fetchIssues(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val && val !== 'all') query.append(key, val);
  });
  const res = await fetch(`${API_BASE}/issues?${query.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function fetchIssueById(id) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch issue details');
  return res.json();
}

export async function createIssue(data) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create report');
  }
  return res.json();
}

export async function voteIssue(id, userId) {
  const res = await fetch(`${API_BASE}/issues/${id}/vote`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId })
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json();
}

export async function appealIssue(id, appeal_reason, student_name) {
  const res = await fetch(`${API_BASE}/issues/${id}/appeal`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ appeal_reason, student_name })
  });
  if (!res.ok) throw new Error('Failed to appeal');
  return res.json();
}

export async function updateIssue(id, data) {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationsRead() {
  const res = await fetch(`${API_BASE}/notifications/mark-read`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
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
