// src/pages/Customize/customize-editor/custom/ElementLibrary.jsx
// Palette panel — drag tiles onto the canvas to add elements.

import React, { useState } from "react";

// ── Extended palette with sections ──────────────────────────────────────────
const SECTIONS = [
  {
    label: "Text",
    elements: [
      { type: "heading",    label: "Heading",     desc: "H1–H6 title",        icon: "H1", color: "#6366f1" },
      { type: "subheading", label: "Subheading",  desc: "Section subtitle",   icon: "H2", color: "#818cf8" },
      { type: "paragraph",  label: "Paragraph",   desc: "Body text block",    icon: "¶",  color: "#0ea5e9" },
      { type: "label",      label: "Label",       desc: "Small tag/badge",    icon: "Aa", color: "#a78bfa" },
      { type: "quote",      label: "Quote",       desc: "Blockquote / pull",  icon: "❝",  color: "#f472b6" },
      { type: "list",       label: "List",        desc: "Bullet / numbered",  icon: "☰",  color: "#34d399" },
    ],
  },
  {
    label: "Media",
    elements: [
      { type: "image",      label: "Image",       desc: "Photo / graphic",    icon: "🖼", color: "#10b981" },
      { type: "video",      label: "Video",       desc: "YouTube / Vimeo",    icon: "▶",  color: "#ef4444" },
      { type: "icon",       label: "Icon",        desc: "SVG / emoji icon",   icon: "★",  color: "#f59e0b" },
      { type: "avatar",     label: "Avatar",      desc: "Round profile pic",  icon: "👤", color: "#06b6d4" },
      { type: "logo",       label: "Logo",        desc: "Brand / logo image", icon: "◈",  color: "#8b5cf6" },
      { type: "gallery",    label: "Gallery",     desc: "Image grid",         icon: "⊞",  color: "#ec4899" },
    ],
  },
  {
    label: "Layout",
    elements: [
      { type: "section",    label: "Section",     desc: "Full-width block",   icon: "▬",  color: "#1d4ed8" },
      { type: "columns",    label: "Columns",     desc: "2 / 3 col grid",     icon: "⫿",  color: "#0891b2" },
      { type: "card",       label: "Card",        desc: "Content card",       icon: "▣",  color: "#ec4899" },
      { type: "divider",    label: "Divider",     desc: "Horizontal rule",    icon: "─",  color: "#8b5cf6" },
      { type: "spacer",     label: "Spacer",      desc: "Vertical gap",       icon: "↕",  color: "#6b7280" },
      { type: "container",  label: "Container",   desc: "Flex / grid box",    icon: "⬚",  color: "#64748b" },
    ],
  },
  {
    label: "Interactive",
    elements: [
      { type: "button",     label: "Button",      desc: "CTA / action btn",   icon: "▶",  color: "#f59e0b" },
      { type: "form",       label: "Form",        desc: "Contact / lead",     icon: "✉",  color: "#14b8a6" },
      { type: "input",      label: "Input",       desc: "Text field",         icon: "▭",  color: "#0ea5e9" },
      { type: "countdown",  label: "Countdown",   desc: "Timer / deadline",   icon: "⏱",  color: "#f43f5e" },
      { type: "map",        label: "Map",         desc: "Google Maps embed",  icon: "📍", color: "#22c55e" },
      { type: "social",     label: "Social",      desc: "Social link icons",  icon: "⬡",  color: "#3b82f6" },
    ],
  },
  {
    label: "Navigation",
    elements: [
      { type: "navbar",     label: "Navbar",      desc: "Top nav bar",        icon: "≡",  color: "#1d4ed8" },
      { type: "footer",     label: "Footer",      desc: "Page footer",        icon: "⊟",  color: "#475569" },
      { type: "breadcrumb", label: "Breadcrumb",  desc: "Path / crumbs",      icon: "›",  color: "#94a3b8" },
      { type: "tabs",       label: "Tabs",        desc: "Tabbed content",     icon: "⊞",  color: "#a78bfa" },
    ],
  },
  {
    label: "Business Blocks",
    elements: [
      { type: "hero",          label: "Hero",        desc: "Full hero section",   icon: "🚀", color: "#6366f1" },
      { type: "pricing",       label: "Pricing",     desc: "Pricing table",       icon: "$",  color: "#22c55e" },
      { type: "testimonial",   label: "Testimonial", desc: "Review / quote card", icon: "★",  color: "#f59e0b" },
      { type: "team",          label: "Team Card",   desc: "Member profile",      icon: "👥", color: "#0ea5e9" },
      { type: "stats",         label: "Stats",       desc: "Number highlights",   icon: "#",  color: "#ef4444" },
      { type: "faq",           label: "FAQ",         desc: "Accordion Q&A",       icon: "?",  color: "#8b5cf6" },
      { type: "feature",       label: "Feature",     desc: "Icon + text block",   icon: "✦",  color: "#14b8a6" },
      { type: "cta",           label: "CTA Banner",  desc: "Call-to-action band", icon: "⚡", color: "#f43f5e" },
      { type: "timeline",      label: "Timeline",    desc: "Steps / milestones",  icon: "◎",  color: "#a78bfa" },
      { type: "logostrip",     label: "Logo Strip",  desc: "Brand logos row",     icon: "◈",  color: "#64748b" },
      { type: "property",      label: "Property",    desc: "Real estate listing", icon: "🏠", color: "#10b981" },
      { type: "service",       label: "Service",     desc: "Service card",        icon: "⚙",  color: "#1d4ed8" },
    ],
  },
];

