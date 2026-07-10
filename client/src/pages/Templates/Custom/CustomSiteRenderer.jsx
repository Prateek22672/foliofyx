// src/pages/Templates/Custom/CustomSiteRenderer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Read-only public renderer for a "custom" template portfolio.
//
// Unlike CustomCanvas (which reads from PortfolioContext and has all the editor
// chrome), this is a standalone, prop-driven component used by the PUBLIC view
// (/portfolio/:id). It renders the saved canvas exactly as designed — no editing,
// no context dependency — so a deployed custom site behaves like any template.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { ElementRenderer } from "../../Customize/customize-editor/custom/CanvasElementRenderer";

const CANVAS_W = 1200;

// Compute the tallest point so the page is fully visible (elements are absolute).
function contentHeight(elements = []) {
  let max = 900;
  for (const el of elements) {
    const h = el.height === "auto" ? 240 : Number(el.height) || 0;
    max = Math.max(max, (Number(el.y) || 0) + h + 40);
  }
  return max;
}

export default function CustomSiteRenderer({ layout }) {
  const pages = layout?.pages || [];
  const [activeId, setActiveId] = useState(layout?.activePage || pages[0]?.id || null);

  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function calc() {
      if (!wrapRef.current) return;
      setScale(Math.min(1, wrapRef.current.offsetWidth / CANVAS_W));
    }
    calc();
    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const page = pages.find((p) => p.id === activeId) || pages[0];

  if (!page) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 16 }}>
        This site doesn’t have any content yet.
      </div>
    );
  }

  const h = contentHeight(page.elements);
  const pageBg = {
    background: page.bgImage
      ? `url(${page.bgImage}) center/cover no-repeat`
      : page.bgColor || "#ffffff",
  };

  return (
    <div ref={wrapRef} style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: CANVAS_W,
          minHeight: h,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          position: "relative",
          ...pageBg,
        }}
      >
        {page.elements.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height === "auto" ? undefined : el.height,
              zIndex: el.zIndex || 1,
              visibility: el.visible === false ? "hidden" : "visible",
            }}
          >
            <ElementRenderer
              element={el}
              isEditing={false}
              readOnly={true}
              pages={pages}
              activePage={activeId}
              onPageChange={setActiveId}
            />
          </div>
        ))}
      </div>
      {/* Spacer absorbs the scaled height so the page lays out correctly. */}
      <div style={{ height: h * scale }} />
    </div>
  );
}
