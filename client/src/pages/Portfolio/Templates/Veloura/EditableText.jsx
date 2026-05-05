import React, { useState, useEffect, useRef } from "react";
import { Check, X, Pencil, Type } from "lucide-react";

const EditableText = ({ value, onChange, isTextArea, readOnly, placeholder, multiline }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const containerRef = useRef(null);

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleCancel();
      }
    };
    if (isEditing) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, tempValue]);

  if (readOnly) return <span className="inline-block">{value || ""}</span>;

  const handleSave = () => {
    if (onChange) onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTextArea && !multiline) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div 
        ref={containerRef}
        className="relative inline-flex flex-col w-full min-w-[240px] z-[500] animate-in fade-in zoom-in-95 duration-200"
      >
        {isTextArea || multiline ? (
          <textarea
            className="w-full bg-white/95 backdrop-blur-md p-3 rounded-xl outline-none border-2 border-indigo-500 text-slate-900 shadow-2xl min-h-[120px] resize-y 
                       font-[inherit] font-weight-[inherit] tracking-[inherit] text-[0.92em] leading-tight transition-all"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <input
            className="w-full bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg outline-none border-2 border-indigo-500 text-slate-900 shadow-2xl
                       font-[inherit] font-weight-[inherit] tracking-[inherit] text-[0.92em] transition-all"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        )}
        
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider"
          >
            <X size={12} strokeWidth={2.5} />
            Close
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all shadow-lg text-[10px] font-bold uppercase tracking-wider"
          >
            <Check size={12} strokeWidth={2.5} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="relative cursor-pointer transition-all duration-200 group/text inline-flex items-center gap-2"
    >
      {/* The main text with a permanent indicator line */}
      <span className="border-b border-dashed border-indigo-400/40 group-hover/text:border-indigo-600 group-hover/text:text-indigo-600 transition-all">
        {value || placeholder || "Click to edit..."}
      </span>
      
      {/* Permanent Edit Icon (Subtle when not hovering) */}
      <span className="flex-none opacity-20 group-hover/text:opacity-100 transition-all scale-90 group-hover/text:scale-110">
        <div className="bg-indigo-600 text-white p-1 rounded-md shadow-lg">
          <Pencil size={10} strokeWidth={3} />
        </div>
      </span>

      {/* Floating Tooltip on Hover */}
      <span className="absolute -top-8 left-0 opacity-0 group-hover/text:opacity-100 transition-all pointer-events-none whitespace-nowrap">
        <span className="bg-slate-900 text-white text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest shadow-xl">
          Edit Text
        </span>
      </span>
    </span>
  );
};

export default EditableText;