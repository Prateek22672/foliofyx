// client/src/hooks/useAutoSave.js
// Debounced auto-save. Saves 3 seconds after last change.
// Shows save status: "saving..." → "saved" → idle

import { useEffect, useRef, useState, useCallback } from "react";
import { saveCustomWebsite } from "../api/customWebsiteAPI";

export const SAVE_STATUS = {
  IDLE:   "idle",
  SAVING: "saving",
  SAVED:  "saved",
  ERROR:  "error",
};

const DEBOUNCE_MS = 3000; // 3 seconds after last change

export function useAutoSave(siteId, data) {
  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.IDLE);
  const timerRef   = useRef(null);
  const prevDataRef = useRef(null);
  const isMounted  = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    // Don't save if no siteId or no data
    if (!siteId || !data) return;

    // Skip if data hasn't changed (shallow check on JSON)
    const serialized = JSON.stringify(data);
    if (serialized === prevDataRef.current) return;
    prevDataRef.current = serialized;

    // Clear existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Show "unsaved" indicator immediately
    setSaveStatus(SAVE_STATUS.SAVING);

    // Debounce the actual save
    timerRef.current = setTimeout(async () => {
      try {
        await saveCustomWebsite(siteId, data);
        if (isMounted.current) {
          setSaveStatus(SAVE_STATUS.SAVED);
          // Reset to idle after 2s
          setTimeout(() => {
            if (isMounted.current) setSaveStatus(SAVE_STATUS.IDLE);
          }, 2000);
        }
      } catch (err) {
        console.error("[AutoSave] failed:", err);
        if (isMounted.current) setSaveStatus(SAVE_STATUS.ERROR);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [siteId, data]);

  // Manual save trigger (e.g. Ctrl+S)
  const saveNow = useCallback(async () => {
    if (!siteId || !data) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus(SAVE_STATUS.SAVING);
    try {
      await saveCustomWebsite(siteId, data);
      prevDataRef.current = JSON.stringify(data);
      if (isMounted.current) {
        setSaveStatus(SAVE_STATUS.SAVED);
        setTimeout(() => {
          if (isMounted.current) setSaveStatus(SAVE_STATUS.IDLE);
        }, 2000);
      }
    } catch (err) {
      console.error("[AutoSave] saveNow failed:", err);
      if (isMounted.current) setSaveStatus(SAVE_STATUS.ERROR);
    }
  }, [siteId, data]);

  return { saveStatus, saveNow };
}

// ── SaveStatusBadge component ─────────────────────────────────────────────────
// Drop this anywhere in your editor header.
export function SaveStatusBadge({ status }) {
  const config = {
    [SAVE_STATUS.IDLE]:   { text: "",           color: "transparent",  dot: null },
    [SAVE_STATUS.SAVING]: { text: "Saving…",    color: "#fef3c7",      dot: "#f59e0b" },
    [SAVE_STATUS.SAVED]:  { text: "Saved ✓",    color: "#f0fdf4",      dot: "#22c55e" },
    [SAVE_STATUS.ERROR]:  { text: "Save failed",color: "#fef2f2",      dot: "#ef4444" },
  };

  const c = config[status] || config[SAVE_STATUS.IDLE];
  if (!c.text) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 20,
      background: c.color, fontSize: 11, fontWeight: 600,
      color: status === SAVE_STATUS.ERROR ? "#dc2626" : "#374151",
      border: `1px solid ${c.dot}40`,
      transition: "all 0.2s",
    }}>
      {c.dot && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: c.dot,
          ...(status === SAVE_STATUS.SAVING ? { animation: "save-pulse 1s ease-in-out infinite" } : {}),
        }} />
      )}
      {c.text}
      <style>{`@keyframes save-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}