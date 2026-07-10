// src/hooks/useElementSelect.js
// Manages which element(s) are currently selected on the canvas.

import { useState, useCallback, useEffect } from "react";

export function useElementSelect() {
  const [selectedId, setSelectedId] = useState(null);

  const select = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const deselect = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Press Escape → deselect
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") deselect(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deselect]);

  return { selectedId, select, deselect };
}