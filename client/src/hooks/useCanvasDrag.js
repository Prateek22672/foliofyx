// src/hooks/useCanvasDrag.js
// Handles pointer-based drag-to-move and resize for canvas elements.
// Used inside CustomCanvas.jsx.

import { useRef, useCallback } from "react";
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
  }, []); // eslint-disable-line

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
  }, []); // eslint-disable-line

  const onMouseMove = useCallback((e) => {
    const s = state.current;
    if (!s) return;

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
      let { x, y, width, height } = origEl;
      const MIN = 40;

      if (handle.includes("e")) width  = Math.max(MIN, origEl.width  + dx);
      if (handle.includes("s")) height = Math.max(MIN, origEl.height + dy);
      if (handle.includes("w")) { const w = Math.max(MIN, origEl.width - dx); x = origEl.x + (origEl.width - w); width = w; }
      if (handle.includes("n")) { const h = Math.max(MIN, origEl.height - dy); y = origEl.y + (origEl.height - h); height = h; }

      onResize(s.id, {
        x: Math.round(x / 8) * 8,
        y: Math.round(y / 8) * 8,
        width: Math.round(width / 8) * 8,
        height: Math.round(height / 8) * 8,
      });
    }
  }, [scale, elements, onMove, onResize, snapToElements]);

  const onMouseUp = useCallback(() => {
    if (state.current) {
      onDragEnd?.();
      state.current = null;
    }
    unbindGlobalEvents();
  }, [onDragEnd]); // eslint-disable-line

  function bindGlobalEvents() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor    = "grabbing";
  }

  function unbindGlobalEvents() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup",   onMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor    = "";
  }

  return { startMove, startResize };
}