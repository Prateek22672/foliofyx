// client/src/api/referenceAPI.js
// Client for the "Design from Reference" backend (/api/reference).

const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://foliofyx-backend.onrender.com");
const API = `${BASE}/api/reference`;

// Analysis runs several AI calls; give it room but never hang forever.
const TIMEOUT_MS = 150_000;

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
 * @returns {Promise<{industry,tokens,palette,sections,elements,count,personalized,replicated,model}>}
 */
export async function analyzeReference({ mode, file, description = "", url = "" }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    if (file) {
      const fd = new FormData();
      fd.append("mode", mode || "image");
      fd.append("image", file);
      if (description) fd.append("description", description);
      res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { ...authHeader() },
        body: fd,
        signal: controller.signal,
      });
    } else {
      res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ mode: mode || "text", description, url }),
        signal: controller.signal,
      });
    }
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("The analysis took too long and was cancelled. Please try again.");
    }
    throw new Error("Could not reach the server. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
    if (res.status === 429) throw new Error(data.message || "Too many requests. Please wait a minute and try again.");
    throw new Error(data.message || `Reference analysis failed (HTTP ${res.status}).`);
  }
  return data;
}
