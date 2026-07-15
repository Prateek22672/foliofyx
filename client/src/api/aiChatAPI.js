// client/src/api/aiChatAPI.js
// Conversational AI website builder — talks to our OWN backend.
// The LLM keys live only on the server, never in this bundle.

const BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://foliofyx-backend.onrender.com");
const API = `${BASE}/api/ai-chat`;

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
 * Send the conversation to the AI chat builder.
 * @param {Object}  params
 * @param {Array<{role:"user"|"assistant", content:string}>} params.messages
 * @param {Object|null} params.site  Current site state ({ pages, activePage, industry }) or null.
 * @param {"create"|"edit"|"chat"} [params.mode]  Optional hint; server infers when omitted.
 * @returns {Promise<{intent:string, reply:string, elements?:Array, industry?:string, model?:string, personalized?:boolean, applied?:boolean, pageId?:string}>}
 */
export async function sendChatMessage({ messages, site = null, mode }) {
  const res = await fetch(`${API}/message`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ messages, site, ...(mode ? { mode } : {}) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `AI request failed (HTTP ${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
