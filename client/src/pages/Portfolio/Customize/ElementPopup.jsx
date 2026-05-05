// src/pages/Customize/customize-editor/ElementPopup.jsx
import React, { useState, useRef } from "react";
import { useElements } from "../../../context/ElementContext";
import { X, GripVertical } from "lucide-react";

const TABS = ["Content", "Media", "Layout"];

const ELEMENT_REGISTRY = {
  Content: [
    { type: "button", name: "Button", desc: "CTA or action", icon: "▶", bg: "#E6F1FB", fg: "#185FA5" },
    { type: "text", name: "Text block", desc: "Paragraph or heading", icon: "T", bg: "#EAF3DE", fg: "#3B6D11" },
    { type: "link", name: "Link", desc: "Clickable URL", icon: "⬡", bg: "#FAEEDA", fg: "#854F0B" },
    { type: "divider", name: "Divider", desc: "Section separator", icon: "—", bg: "#F1EFE8", fg: "#5F5E5A" },
    { type: "badge", name: "Badge", desc: "Status or label", icon: "◈", bg: "#EEEDFE", fg: "#534AB7" },
    { type: "card", name: "Card", desc: "Content container", icon: "⬜", bg: "#FAECE7", fg: "#993C1D" },
  ],
  Media: [
    { type: "image", name: "Image", desc: "Photo or graphic", icon: "🖼", bg: "#E6F1FB", fg: "#185FA5" },
    { type: "video", name: "Video embed", desc: "YouTube / Vimeo", icon: "▷", bg: "#EEEDFE", fg: "#534AB7" },
    { type: "icon", name: "Icon", desc: "SVG icon", icon: "✦", bg: "#EAF3DE", fg: "#3B6D11" },
    { type: "avatar", name: "Avatar", desc: "Profile picture", icon: "◉", bg: "#FAEEDA", fg: "#854F0B" },
  ],
  Layout: [
    { type: "2col", name: "2 columns", desc: "Side-by-side", icon: "⬛⬛", bg: "#F1EFE8", fg: "#5F5E5A" },
    { type: "section", name: "Section", desc: "Full-width block", icon: "▬", bg: "#FAECE7", fg: "#993C1D" },
    { type: "hero", name: "Hero block", desc: "Top banner area", icon: "⬜", bg: "#EEEDFE", fg: "#534AB7" },
    { type: "spacer", name: "Spacer", desc: "Vertical gap", icon: "⇕", bg: "#EAF3DE", fg: "#3B6D11" },
  ],
};

const DEFAULT_CONTENT = {
  button: "Click Me", text: "Sample Text", link: "https://example.com",
  divider: "", badge: "New", card: "Card content here",
  image: "", video: "", icon: "", avatar: "",
  "2col": "", section: "", hero: "", spacer: "",
};

export default function ElementPopup({ onClose }) {
  const { addElement } = useElements();
  const [activeTab, setActiveTab] = useState("Content");
  const [dropped, setDropped] = useState([]);
  const [dragSrcType, setDragSrcType] = useState(null);
  const [reorderSrc, setReorderSrc] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const idRef = useRef(0);

  const allElements = Object.values(ELEMENT_REGISTRY).flat();
  const findMeta = (type) => allElements.find((e) => e.type === type) || {};

  const addToCanvas = (type) => {
    const meta = findMeta(type);
    setDropped((prev) => [...prev, { id: ++idRef.current, type, ...meta }]);
  };

  const removeFromCanvas = (id) => {
    setDropped((prev) => prev.filter((el) => el.id !== id));
  };

  const clearCanvas = () => setDropped([]);

  // Drag from palette
  const handlePaletteDragStart = (e, type) => {
    setDragSrcType(type);
    setReorderSrc(null);
    e.dataTransfer.effectAllowed = "copy";
  };

  // Drag to reorder within canvas
  const handleCanvasDragStart = (e, idx) => {
    setReorderSrc(idx);
    setDragSrcType(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (dragSrcType) {
      addToCanvas(dragSrcType);
      setDragSrcType(null);
    }
  };

  const handleReorderDrop = (e, targetIdx) => {
    e.preventDefault();
    e.stopPropagation();
    if (reorderSrc === null || reorderSrc === targetIdx) {
      setReorderSrc(null);
      return;
    }
    setDropped((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(reorderSrc, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
    setReorderSrc(null);
  };

  const applyAll = () => {
    dropped.forEach(({ type }) => {
      addElement({ type, content: DEFAULT_CONTENT[type] ?? "" });
    });
    onClose();
  };

  const currentElements = ELEMENT_REGISTRY[activeTab] || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg text-black overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">Add element</span>
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">Beta</span>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all -mb-px ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Palette grid */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Elements — drag to canvas or click +
            </p>
            <div className="grid grid-cols-3 gap-2">
              {currentElements.map((el) => (
                <div
                  key={el.type}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, el.type)}
                  className="group relative flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-300 hover:shadow-sm cursor-grab transition-all"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: el.bg, color: el.fg }}>
                    {el.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800 text-center leading-tight">{el.name}</span>
                  <span className="text-[9px] text-gray-400 text-center">{el.desc}</span>

                  {/* Quick-add button */}
                  <button
                    type="button"
                    onClick={() => addToCanvas(el.type)}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  >+</button>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas drop zone */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Canvas</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleCanvasDrop}
              className={`rounded-xl border-2 border-dashed min-h-[120px] transition-all ${
                dragOver
                  ? "border-purple-400 bg-purple-50/40"
                  : "border-gray-200 bg-gray-50/40"
              }`}
            >
              {dropped.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-28 gap-2 text-gray-300">
                  <div className="text-2xl">⊞</div>
                  <span className="text-xs">Drag elements here or click + to add</span>
                </div>
              ) : (
                <div className="p-3 flex flex-col gap-2">
                  {dropped.map((el, idx) => (
                    <div
                      key={el.id}
                      draggable
                      onDragStart={(e) => handleCanvasDragStart(e, idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleReorderDrop(e, idx)}
                      className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-2.5 hover:border-gray-300 transition-all cursor-grab group"
                    >
                      <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
                      <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0" style={{ background: el.bg, color: el.fg }}>
                        {el.icon}
                      </div>
                      <span className="flex-1 text-xs font-semibold text-gray-800">{el.name}</span>
                      <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{el.type}</span>
                      <button
                        type="button"
                        onClick={() => removeFromCanvas(el.id)}
                        className="w-5 h-5 rounded flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 text-xs"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {dropped.length} element{dropped.length !== 1 ? "s" : ""} added
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={clearCanvas} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
              Clear
            </button>
            <button
              type="button"
              onClick={applyAll}
              disabled={dropped.length === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 8.5L10 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Apply to page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}