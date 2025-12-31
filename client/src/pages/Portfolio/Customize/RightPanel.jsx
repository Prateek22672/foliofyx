import React, { useState, useMemo } from "react";
import { TEMPLATE_LIST } from "../../Portfolio/Templates";
import DraggableBlock from "../../../components/DraggableBlock";
import { useElements } from "../../../context/ElementContext";


// --- HELPER: CLEAN BAD DATA BEFORE RENDERING ---
const sanitizeData = (rawData) => {
  if (!rawData) return {};

  return {
    ...rawData,
    // Ensure text fields are actually strings (prevents Object crash)
    name: typeof rawData.name === 'string' ? rawData.name : "",
    role: typeof rawData.role === 'string' ? rawData.role : "",
    bio: typeof rawData.bio === 'string' ? rawData.bio : "Developer & Creator",
    education: typeof rawData.education === 'string' ? rawData.education : "",
    
    // Ensure Arrays are valid
    experience: Array.isArray(rawData.experience) 
      ? rawData.experience 
      : (typeof rawData.experience === 'string' ? rawData.experience : []), // Allow string fallback if legacy data

    skills: Array.isArray(rawData.skills) 
      ? rawData.skills.map(s => {
          // If it's a string, keep it. If object has name, use name. Else ignore.
          if (typeof s === 'string') return s;
          if (s && s.name && typeof s.name === 'string') return s.name;
          return null; 
        }).filter(Boolean)
      : [],
      
    projects: Array.isArray(rawData.projects) ? rawData.projects : []
  };
};

const RightPanel = ({ portfolioData = {} }) => {
  // 1. Sanitize Data Immediately
  const safeData = useMemo(() => sanitizeData(portfolioData), [portfolioData]);

  const rawTemplate = safeData?.template ?? "minimal";
  const templateName = rawTemplate.toLowerCase();

  // console.log("Rendering template:", templateName);

  const selected = TEMPLATE_LIST[templateName];
  
  // 2. Fallback to Modern if template not found
  const Template = selected?.module || TEMPLATE_LIST["modern"]?.module; 

  const { elements = [], setElements = () => {} } = useElements() || {};

  if (!Template) {
    return <div className="text-center p-10 text-gray-500">Loading Template...</div>;
  }

  const [order, setOrder] = useState([
    "Header",
    "Home",
    "About",
    "Experience",
    "Projects",
    "Contact",
    "Footer",
  ]);

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
    switch (el.type) {
      case "button":
        return (
          <button
            style={{
              background: el.bg || "black",
              color: el.color || "white",
              padding: "10px 20px",
              borderRadius: "8px",
              border: el.border || "none",
            }}
          >
            {el.content}
          </button>
        );

      case "text":
        return <p className="text-lg">{el.content}</p>;

      case "link":
        return (
          <a href={el.content} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            {el.content}
          </a>
        );

      case "divider":
        return <hr className="border-gray-400 my-5" />;

      default:
        return null;
    }
  };

  const bg = safeData.themeBg || selected?.defaultBg || "#ffffff";
  const fg = safeData.themeFont || selected?.defaultFont || "#111827";

  return (
    <div
      className="min-h-screen relative w-full z-10 -mt-2 overflow-y-auto transition-all scroll-smooth"
      style={{
        backgroundColor: bg,
        color: fg,
        "--folio-bg": bg,
        "--folio-fg": fg,
      }}
    >
      {/* DRAGGABLE TEMPLATE SECTIONS */}
      {order.map((sectionName, index) => {
        const Component = Template[sectionName];
        if (!Component) return null;

        // ✅ CHECK VISIBILITY
        const sectionKey = sectionName.toLowerCase();
        
        // Visibility Check (Safely handle undefined)
        const isVisible = safeData.visibility?.[sectionKey] !== false;

        // Always show Header/Footer unless explicitly hidden
        const isEssential = sectionName === "Header" || sectionName === "Footer";

        if (!isVisible && !isEssential) return null;

        return (
          <DraggableBlock
            key={sectionName}
            id={sectionName}
            index={index}
            moveBlock={moveBlock}
          >
            {/* Pass the SANITIZED safeData here */}
            <Component portfolioData={safeData} />
          </DraggableBlock>
        );
      })}

      {/* DRAGGABLE USER-ADDED ELEMENTS */}
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
  );
};

export default RightPanel;