// ── Section Templates (one-click inserts) ────────────────────────────────────
const TEMPLATES = [
  { id: "marketing-hero",    label: "Marketing Hero",     tags: ["marketing", "agency"],    icon: "🚀", desc: "Bold hero + CTA + trust bar" },
  { id: "agency-services",   label: "Agency Services",    tags: ["agency", "marketing"],    icon: "💼", desc: "3-col icon service grid" },
  { id: "realestate-listing",label: "Property Listing",   tags: ["realestate"],             icon: "🏠", desc: "Photo + details + contact" },
  { id: "realestate-hero",   label: "RE Hero Section",    tags: ["realestate"],             icon: "🏡", desc: "Search bar + bg property photo" },
  { id: "saas-pricing",      label: "SaaS Pricing",       tags: ["saas", "startup"],        icon: "💰", desc: "3-tier pricing table" },
  { id: "portfolio-grid",    label: "Portfolio Grid",     tags: ["portfolio", "creative"],  icon: "🎨", desc: "Masonry project grid" },
  { id: "restaurant-menu",   label: "Restaurant Menu",    tags: ["restaurant", "food"],     icon: "🍽", desc: "Menu items with prices" },
  { id: "testimonials-row",  label: "Testimonials Row",   tags: ["all"],                    icon: "★",  desc: "3 review cards" },
  { id: "contact-form",      label: "Contact Form",       tags: ["all"],                    icon: "✉",  desc: "Name + email + message" },
  { id: "team-grid",         label: "Team Grid",          tags: ["agency", "startup"],      icon: "👥", desc: "Avatar + name + role" },
  { id: "stats-bar",         label: "Stats Bar",          tags: ["all"],                    icon: "#",  desc: "4 highlight numbers" },
  { id: "faq-accordion",     label: "FAQ Accordion",      tags: ["all"],                    icon: "?",  desc: "Collapsible Q&A list" },
];

const TAG_FILTERS = ["all", "marketing", "agency", "realestate", "saas", "portfolio", "restaurant"];

