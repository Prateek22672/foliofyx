// client/src/context/CustomWebsiteContext.jsx
// Dedicated context for the custom website builder.
// Completely separate from PortfolioContext (which is for template-based portfolios).

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomWebsite, getCustomWebsite, saveCustomWebsite } from "../api/customWebsiteAPI";

// ── Types ─────────────────────────────────────────────────────────────────────
const DEFAULT_PAGE = () => ({
  id:       `page_${Date.now()}`,
  name:     "Home",
  slug:     "/",
  pageType: "page",
  elements: [],
  bgColor:  "#ffffff",
  bgType:   "solid",
});

const DEFAULT_LAYOUT = () => {
  const page = DEFAULT_PAGE();
  return { pages: [page], activePage: page.id };
};

// ── Context ───────────────────────────────────────────────────────────────────
const CustomWebsiteContext = createContext(null);

export function CustomWebsiteProvider({ children }) {
  const [siteId,      setSiteId]      = useState(null);
  const [title,       setTitle]       = useState("My Website");
  const [industry,    setIndustry]    = useState("general");
  const [status,      setStatus]      = useState("draft");
  const [layout,      setLayout]      = useState(DEFAULT_LAYOUT());
  const [settings,    setSettings]    = useState({});
  const [loading,     setLoading]     = useState(false);
  const [saveStatus,  setSaveStatus]  = useState("idle"); // idle|saving|saved|error
  const [selectedId,  setSelectedId]  = useState(null);

  const saveTimer  = useRef(null);
  const prevLayout = useRef(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activePage = layout.pages.find(p => p.id === layout.activePage) || layout.pages[0];

  // ── Auto-save: 3s debounce on layout change ───────────────────────────────
  useEffect(() => {
    if (!siteId) return;
    const serial = JSON.stringify(layout);
    if (serial === prevLayout.current) return;
    prevLayout.current = serial;

    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        await saveCustomWebsite(siteId, { pages: layout.pages, activePage: layout.activePage, title, industry, settings });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 3000);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [layout, siteId, title, industry, settings]);

  // ── Load existing site ────────────────────────────────────────────────────
  const loadSite = useCallback(async (id) => {
    setLoading(true);
    try {
      const { site } = await getCustomWebsite(id);
      setSiteId(site._id);
      setTitle(site.title);
      setIndustry(site.industry);
      setStatus(site.status);
      setSettings(site.settings || {});
      const lay = { pages: site.pages, activePage: site.activePage };
      setLayout(lay);
      prevLayout.current = JSON.stringify(lay);
    } catch (err) {
      console.error("[CustomWebsiteContext] load failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Create new site ───────────────────────────────────────────────────────
  const initSite = useCallback(async (opts = {}) => {
    setLoading(true);
    try {
      const defLayout = DEFAULT_LAYOUT();
      const { site } = await createCustomWebsite({
        title:      opts.title      || "My Website",
        industry:   opts.industry   || "general",
        pages:      defLayout.pages,
        activePage: defLayout.activePage,
      });
      setSiteId(site._id);
      setTitle(site.title);
      setIndustry(site.industry);
      setStatus("draft");
      setLayout({ pages: site.pages, activePage: site.activePage });
      prevLayout.current = JSON.stringify({ pages: site.pages, activePage: site.activePage });
      return site._id;
    } catch (err) {
      console.error("[CustomWebsiteContext] init failed:", err);
      // Fallback to local-only mode
      const defLayout = DEFAULT_LAYOUT();
      setLayout(defLayout);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Manual save ───────────────────────────────────────────────────────────
  const saveNow = useCallback(async () => {
    if (!siteId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    try {
      await saveCustomWebsite(siteId, { pages: layout.pages, activePage: layout.activePage, title, industry, settings });
      prevLayout.current = JSON.stringify(layout);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
    }
  }, [siteId, layout, title, industry, settings]);

  // ── Layout patchers ───────────────────────────────────────────────────────
  const updateLayout = useCallback((patch) => {
    setLayout(prev => ({ ...prev, ...patch }));
  }, []);

  const setActivePage = useCallback((pageId) => {
    setLayout(prev => ({ ...prev, activePage: pageId }));
    setSelectedId(null);
  }, []);

  // Add element to active page
  const addElements = useCallback((elements) => {
    setLayout(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === prev.activePage
          ? { ...p, elements: [...(p.elements || []), ...elements] }
          : p
      ),
    }));
  }, []);

  // Update single element
  const updateElement = useCallback((elementId, patch) => {
    setLayout(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === prev.activePage
          ? { ...p, elements: p.elements.map(el => el.id === elementId ? { ...el, ...patch } : el) }
          : p
      ),
    }));
  }, []);

  // Update element styles
  const updateElementStyles = useCallback((elementId, stylesPatch) => {
    setLayout(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === prev.activePage
          ? { ...p, elements: p.elements.map(el =>
              el.id === elementId ? { ...el, styles: { ...el.styles, ...stylesPatch } } : el
            )}
          : p
      ),
    }));
  }, []);

  // Delete element
  const deleteElement = useCallback((elementId) => {
    setLayout(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === prev.activePage
          ? { ...p, elements: p.elements.filter(el => el.id !== elementId) }
          : p
      ),
    }));
    setSelectedId(null);
  }, []);

  // Duplicate element
  const duplicateElement = useCallback((elementId) => {
    setLayout(prev => {
      const activePg = prev.pages.find(p => p.id === prev.activePage);
      if (!activePg) return prev;
      const el = activePg.elements.find(e => e.id === elementId);
      if (!el) return prev;
      const copy = { ...el, id: `el_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, x: el.x + 20, y: el.y + 20 };
      return {
        ...prev,
        pages: prev.pages.map(p =>
          p.id === prev.activePage
            ? { ...p, elements: [...p.elements, copy] }
            : p
        ),
      };
    });
  }, []);

  // Patch active page settings (bg, seo, etc.)
  const patchActivePage = useCallback((patch) => {
    setLayout(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === prev.activePage ? { ...p, ...patch } : p),
    }));
  }, []);

  // Add page
  const addPage = useCallback((pageData) => {
    const newPage = { id: `page_${Date.now()}`, name: "New Page", slug: `/page-${Date.now()}`, pageType: "page", elements: [], bgColor: "#ffffff", bgType: "solid", ...pageData };
    setLayout(prev => ({ ...prev, pages: [...prev.pages, newPage], activePage: newPage.id }));
  }, []);

  // Delete page
  const deletePage = useCallback((pageId) => {
    setLayout(prev => {
      if (prev.pages.length <= 1) return prev;
      const next = prev.pages.filter(p => p.id !== pageId);
      return { ...prev, pages: next, activePage: prev.activePage === pageId ? next[0].id : prev.activePage };
    });
  }, []);

  // Reorder pages
  const reorderPages = useCallback((pages) => {
    setLayout(prev => ({ ...prev, pages }));
  }, []);

  const value = {
    // State
    siteId, title, industry, status, layout, settings, loading, saveStatus, selectedId,
    activePage,

    // Setters
    setTitle, setIndustry, setSettings, setSelectedId,

    // Site ops
    loadSite, initSite, saveNow,

    // Layout ops
    updateLayout, setActivePage, addElements,
    updateElement, updateElementStyles, deleteElement, duplicateElement,
    patchActivePage, addPage, deletePage, reorderPages,
  };

  return (
    <CustomWebsiteContext.Provider value={value}>
      {children}
    </CustomWebsiteContext.Provider>
  );
}

export function useCustomWebsite() {
  const ctx = useContext(CustomWebsiteContext);
  if (!ctx) throw new Error("useCustomWebsite must be used within CustomWebsiteProvider");
  return ctx;
}