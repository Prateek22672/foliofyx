// client/src/api/aiBuilderAPI.js
// Calls our OWN backend for AI section generation.
// The Groq API key lives only on the server — never in this bundle.

const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://foliofyx-backend.onrender.com");
const API = `${BASE}/api/ai-builder`;

function getHeaders() {
  // The app stores the JWT under "accessToken" (see Login.jsx / PortfolioContext).
  // Fall back to "token" just in case an older session used that key.
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Generate a section from a natural-language prompt.
 * The server runs the industry-RAG pipeline + Groq and returns validated elements.
 * @param {string} prompt
 * @returns {Promise<{ industry: string, model: string, elements: Array, count: number }>}
 */
export async function generateSection(prompt) {
  const res = await fetch(`${API}/generate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `AI request failed (HTTP ${res.status})`);
  return data;
}
