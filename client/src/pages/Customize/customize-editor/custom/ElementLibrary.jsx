// src/pages/Customize/customize-editor/custom/ElementLibrary.jsx
// Palette panel — drag tiles onto the canvas to add elements.

import React, { useState } from "react";
import {
  Heading1, Heading2, Pilcrow, Tag, Quote, List,
  Image, Play, Star, CircleUser, Hexagon, LayoutGrid,
  RectangleHorizontal, Columns3, CreditCard, Minus, MoveVertical, Box,
  MousePointerClick, Mail, TextCursorInput, Timer, MapPin, Share2,
  Menu, PanelBottom, ChevronsRight, Layers,
  Rocket, DollarSign, MessageSquareQuote, Users, Hash, HelpCircle,
  Sparkles, Zap, Home, Wrench, Briefcase, UtensilsCrossed, Palette,
  BarChart3, ListChecks, Search, ChevronDown, ChevronRight, Puzzle,
} from "lucide-react";
import { T, inputStyle, sectionLabelStyle } from "./ui";

// ── Extended palette with sections ──────────────────────────────────────────
const SECTIONS = [
  {
    label: "Text",
    elements: [
      { type: "heading",    label: "Heading",     desc: "H1-H6 title",        Icon: Heading1,   color: "#818cf8" },
      { type: "subheading", label: "Subheading",  desc: "Section subtitle",   Icon: Heading2,   color: "#a5b4fc" },
      { type: "paragraph",  label: "Paragraph",   desc: "Body text block",    Icon: Pilcrow,    color: "#38bdf8" },
      { type: "label",      label: "Label",       desc: "Small tag/badge",    Icon: Tag,        color: "#c4b5fd" },
      { type: "quote",      label: "Quote",       desc: "Blockquote / pull",  Icon: Quote,      color: "#f9a8d4" },
      { type: "list",       label: "List",        desc: "Bullet / numbered",  Icon: List,       color: "#6ee7b7" },
    ],
  },
  {
    label: "Media",
    elements: [
      { type: "image",      label: "Image",       desc: "Photo / graphic",    Icon: Image,      color: "#34d399" },
      { type: "video",      label: "Video",       desc: "YouTube / Vimeo",    Icon: Play,       color: "#f87171" },
      { type: "icon",       label: "Icon",        desc: "SVG icon",           Icon: Star,       color: "#fbbf24" },
      { type: "avatar",     label: "Avatar",      desc: "Round profile pic",  Icon: CircleUser, color: "#22d3ee" },
      { type: "logo",       label: "Logo",        desc: "Brand / logo image", Icon: Hexagon,    color: "#a78bfa" },
      { type: "gallery",    label: "Gallery",     desc: "Image grid",         Icon: LayoutGrid, color: "#f472b6" },
    ],
  },
  {
    label: "Layout",
    elements: [
      { type: "section",    label: "Section",     desc: "Full-width block",   Icon: RectangleHorizontal, color: "#60a5fa" },
      { type: "columns",    label: "Columns",     desc: "2 / 3 col grid",     Icon: Columns3,   color: "#22d3ee" },
      { type: "card",       label: "Card",        desc: "Content card",       Icon: CreditCard, color: "#f472b6" },
      { type: "divider",    label: "Divider",     desc: "Horizontal rule",    Icon: Minus,      color: "#a78bfa" },
      { type: "spacer",     label: "Spacer",      desc: "Vertical gap",       Icon: MoveVertical, color: "#9ca3af" },
      { type: "container",  label: "Container",   desc: "Flex / grid box",    Icon: Box,        color: "#94a3b8" },
    ],
  },
  {
    label: "Interactive",
    elements: [
      { type: "button",     label: "Button",      desc: "CTA / action btn",   Icon: MousePointerClick, color: "#fbbf24" },
      { type: "form",       label: "Form",        desc: "Contact / lead",     Icon: Mail,       color: "#2dd4bf" },
      { type: "input",      label: "Input",       desc: "Text field",         Icon: TextCursorInput, color: "#38bdf8" },
      { type: "countdown",  label: "Countdown",   desc: "Timer / deadline",   Icon: Timer,      color: "#fb7185" },
      { type: "map",        label: "Map",         desc: "Google Maps embed",  Icon: MapPin,     color: "#4ade80" },
      { type: "social",     label: "Social",      desc: "Social link icons",  Icon: Share2,     color: "#60a5fa" },
    ],
  },
  {
    label: "Navigation",
    elements: [
      { type: "navbar",     label: "Navbar",      desc: "Top nav bar",        Icon: Menu,       color: "#60a5fa" },
      { type: "footer",     label: "Footer",      desc: "Page footer",        Icon: PanelBottom, color: "#94a3b8" },
      { type: "breadcrumb", label: "Breadcrumb",  desc: "Path / crumbs",      Icon: ChevronsRight, color: "#cbd5e1" },
      { type: "tabs",       label: "Tabs",        desc: "Tabbed content",     Icon: Layers,     color: "#c4b5fd" },
    ],
  },
  {
    label: "Business Blocks",
    elements: [
      { type: "hero",          label: "Hero",        desc: "Full hero section",   Icon: Rocket,     color: "#818cf8" },
      { type: "pricing",       label: "Pricing",     desc: "Pricing table",       Icon: DollarSign, color: "#4ade80" },
      { type: "testimonial",   label: "Testimonial", desc: "Review / quote card", Icon: MessageSquareQuote, color: "#fbbf24" },
      { type: "team",          label: "Team Card",   desc: "Member profile",      Icon: Users,      color: "#38bdf8" },
      { type: "stats",         label: "Stats",       desc: "Number highlights",   Icon: BarChart3,  color: "#f87171" },
      { type: "faq",           label: "FAQ",         desc: "Accordion Q&A",       Icon: HelpCircle, color: "#a78bfa" },
      { type: "feature",       label: "Feature",     desc: "Icon + text block",   Icon: Sparkles,   color: "#2dd4bf" },
      { type: "cta",           label: "CTA Banner",  desc: "Call-to-action band", Icon: Zap,        color: "#fb7185" },
      { type: "timeline",      label: "Timeline",    desc: "Steps / milestones",  Icon: ListChecks, color: "#c4b5fd" },
      { type: "logostrip",     label: "Logo Strip",  desc: "Brand logos row",     Icon: Hexagon,    color: "#94a3b8" },
      { type: "property",      label: "Property",    desc: "Real estate listing", Icon: Home,       color: "#34d399" },
      { type: "service",       label: "Service",     desc: "Service card",        Icon: Wrench,     color: "#60a5fa" },
    ],
  },
];

