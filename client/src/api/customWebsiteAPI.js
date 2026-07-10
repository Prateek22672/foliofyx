// client/src/api/customWebsiteAPI.js
// All API calls for the custom website builder.
// Uses your existing auth token from localStorage.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API  = `${BASE}/api/custom-websites`;

function getHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Create a new custom website ───────────────────────────────────────────────
export async function createCustomWebsite(payload = {}) {
  const res = await fetch(API, {
    method:  "POST",
    headers: getHeaders(),
    body:    JSON.stringify(payload),
  });
  return handle(res);
}

// ── Load one website by ID ────────────────────────────────────────────────────
export async function getCustomWebsite(id) {
  const res = await fetch(`${API}/${id}`, { headers: getHeaders() });
  return handle(res);
}

// ── List all websites for current user ───────────────────────────────────────
export async function getUserCustomWebsites() {
  const res = await fetch(API, { headers: getHeaders() });
  return handle(res);
}

// ── Save (auto-save) ──────────────────────────────────────────────────────────
export async function saveCustomWebsite(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method:  "PUT",
    headers: getHeaders(),
    body:    JSON.stringify(payload),
  });
  return handle(res);
}

// ── Publish ───────────────────────────────────────────────────────────────────
export async function publishCustomWebsite(id) {
  const res = await fetch(`${API}/${id}/publish`, {
    method:  "POST",
    headers: getHeaders(),
  });
  return handle(res);
}

// ── Unpublish ─────────────────────────────────────────────────────────────────
export async function unpublishCustomWebsite(id) {
  const res = await fetch(`${API}/${id}/unpublish`, {
    method:  "POST",
    headers: getHeaders(),
  });
  return handle(res);
}

// ── Delete ────────────────────────────────────────────────────────────────────
export async function deleteCustomWebsite(id) {
  const res = await fetch(`${API}/${id}`, {
    method:  "DELETE",
    headers: getHeaders(),
  });
  return handle(res);
}

// ── Duplicate ─────────────────────────────────────────────────────────────────
export async function duplicateCustomWebsite(id) {
  const res = await fetch(`${API}/${id}/duplicate`, {
    method:  "POST",
    headers: getHeaders(),
  });
  return handle(res);
}

// ── Log AI generation (fire & forget) ────────────────────────────────────────
export function logAiGeneration(id, { prompt, industry, elemCount }) {
  fetch(`${API}/${id}/ai-log`, {
    method:  "POST",
    headers: getHeaders(),
    body:    JSON.stringify({ prompt, industry, elemCount }),
  }).catch(() => {}); // silent fail — non-critical
}

// ── Public view (no auth) ─────────────────────────────────────────────────────
export async function getPublishedWebsite(slug) {
  const res = await fetch(`${API}/public/${slug}`);
  return handle(res);
}