// src/pages/Customize/customize-editor/RightPanel.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { TEMPLATE_LIST } from "../../Portfolio/Templates";
import DraggableBlock from "../../../components/DraggableBlock";
import { useElements } from "../../../context/ElementContext";

const sanitizeData = (rawData) => {
  if (!rawData) return {};
  return {
    ...rawData,
    name:       typeof rawData.name       === "string" ? rawData.name       : "",
    role:       typeof rawData.role       === "string" ? rawData.role       : "",
    bio:        typeof rawData.bio        === "string" ? rawData.bio        : "Developer & Creator",
    education:  typeof rawData.education  === "string" ? rawData.education  : "",
    experience: Array.isArray(rawData.experience) ? rawData.experience : [],
    skills:     Array.isArray(rawData.skills)
      ? rawData.skills.map(s => (typeof s === "string" ? s : s?.name)).filter(Boolean)
      : [],
    projects: Array.isArray(rawData.projects) ? rawData.projects : [],
  };
};

const RightPanel = ({ portfolioData = {} }) => {
  const safeData     = useMemo(() => sanitizeData(portfolioData), [portfolioData]);
  const rawTemplate  = safeData?.template ?? "minimal";
  const templateName = rawTemplate.toLowerCase();
  const selected     = TEMPLATE_LIST[templateName];
  const Template     = selected?.module || TEMPLATE_LIST["modern"]?.module;
  const { elements = [], setElements = () => {} } = useElements() || {};

  const [order, setOrder] = useState([
    "Header", "Home", "About", "Experience", "Projects", "Contact", "Footer",
  ]);

  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale]               = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const [isMobileMode, setIsMobileMode]   = useState(false);

  const DESIGN_WIDTH = 1440;

  useEffect(() => {
    const update = () => {
      if (!outerRef.current || !innerRef.current) return;

      // Use the outer element's offsetWidth (excludes scrollbar) so the
      // scale math is always based on the true visible width — this is what
      // eliminates the right-side gap caused by the scrollbar gutter.
      const availableWidth = outerRef.current.offsetWidth;
      if (availableWidth <= 0) return;

      const isSmall = availableWidth < 768;
      setIsMobileMode(isSmall);

      const nextScale = isSmall ? 1 : Math.min(1, availableWidth / DESIGN_WIDTH);
      setScale(nextScale);
      setContentHeight(innerRef.current.scrollHeight);
    };

    update();
    const ro = new ResizeObserver(update);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [portfolioData, order, elements]);

  const moveBlock = (from, to) => {
    const updated = [...order];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setOrder(updated);
  };

  const moveDynamicElement = (from, to) => {
    const updated = [...(elements || [])];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setElements(updated);
  };

  const renderDynamicElement = (el) => {
    if (!el) return null;
    if (el.type === "button")
      return (
        <button style={{ background: el.bg || "black", color: el.color || "white", padding: "10px 20px", borderRadius: "8px", border: el.border || "none" }}>
          {el.content}
        </button>
      );
    if (el.type === "text")    return <p className="text-lg">{el.content}</p>;
    if (el.type === "link")    return <a href={el.content} className="text-blue-600 underline" target="_blank" rel="noreferrer">{el.content}</a>;
    if (el.type === "divider") return <hr className="border-gray-400 my-5" />;
    return null;
  };

  const bg         = safeData.themeBg      || selected?.defaultBg   || "#ffffff";
  const fg         = safeData.themeFont    || selected?.defaultFont  || "#111827";
  const fontFamily = safeData.themeFontFamily || "Switzer, sans-serif";

  if (!Template) return <div className="text-center p-10 text-gray-500">Loading Template...</div>;

  return (
    /*
      Outer container:
      - overflow-x: hidden  → never a horizontal scrollbar
      - overflow-y: auto    → vertical scroll lives here
      - NO width: 100% on the inner scaled div leaves a gap on the right;
        using offsetWidth (above) for scale calculation means the scaled
        content exactly fills the visible area — zero gap.
    */
    <div
      ref={outerRef}
      style={{
        position:        "relative",
        width:           "100%",
        maxWidth:        "100%",
        overflowX:       "hidden",
        overflowY:       "auto",
        backgroundColor: bg,
        // Prevent the browser from reserving scrollbar gutter space, which
        // would create the right-side white gap visible in the screenshot.
        scrollbarGutter: "auto",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width:           isMobileMode ? "100%" : `${DESIGN_WIDTH}px`,
          transformOrigin: "top left",
          transform:       `scale(${scale})`,
          backgroundColor: bg,
          color:           fg,
          fontFamily,
          "--folio-bg":    bg,
          "--folio-fg":    fg,
          "--folio-font":  fontFamily,
          // Collapse the phantom space the browser adds after a CSS scale().
          // Without these two negative margins the outer div grows to
          // DESIGN_WIDTH px wide even though the visible content is smaller,
          // which is what produced the right-side gap.
          marginBottom: isMobileMode ? 0 : -(contentHeight   * (1 - scale)),
          marginRight:  isMobileMode ? 0 : -(DESIGN_WIDTH * (1 - scale)),
          flexShrink:   0,
        }}
      >
        {order.map((sectionName, index) => {
          const Component  = Template[sectionName];
          if (!Component) return null;
          const sectionKey = sectionName.toLowerCase();
          const isVisible  = safeData.visibility?.[sectionKey] !== false;
          if (!isVisible && sectionName !== "Header" && sectionName !== "Footer") return null;

          return (
            <DraggableBlock key={sectionName} id={sectionName} index={index} moveBlock={moveBlock}>
              <Component portfolioData={safeData} />
            </DraggableBlock>
          );
        })}

        <div className="p-6 flex flex-col gap-4">
          {(elements || []).map((el, index) => (
            <DraggableBlock
              key={el.id ?? `el-${index}`}
              id={el.id ?? `el-${index}`}
              index={index}
              moveBlock={moveDynamicElement}
            >
              {renderDynamicElement(el)}
            </DraggableBlock>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;