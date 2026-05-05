import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

// ─── Steps covering the new Dashboard UI ────────────────────────────────────
const STEPS = [
  {
    title: "Welcome to your Studio 👋",
    desc: "This is your Dashboard — the control centre for all your portfolio websites. Let's take a quick tour so you know exactly what everything does.",
    target: null,
    position: "center",
    icon: "🏠",
  },
  {
    title: "It's your work, your name",
    desc: "The greeting up top shows your first name so you always know you're in the right place. Your plan badge (Free / Plus / Max) sits right next to it.",
    target: "plan-badge",
    position: "bottom",
    icon: "🏷️",
  },
  {
    title: "Quick stats at a glance",
    desc: "The three stat pills show how many portfolios you've created, your current plan, and how many templates are available to you — all in one line.",
    target: "stats-strip",
    position: "bottom",
    icon: "📊",
  },
  {
    title: "View Templates",
    desc: "Click 'View Templates' to browse every available template. You can preview desktop & mobile layouts before committing to one.",
    target: "view-templates-btn",
    position: "bottom",
    icon: "🗂️",
  },
  {
    title: "Start Creating",
    desc: "Ready to build? Hit 'Start Creating' to jump straight into the builder. On the Free plan you get 1 portfolio — once it's used, this button will prompt you to upgrade.",
    target: "create-btn",
    position: "bottom",
    icon: "✦",
  },
  {
    title: "My Portfolios",
    desc: "Every portfolio you've built lives here as a card. Each one shows a live template preview, your name, your role, and quick actions to manage it.",
    target: "first-card",
    position: "top",
    icon: "🗃️",
  },
  {
    title: "Copy link & Delete",
    desc: "Hover (or tap on mobile) a card to reveal two icon buttons. The copy icon grabs the public URL for sharing. The red trash icon permanently deletes the portfolio after a confirmation step.",
    target: "card-actions",
    position: "bottom",
    icon: "🔗",
  },
  {
    title: "View Live",
    desc: "Opens your portfolio exactly as visitors see it — your live, published page. Great for checking how it looks before sharing.",
    target: "view-btn",
    position: "top",
    icon: "🌐",
  },
  {
    title: "Edit",
    desc: "Takes you into the full customisation studio where you can change content, colours, fonts, sections, and even switch the template entirely.",
    target: "edit-btn",
    position: "top",
    icon: "✏️",
  },
  {
    title: "Recommended Templates",
    desc: "These are handpicked templates curated just for you. Click any card to open a full preview — see desktop and mobile views before you decide.",
    target: "recommended-section",
    position: "top",
    icon: "✨",
  },
  {
    title: "Quick-use a Template",
    desc: "Each recommendation card has a '+ Use' button. Tap it to jump straight into that template's customisation studio without going through the full picker.",
    target: "recommended-card-0",
    position: "top",
    icon: "⚡",
  },
  {
    title: "You're all set! 🚀",
    desc: "That's the whole Dashboard. Create your first portfolio, personalise it your way, and share it with the world. Go build something great.",
    target: null,
    position: "center",
    icon: "🎉",
  },
];

const SPOTLIGHT_PADDING = 12;
const TOOLTIP_MAX_W = 340;

