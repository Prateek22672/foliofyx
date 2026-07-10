// src/pages/Portfolio/Templates/Custom/CustomCanvas.jsx
// The live editable preview surface for the Custom template.
// Renders elements as absolute-positioned layers inside a scaled 1200px canvas.

import React, { useState, useRef, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useCanvasDrag } from "../../../hooks/useCanvasDrag";
import { useElementSelect } from "../../../hooks/useElementSelect";
import { useHistory }       from "../../../hooks/useHistory";
// Use the complete renderer that handles every AI-generated element type
// (label, logostrip, bg, etc.) — no more "Unknown element type" boxes.
import { ElementRenderer }  from "../../Customize/customize-editor/custom/CanvasElementRenderer";
import { SelectionBox }     from "./SelectionBox";
import { createElement, defaultCustomLayout } from "./constants";

const CANVAS_W = 1200;

function getLayout(portfolioData) {
  return portfolioData?.customLayout ?? defaultCustomLayout();
}

function getActivePage(layout) {
  return layout.pages.find((p) => p.id === layout.activePage) ?? layout.pages[0];
}

/**
 * Props:
 *   readOnly  {boolean}   — no edit UI in published view
 *   onSelect  {Function}  — (id | null) => void  — called when element is selected/deselected
 *                           EditorPanel uses this to auto-switch to the Style tab
 */
