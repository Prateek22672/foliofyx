import React, { useEffect, useState, useRef } from "react";
import { Check, Search, X } from "lucide-react";

/**
 * SearchSuggestion
 * A polished, user-friendly autocomplete component.
 */
const SearchSuggestion = ({
  dataFile,
  label,
  placeholder = "Search...",
  multiple = false,
  selected = multiple ? [] : "",
  onToggle = () => {},
  onSelect = () => {},
  defaultCount = 6,
  className = "",
}) => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // 1. Load Data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/data/${dataFile}`);
        if (!res.ok) throw new Error("Failed to load");
        const text = await res.text();
        const arr = text
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        if (mounted) setItems(arr);
      } catch (err) {
        // console.warn("SearchSuggestion load warning:", err); // Optional: suppress logs
        if (mounted) setItems([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [dataFile]);

  // 2. Filter Logic
  useEffect(() => {
    const q = (query || "").trim().toLowerCase();
    
    // If not multiple, sync query with selected value (only initially or on external change)
    if (!multiple && typeof selected === 'string' && !showDropdown && selected !== query) {
        setQuery(selected);
    }

    if (!q) {
      setFiltered(items.slice(0, 10)); // Show more suggestions initially
    } else {
      const matches = items.filter((it) => it.toLowerCase().includes(q));
      setFiltered(matches.slice(0, 10));
    }
  }, [items, query, showDropdown, multiple, selected]);


  // 3. Handle Click
  const handleClickSuggestion = (item) => {
    if (multiple) {
      onToggle(item);
      setQuery(""); // Clear query after adding tag
    } else {
      onSelect(item);
      setQuery(item); // Keep query as the selected value
    }
    setShowDropdown(false);
  };

  // 4. Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultTags = items.slice(0, defaultCount);

  // Helper to check if item is active
  const isActive = (item) => {
    if (multiple) {
      // For arrays (projects uses simple strings, skills uses objects sometimes, assume strings here based on context)
      return Array.isArray(selected) && selected.includes(item);
    }
    return selected === item;
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
        />
        {query && (
            <button 
                onClick={() => { setQuery(""); onSelect(""); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
                <X size={14} />
            </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1">
            {filtered.map((it, idx) => {
              const active = isActive(it);
              return (
                <button
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    handleClickSuggestion(it);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{it}</span>
                  {active && <Check size={14} className="text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Select Tags (Rounded & Clean) */}
      <div className="flex flex-wrap gap-2 mt-3">
        {defaultTags.map((tag) => {
          const active = isActive(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleClickSuggestion(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchSuggestion;