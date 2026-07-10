import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Check,
  Home, Tag, BarChart3, FolderOpen, Rocket, Archive,
  Link2, Globe, Pencil, Sparkles, Zap, PartyPopper,
} from "lucide-react";

// ─── Tutorial steps ───────────────────────────────────────────────────────────
// `target`      → id of the DOM element to spotlight (null = centred overlay)
// `fallbackDesc`→ shown when the target element doesn't exist in the DOM yet
const STEPS = [
  {
    title: "Welcome to your Studio",
    desc: "This is your Dashboard — the control centre for all your portfolio websites. Let's take a quick tour so you know exactly what everything does.",
    target: null,
    position: "center",
    icon: Home,
  },
  {
    title: "It's your work, your name",
    desc: "The greeting at the top shows your first name so you always know you're in the right place. Your plan badge (Free / Plus / Max) sits right next to it.",
    target: "plan-badge",
    position: "bottom",
    icon: Tag,
    fallbackDesc: "Your plan badge (Free / Plus / Max) appears at the top of the dashboard next to your name.",
  },
  {
    title: "Quick stats at a glance",
    desc: "Three stat pills show how many portfolios you've created, your current plan, and how many templates are available — all in one line.",
    target: "stats-strip",
    position: "bottom",
    icon: BarChart3,
    fallbackDesc: "A stats strip below your name shows your portfolio count, current plan, and total templates available.",
  },
  {
    title: "View Templates",
    desc: "Click 'View Templates' to browse every available design. You can preview desktop and mobile layouts before committing to one.",
    target: "view-templates-btn",
    position: "bottom",
    icon: FolderOpen,
    fallbackDesc: "The 'View Templates' button (outlined) lets you browse and preview all available designs before picking one.",
  },
  {
    title: "Start Creating",
    desc: "Ready to build? Hit 'Start Creating' to jump straight into the builder. On the Free plan you get 1 portfolio — once used, this button prompts you to upgrade.",
    target: "create-btn",
    position: "bottom",
    icon: Rocket,
    fallbackDesc: "The 'Start Creating' button (solid black) launches the builder. Free plan allows 1 portfolio.",
  },
  {
    title: "Portfolio cards",
    desc: "Every portfolio you build appears here as a dark card showing a template preview, your name, your role, and action buttons.",
    target: "first-card",
    position: "top",
    icon: Archive,
    fallbackDesc: "Once you create a portfolio, it appears here as a dark card with a preview image, your name, role, and action buttons.",
  },
  {
    title: "Copy link & Delete",
    desc: "Hover (or tap on mobile) a card to reveal two icon buttons in the top bar — a copy icon for the public URL, and a red trash icon to permanently delete the portfolio.",
    target: "card-actions",
    position: "bottom",
    icon: Link2,
    fallbackDesc: "Hovering a portfolio card reveals a copy-link icon and a red delete icon in its top bar.",
  },
  {
    title: "View Live",
    desc: "Opens your portfolio exactly as visitors see it — your published, public-facing page. Great for checking how it looks before sharing.",
    target: "view-btn",
    position: "top",
    icon: Globe,
    fallbackDesc: "'View Live' opens your published portfolio exactly as the world sees it.",
  },
  {
    title: "Edit",
    desc: "Takes you into the full customisation studio — change content, colours, fonts, sections, and even switch the template without losing your data.",
    target: "edit-btn",
    position: "top",
    icon: Pencil,
    fallbackDesc: "'Edit' opens the customisation studio where you can change content, colours, fonts, and templates.",
  },
  {
    title: "Recommended Templates",
    desc: "Handpicked templates curated just for you. Click any card to open a full preview with desktop and mobile views before you decide.",
    target: "recommended-section",
    position: "top",
    icon: Sparkles,
    fallbackDesc: "Below your portfolios you'll find recommended templates — click any to preview before building.",
  },
  {
    title: "Quick-use a Template",
    desc: "Each recommendation card has a '+ Use' button. Tap it to jump straight into that template's customisation studio without going through the full picker.",
    target: "recommended-card-0",
    position: "top",
    icon: Zap,
    fallbackDesc: "Each recommended template card has a '+ Use' button to jump straight into customising that design.",
  },
  {
    title: "You're all set!",
    desc: "That's the whole Dashboard. Create your first portfolio, personalise it your way, and share it with the world. Go build something great.",
    target: null,
    position: "center",
    icon: PartyPopper,
  },
];

const SPOTLIGHT_PAD = 12;
const TOOLTIP_W     = 340;

// ─── Measure a DOM element in absolute page coordinates ───────────────────────
const getRect = (id) => {
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top:      r.top    + window.scrollY - SPOTLIGHT_PAD,
    left:     r.left   + window.scrollX - SPOTLIGHT_PAD,
    width:    r.width  + SPOTLIGHT_PAD * 2,
    height:   r.height + SPOTLIGHT_PAD * 2,
    vpTop:    r.top,
    vpBottom: r.bottom,
  };
};

