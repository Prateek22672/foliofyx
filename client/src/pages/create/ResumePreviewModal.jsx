import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, User, Briefcase, Code2,
  Mail, Plus, Trash2, Sparkles, AlertCircle,
} from "lucide-react";

export default function ResumePreviewModal({ data, onConfirm, onClose }) {
  const [form, setForm] = useState({ ...data });
  const scrollRef = useRef(null);

  // Lock body scroll — covers iOS Safari too (position:fixed trick)
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow   = "hidden";
    document.body.style.position   = "fixed";
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.width      = "100%";
    return () => {
      document.body.style.overflow  = "";
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.width     = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Prevent wheel / touch events on the backdrop from reaching the page
  const stopScroll = (e) => e.stopPropagation();

  // Input Handlers
  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const updateArray = (key, index, field, value) => {
    const list = [...(form[key] || [])];
    list[index] = { ...list[index], [field]: value };
    update(key, list);
  };
  const removeArray = (key, index) =>
    update(key, (form[key] || []).filter((_, idx) => idx !== index));

  const addExp = () =>
    update("experience", [...(form.experience || []), { company: "", role: "", period: "", desc: "" }]);
  const addProject = () =>
    update("projects", [...(form.projects || []), { title: "", tech: "", github: "", demo: "" }]);
  const addSkill = () =>
    update("skills", [...(form.skills || []), { name: "", level: "Intermediate" }]);

  const completionPct = Math.round(
    ([form.name, form.role, form.email, form.bio, form.education].filter(Boolean).length / 5) * 100
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[2.5vh] sm:p-[2.5vw]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={stopScroll}
      onTouchMove={stopScroll}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        onClick={onClose}
        onWheel={stopScroll}
        onTouchMove={stopScroll}
      />

      {/* Modal Card — 95vw × 95vh, same dark card style as WizardForm */}
      <motion.div
        className="
          relative z-10 flex flex-col
          w-[95vw] h-[95vh]
          bg-[#0f0f0f]/98 backdrop-blur-3xl
          border border-white/15
          rounded-[2.5rem] sm:rounded-[3rem]
          shadow-[0_0_80px_rgba(0,0,0,0.7)]
          overflow-hidden
        "
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="shrink-0 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Icon badge */}
            <div className="w-11 h-11 rounded-xl bg-white border border-white/25 flex items-center justify-center">
              <img className="w-8 brightness-0" src="/fyx3.png"/>
              

            </div>
            <div>
              <h2 className="text-white font-bold text-sm sm:text-base leading-tight">Resume Review</h2>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest">FolioFYX Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Profile strength bar */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${completionPct}%` }}
                  className="h-full bg-emerald-500"
                  transition={{ type: "spring", stiffness: 80 }}
                />
              </div>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                {completionPct}% Profile Strength
              </span>
            </div>

            {/* Close button — always visible */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto"
          style={{
            overscrollBehavior: "contain",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="px-5 sm:px-10 py-6 space-y-5 max-w-3xl mx-auto">

            {/* Parse warning */}
            {data._parseError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-xs text-amber-300"
              >
                <AlertCircle size={15} className="shrink-0" />
                AI found some formatting gaps. Please double-check highlighted fields.
              </motion.div>
            )}

            {/* ── CORE IDENTITY ── */}
            <Section icon={<User size={14} />} title="Core Identity" accent="blue">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} placeholder="Your full name" />
                <Field label="Target Role" value={form.role} onChange={(v) => update("role", v)} placeholder="e.g. Full Stack Developer" />
              </div>
              <Field label="Bio / Elevator Pitch" value={form.bio} onChange={(v) => update("bio", v)} placeholder="Briefly describe your expertise..." multiline />
            </Section>

            {/* ── REACH & LINKS ── */}
            <Section icon={<Mail size={14} />} title="Reach & Links" accent="cyan">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address" value={form.email} onChange={(v) => update("email", v)} placeholder="mail@example.com" />
                <Field label="Education" value={form.education} onChange={(v) => update("education", v)} placeholder="University / Degree" />
                <Field label="LinkedIn" value={form.linkedin} onChange={(v) => update("linkedin", v)} placeholder="https://linkedin.com/in/..." />
                <Field label="GitHub" value={form.github} onChange={(v) => update("github", v)} placeholder="https://github.com/..." />
              </div>
            </Section>

            {/* ── SKILLS ── */}
            <Section icon={<Code2 size={14} />} title={`Skills (${(form.skills || []).length})`} accent="purple">
              <div className="flex flex-wrap gap-2">
                {(form.skills || []).map((s, i) => (
                  <motion.div
                    key={i}
                    layout
                    className="flex items-center gap-2 bg-white/[0.06] border border-white/15 rounded-full pl-3.5 pr-2 py-1.5 hover:border-purple-500/30 transition-colors"
                  >
                    <input
                      value={s.name}
                      onChange={(e) => updateArray("skills", i, "name", e.target.value)}
                      className="bg-transparent text-white text-xs outline-none w-20"
                      placeholder="Skill"
                    />
                    <select
                      value={s.level}
                      onChange={(e) => updateArray("skills", i, "level", e.target.value)}
                      className="bg-transparent text-purple-300 text-[10px] font-bold outline-none cursor-pointer"
                    >
                      <option className="bg-[#111]">Basic</option>
                      <option className="bg-[#111]">Intermediate</option>
                      <option className="bg-[#111]">Expert</option>
                    </select>
                    <button onClick={() => removeArray("skills", i)} className="p-0.5 text-gray-500 hover:text-red-400 transition-colors">
                      <X size={11} />
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={addSkill}
                  className="px-4 py-1.5 border border-dashed border-white/20 rounded-full text-gray-400 hover:text-white hover:border-white/40 text-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
            </Section>

            {/* ── EXPERIENCE ── */}
            <Section icon={<Briefcase size={14} />} title="Experience" accent="amber">
              <div className="space-y-3">
                {(form.experience || []).map((exp, i) => (
                  <div
                    key={i}
                    className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
                  >
                    <button
                      onClick={() => removeArray("experience", i)}
                      className="absolute top-3.5 right-3.5 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <ExpField label="Company" value={exp.company} onChange={(v) => updateArray("experience", i, "company", v)} placeholder="Company Name" />
                      <ExpField label="Role / Title" value={exp.role} onChange={(v) => updateArray("experience", i, "role", v)} placeholder="e.g. Senior Developer" />
                    </div>
                    <ExpField label="Period" value={exp.period} onChange={(v) => updateArray("experience", i, "period", v)} placeholder="Jan 2022 – Present" />
                  </div>
                ))}
                <button
                  onClick={addExp}
                  className="w-full py-3 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-gray-400 text-sm font-medium hover:border-white/40 hover:text-white hover:bg-white/[0.03] transition-all"
                >
                  <Plus size={14} /> Add Position
                </button>
              </div>
            </Section>

            {/* ── PROJECTS ── */}
            <Section icon={<Code2 size={14} />} title="Projects" accent="emerald">
              <div className="space-y-3">
                {(form.projects || []).map((p, i) => (
                  <div key={i} className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
                    <button
                      onClick={() => removeArray("projects", i)}
                      className="absolute top-3.5 right-3.5 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ExpField label="Project Title" value={p.title} onChange={(v) => updateArray("projects", i, "title", v)} placeholder="Project Name" />
                      <ExpField label="Tech Stack" value={p.tech} onChange={(v) => updateArray("projects", i, "tech", v)} placeholder="React, Node..." />
                      <ExpField label="GitHub Link" value={p.github} onChange={(v) => updateArray("projects", i, "github", v)} placeholder="https://github.com/..." />
                      <ExpField label="Live Demo" value={p.demo} onChange={(v) => updateArray("projects", i, "demo", v)} placeholder="https://..." />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addProject}
                  className="w-full py-3 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-gray-400 text-sm font-medium hover:border-white/40 hover:text-white hover:bg-white/[0.03] transition-all"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>
            </Section>

            {/* Bottom breathing room */}
            <div className="h-6" />
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="shrink-0 flex items-center justify-between px-6 sm:px-10 py-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Discard
          </button>
          <button
            onClick={() => onConfirm(form)}
            className="group flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black font-bold text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-[0_0_24px_rgba(255,255,255,0.18)]"
          >
            <Check size={15} />
            Confirm Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon, title, accent, children }) {
  const accents = {
    blue:    "border-blue-500/20 bg-blue-500/[0.04]   text-blue-400",
    cyan:    "border-cyan-500/20 bg-cyan-500/[0.04]   text-cyan-400",
    purple:  "border-purple-500/20 bg-purple-500/[0.04] text-purple-400",
    amber:   "border-amber-500/20 bg-amber-500/[0.04]  text-amber-400",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.04] text-emerald-400",
  };
  const cls = accents[accent] || accents.blue;
  const [borderCls, bgCls, iconCls] = cls.split(" ");

  return (
    <div className={`rounded-[1.75rem] border ${borderCls} ${bgCls} p-5 sm:p-6`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center ${iconCls}`}>
          {icon}
        </div>
        <h3 className="text-white text-[11px] font-black uppercase tracking-[0.18em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Field — larger editable area ─────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, multiline }) {
  const base =
    "w-full bg-white/[0.05] border border-white/12 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/35 focus:bg-white/[0.08] transition-all placeholder-gray-500 caret-white";
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-0.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} resize-none`}
          style={{ touchAction: "pan-y" }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

// ── ExpField — inline borderless field ───────────────────────────────────────
function ExpField({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-white/15 py-1.5 text-sm text-white focus:border-white/50 outline-none transition-all placeholder-gray-500"
      />
    </div>
  );
}