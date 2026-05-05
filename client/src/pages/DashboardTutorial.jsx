import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const STEPS = [
  {
    title: "Welcome to your studio",
    desc: "This is your Dashboard — the home for all your portfolio websites. Let's do a quick tour so you know exactly where everything is.",
    target: null,
    position: "center",
    icon: "👋",
  },
  {
    title: "Your plan badge",
    desc: "The badge next to 'My Portfolios' shows your current plan — Free, Plus, or Max. Higher plans unlock more portfolios and premium templates.",
    target: "plan-badge",
    position: "bottom",
    icon: "🏷️",
  },
  {
    title: "Create Website button",
    desc: "Click this to start building a new portfolio. On the Free plan you get 1 portfolio — once you've used it, this button locks and prompts you to upgrade.",
    target: "create-btn",
    position: "bottom",
    icon: "✦",
  },
  {
    title: "Portfolio card",
    desc: "Each card represents one of your portfolio sites. It shows a preview of the template, your name, and your role.",
    target: "first-card",
    position: "top",
    icon: "🗂️",
  },
  {
    title: "Copy link & delete",
    desc: "Hover over a card to reveal two icon buttons in the top bar. The copy icon grabs the public URL. The red trash icon permanently deletes the portfolio after confirmation.",
    target: "card-actions",
    position: "bottom",
    icon: "🔗",
  },
  {
    title: "View Live",
    desc: "Opens the public-facing version of your portfolio — exactly what visitors see when they land on your page.",
    target: "view-btn",
    position: "top",
    icon: "🌐",
  },
  {
    title: "Edit",
    desc: "Takes you into the full customization studio where you can change content, colors, fonts, and switch templates.",
    target: "edit-btn",
    position: "top",
    icon: "✏️",
  },
  {
    title: "You're all set!",
    desc: "That's the whole Dashboard. Create your first portfolio, customize it your way, and deploy it live. Go build something great.",
    target: null,
    position: "center",
    icon: "🚀",
  },
];

const SPOTLIGHT_PADDING = 10;

const getRect = (id) => {
  if (!id) return null;
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top + window.scrollY - SPOTLIGHT_PADDING,
    left: r.left + window.scrollX - SPOTLIGHT_PADDING,
    width: r.width + SPOTLIGHT_PADDING * 2,
    height: r.height + SPOTLIGHT_PADDING * 2,
  };
};

const Tooltip = ({ step, rect, onNext, onPrev, onClose, isFirst, isLast, current, total }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!rect) {
      setPos({
        top: window.innerHeight / 2 - 130 + window.scrollY,
        left: window.innerWidth / 2 - 180,
      });
      return;
    }

    const tooltipH = 220;
    const tooltipW = 340;

    let top, left;

    if (step.position === "bottom") {
      top = rect.top + rect.height + 14;
    } else {
      top = rect.top - tooltipH - 14;
    }

    left = rect.left + rect.width / 2 - tooltipW / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));

    setPos({ top, left });
  }, [rect, step]);

  return (
    <motion.div
      key={current}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: 340,
        zIndex: 10001,
      }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 select-none"
    >
      {/* Progress dots */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
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
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
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
            {isLast ? "Done" : "Next"} {!isLast && <ChevronRight size={13} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardTutorial = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [rect, setRect] = useState(null);

  const step = STEPS[current];

  useEffect(() => {
    const r = getRect(step.target);
    setRect(r);

    if (r) {
      window.scrollTo({
        top: Math.max(0, r.top - window.innerHeight / 2 + r.height / 2),
        behavior: "smooth",
      });
    }
  }, [current, step.target]);

  const handleNext = () => {
    if (current === STEPS.length - 1) {
      onClose();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handlePrev = () => setCurrent((c) => c - 1);

  return (
    <AnimatePresence>
      <div
        style={{ position: "absolute", inset: 0, zIndex: 10000, pointerEvents: "none" }}
      >
        {/* Dark overlay with spotlight cutout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            pointerEvents: "auto",
          }}
          onClick={onClose}
        >
          {rect ? (
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={rect.left}
                    y={rect.top}
                    width={rect.width}
                    height={rect.height}
                    rx="16"
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.65)"
                mask="url(#spotlight-mask)"
              />
              {/* Spotlight border ring */}
              <rect
                x={rect.left}
                y={rect.top}
                width={rect.width}
                height={rect.height}
                rx="16"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />
            </svg>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
          )}
        </motion.div>

        {/* Tooltip */}
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