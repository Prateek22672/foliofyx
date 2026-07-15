// src/hooks/useHistory.js
// Undo / redo stack for the custom canvas editor.
// Wraps any state setter — call pushHistory(snapshot) before every mutation,
// then undo() / redo() to travel the timeline.

import { useRef, useCallback } from "react";

const MAX = 60; // max undo steps

export function useHistory(setValue) {
  const past   = useRef([]); // snapshots before current
  const future = useRef([]); // snapshots after current (for redo)

  /** Call BEFORE mutating state — pass the CURRENT value */
  const pushHistory = useCallback((snapshot) => {
    past.current = [...past.current.slice(-(MAX - 1)), JSON.parse(JSON.stringify(snapshot))];
    future.current = []; // any new action clears redo
  }, []);

  const undo = useCallback(() => {
    if (!past.current.length) return;
    const prev = past.current[past.current.length - 1];
    past.current = past.current.slice(0, -1);
    // React may invoke updaters twice (StrictMode) — guard the side effect so
    // the redo stack doesn't get a duplicate snapshot.
    let captured = false;
    setValue((cur) => {
      if (!captured) {
        captured = true;
        future.current = [JSON.parse(JSON.stringify(cur)), ...future.current.slice(0, MAX - 1)];
      }
      return prev;
    });
  }, [setValue]);

  const redo = useCallback(() => {
    if (!future.current.length) return;
    const next = future.current[0];
    future.current = future.current.slice(1);
    let captured = false;
    setValue((cur) => {
      if (!captured) {
        captured = true;
        past.current = [...past.current.slice(-(MAX - 1)), JSON.parse(JSON.stringify(cur))];
      }
      return next;
    });
  }, [setValue]);

  const canUndo = () => past.current.length > 0;
  const canRedo = () => future.current.length > 0;

  return { pushHistory, undo, redo, canUndo, canRedo };
}