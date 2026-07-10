// src/pages/Templates/Custom/constants.js
// Single source of truth for all element types, factories, and defaults.

import { nanoid } from "nanoid";

// ─── Element type keys ────────────────────────────────────────────────────────
// ALL types that ElementRenderer + AI can generate.
// Keep in sync with ElementRenderer.jsx switch cases.
export const EL = {
  // Text
  HEADING:     "heading",
  SUBHEADING:  "subheading",
  PARAGRAPH:   "paragraph",
  LABEL:       "label",
  QUOTE:       "quote",
  LIST:        "list",

  // Media
  IMAGE:       "image",
  VIDEO:       "video",
  ICON:        "icon",
  AVATAR:      "avatar",
  LOGO:        "logo",
  GALLERY:     "gallery",

  // Layout
  SECTION:     "section",
  BG:          "bg",          // ← alias for section (AI sometimes emits "bg")
  CARD:        "card",
  COLUMNS:     "columns",
  CONTAINER:   "container",
  DIVIDER:     "divider",
  SPACER:      "spacer",

  // Interactive
  BUTTON:      "button",
  INPUT:       "input",
  FORM:        "form",
  COUNTDOWN:   "countdown",
  MAP:         "map",
  SOCIAL:      "social",
  TABS:        "tabs",

  // Navigation
  NAVBAR:      "navbar",
  FOOTER:      "footer",
  BREADCRUMB:  "breadcrumb",

  // Business blocks
  HERO:        "hero",
  STATS:       "stats",
  TESTIMONIAL: "testimonial",
  PRICING:     "pricing",
  TEAM:        "team",
  FEATURE:     "feature",
  SERVICE:     "service",
  PROPERTY:    "property",
  FAQ:         "faq",
  TIMELINE:    "timeline",
  LOGOSTRIP:   "logostrip",
  CTA:         "cta",
};

// ─── Base styles shared by all elements ───────────────────────────────────────
const BASE_STYLES = {
  fontFamily:    "inherit",
  fontWeight:    "400",
  fontSize:      16,
  color:         "#111827",
  textAlign:     "left",
  lineHeight:    1.6,
  letterSpacing: 0,
  opacity:       1,
  borderRadius:  0,
  padding:       0,
  bgColor:       "transparent",
  boxShadow:     "none",
};

// ─── createElement factory ────────────────────────────────────────────────────
export function createElement(type, overrides = {}) {
  const { styles: overrideStyles = {}, ...rest } = overrides;

  const base = {
    id:      nanoid(8),
    type,
    x:       80,
    y:       80,
    width:   400,
    height:  "auto",
    locked:  false,
    visible: true,
    content: "",
    styles:  { ...BASE_STYLES },
    ...rest,
    styles:  { ...BASE_STYLES, ...overrideStyles },
  };

  switch (type) {

    // ── TEXT ──────────────────────────────────────────────────────────────
    case EL.HEADING:
      return { ...base, content:"Your Heading", width:600,
        styles:{ ...base.styles, fontSize:48, fontWeight:"800", color:"#111827", lineHeight:1.15, letterSpacing:-1 }};

    case EL.SUBHEADING:
      return { ...base, content:"Section subheading that supports your main heading.", width:600,
        styles:{ ...base.styles, fontSize:22, fontWeight:"500", color:"#64748b", lineHeight:1.6 }};

    case EL.PARAGRAPH:
      return { ...base, content:"Your paragraph text goes here. Click to edit.", width:520,
        styles:{ ...base.styles, fontSize:16, color:"#374151", lineHeight:1.7 }};

    case EL.LABEL:
      return { ...base, content:"SECTION LABEL", width:200,
        styles:{ ...base.styles, fontSize:11, fontWeight:"700", color:"#6366f1", letterSpacing:3, textTransform:"uppercase" }};

    case EL.QUOTE:
      return { ...base, content:"Your inspiring quote goes here.", width:500,
        styles:{ ...base.styles, fontSize:20, fontStyle:"italic", color:"#374151", borderColor:"#6366f1" }};

    case EL.LIST:
      return { ...base, content:"Item one\nItem two\nItem three", width:400,
        styles:{ ...base.styles, fontSize:16, color:"#374151" }};

    // ── MEDIA ─────────────────────────────────────────────────────────────
    case EL.IMAGE:
    case EL.AVATAR:
    case EL.LOGO:
      return { ...base, src:"", alt:"Image", width:400, height:280,
        styles:{ ...base.styles, objectFit:"cover", borderRadius:8 }};

    case EL.VIDEO:
      return { ...base, src:"", width:560, height:315,
        styles:{ ...base.styles, borderRadius:8 }};

    case EL.ICON:
      return { ...base, content:"★", width:64, height:64,
        styles:{ ...base.styles, fontSize:32, color:"#6366f1", textAlign:"center" }};

    case EL.GALLERY:
      return { ...base, width:600, height:320,
        styles:{ ...base.styles, borderRadius:8 }};

    // ── LAYOUT ────────────────────────────────────────────────────────────
    case EL.SECTION:
    case EL.BG:
    case EL.HERO:
      return { ...base, x:0, y:0, width:1200, height:600,
        styles:{ ...base.styles, bgColor:"#0f172a" }};

    case EL.CARD:
      return { ...base, width:280, height:200,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:16, boxShadow:"0 4px 16px rgba(0,0,0,0.08),0 1px 4px rgba(0,0,0,0.04)", padding:28 }};

    case EL.CONTAINER:
    case EL.COLUMNS:
      return { ...base, width:800, height:300,
        styles:{ ...base.styles, bgColor:"transparent" }};

    case EL.DIVIDER:
      return { ...base, width:600, height:2,
        styles:{ ...base.styles, bgColor:"#e5e7eb" }};

    case EL.SPACER:
      return { ...base, width:200, height:48 };

    // ── INTERACTIVE ───────────────────────────────────────────────────────
    case EL.BUTTON:
      return { ...base, content:"Get Started", width:180, height:52, href:"",
        styles:{ ...base.styles, fontSize:15, fontWeight:"700", color:"#ffffff", bgColor:"#6366f1", borderRadius:8, textAlign:"center", boxShadow:"0 4px 14px rgba(99,102,241,0.40)" }};

    case EL.INPUT:
      return { ...base, content:"Type here…", width:360, height:48,
        styles:{ ...base.styles, fontSize:15, bgColor:"#ffffff", borderRadius:8, borderWidth:1, borderColor:"#e2e8f0" }};

    case EL.FORM:
      return { ...base, width:480, height:320,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:16, boxShadow:"0 4px 16px rgba(0,0,0,0.08)", padding:28 }};

    case EL.COUNTDOWN:
      return { ...base, width:500, height:120,
        styles:{ ...base.styles, fontSize:40, fontWeight:"800", color:"#0f172a" }};

    case EL.MAP:
      return { ...base, width:600, height:360,
        styles:{ ...base.styles, borderRadius:12 }};

    case EL.SOCIAL:
      return { ...base, width:200, height:50,
        styles:{ ...base.styles, bgColor:"#f1f5f9", borderColor:"#e2e8f0" }};

    case EL.TABS:
      return { ...base, content:"Tab 1|Tab 2|Tab 3", width:600, height:160,
        styles:{ ...base.styles, borderColor:"#e2e8f0", color:"#6366f1" }};

    // ── NAVIGATION ────────────────────────────────────────────────────────
    case EL.NAVBAR:
      return { ...base, x:0, y:0, content:"Brand", width:1200, height:64,
        styles:{ ...base.styles, bgColor:"#ffffff", fontSize:14, fontWeight:"600", color:"#111827", boxShadow:"0 1px 0 #e5e7eb", padding:40 }};

    case EL.FOOTER:
      return { ...base, x:0, width:1200, height:72, content:"© 2025 Company. All rights reserved.",
        styles:{ ...base.styles, bgColor:"#0f172a", color:"#94a3b8", fontSize:14, padding:40 }};

    case EL.BREADCRUMB:
      return { ...base, content:"Home|Page", width:300, height:40,
        styles:{ ...base.styles, fontSize:13, color:"#374151" }};

    // ── BUSINESS BLOCKS ───────────────────────────────────────────────────
    case EL.STATS:
      return { ...base, content:"2,847+|Projects Delivered", width:220, height:120,
        styles:{ ...base.styles, fontSize:56, fontWeight:"800", color:"#6366f1", textAlign:"center" }};

    case EL.TESTIMONIAL:
      return { ...base, content:"This completely changed how we work!|Sarah Chen|CEO, Acme Inc", width:340, height:260,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:20, boxShadow:"0 8px 24px rgba(0,0,0,0.10),0 2px 8px rgba(0,0,0,0.06)", padding:32, fontSize:16, color:"#374151", borderColor:"#f59e0b" }};

    case EL.PRICING:
      return { ...base, content:"Pro Plan|$79|/month|Everything you need to grow.|5 team members|Unlimited projects|Priority support|Custom domain|Advanced analytics", width:320, height:400,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:20, boxShadow:"0 8px 24px rgba(0,0,0,0.10)", padding:32, fontSize:48 }};

    case EL.TEAM:
      return { ...base, content:"Alex Johnson|Lead Designer|Creates beautiful, user-centered interfaces.", src:"", width:280, height:300,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:20, boxShadow:"0 4px 16px rgba(0,0,0,0.08)", padding:28, fontSize:17, color:"#0f172a", borderColor:"#e0e7ff" }};

    case EL.FEATURE:
      return { ...base, content:"Feature Title|Description of this feature and what it does for you.|✦", width:320, height:200,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:16, boxShadow:"0 4px 16px rgba(0,0,0,0.06)", padding:24, fontSize:18, color:"#0f172a", borderColor:"#6366f1" }};

    case EL.SERVICE:
      return { ...base, content:"Service Name|Description of this service and its key benefits.|⚙", width:320, height:120,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:12, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", padding:24, fontSize:16, color:"#0f172a", borderColor:"#6366f1" }};

    case EL.PROPERTY:
      return { ...base, content:"Modern Villa|$1,250,000|4 Bed • 3 Bath • 3,200 sqft", src:"", width:320, height:360,
        styles:{ ...base.styles, bgColor:"#ffffff", borderRadius:16, boxShadow:"0 8px 24px rgba(0,0,0,0.10)", fontSize:17, color:"#0f172a" }};

    case EL.FAQ:
      return { ...base, content:"What makes your service different?|We combine cutting-edge technology with deep industry expertise to deliver results that exceed expectations.", width:700, height:100,
        styles:{ ...base.styles, fontSize:17, fontWeight:"600", color:"#0f172a", borderColor:"#f1f5f9", padding:20 }};

    case EL.TIMELINE:
      return { ...base, content:"Company Founded|Started with a vision to transform digital experiences.|2019", width:500, height:100,
        styles:{ ...base.styles, fontSize:16, fontWeight:"700", color:"#0f172a", borderColor:"#6366f1", padding:16 }};

    case EL.LOGOSTRIP:
      return { ...base, x:0, content:"Microsoft|Google|Slack|Notion|Figma", width:1200, height:80,
        styles:{ ...base.styles, bgColor:"#f8fafc", color:"#94a3b8", fontSize:14, padding:40 }};

    case EL.CTA:
      return { ...base, x:0, content:"Ready to transform your digital presence? Let's build something extraordinary.", width:1200, height:200,
        styles:{ ...base.styles, bgType:"gradient", gradientFrom:"#6366f1", gradientTo:"#7c3aed", gradientDir:"135deg", fontSize:22, fontWeight:"600", color:"#ffffff", textAlign:"center", padding:60 }};

    default:
      return base;
  }
}

// ─── Page factory ─────────────────────────────────────────────────────────────
export function createPage(name = "New Page", pageType = "page", overrides = {}) {
  return {
    id:       nanoid(8),
    name,
    slug:     `/${name.toLowerCase().replace(/\s+/g, "-")}`,
    pageType,
    bgColor:  "#ffffff",
    bgType:   "solid",
    bgImage:  null,
    elements: [],
    ...overrides,
  };
}

// ─── Default layout ───────────────────────────────────────────────────────────
export function defaultCustomLayout() {
  const home = createPage("Home", "page", { slug: "/" });
  home.elements = [
    createElement(EL.NAVBAR, { x:0, y:0 }),
    createElement(EL.LABEL, { x:120, y:140, content:"WELCOME", styles:{ fontSize:11, fontWeight:"700", color:"#6366f1", letterSpacing:3, textTransform:"uppercase" } }),
    createElement(EL.HEADING, { x:120, y:170, content:"Hi, I'm [Your Name] 👋",
      styles:{ fontSize:64, fontWeight:"800", color:"#111827", lineHeight:1.1, letterSpacing:-2 } }),
    createElement(EL.PARAGRAPH, { x:120, y:300, width:560, content:"I build thoughtful digital products. Scroll down to see my work.",
      styles:{ fontSize:20, color:"#6b7280", lineHeight:1.6 } }),
    createElement(EL.BUTTON, { x:120, y:390, content:"View My Work →",
      styles:{ bgColor:"#111827", color:"#ffffff", fontSize:15, fontWeight:"700", borderRadius:8, boxShadow:"0 4px 14px rgba(0,0,0,0.3)" } }),
  ];
  return { pages:[home], activePage:home.id, canvasWidth:1200 };
}

// ─── Element palette for ElementLibrary.jsx ───────────────────────────────────
export const ELEMENT_PALETTE = [
  { type: EL.HEADING,     label: "Heading",     icon: "H1", desc: "Title or section header" },
  { type: EL.SUBHEADING,  label: "Subheading",  icon: "H2", desc: "Secondary heading" },
  { type: EL.PARAGRAPH,   label: "Paragraph",   icon: "¶",  desc: "Body text block" },
  { type: EL.LABEL,       label: "Label",       icon: "Aa", desc: "Uppercase tag / eyebrow" },
  { type: EL.BUTTON,      label: "Button",      icon: "▶",  desc: "CTA / action button" },
  { type: EL.IMAGE,       label: "Image",       icon: "🖼", desc: "Photo or graphic" },
  { type: EL.VIDEO,       label: "Video",       icon: "▶️", desc: "YouTube / Vimeo embed" },
  { type: EL.CARD,        label: "Card",        icon: "▣",  desc: "Content card with shadow" },
  { type: EL.DIVIDER,     label: "Divider",     icon: "─",  desc: "Horizontal rule" },
  { type: EL.SPACER,      label: "Spacer",      icon: "↕",  desc: "Vertical gap" },
  { type: EL.NAVBAR,      label: "Navbar",      icon: "≡",  desc: "Navigation bar" },
  { type: EL.FOOTER,      label: "Footer",      icon: "⊟",  desc: "Page footer" },
  { type: EL.STATS,       label: "Stats",       icon: "#",  desc: "Large number highlight" },
  { type: EL.TESTIMONIAL, label: "Testimonial", icon: "★",  desc: "Review / quote card" },
  { type: EL.PRICING,     label: "Pricing",     icon: "$",  desc: "Pricing card" },
  { type: EL.TEAM,        label: "Team",        icon: "👥", desc: "Team member card" },
  { type: EL.FEATURE,     label: "Feature",     icon: "✦",  desc: "Icon + text feature" },
  { type: EL.SERVICE,     label: "Service",     icon: "⚙",  desc: "Service card" },
  { type: EL.PROPERTY,    label: "Property",    icon: "🏠", desc: "Real estate listing" },
  { type: EL.FAQ,         label: "FAQ",         icon: "?",  desc: "Q&A accordion row" },
  { type: EL.FORM,        label: "Form",        icon: "✉",  desc: "Contact / lead form" },
  { type: EL.MAP,         label: "Map",         icon: "📍", desc: "Google Maps embed" },
  { type: EL.LOGOSTRIP,   label: "Logo Strip",  icon: "◈",  desc: "Brand logo row" },
  { type: EL.CTA,         label: "CTA Banner",  icon: "⚡", desc: "Call-to-action band" },
  { type: EL.TIMELINE,    label: "Timeline",    icon: "◎",  desc: "Steps / milestones" },
  { type: EL.SOCIAL,      label: "Social",      icon: "⬡",  desc: "Social media icons" },
  { type: EL.QUOTE,       label: "Quote",       icon: "❝",  desc: "Pull quote / blockquote" },
  { type: EL.LIST,        label: "List",        icon: "☰",  desc: "Bullet / numbered list" },
  { type: EL.ICON,        label: "Icon",        icon: "★",  desc: "Emoji / SVG icon" },
  { type: EL.COUNTDOWN,   label: "Countdown",   icon: "⏱", desc: "Timer / deadline" },
  { type: EL.TABS,        label: "Tabs",        icon: "⊞",  desc: "Tabbed content" },
];