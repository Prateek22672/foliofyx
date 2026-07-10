// client/src/api/domainAPI.js
// Custom-domain (DNS) connection for published custom websites.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${BASE}/api/domains`;

function getHeaders() {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Request failed (HTTP ${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * Connect a domain to a published site.
 * @returns {Promise<{domain:string, status:string, records:Array<{type,host,value,purpose}>, note:string}>}
 */
export async function connectDomain(siteId, domain) {
  const res = await fetch(`${API}/${siteId}/connect`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ domain }),
  });
  return handle(res);
}

/**
 * Re-check DNS records for the connected domain.
 * @returns {Promise<{status:"pending"|"verified"|"live", checks:Object, records:Array, message:string}>}
 */
export async function verifyDomain(siteId) {
  const res = await fetch(`${API}/${siteId}/verify`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handle(res);
}

/**
 * Current domain connection state for a site.
 * @returns {Promise<{domain:string|null, status:string|null, records:Array, lastCheckedAt:string|null}>}
 */
export async function getDomainStatus(siteId) {
  const res = await fetch(`${API}/${siteId}/status`, { headers: getHeaders() });
  return handle(res);
}

/** Remove the domain connection from a site. */
export async function disconnectDomain(siteId) {
  const res = await fetch(`${API}/${siteId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handle(res);
}