// ─── Shared tooltip body ──────────────────────────────────────────────────────
const TooltipBody = ({ step, hasTarget, onNext, onPrev, onClose, isFirst, isLast, current, total }) => {
  const desc = (!hasTarget && step.fallbackDesc) ? step.fallbackDesc : step.desc;
  const StepIcon = step.icon;

  return (
    <>
      {/* Progress dots */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-5 bg-gray-900" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-3"
        >
          <X size={14} />
        </button>
      </div>

      {/* Icon + text */}
      <div className="flex gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
          {StepIcon && <StepIcon size={18} />}
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight">{step.title}</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
          {/* Hint badge when element isn't in the DOM yet */}
          {!hasTarget && step.target && (
            <span className="inline-block mt-2 text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              Create a portfolio to see this live
            </span>
          )}
        </div>
      </div>

      {/* Counter + nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Skip tour
          </button>
          <span className="text-[11px] text-gray-300 font-mono">{current + 1}/{total}</span>
        </div>
        <div className="flex gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[12px] font-semibold transition-all"
            >
              <ChevronLeft size={13} /> Back
            </button>
          )}
          <button
            onClick={onNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-[12px] font-semibold transition-all active:scale-95"
          >
            {isLast ? "Done" : "Next"} {isLast ? <Check size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Tooltip wrapper — mobile sheet vs desktop float ─────────────────────────
const Tooltip = ({ step, rect, onNext, onPrev, onClose, isFirst, isLast, current, total }) => {
  const isMobile  = typeof window !== "undefined" && window.innerWidth < 640;
  const hasTarget = !!rect;
  const bodyProps = { step, hasTarget, onNext, onPrev, onClose, isFirst, isLast, current, total };

  // ── Mobile: fixed bottom sheet ──
  if (isMobile) {
    return (
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10001 }}
        className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 pb-8 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <TooltipBody {...bodyProps} />
      </motion.div>
    );
  }

  // ── Desktop: absolutely positioned float ──
  const vh       = window.innerHeight;
  const tooltipH = 240;
  let top, left;

  if (!rect) {
    top  = window.scrollY + vh / 2 - tooltipH / 2;
    left = Math.max(12, window.innerWidth / 2 - TOOLTIP_W / 2);
  } else {
    const spaceBelow = vh - rect.vpBottom;
    const spaceAbove = rect.vpTop;

    if (step.position === "bottom" && spaceBelow >= tooltipH + 16) {
      top = rect.top + rect.height + 14;
    } else if (spaceAbove >= tooltipH + 16) {
      top = rect.top - tooltipH - 14;
    } else {
      top = window.scrollY + vh / 2 - tooltipH / 2;
    }

    left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - TOOLTIP_W - 12));
  }

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0,   y: -6,  scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "absolute", top, left, width: TOOLTIP_W, zIndex: 10001 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <TooltipBody {...bodyProps} />
    </motion.div>
  );
};

// ─── Main overlay ─────────────────────────────────────────────────────────────
const DashboardTutorial = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [rect, setRect]       = useState(null);

  const step = STEPS[current];

  const updateRect = useCallback(() => {
    const r = getRect(step.target);
    setRect(r);

    if (r) {
      const isMobile = window.innerWidth < 640;
      const offset   = isMobile ? window.innerHeight * 0.5 : window.innerHeight / 2;
      window.scrollTo({
        top: Math.max(0, r.top - offset + r.height / 2),
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step.target]);

  useEffect(() => {
    // Small delay so DOM has settled after step change
    const t = setTimeout(updateRect, 80);
    window.addEventListener("resize", updateRect);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect]);

  const handleNext = () => {
    if (current === STEPS.length - 1) onClose();
    else setCurrent((c) => c + 1);
  };
  const handlePrev = () => setCurrent((c) => c - 1);

  return (
    <AnimatePresence>
      <div style={{ position: "absolute", inset: 0, zIndex: 10000, pointerEvents: "none" }}>

        {/* ── Dark overlay with spotlight cutout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "auto" }}
          onClick={onClose}
        >
          {rect ? (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={rect.left} y={rect.top}
                    width={rect.width} height={rect.height}
                    rx="14" fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#spotlight-mask)" />
              <rect
                x={rect.left} y={rect.top}
                width={rect.width} height={rect.height}
                rx="14" fill="none"
                stroke="white" strokeWidth="1.5" strokeOpacity="0.25"
              />
            </svg>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
          )}
        </motion.div>

        {/* ── Tooltip ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 10001, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>
            <AnimatePresence mode="wait">
              <Tooltip
                key={current}
                step={step}
                rect={rect}
                onNext={handleNext}
                onPrev={handlePrev}
                onClose={onClose}
                isFirst={current === 0}
                isLast={current === STEPS.length - 1}
                current={current}
                total={STEPS.length}
              />
            </AnimatePresence>
          </div>
        </div>

      </div>
    </AnimatePresence>
  );
};

export default DashboardTutorial;