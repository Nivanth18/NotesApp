// Central place for all API calls.
// This avoids duplicating fetch logic in every component.
const BASE = process.env.NEXT_PUBLIC_API_URL;

// Helper: get the stored JWT token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper: build headers for authenticated requests
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// ── Auth API ────────────────────────────────────────────────
export const authAPI = {
  register: (data) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ── Notes API ───────────────────────────────────────────────
export const notesAPI = {
  getAll: () =>
    fetch(`${BASE}/notes`, { headers: authHeaders() })
      .then((r) => r.json()),

  create: (data) =>
    fetch(`${BASE}/notes`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (id, data) =>
    fetch(`${BASE}/notes/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (id) =>
    fetch(`${BASE}/notes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then((r) => r.json()),
};