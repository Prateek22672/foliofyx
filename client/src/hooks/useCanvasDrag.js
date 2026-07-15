// src/hooks/useCanvasDrag.js
// Handles pointer-based drag-to-move and resize for canvas elements.
// Used inside CustomCanvas.jsx.

import { useRef, useCallback, useEffect } from "react";
import { useGridSnap } from "./useGridSnap";

/**
 * @param {object} params
 * @param {number}   params.scale       — CSS scale factor of canvas (e.g. 0.75)
 * @param {Function} params.onMove      — (id, {x,y}) called during drag
 * @param {Function} params.onResize    — (id, {x,y,width,height}) called during resize
 * @param {Function} params.onDragEnd   — () called on mouseup (commit to history)
 * @param {Array}    params.elements    — all elements on the page (for snap guides)
 */
export function useCanvasDrag({ scale = 1, onMove, onResize, onDragEnd, elements = [] }) {
  const { snapToElements } = useGridSnap();

  const state = useRef(null); // { mode, id, startX, startY, origEl, handle }

  // Keep the latest props in a ref so the window listeners (which are bound
  // once and must stay referentially stable to unbind) never read stale values.
  // Previously the []-dep callbacks captured the FIRST render's scale/elements,
  // so drags used a stale scale after the canvas rescaled and snapped against
  // outdated element positions.
  const latest = useRef({ scale, elements, onMove, onResize, onDragEnd, snapToElements });
  latest.current = { scale, elements, onMove, onResize, onDragEnd, snapToElements };

  const onMouseMove = useCallback((e) => {
    const s = state.current;
    if (!s) return;

    const { scale, elements, onMove, onResize, snapToElements } = latest.current;

    const dx = (e.clientX - s.startX) / scale;
    const dy = (e.clientY - s.startY) / scale;

    if (s.mode === "move") {
      const others = elements.filter((el) => el.id !== s.id);
      const { x, y } = snapToElements(
        { x: s.origEl.x + dx, y: s.origEl.y + dy, width: s.origEl.width, height: s.origEl.height },
        others
      );
      onMove(s.id, { x: Math.max(0, x), y: Math.max(0, y) });
    }

    if (s.mode === "resize") {
      const { handle, origEl } = s;
      const MIN = 40;
      // Guard "auto" heights — Math.max(MIN, "auto" + dy) is NaN.
      const origW = Number(origEl.width) || MIN;
      const origH = origEl.height === "auto" ? MIN : (Number(origEl.height) || MIN);
      let x = origEl.x, y = origEl.y, width = origW, height = origH;

      if (handle.includes("e")) width  = Math.max(MIN, origW + dx);
      if (handle.includes("s")) height = Math.max(MIN, origH + dy);
      if (handle.includes("w")) { const w = Math.max(MIN, origW - dx); x = origEl.x + (origW - w); width = w; }
      if (handle.includes("n")) { const h = Math.max(MIN, origH - dy); y = origEl.y + (origH - h); height = h; }

      onResize(s.id, {
        x: Math.round(x / 8) * 8,
        y: Math.round(y / 8) * 8,
        width: Math.round(width / 8) * 8,
        height: Math.round(height / 8) * 8,
      });
    }
  }, []);

  const onMouseUp = useCallback(() => {
    if (state.current) {
      latest.current.onDragEnd?.();
      state.current = null;
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor    = "";
  }, [onMouseMove]);

  const bindGlobalEvents = useCallback(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor    = "grabbing";
  }, [onMouseMove, onMouseUp]);

  const startMove = useCallback((e, element) => {
    if (element.locked) return;
    e.stopPropagation();
    e.preventDefault();
    state.current = {
      mode: "move",
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      origEl: { ...element },
    };
    bindGlobalEvents();
  }, [bindGlobalEvents]);

  const startResize = useCallback((e, element, handle) => {
    e.stopPropagation();
    e.preventDefault();
    state.current = {
      mode: "resize",
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      origEl: { ...element },
      handle, // 'nw'|'n'|'ne'|'e'|'se'|'s'|'sw'|'w'
    };
    bindGlobalEvents();
  }, [bindGlobalEvents]);

  // Clean up if the component unmounts mid-drag — otherwise the window
  // listeners leak and the body keeps the "grabbing" cursor forever.
  useEffect(() => () => {
    state.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor    = "";
  }, [onMouseMove, onMouseUp]);

  return { startMove, startResize };
}
