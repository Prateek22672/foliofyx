import React, { useState, useMemo } from "react";
import { TEMPLATE_LIST } from "../../Portfolio/Templates";
import DraggableBlock from "../../../components/DraggableBlock";
import { useElements } from "../../../context/ElementContext";

const sanitizeData = (rawData) => {
  if (!rawData) return {};
  return {
    ...rawData,
    name: typeof rawData.name === 'string' ? rawData.name : "",
    role: typeof rawData.role === 'string' ? rawData.role : "",
    bio: typeof rawData.bio === 'string' ? rawData.bio : "Developer & Creator",
    education: typeof rawData.education === 'string' ? rawData.education : "",
    experience: Array.isArray(rawData.experience) ? rawData.experience : [],
    skills: Array.isArray(rawData.skills) ? rawData.skills.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean) : [],
    projects: Array.isArray(rawData.projects) ? rawData.projects : []
  };
};

const RightPanel = ({ portfolioData = {} }) => {
  const safeData = useMemo(() => sanitizeData(portfolioData), [portfolioData]);
  const rawTemplate = safeData?.template ?? "minimal";
  const templateName = rawTemplate.toLowerCase();
  const selected = TEMPLATE_LIST[templateName];
  const Template = selected?.module || TEMPLATE_LIST["modern"]?.module; 
  const { elements = [], setElements = () => {} } = useElements() || {};

  const [order, setOrder] = useState(["Header", "Home", "About", "Experience", "Projects", "Contact", "Footer"]);

  const moveBlock = (from, to) => {
    const updated = [...order];
    const movedItem = updated.splice(from, 1)[0];
    updated.splice(to, 0, movedItem);
    setOrder(updated);
  };

  const moveDynamicElement = (from, to) => {
    const updated = [...(elements || [])];
    const movedItem = updated.splice(from, 1)[0];
    updated.splice(to, 0, movedItem);
    setElements(updated);
  };

  const renderDynamicElement = (el) => {
    if (!el) return null;
    if(el.type === "button") return <button style={{ background: el.bg || "black", color: el.color || "white", padding: "10px 20px", borderRadius: "8px", border: el.border || "none" }}>{el.content}</button>;
    if(el.type === "text") return <p className="text-lg">{el.content}</p>;
    if(el.type === "link") return <a href={el.content} className="text-blue-600 underline" target="_blank" rel="noreferrer">{el.content}</a>;
    if(el.type === "divider") return <hr className="border-gray-400 my-5" />;
    return null;
  };

  const bg = safeData.themeBg || selected?.defaultBg || "#ffffff";
  const fg = safeData.themeFont || selected?.defaultFont || "#111827";
  
  // ✅ NEW: Apply Font Family
  const fontFamily = safeData.themeFontFamily || "Switzer, sans-serif";

  if (!Template) return <div className="text-center p-10 text-gray-500">Loading Template...</div>;

  return (
    <div
      className="min-h-screen relative w-full z-10 -mt-2 overflow-y-auto transition-all scroll-smooth"
      style={{
        backgroundColor: bg,
        color: fg,
        fontFamily: fontFamily, // ✅ Font Applied Here
        "--folio-bg": bg,
        "--folio-fg": fg,
        "--folio-font": fontFamily
      }}
    >
      {order.map((sectionName, index) => {
        const Component = Template[sectionName];
        if (!Component) return null;
        const sectionKey = sectionName.toLowerCase();
        const isVisible = safeData.visibility?.[sectionKey] !== false;
        const isEssential = sectionName === "Header" || sectionName === "Footer";
        if (!isVisible && !isEssential) return null;

        return (
          <DraggableBlock key={sectionName} id={sectionName} index={index} moveBlock={moveBlock}>
            <Component portfolioData={safeData} />
          </DraggableBlock>
        );
      })}

      <div className="p-6 flex flex-col gap-4">
        {(elements || []).map((el, index) => (
          <DraggableBlock key={el.id ?? `el-${index}`} id={el.id ?? `el-${index}`} index={index} moveBlock={moveDynamicElement}>
            {renderDynamicElement(el)}
          </DraggableBlock>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;