function ElementLibrary({ onInsertTemplate }) {
  const [dragging, setDragging] = useState(null);
  const [view, setView] = useState("elements"); // "elements" | "templates"
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [collapsed, setCollapsed] = useState({});

  const toggleSection = (label) => setCollapsed(p => ({ ...p, [label]: !p[label] }));

  // Filter elements by search
  const filteredSections = search.trim()
    ? SECTIONS.map(s => ({
        ...s,
        elements: s.elements.filter(e =>
          e.label.toLowerCase().includes(search.toLowerCase()) ||
          e.desc.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(s => s.elements.length > 0)
    : SECTIONS;

  // Filter templates by tag
  const filteredTemplates = TEMPLATES.filter(t =>
    tagFilter === "all" ? true : t.tags.includes(tagFilter)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ── View Toggle ── */}
      <div style={{ display: "flex", gap: 4, padding: "10px 12px 0", flexShrink: 0 }}>
        {["elements", "templates"].map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid",
              borderColor: view === v ? "#6366f1" : "#e5e7eb",
              background: view === v ? "#f0f0ff" : "#fafafa",
              color: view === v ? "#4f46e5" : "#6b7280",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.06em",
              transition: "all 0.15s",
            }}
          >
            {v === "elements" ? "🧩 Elements" : "⚡ Sections"}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      {view === "elements" && (
        <div style={{ padding: "8px 12px 4px", flexShrink: 0 }}>
          <input
            placeholder="Search elements…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "6px 10px", borderRadius: 8,
              border: "1px solid #e5e7eb", fontSize: 12, background: "#fafafa",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* ── Tag Filter (templates view) ── */}
      {view === "templates" && (
        <div style={{ padding: "8px 12px 4px", flexShrink: 0, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {TAG_FILTERS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tag)}
              style={{
                padding: "3px 10px", borderRadius: 20, border: "1px solid",
                borderColor: tagFilter === tag ? "#6366f1" : "#e5e7eb",
                background: tagFilter === tag ? "#6366f1" : "#fafafa",
                color: tagFilter === tag ? "#fff" : "#6b7280",
                fontSize: 10, fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 12px 16px" }}>

        {/* ELEMENTS VIEW */}
        {view === "elements" && filteredSections.map(({ label, elements }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(label)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 0 6px", marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {label}
              </span>
              <span style={{ fontSize: 10, color: "#9ca3af" }}>{collapsed[label] ? "▶" : "▼"}</span>
            </button>

            {!collapsed[label] && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {elements.map(({ type, label: elLabel, desc, icon, color }) => (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("element-type", type);
                      setDragging(type);
                    }}
                    onDragEnd={() => setDragging(null)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 5, padding: "10px 6px",
                      border: `1.5px solid ${dragging === type ? color : "#e5e7eb"}`,
                      borderRadius: 10,
                      background: dragging === type ? `${color}10` : "#fafafa",
                      cursor: "grab", transition: "all 0.15s", userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.background  = `${color}10`;
                      e.currentTarget.style.transform   = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      if (dragging !== type) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background  = "#fafafa";
                        e.currentTarget.style.transform   = "translateY(0)";
                      }
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, color,
                    }}>
                      {icon}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#374151", textAlign: "center" }}>
                      {elLabel}
                    </span>
                    <span style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", lineHeight: 1.3 }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* TEMPLATES VIEW */}
        {view === "templates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, lineHeight: 1.5 }}>
              One-click insert pre-built section blocks for any website type.
            </p>
            {filteredTemplates.map(({ id, label, desc, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onInsertTemplate?.(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  border: "1.5px solid #e5e7eb", background: "#fafafa",
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.background  = "#f0f0ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.background  = "#fafafa";
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{desc}</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "#6366f1", fontWeight: 700, flexShrink: 0 }}>
                  + Add
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ── Footer tip ── */}
      <div style={{
        flexShrink: 0, padding: "8px 12px 10px",
        borderTop: "1px solid #f3f4f6",
        background: "#f0f0ff",
        fontSize: 10, color: "#4f46e5", lineHeight: 1.5,
      }}>
        <strong>Tip:</strong> Drag elements to canvas · Click to select · Style in Style tab
      </div>
    </div>
  );
}

export default ElementLibrary;