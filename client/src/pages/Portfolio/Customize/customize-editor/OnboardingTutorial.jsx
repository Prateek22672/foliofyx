// src/pages/Customize/customize-editor/OnboardingTutorial.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Palette, Save, Rocket, Settings2, Eye,
  MousePointer, ArrowRight, PanelLeft, CheckCircle2
} from "lucide-react";

const STEPS = [
  {
    id: "welcome",
    icon: null,
    iconColor: "",
    title: "Welcome to your Portfolio Editor",
    subtitle: "Let's take 30 seconds to show you around",
    description: "You're in the right place to build a stunning portfolio. Here's a quick tour of the three key areas.",
    visual: null,
    highlight: null,
  },
  {
    id: "topbar",
    icon: Monitor,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Top Bar — Quick Controls",
    subtitle: "Save, Publish & Switch Views",
    description: "The top bar handles your most important actions: switch between Desktop / Mobile preview, Save your work, and Publish your portfolio live.",
    visual: "topbar",
    highlight: "top",
    items: [
      { icon: Monitor, label: "View toggle", desc: "Switch between Desktop and Mobile preview" },
      { icon: Save, label: "Save", desc: "Save your portfolio changes instantly" },
      { icon: Rocket, label: "Publish", desc: "Go live — makes your portfolio public" },
    ]
  },
  {
    id: "sidebar",
    icon: PanelLeft,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Left Sidebar — Design & Settings",
    subtitle: "Templates, Colors, Visibility",
    description: "The floating sidebar on the left controls your visual design: pick templates, change colors & fonts, toggle public/private, and deploy.",
    visual: "sidebar",
    highlight: "left",
    items: [
      { icon: Palette, label: "Design", desc: "Change colors, fonts and visual style" },
      { icon: Settings2, label: "Templates", desc: "Browse and switch portfolio templates" },
      { icon: Eye, label: "Visibility", desc: "Toggle between Public and Private" },
    ]
  },
  {
    id: "editor",
    icon: Settings2,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Editor Panel — Your Content",
    subtitle: "Name, Bio, Projects, Skills",
    description: "Click the Editor button in the sidebar to open the content panel. This is where you fill in your name, bio, projects, skills, and everything that appears on your portfolio.",
    visual: "editor",
    highlight: "right",
    items: [
      { icon: MousePointer, label: "Click Editor", desc: "Opens the slide-out content panel" },
      { icon: ArrowRight, label: "Fill your info", desc: "Name, role, bio, projects, skills" },
      { icon: CheckCircle2, label: "Save & preview", desc: "Hit Save, then Preview to see it live" },
    ]
  },
  {
    id: "done",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "You're all set!",
    subtitle: "Start editing your portfolio",
    description: "You now know exactly where everything is. Jump in and make it yours — you can always revisit this tour from the Help menu.",
    visual: null,
    highlight: null,
  },
];

