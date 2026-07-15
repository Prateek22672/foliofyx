// src/pages/Customize/customize-editor/custom/CustomEditorPanel.jsx

import React, { useState, createContext, useContext } from "react";
import {
  LayoutTemplate, Library, Sliders, Settings, Sparkles,
  Zap, Target, Check, AlertTriangle, Lightbulb,
} from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

import PageManager    from "./PageManager";
import ElementLibrary from "./ElementLibrary";
import PropertyPanel  from "./PropertyPanel";
import PageSettings   from "./PageSettings";
import { generateSection } from "../../../../api/aiBuilderAPI";
import { T, inputStyle } from "./ui";

export const CanvasSelectionContext = createContext({ selectedId: null, setSelectedId: () => {} });
export function useCanvasSelection() { return useContext(CanvasSelectionContext); }

const TABS = [
  { id: "pages",        label: "Pages",  Icon: LayoutTemplate },
  { id: "elements",     label: "Add",    Icon: Library        },
  { id: "properties",   label: "Style",  Icon: Sliders        },
  { id: "pagesettings", label: "Page",   Icon: Settings       },
  { id: "ai",           label: "AI",     Icon: Sparkles       },
];

// ── Detect industry for the live UI badge ─────────────────────────────────────
// NOTE: The authoritative RAG/industry pipeline + the Groq call now run on the
// server (POST /api/ai-builder/generate). This client copy only powers the
// "Detected industry" preview chip while the user types — it sends no secrets.
function detectIndustry(prompt = "") {
  const p = prompt.toLowerCase();
  // Kept in sync with the server's detectIndustry (aiBuilderController.js).
  if (/real.?estat|propert|listing|realtor|house|apartment|condo|for sale|for rent/.test(p)) return "realestate";
  if (/restaurant|food|menu|chef|dining|cuisine|cafe|bistro|eatery|bar & grill/.test(p)) return "restaurant";
  if (/saas|software|app|dashboard|platform|startup|api|b2b|tool|product/.test(p)) return "saas";
  if (/portfolio|designer|developer|freelance|photographer|my work|personal site|resume/.test(p)) return "portfolio";
  if (/ecommerce|e-commerce|shop|store|cart|fashion|product launch|dtc/.test(p)) return "ecommerce";
  if (/law|legal|attorney|counsel|law firm|lawyer|advocate/.test(p)) return "law";
  if (/hotel|resort|hospitality|spa|villa|booking/.test(p)) return "hotel";
  if (/agency|marketing|digital|seo|advertis|campaign|branding/.test(p)) return "marketing";
  return "general";
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  { label: "Agency hero",              prompt: "Dark cinematic marketing agency hero. Full-bleed office photo + heavy dark gradient overlay. Small label 'AWARD-WINNING DIGITAL AGENCY'. Massive bold headline 'We Build Digital Experiences That Define Industries'. Descriptive subheading. Two CTA buttons: 'Start a Project' (primary gradient) and 'View Our Work' (outlined white). Bottom trust bar with 3 client logos." },
  { label: "Real estate hero",         prompt: "Luxury real estate website hero. Full-width aerial neighborhood photo + dark warm overlay. Large serif headline 'Find Where Your Story Begins'. Elegant subheading. Prominent search bar with Location / Property Type / Price Range inputs + Search button. Below search: 3 trust stats (12,847 Listings / 1,203 Sold This Month / $4.2B in Sales)." },
  { label: "Property listing",         prompt: "Luxury property listing section. Cream warm background. Large property photo (modern villa). Address '2847 Sunset Ridge Drive, Beverly Hills CA 90210'. Price '$4,250,000' (large accent). Stats row: 5 Bed / 4.5 Bath / 5,200 sqft / 2-Car Garage. Rich 2-paragraph description. Two buttons: Schedule Tour + Request Info. Agent card." },
  { label: "SaaS pricing",             prompt: "Clean modern SaaS pricing section. Light bg. Label 'PRICING PLANS'. Heading 'Simple, Transparent Pricing'. 3 pricing cards: Starter $29/mo (white bordered), Pro $79/mo (indigo-violet gradient, MOST POPULAR badge, white text, colored shadow), Enterprise $199/mo (white bordered). Each: 5 specific feature lines with checkmarks, CTA button." },
  { label: "Restaurant menu",          prompt: "Upscale restaurant menu section. Very dark warm bg (#1a0f06). Label 'SEASONAL MENU' in amber uppercase. Elegant serif heading 'Crafted With Passion & Purpose'. Subheading. 4 dish cards in 2x2 grid: each with food photo, dish name, chef's description, ingredients note, price. Rich amber and cream palette." },
  { label: "Team section",             prompt: "Premium team section. Very light warm bg. Label 'THE TEAM'. Heading 'The Minds Behind The Magic'. Subheading about expertise. 3 team member cards side by side: circular portrait photo, full name (Alex Mercer / Sarah Chen / Marcus Williams), specific title, 2-line personal philosophy bio. White cards, borderRadius 20, lifted shadow." },
  { label: "Testimonials",             prompt: "Premium testimonials section. Soft gray bg. Label 'CLIENT STORIES'. Heading 'Results That Speak For Themselves'. 3 testimonial cards: large faded decorative quote mark, specific 3-sentence testimonial mentioning measurable results, client full name and company role, 5 gold stars. White rounded cards, medium lifted shadow." },
  { label: "Stats bar",                prompt: "Bold achievement stats section. Deep dark bg gradient #0f172a to #1e293b. No heading needed. 4 giant stats side by side in full width: '2,847 Projects Delivered' / '$142M Revenue Generated' / '98.3% Client Satisfaction' / '14 Industry Awards'. Each: giant accent-colored number 64px+, descriptive label below in muted color, thin top accent line." },
  { label: "Services grid",            prompt: "Premium services section. White bg. Label 'WHAT WE DO'. Heading 'End-to-End Digital Excellence'. Subheading about approach. 6 service cards in 2-row grid (3 per row): Brand Strategy / UI-UX Design / Web Development / Digital Marketing / SEO & Content / Analytics & CRO. Each: colored icon circle, bold title, 2-line specific description of deliverables." },
  { label: "Portfolio grid",           prompt: "Dark cinematic portfolio section. bg #0a0a0f. Label 'SELECTED WORK'. Heading 'Projects That Define Us'. 3 large project cards (h:360): full project screenshot image, gradient overlay bottom for text legibility, project category label, bold project name, 1-line description, 'View Case Study' link. Cinematic feel." },
  { label: "About us",                 prompt: "Premium about us section. 2-column layout. Left: beautiful office team photo with small floating achievement card ('15+ Years of Excellence'). Right: label 'OUR STORY', bold heading 'Built on Trust, Driven by Results', 2 compelling paragraphs about mission and innovation, 3 horizontal achievement stat rows (500+ Clients / $142M Revenue / 98.3% Satisfaction), 'Meet Our Team' button." },
  { label: "FAQ section",              prompt: "Clean premium FAQ section. Light warm bg. Label 'FAQ'. Heading 'Everything You Need To Know'. Subheading. 6 FAQ rows: bold specific question (digital agency context), detailed helpful answer paragraph, thin divider. Clean readable typography." },
  { label: "CTA newsletter",           prompt: "High-conversion CTA newsletter banner. Bold indigo-violet gradient background. Centered. Heading 'Join 14,000+ Growth-Focused Teams'. Subheading about weekly insights and exclusive resources. Email input field + 'Get Free Access' gradient button side by side. Below: 3 micro trust signals (No spam ever / Cancel anytime / Read by 14k+ founders). Very impactful." },
  { label: "Product hero",             prompt: "Premium ecommerce product hero. 2-column layout. Left: large clean product image on subtle soft gradient bg, borderRadius 20. Right: brand label, product name 'Apex Pro ANC Headphones', price '$349' with crossed out $499, star rating 4.9 with review count (2,847 reviews), 4 feature highlight badges (40hr battery / Active Noise Cancel / Hi-Res Audio / Water Resistant), color variant swatches row, Add to Cart gradient button, Add to Wishlist secondary link." },
  { label: "Law firm hero",            prompt: "Authoritative law firm hero. Dark professional bg + courthouse/justice photo + dark overlay. Small gold label 'TRUSTED LEGAL COUNSEL SINCE 1987'. Powerful bold headline 'Your Rights. Our Mission. Your Victory.' Credibility subheading about track record and success rate. Two buttons: Free Consultation (gold gradient) + Our Practice Areas (outlined). 3 trust stats below: 500+ Cases Won / $200M Recovered / 35+ Years Experience." },
  { label: "Luxury hotel hero",        prompt: "5-star luxury hotel hero. Full-width aerial resort photo + elegant dark gradient overlay. Ultra-small label 'LUXURY COLLECTION'. Large elegant serif headline 'An Escape Beyond Ordinary'. Atmospheric subheading. Two refined buttons: Book Your Stay (gold) + Explore Rooms (outlined). 3 amenity highlights row below: Infinity Pool & Spa / Award-Winning Cuisine / Private Villa Suites." },
];

// ── AI Builder Panel ──────────────────────────────────────────────────────────
function AIBuilderPanel() {
  const { setPortfolioData } = usePortfolio();
  const [prompt,  setPrompt]  = useState("");
  const [status,  setStatus]  = useState("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const [count,   setCount]   = useState(0);
  const [info,    setInfo]    = useState("");
  const [detected, setDetected] = useState("");

  const getLayout = (pd) => pd?.customLayout ?? { pages: [], activePage: null };

  const handleGenerate = async () => {
    if (!prompt.trim() || status === "loading") return;
    setDetected(detectIndustry(prompt));
    setStatus("loading"); setErrMsg(""); setCount(0); setInfo("Designing your section…");
    try {
      // Server runs the RAG pipeline + Groq and returns validated elements.
      const { elements, industry } = await generateSection(prompt);
      if (industry) setDetected(industry);
      if (!Array.isArray(elements) || elements.length === 0) {
        throw new Error("The AI returned no elements. Try rephrasing your prompt.");
      }
      setPortfolioData(prev => {
        const l = getLayout(prev);
        if (!l.activePage) {
          setErrMsg("Add a page first (Pages tab), then generate.");
          return prev;
        }
        const page = l.pages.find(p => p.id === l.activePage);
        const existing = page?.elements || [];
        // Stack new content below whatever is already on the page (no overlap).
        const offset = existing.length
          ? Math.max(0, ...existing.map(e => (e.y || 0) + (e.height === "auto" ? 80 : (e.height || 0)))) + 40
          : 0;
        const placed = elements.map(e => ({ ...e, y: (e.y || 0) + offset }));
        return {
          ...prev,
          customLayout: {
            ...l,
            pages: l.pages.map(p =>
              p.id === l.activePage
                ? { ...p, elements: [...(p.elements || []), ...placed] }
                : p
            ),
          },
        };
      });
      setCount(elements.length);
      setStatus("success");
    } catch (err) {
      console.error("[AI]", err);
      setErrMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const reset = () => { setStatus("idle"); setErrMsg(""); setCount(0); setInfo(""); setDetected(""); };

  const industryColors = {
    marketing: "#818cf8", realestate: "#34d399", saas: "#818cf8",
    restaurant: "#fbbf24", portfolio: "#a78bfa", ecommerce: "#38bdf8",
    law: "#fbbf24", hotel: "#fbbf24", general: "#818cf8",
  };
  const iColor = industryColors[detected] || "#818cf8";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 12,
          background: T.accentSoft, borderRadius: 8, border: `1px solid ${T.accentBorder}`,
        }}>
          <Sparkles size={15} color={T.accentText} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>AI Section Builder</div>
            <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>Industry-aware, premium quality, auto-retry</div>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 9, fontWeight: 800, color: "#0a0a0a",
            background: "#fff", padding: "2px 8px", borderRadius: 20,
          }}>
            <Zap size={9} /> Groq
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>

        {/* IDLE / ERROR */}
        {(status === "idle" || status === "error") && (
          <>
            <textarea
              value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={"Describe the section you want…\n\nAI auto-detects your industry (real estate, SaaS, restaurant, agency…) and applies the perfect color palette, fonts, and layout style automatically."}
              rows={4}
              style={{
                ...inputStyle,
                padding: "10px 12px", borderRadius: 8,
                border: `1px solid ${status === "error" ? "rgba(248,113,113,0.5)" : T.border}`,
                resize: "none", lineHeight: 1.6, fontFamily: "inherit",
              }}
              onFocus={e => { if (status !== "error") e.target.style.borderColor = T.accentBorder; }}
              onBlur={e  => { if (status !== "error") e.target.style.borderColor = T.border; }}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
            />

            {/* Industry detection preview */}
            {prompt.trim().length > 10 && (
              <div style={{
                marginTop: 8, padding: "5px 10px", borderRadius: 6,
                background: T.input, border: `1px solid ${T.border}`,
                fontSize: 10, color: T.textDim, display: "flex", alignItems: "center", gap: 6,
              }}>
                <Target size={11} color={iColor} />
                <span>Detected industry:</span>
                <span style={{ fontWeight: 700, color: iColor, textTransform: "capitalize" }}>
                  {detectIndustry(prompt)}
                </span>
                <span style={{ marginLeft: "auto", opacity: 0.6 }}>palette + fonts auto-applied</span>
              </div>
            )}

            {status === "error" && (
              <div style={{
                marginTop: 8, padding: "8px 10px", borderRadius: 6,
                background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.35)",
                fontSize: 11, color: "#fca5a5", lineHeight: 1.5,
                display: "flex", alignItems: "flex-start", gap: 6,
              }}>
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 1 }} /> {errMsg}
              </div>
            )}

            <button type="button" disabled={!prompt.trim()} onClick={handleGenerate}
              title="Generate section (Ctrl+Enter)"
              style={{
                marginTop: 10, width: "100%", padding: "9px 0", borderRadius: 8, border: "none",
                background: prompt.trim() ? "#ffffff" : T.input,
                color: prompt.trim() ? "#0a0a0a" : T.textFaint,
                fontSize: 12, fontWeight: 700,
                cursor: prompt.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "opacity 0.15s",
              }}>
              <Zap size={13} /> Generate Premium Section
              <span style={{ opacity: 0.5, fontSize: 10 }}>Ctrl+Enter</span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 8px" }}>
              <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
              <span style={{ fontSize: 9, color: T.textFaint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Prompts</span>
              <div style={{ flex: 1, height: 1, background: T.borderSoft }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {QUICK_PROMPTS.map(({ label, prompt: qp }) => {
                const sel = prompt === qp;
                return (
                  <button key={label} type="button" onClick={() => setPrompt(qp)}
                    title="Use this prompt"
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                      borderRadius: 6, width: "100%",
                      border: `1px solid ${sel ? T.accentBorder : T.border}`,
                      background: sel ? T.accentSoft : T.input,
                      color: sel ? T.accentText : T.textDim,
                      fontSize: 11, fontWeight: sel ? 700 : 500, textAlign: "left",
                      cursor: "pointer", transition: "all 0.12s",
                    }}
                    onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = T.accentBorder; e.currentTarget.style.color = T.text; }}}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}}
                  >
                    <Zap size={11} style={{ flexShrink: 0, opacity: 0.7 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Industry badge */}
            {detected && (
              <div style={{
                padding: "6px 12px", borderRadius: 6, background: `${iColor}15`,
                border: `1px solid ${iColor}40`, fontSize: 10, fontWeight: 700, color: iColor,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Target size={11} /> {detected.toUpperCase()} palette + fonts applied
              </div>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              background: T.input, borderRadius: 8, border: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                border: `2.5px solid ${T.border}`, borderTopColor: T.accent,
                animation: "groq-spin 0.7s linear infinite", flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{info || "Crafting premium section…"}</div>
                <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>Industry-aware design system active</div>
              </div>
            </div>

            {[100, 72, 88, 58, 78].map((w, i) => (
              <div key={i} style={{
                height: 9, width: `${w}%`, borderRadius: 5,
                background: "linear-gradient(90deg,#1a1a1a 25%,#2b2b2b 50%,#1a1a1a 75%)",
                backgroundSize: "200% 100%",
                animation: "groq-shimmer 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s`,
              }} />
            ))}
            <style>{`@keyframes groq-spin{to{transform:rotate(360deg)}}@keyframes groq-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {detected && (
              <div style={{
                padding: "5px 12px", borderRadius: 6, background: `${iColor}15`,
                border: `1px solid ${iColor}40`, fontSize: 10, fontWeight: 700, color: iColor,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Target size={11} /> {detected.toUpperCase()} industry template applied
              </div>
            )}
            <div style={{
              padding: 16, background: T.accentSoft, borderRadius: 10,
              border: `1px solid ${T.accentBorder}`, textAlign: "center",
            }}>
              <Check size={26} color={T.success} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{count} premium elements placed</div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>Scroll the canvas to see your section</div>
            </div>

            <div style={{
              padding: "8px 10px", background: T.input, borderRadius: 6,
              border: `1px solid ${T.border}`, fontSize: 10, color: T.textDim, lineHeight: 1.6,
            }}>
              <strong style={{ color: T.text }}>Prompt: </strong>
              <span style={{ fontStyle: "italic" }}>{prompt.slice(0, 100)}{prompt.length > 100 ? "…" : ""}</span>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={reset}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 6, border: "none",
                  background: "#ffffff", color: "#0a0a0a",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                <Zap size={12} /> Generate More
              </button>
              <button type="button" onClick={() => { setStatus("idle"); setPrompt(""); setDetected(""); }}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 6,
                  border: `1px solid ${T.border}`, background: T.input, color: T.text,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>
                New Prompt
              </button>
            </div>

            <div style={{
              padding: "8px 10px", background: T.input, borderRadius: 6,
              border: `1px solid ${T.border}`, fontSize: 10, color: T.textDim, lineHeight: 1.6,
              display: "flex", alignItems: "flex-start", gap: 6,
            }}>
              <Lightbulb size={11} style={{ flexShrink: 0, marginTop: 1, color: T.warn }} />
              <span><strong style={{ color: T.text }}>Refine:</strong> Click any element, then open the <em>Style tab</em> to adjust colors, fonts, shadows, spacing.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
function CustomEditorPanel({ selectedId, onDelete, onDuplicate, onInsertTemplate }) {
  const [activeTab, setActiveTab] = useState("pages");
  React.useEffect(() => { if (selectedId) setActiveTab("properties"); }, [selectedId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: T.panel, color: T.text }}>
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.panelAlt, flexShrink: 0 }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button key={id} type="button" onClick={() => setActiveTab(id)}
              title={`${label} tab`}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "9px 2px 8px", border: "none",
                background: isActive ? T.panel : "transparent",
                borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
                color: isActive ? T.text : T.textFaint,
                cursor: "pointer", fontSize: 9, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.07em",
                transition: "color 0.15s, background 0.15s", position: "relative",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.textDim; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.textFaint; }}
            >
              <Icon size={14} />{label}
              {id === "properties" && selectedId && (
                <span style={{ position: "absolute", top: 5, right: 8, width: 5, height: 5, borderRadius: "50%", background: T.accent }} />
              )}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "pages"        && <PageManager />}
        {activeTab === "elements"     && <ElementLibrary onInsertTemplate={onInsertTemplate} />}
        {activeTab === "properties"   && <PropertyPanel selectedId={selectedId} onDelete={onDelete} onDuplicate={onDuplicate} />}
        {activeTab === "pagesettings" && <PageSettings />}
        {activeTab === "ai"           && <AIBuilderPanel />}
      </div>

      {/* Status bar */}
      <div style={{
        flexShrink: 0, padding: "5px 16px", borderTop: `1px solid ${T.border}`,
        background: T.panelAlt, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 10, color: selectedId ? T.accentText : T.textFaint }}>
          {selectedId ? "Element selected" : "No selection"}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: T.textDim, fontWeight: 600 }}>
          <Zap size={10} /> Groq AI
        </span>
      </div>
    </div>
  );
}

export default CustomEditorPanel;