export function CustomCanvas({ readOnly = false, onSelect }) {
  const { portfolioData, setPortfolioData } = usePortfolio();

  const layout     = getLayout(portfolioData);
  const activePage = getActivePage(layout);

  // ── Selection ──
  const { selectedId, select: _select, deselect: _deselect } = useElementSelect();
  const [editingId, setEditingId] = useState(null);

  // Wrap select/deselect so we also notify the parent EditorPanel
  const select = useCallback((id) => {
    _select(id);
    onSelect?.(id);
  }, [_select, onSelect]);

  const deselect = useCallback(() => {
    _deselect();
    onSelect?.(null);
    setEditingId(null);
  }, [_deselect, onSelect]);

  // ── Layout updater ──
  const updateLayout = useCallback((updater) => {
    setPortfolioData((prev) => {
      const old  = getLayout(prev);
      const next = typeof updater === "function" ? updater(old) : updater;
      return { ...prev, customLayout: next };
    });
  }, [setPortfolioData]);

  const { pushHistory, undo, redo } = useHistory((updater) => {
    setPortfolioData((prev) => {
      const next = typeof updater === "function" ? updater(getLayout(prev)) : updater;
      return { ...prev, customLayout: next };
    });
  });

  // ── Canvas scale ──
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function calcScale() {
      if (!wrapRef.current) return;
      setScale(Math.min(1, wrapRef.current.offsetWidth / CANVAS_W));
    }
    calcScale();
    const ro = new ResizeObserver(calcScale);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // ── Element mutators ──
  const mutateElements = useCallback((fn) => {
    updateLayout((l) => ({
      ...l,
      pages: l.pages.map((p) =>
        p.id === l.activePage ? { ...p, elements: fn(p.elements) } : p
      ),
    }));
  }, [updateLayout]);

  const updateElement = useCallback((id, patch) => {
    mutateElements((els) => els.map((el) => el.id === id ? { ...el, ...patch } : el));
  }, [mutateElements]);

  // ── Drag ──
  const { startMove, startResize } = useCanvasDrag({
    scale,
    elements: activePage?.elements ?? [],
    onMove:   (id, pos) => updateElement(id, pos),
    onResize: (id, geo) => updateElement(id, geo),
    onDragEnd: () => {},
  });

  // ── Keyboard shortcuts ──
  useEffect(() => {
    if (readOnly) return;
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") { e.preventDefault(); redo(); }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        pushHistory(layout);
        mutateElements((els) => els.filter((el) => el.id !== selectedId));
        deselect();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [readOnly, selectedId, layout, undo, redo, pushHistory, mutateElements, deselect]);

  // ── Drop from ElementLibrary ──
  const onDrop = useCallback((e) => {
    if (readOnly) return;
    e.preventDefault();
    const type = e.dataTransfer.getData("element-type");
    if (!type) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / scale) / 8) * 8;
    const y = Math.round(((e.clientY - rect.top)  / scale) / 8) * 8;
    const el = createElement(type, { x: Math.max(0, x), y: Math.max(0, y) });
    pushHistory(layout);
    mutateElements((els) => [...els, el]);
    select(el.id);
  }, [readOnly, scale, layout, pushHistory, mutateElements, select]);

  const pageBg = {
    background: activePage?.bgImage
      ? `url(${activePage.bgImage}) center/cover no-repeat`
      : activePage?.bgColor || "#ffffff",
  };

  // ── Canvas height: fit the actual content ──
  // Was hardcoded to 900px, which CLIPPED tall AI-generated pages (so edits to
  // lower sections "didn't show") and left big white space on short pages.
  // Compute the real extent of the elements + a small working margin for drops.
  const contentBottom = (activePage?.elements ?? []).reduce((max, el) => {
    const h = el.height === "auto" ? 80 : (Number(el.height) || 0);
    return Math.max(max, (Number(el.y) || 0) + h);
  }, 0);
  const canvasHeight = Math.max(900, Math.ceil(contentBottom) + (readOnly ? 0 : 120));

  if (!activePage) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
        No pages yet — add one in the Pages tab →
      </div>
    );
  }

  return (
    <div ref={wrapRef} style={{ width: "100%", overflow: "hidden", background: "#e5e7eb" }}>
      {/* Scaled canvas */}
      <div
        style={{
          width:           CANVAS_W,
          height:          canvasHeight,
          transformOrigin: "top left",
          transform:       `scale(${scale})`,
          position:        "relative",
          ...pageBg,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) deselect(); }}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {activePage.elements.map((el) => {
          const isSelected = selectedId === el.id && !readOnly;
          const isEditing  = editingId  === el.id && !readOnly;

          return (
            <div
              key={el.id}
              style={{
                position:  "absolute",
                left:      el.x,
                top:       el.y,
                width:     el.width,
                height:    el.height === "auto" ? undefined : el.height,
                cursor:    el.locked || readOnly ? "default" : "grab",
                userSelect:"none",
                zIndex:    isSelected ? 5 : 1,
                visibility:el.visible === false ? "hidden" : "visible",
              }}
              onClick={(e) => { e.stopPropagation(); if (!readOnly) select(el.id); }}
              onDoubleClick={(e) => { e.stopPropagation(); if (!readOnly) setEditingId(el.id); }}
              onMouseDown={(e) => {
                if (readOnly || el.locked || isEditing) return;
                if (e.button === 0) startMove(e, el);
              }}
            >
              <ElementRenderer
                element={el}
                isEditing={isEditing}
                readOnly={readOnly}
                onContentChange={(val) => {
                  updateElement(el.id, typeof val === "object" ? val : { content: val });
                  setEditingId(null);
                }}
                onSrcChange={(src) => updateElement(el.id, { src })}
                pages={layout.pages}
                activePage={layout.activePage}
                onPageChange={(pageId) => updateLayout((l) => ({ ...l, activePage: pageId }))}
              />

              {isSelected && (
                <SelectionBox
                  element={el}
                  onResizeStart={startResize}
                  onDelete={() => {
                    pushHistory(layout);
                    mutateElements((els) => els.filter((e) => e.id !== el.id));
                    deselect();
                  }}
                  onDuplicate={() => {
                    pushHistory(layout);
                    const dup = { ...el, id: nanoid(8), x: el.x + 24, y: el.y + 24 };
                    mutateElements((els) => [...els, dup]);
                    select(dup.id);
                  }}
                  onToggleLock={() => updateElement(el.id, { locked: !el.locked })}
                />
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {activePage.elements.length === 0 && !readOnly && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{
              border: "2px dashed #d1d5db", borderRadius: 16,
              padding: "40px 60px", textAlign: "center",
            }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px" }}>
                Canvas is empty
              </p>
              <p style={{ fontSize: 14, color: "#d1d5db", margin: 0 }}>
                Open the editor panel → Add tab → drag elements here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Height spacer — reserves the scaled canvas height so the scroll area
          matches the real content (no clipping, no dead white space). */}
      <div style={{ height: canvasHeight * scale }} />
    </div>
  );
}

export default CustomCanvas;