const getRect = (id) => {
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top:    r.top    + window.scrollY  - SPOTLIGHT_PADDING,
    left:   r.left   + window.scrollX  - SPOTLIGHT_PADDING,
    width:  r.width  + SPOTLIGHT_PADDING * 2,
    height: r.height + SPOTLIGHT_PADDING * 2,
    // raw viewport values for positioning logic
    vpTop:    r.top,
    vpBottom: r.bottom,
    vpLeft:   r.left,
    vpRight:  r.right,
  };
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const Tooltip = ({ step, rect, onNext, onPrev, onClose, isFirst, isLast, current, total }) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // On mobile: always pin to bottom of viewport as a sheet
  if (isMobile) {
    return (
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10001,
        }}
        className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-5 pb-8 select-none"
      >
        <TooltipContent
          step={step}
          onNext={onNext}
          onPrev={onPrev}
          onClose={onClose}
          isFirst={isFirst}
          isLast={isLast}
          current={current}
          total={total}
        />
      </motion.div>
    );
  }

  // Desktop: position relative to spotlight rect
  const tooltipW = TOOLTIP_MAX_W;
  const tooltipH = 230;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;

  if (!rect) {
    // Centered
    top  = vh / 2 - tooltipH / 2 + window.scrollY;
    left = vw / 2 - tooltipW / 2;
  } else {
    const spaceBelow = vh - rect.vpBottom;
    const spaceAbove = rect.vpTop;

    if (step.position === "bottom" && spaceBelow >= tooltipH + 16) {
      top = rect.top + rect.height + 14;
    } else if (spaceAbove >= tooltipH + 16) {
      top = rect.top - tooltipH - 14;
    } else {
      // Not enough room above or below — centre vertically on screen
      top = window.scrollY + vh / 2 - tooltipH / 2;
    }

    left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(12, Math.min(left, vw - tooltipW - 12));
  }

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0,   y: -6,  scale: 0.97 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "absolute",
        top,
        left,
        width: tooltipW,
        zIndex: 10001,
      }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 select-none"
    >
      <TooltipContent
        step={step}
        onNext={onNext}
        onPrev={onPrev}
        onClose={onClose}
        isFirst={isFirst}
        isLast={isLast}
        current={current}
        total={total}
      />
    </motion.div>
  );
};

// ─── Shared tooltip body ─────────────────────────────────────────────────────
const TooltipContent = ({ step, onNext, onPrev, onClose, isFirst, isLast, current, total }) => (
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
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-2"
      >
        <X size={14} />
      </button>
    </div>

    {/* Icon + content */}
    <div className="flex gap-3 mb-5">
      <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
        {step.icon}
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-gray-900 mb-1 leading-tight">{step.title}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
      </div>
    </div>

    {/* Step counter label */}
    <p className="text-[11px] text-gray-300 font-mono mb-3">
      {current + 1} / {total}
    </p>

    {/* Nav */}
    <div className="flex items-center justify-between">
      <button
        onClick={onClose}
        className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors font-medium"
      >
        Skip tour
      </button>
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
          {isLast ? "Done ✓" : "Next"} {!isLast && <ChevronRight size={13} />}
        </button>
      </div>
    </div>
  </>
);

// ─── Main tutorial overlay ────────────────────────────────────────────────────
const DashboardTutorial = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [rect, setRect]       = useState(null);

  const step = STEPS[current];

  const updateRect = useCallback(() => {
    const r = getRect(step.target);
    setRect(r);

    if (r) {
      const isMobile = window.innerWidth < 640;
      // On mobile leave room for the bottom sheet tooltip (~240px)
      const offset = isMobile ? window.innerHeight * 0.35 : window.innerHeight / 2;
      window.scrollTo({
        top: Math.max(0, r.top - offset + r.height / 2),
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step.target]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [updateRect]);

  const handleNext = () => {
    if (current === STEPS.length - 1) onClose();
    else setCurrent((c) => c + 1);
  };
  const handlePrev = () => setCurrent((c) => c - 1);

  // Skip steps whose target element doesn't exist in the DOM
  // (e.g., no portfolios yet → first-card, card-actions, view-btn, edit-btn won't exist)
  useEffect(() => {
    if (step.target && !document.getElementById(step.target)) {
      // Auto-advance past steps with missing targets
      if (current < STEPS.length - 1) setCurrent((c) => c + 1);
    }
  }, [current, step.target]);

  return (
    <AnimatePresence>
      <div style={{ position: "absolute", inset: 0, zIndex: 10000, pointerEvents: "none" }}>

        {/* ── Overlay / spotlight ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "auto" }}
          onClick={onClose}
        >
          {rect ? (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={rect.left}
                    y={rect.top}
                    width={rect.width}
                    height={rect.height}
                    rx="14"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.68)"
                mask="url(#spotlight-mask)"
              />
              {/* Glowing ring around spotlight */}
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx="14"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.3"
              />
            </svg>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.68)" }} />
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