const VisualDiagram = ({ type }) => {
  if (type === "topbar") {
    return (
      <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        {/* Mock top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
          <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <Monitor size={12} className="text-blue-500" />
              <span className="text-[10px] font-semibold text-blue-600">Desktop</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
              <Monitor size={12} className="text-gray-400" />
              <span className="text-[10px] font-semibold text-gray-500">Mobile</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
              <Save size={12} className="text-gray-500" />
              <span className="text-[10px] font-semibold text-gray-600">Save</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg">
              <Rocket size={12} className="text-white" />
              <span className="text-[10px] font-bold text-white">Publish</span>
            </div>
          </div>
        </div>
        {/* Arrow pointing up */}
        <div className="flex justify-center py-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-0.5 h-6 bg-blue-300" />
            <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              Top Bar
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex" style={{ height: 120 }}>
          {/* Mock sidebar */}
          <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center pt-3 gap-2">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
              <Settings2 size={14} className="text-white" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center">
              <Palette size={14} className="text-violet-500" />
            </div>
            <div className="w-9 h-9 rounded-xl hover:bg-gray-50 flex items-center justify-center">
              <Monitor size={14} className="text-gray-400" />
            </div>
          </div>
          {/* Mock preview */}
          <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium">Portfolio Preview</span>
          </div>
        </div>
        <div className="flex justify-start pl-3 py-3">
          <div className="flex items-center gap-1">
            <div className="w-0.5 h-6 bg-emerald-300" />
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">
              Left Sidebar
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "editor") {
    return (
      <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex" style={{ height: 120 }}>
          {/* Mock sidebar */}
          <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center pt-3 gap-2">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center ring-2 ring-violet-400 ring-offset-1">
              <Settings2 size={14} className="text-white" />
            </div>
          </div>
          {/* Mock preview shrunk */}
          <div className="flex-1 bg-gray-100 relative flex items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium">Preview</span>
          </div>
          {/* Mock editor panel */}
          <div className="w-32 bg-white border-l border-gray-100 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-1.5">
              <Settings2 size={10} className="text-violet-500" />
              <span className="text-[9px] font-semibold text-gray-700">Editor</span>
            </div>
            <div className="p-2 flex flex-col gap-1.5">
              <div className="h-3 bg-gray-100 rounded-md w-full" />
              <div className="h-3 bg-gray-100 rounded-md w-3/4" />
              <div className="h-3 bg-violet-100 rounded-md w-full" />
              <div className="h-3 bg-gray-100 rounded-md w-2/3" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pr-3 py-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Editor Panel
            </span>
            <div className="w-0.5 h-6 bg-amber-300" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const OnboardingTutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("fyx_onboarding_seen");
    if (seen) setDismissed(true);
  }, []);

  const handleComplete = () => {
    localStorage.setItem("fyx_onboarding_seen", "1");
    setDismissed(true);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem("fyx_onboarding_seen", "1");
    setDismissed(true);
    onComplete?.();
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          // Added max-height and flex-col to handle internal scrolling
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Static Progress bar at the top */}
          <div className="h-1 bg-gray-100 shrink-0">
            <motion.div
              className="h-full bg-violet-500 rounded-full"
              initial={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-7">
            {/* Icon + step counter */}
            <div className="flex items-center justify-between mb-5">
              <div className={`w-32 h-16 rounded-2xl ${current.id === 'welcome' ? 'bg-transparent' : current.iconBg} flex items-center justify-center overflow-hidden shrink-0`}>
                {current.icon ? (
                  <current.icon size={28} className={current.iconColor} />
                ) : (
                  <img 
                    src="/FYX/BlackClearBG.svg" 
                    alt="FYX" 
                    className="w-full h-39 object-contain" 
                  />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === step
                        ? "w-5 h-1.5 bg-violet-500"
                        : i < step
                        ? "w-1.5 h-1.5 bg-violet-300"
                        : "w-1.5 h-1.5 bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="mb-5">
              <p className="text-[11px] font-bold text-violet-500 uppercase tracking-widest mb-1">
                {current.subtitle}
              </p>
              <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-2">
                {current.title}
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Visual diagram */}
            {current.visual && (
              <div className="mb-5">
                <VisualDiagram type={current.visual} />
              </div>
            )}

            {/* Feature list */}
            {current.items && (
              <div className="flex flex-col gap-2 mb-5">
                {current.items.map((item, i) => {
                  const ItemIcon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <ItemIcon size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Done state checkmark */}
            {current.id === "done" && (
              <div className="flex justify-center mb-5 pt-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <CheckCircle2 size={32} className="text-green-500" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Static Action Bar at bottom */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
            {!isFirst ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                className="text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
              >
                Skip tour
              </button>
            )}

            <button
              type="button"
              onClick={isLast ? handleComplete : () => setStep(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-[12px] font-bold transition-all hover:bg-gray-700 active:scale-95 shadow-lg"
            >
              {isLast ? (
                <>Start Editing <img src="/studiox.svg" alt="Studio" className="h-4 w-auto brightness-0 invert" /></>
              ) : (
                <>Next <ArrowRight size={13} /></>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Internal CSS for custom scrollbar to keep it clean */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}} />
    </AnimatePresence>
  );
};

export default OnboardingTutorial;