// ── Section Templates (one-click inserts) ────────────────────────────────────
const TEMPLATES = [
  { id: "marketing-hero",    label: "Marketing Hero",     tags: ["marketing", "agency"],    Icon: Rocket,      desc: "Bold hero + CTA + trust bar" },
  { id: "agency-services",   label: "Agency Services",    tags: ["agency", "marketing"],    Icon: Briefcase,   desc: "3-col icon service grid" },
  { id: "realestate-listing",label: "Property Listing",   tags: ["realestate"],             Icon: Home,        desc: "Photo + details + contact" },
  { id: "realestate-hero",   label: "RE Hero Section",    tags: ["realestate"],             Icon: MapPin,      desc: "Search bar + bg property photo" },
  { id: "saas-pricing",      label: "SaaS Pricing",       tags: ["saas", "startup"],        Icon: DollarSign,  desc: "3-tier pricing table" },
  { id: "portfolio-grid",    label: "Portfolio Grid",     tags: ["portfolio", "creative"],  Icon: Palette,     desc: "Masonry project grid" },
  { id: "restaurant-menu",   label: "Restaurant Menu",    tags: ["restaurant", "food"],     Icon: UtensilsCrossed, desc: "Menu items with prices" },
  { id: "testimonials-row",  label: "Testimonials Row",   tags: ["all"],                    Icon: Star,        desc: "3 review cards" },
  { id: "contact-form",      label: "Contact Form",       tags: ["all"],                    Icon: Mail,        desc: "Name + email + message" },
  { id: "team-grid",         label: "Team Grid",          tags: ["agency", "startup"],      Icon: Users,       desc: "Avatar + name + role" },
  { id: "stats-bar",         label: "Stats Bar",          tags: ["all"],                    Icon: Hash,        desc: "4 highlight numbers" },
  { id: "faq-accordion",     label: "FAQ Accordion",      tags: ["all"],                    Icon: HelpCircle,  desc: "Collapsible Q&A list" },
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
      <div style={{ display: "flex", gap: 4, padding: "12px 16px 0", flexShrink: 0 }}>
        {[
          { key: "elements",  label: "Elements", Icon: Puzzle },
          { key: "templates", label: "Sections", Icon: Zap    },
        ].map(({ key, label, Icon }) => {
          const active = view === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              title={`Show ${label.toLowerCase()}`}
              style={{
                flex: 1, padding: "6px 0", borderRadius: 6,
                border: `1px solid ${active ? T.accentBorder : T.border}`,
                background: active ? T.accentSoft : T.input,
                color: active ? T.accentText : T.textDim,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                textTransform: "uppercase", letterSpacing: "0.06em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                transition: "all 0.15s",
              }}
            >
              <Icon size={11} /> {label}
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      {view === "elements" && (
        <div style={{ padding: "8px 16px 4px", flexShrink: 0, position: "relative" }}>
          <Search size={12} color={T.textFaint} style={{ position: "absolute", left: 26, top: "50%", transform: "translateY(-38%)" }} />
          <input
            placeholder="Search elements…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, padding: "6px 10px 6px 28px" }}
          />
        </div>
      )}

      {/* ── Tag Filter (templates view) ── */}
      {view === "templates" && (
        <div style={{ padding: "8px 16px 4px", flexShrink: 0, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {TAG_FILTERS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tag)}
              title={`Filter: ${tag}`}
              style={{
                padding: "3px 10px", borderRadius: 20,
                border: `1px solid ${tagFilter === tag ? T.accentBorder : T.border}`,
                background: tagFilter === tag ? T.accent : T.input,
                color: tagFilter === tag ? "#fff" : T.textDim,
                fontSize: 10, fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize", transition: "all 0.15s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 16px 16px" }}>

        {/* ELEMENTS VIEW */}
        {view === "elements" && filteredSections.map(({ label, elements }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(label)}
              title={collapsed[label] ? `Expand ${label}` : `Collapse ${label}`}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 0 6px", marginBottom: 4,
              }}
            >
              <span style={sectionLabelStyle}>{label}</span>
              {collapsed[label]
                ? <ChevronRight size={11} color={T.textFaint} />
                : <ChevronDown size={11} color={T.textFaint} />}
            </button>

            {!collapsed[label] && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {elements.map(({ type, label: elLabel, desc, Icon, color }) => (
                  <div
                    key={type}
                    draggable
                    title={`Drag ${elLabel} onto the canvas`}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("element-type", type);
                      setDragging(type);
                    }}
                    onDragEnd={() => setDragging(null)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      gap: 5, padding: "10px 6px",
                      border: `1px solid ${dragging === type ? color : T.border}`,
                      borderRadius: 8,
                      background: dragging === type ? `${color}18` : T.input,
                      cursor: "grab", transition: "all 0.15s", userSelect: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.background  = `${color}18`;
                      e.currentTarget.style.transform   = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      if (dragging !== type) {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.background  = T.input;
                        e.currentTarget.style.transform   = "translateY(0)";
                      }
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${color}1f`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={15} color={color} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: T.text, textAlign: "center" }}>
                      {elLabel}
                    </span>
                    <span style={{ fontSize: 9, color: T.textFaint, textAlign: "center", lineHeight: 1.3 }}>
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
            <p style={{ fontSize: 11, color: T.textDim, marginBottom: 4, lineHeight: 1.5 }}>
              One-click insert pre-built section blocks for any website type.
            </p>
            {filteredTemplates.map(({ id, label, desc, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onInsertTemplate?.(id)}
                title={`Insert ${label}`}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 8,
                  border: `1px solid ${T.border}`, background: T.input,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.accentBorder;
                  e.currentTarget.style.background  = T.accentSoft;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.background  = T.input;
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: T.accentSoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={15} color={T.accentText} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{label}</div>
                  <div style={{ fontSize: 10, color: T.textFaint, marginTop: 2 }}>{desc}</div>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 10, color: T.accentText, fontWeight: 700, flexShrink: 0 }}>
                  + Add
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* ── Footer tip ── */}
      <div style={{
        flexShrink: 0, padding: "8px 16px 10px",
        borderTop: `1px solid ${T.border}`,
        background: T.panelAlt,
        fontSize: 10, color: T.textDim, lineHeight: 1.5,
      }}>
        <strong style={{ color: T.text }}>Tip:</strong> Drag elements to canvas. Click to select. Style in the Style tab.
      </div>
    </div>
  );
}

export default ElementLibrary;
