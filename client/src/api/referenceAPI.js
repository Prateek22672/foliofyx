// client/src/api/referenceAPI.js
// Client for the "Design from Reference" backend (/api/reference).

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = `${BASE}/api/reference`;

function authHeader() {
  // Same key the rest of the app uses (see aiBuilderAPI.js / PortfolioContext).
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Analyze a reference and get back canvas-ready elements.
 * @param {Object} opts
 * @param {"text"|"image"|"url"|"html"} opts.mode
 * @param {File}   [opts.file]         screenshot (image mode)
 * @param {string} [opts.description]  brief (text mode, or extra context for image mode)
 * @param {string} [opts.url]          reference URL (url mode — Phase 2)
 * @returns {Promise<{industry,tokens,palette,sections,elements,count,personalized,model}>}
 */
export async function analyzeReference({ mode, file, description = "", url = "" }) {
  let res;
  if (file) {
    const fd = new FormData();
    fd.append("mode", mode || "image");
    fd.append("image", file);
    if (description) fd.append("description", description);
    res = await fetch(`${API}/analyze`, { method: "POST", headers: { ...authHeader() }, body: fd });
  } else {
    res = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ mode: mode || "text", description, url }),
    });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Reference analysis failed (HTTP ${res.status})`);
  return data;
}
