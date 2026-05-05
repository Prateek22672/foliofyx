import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Sparkles, Briefcase,
  Wand2, Coffee, Zap, Loader2, X,
} from "lucide-react";
import SearchSuggestion from "../../components/SearchSuggestion";
import { WIZARD_STEPS } from "./constants";

export default function WizardForm({ formData, setFormData, onSave, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [aiLoading, setAiLoading] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));
  const updateField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const progress = ((currentStep + 1) / (WIZARD_STEPS.length + 1)) * 100;

  const toggleSkill = (name) => {
    const exists = formData.skills.find((s) => s.name === name);
    if (exists) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s.name !== name) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, { name, level: skillLevel }] });
    }
  };

  const removeSkillByName = (name) =>
    setFormData({ ...formData, skills: formData.skills.filter((s) => s.name !== name) });

  const addProjectManual = () => {
    if (!projectTitle.trim()) return;
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: projectTitle, tech: "Web Tech", github: projectGithub, demo: projectDemo },
      ],
    });
    setProjectTitle("");
    setProjectGithub("");
    setProjectDemo("");
  };

  const removeProject = (idx) =>
    setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== idx) });

  const handleExpChange = (index, field, value) => {
    const list = Array.isArray(formData.experience) ? [...formData.experience] : [];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, experience: list });
  };

  const addExp = () => {
    const list = Array.isArray(formData.experience) ? [...formData.experience] : [];
    setFormData({
      ...formData,
      experience: [...list, { company: "", role: "", period: "", desc: "" }],
    });
  };

  const removeExp = (index) => {
    const list = Array.isArray(formData.experience) ? [...formData.experience] : [];
    setFormData({ ...formData, experience: list.filter((_, i) => i !== index) });
  };

  const generateBioWithAI = (tone) => {
    const { name, role, experience, skills, projects } = formData;
    const myName = name ? name.split(" ")[0] : "there";
    const fullName = name || "a Creator";
    const myRole = role || "Professional";
    const latestCompany =
      experience?.length && experience[0].company
        ? experience[0].company
        : "innovative organisations";
    const duration =
      experience?.length && experience[0].period ? experience[0].period : "my career";
    const topSkills = skills?.length
      ? skills.slice(0, 3).map((s) => s.name).join(", ")
      : "modern technologies";
    const mainSkill = skills?.length ? skills[0].name : "Problem Solving";
    const latestProject = projects?.length ? projects[0].title : "digital products";

    const templates = {
      professional: [
        `I am ${fullName}, a ${myRole} with a proven track record at ${latestCompany}. My expertise lies in ${topSkills}, and I am dedicated to building scalable solutions.`,
        `As a ${myRole} working with ${latestCompany}, I specialise in ${mainSkill} and combine technical depth in ${topSkills} with a strategic mindset.`,
        `Results-oriented ${myRole} with experience spanning ${duration}. I focus on ${topSkills} to solve complex problems, delivering projects like ${latestProject}.`,
      ],
      creative: [
        `Crafting digital experiences is my passion. I'm ${myName}, a ${myRole} who blends the logic of ${mainSkill} with creative design using ${topSkills}.`,
        `I don't just build — I create. As the creator of ${latestProject}, I use my background as a ${myRole} to tell compelling stories through code.`,
        `Dreaming in code. I am ${fullName}, a ${myRole} obsessed with ${mainSkill}. My work at ${latestCompany} merges aesthetics with functionality.`,
      ],
      casual: [
        `Hi, I'm ${myName}! I'm a ${myRole} who loves building cool stuff like ${latestProject}. When I'm not at ${latestCompany}, I'm geeking out over ${mainSkill}.`,
        `Just a ${myRole} turning coffee into code. I specialise in ${topSkills} and enjoy solving fun puzzles. Currently making waves at ${latestCompany}.`,
        `Hey there! I'm ${fullName}. I build things for the web using ${topSkills}. Check out my work on ${latestProject}!`,
      ],
      concise: [
        `${myRole} @ ${latestCompany}. Expert in ${topSkills}. Builder of ${latestProject}.`,
        `${fullName} | ${myRole}. Specialised in ${mainSkill} and ${topSkills}.`,
        `Building ${latestProject}. ${myRole} focused on ${topSkills}.`,
      ],
    };

    const options = templates[tone] || templates.professional;
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleAiGenerate = (tone) => {
    setAiLoading(tone);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, bio: generateBioWithAI(tone) }));
      setAiLoading(null);
    }, 900);
  };

  const aiOptions = [
    { id: "professional", label: "Professional", icon: Briefcase, desc: "Corporate & polished"  },
    { id: "creative",     label: "Creative",     icon: Wand2,     desc: "Unique & storyteller" },
    { id: "casual",       label: "Casual",        icon: Coffee,    desc: "Friendly & open"      },
    { id: "concise",      label: "Concise",       icon: Zap,       desc: "Short & impactful"    },
  ];

  const step = WIZARD_STEPS[currentStep];
  const isLastStep = currentStep >= WIZARD_STEPS.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(16px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-20 flex items-center justify-center px-4 py-6 sm:px-6"
    >
      <div
        className="
          relative w-full max-w-xl
          flex flex-col
          max-h-[90vh] sm:max-h-[85vh]
          bg-[#0f0f0f]/95 backdrop-blur-3xl
          border border-white/15
          rounded-[2.5rem] sm:rounded-[3rem]
          shadow-[0_0_80px_rgba(0,0,0,0.6)]
          overflow-hidden
        "
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div className="shrink-0 flex items-start justify-between px-7 sm:px-10 pt-7 pb-0">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              Step {currentStep + 1} of {WIZARD_STEPS.length}
            </span>
            <div className="w-28 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-white"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-gray-400 hover:text-white transition-colors text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/20 rounded-full hover:bg-white/10"
          >
            ESC
          </button>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-7 sm:px-10 py-6"
          onTouchStart={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
        >
          <AnimatePresence mode="wait">
            {!isLastStep ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight leading-snug">
                  {step.question}
                </h2>

                {/* ── ROLE ── */}
                {step.name === "role" && (
                  <SearchSuggestion
                    dataFile="roles.txt"
                    placeholder={step.suggestion}
                    multiple={false}
                    selected={formData.role}
                    onSelect={(v) => updateField("role", v)}
                  />
                )}

                {/* ── SKILLS ── */}
                {step.special === "skills" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((s) => (
                        <motion.span
                          layout
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          key={s.name}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 text-xs text-white"
                        >
                          {s.name}
                          <span className="opacity-40">|</span>
                          <span className="text-[10px] text-gray-300">{s.level}</span>
                          <button
                            onClick={() => removeSkillByName(s.name)}
                            className="hover:text-red-400 transition-colors ml-0.5"
                          >
                            <X size={10} />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex gap-3 items-end border-b border-white/20 pb-2 focus-within:border-white/60 transition-colors">
                      <div className="flex-1">
                        <SearchSuggestion
                          dataFile="skills.txt"
                          placeholder="Type a skill..."
                          multiple={false}
                          onSelect={toggleSkill}
                        />
                      </div>
                      <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer hover:text-white transition shrink-0"
                      >
                        <option className="bg-[#111]">Basic</option>
                        <option className="bg-[#111]">Intermediate</option>
                        <option className="bg-[#111]">Expert</option>
                      </select>
                    </div>
                    {formData.skills.length === 0 && (
                      <p className="text-sm text-gray-400">Start typing a skill above — e.g. React, Figma, Python</p>
                    )}
                  </div>
                )}

                {/* ── EXPERIENCE ── */}
                {step.special === "experience" && (
                  <div className="space-y-3">
                    <div
                      className="space-y-3 max-h-[38vh] overflow-y-auto overscroll-contain pr-1"
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
                    >
                      {(formData.experience || []).map((exp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group relative bg-white/[0.06] border border-white/15 rounded-2xl p-4 hover:border-white/30 transition-all"
                        >
                          <button
                            onClick={() => removeExp(index)}
                            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <ExpField
                              label="Company"
                              value={exp.company}
                              onChange={(v) => handleExpChange(index, "company", v)}
                              placeholder="Company Name"
                            />
                            <ExpField
                              label="Role"
                              value={exp.role}
                              onChange={(v) => handleExpChange(index, "role", v)}
                              placeholder="Job Title"
                            />
                          </div>
                          <ExpField
                            label="Period"
                            value={exp.period}
                            onChange={(v) => handleExpChange(index, "period", v)}
                            placeholder="Jan 2023 – Present"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <button
                      onClick={addExp}
                      className="w-full py-3 border border-dashed border-white/25 rounded-2xl flex items-center justify-center gap-2 text-gray-300 text-sm font-medium hover:border-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                    >
                      <Plus size={15} /> Add Position
                    </button>
                  </div>
                )}

                {/* ── PROJECTS ── */}
                {step.special === "projects" && (
                  <div className="space-y-4">
                    <input
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Project Name"
                      className="w-full bg-transparent border-b border-white/25 py-3 text-lg sm:text-xl outline-none focus:border-white transition-colors placeholder-gray-400 text-white"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        placeholder="GitHub Link"
                        className="w-full bg-transparent border-b border-white/25 py-2 text-sm outline-none focus:border-white transition-colors placeholder-gray-400 text-white"
                      />
                      <input
                        value={projectDemo}
                        onChange={(e) => setProjectDemo(e.target.value)}
                        placeholder="Live Demo Link"
                        className="w-full bg-transparent border-b border-white/25 py-2 text-sm outline-none focus:border-white transition-colors placeholder-gray-400 text-white"
                      />
                    </div>
                    <button
                      onClick={addProjectManual}
                      className="w-full border border-white/20 rounded-full py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      + Add Project
                    </button>
                    <div
                      className="space-y-2 max-h-[22vh] overflow-y-auto overscroll-contain"
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
                    >
                      {formData.projects.map((p, i) => (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          key={i}
                          className="flex justify-between items-center text-sm text-gray-200 border-b border-white/10 py-2"
                        >
                          <span className="truncate mr-3 text-white font-medium">{p.title}</span>
                          <button
                            onClick={() => removeProject(i)}
                            className="text-red-400/80 hover:text-red-400 transition-colors shrink-0 text-xs"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── BIO + AI WRITER ── */}
                {step.name === "bio" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        rows={4}
                        value={formData.bio || ""}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="Write a short intro, or let AI write it for you..."
                        className="w-full p-4 text-sm rounded-2xl border border-white/20 bg-white/[0.06] focus:bg-white/[0.09] focus:border-white/40 text-white outline-none resize-none transition-all leading-relaxed placeholder-gray-400"
                        style={{ touchAction: "pan-y" }}
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] text-gray-400 pointer-events-none">
                        {formData.bio?.length || 0} chars
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles size={13} className="text-purple-400" />
                          <span className="text-xs font-bold text-gray-200">FYX AI Writer</span>
                        </div>
                        <span className="text-[10px] text-purple-300 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full">
                          Uses your profile data
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {aiOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleAiGenerate(opt.id)}
                            disabled={aiLoading !== null}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all
                              ${aiLoading === opt.id
                                ? "bg-purple-500/15 border-purple-500/40"
                                : "bg-white/[0.05] border-white/12 hover:border-white/25 hover:bg-white/[0.09]"
                              }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                                ${aiLoading === opt.id ? "bg-purple-500/25" : "bg-white/10"}`}
                            >
                              {aiLoading === opt.id ? (
                                <Loader2 size={12} className="animate-spin text-purple-400" />
                              ) : (
                                <opt.icon size={12} className="text-gray-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{opt.label}</p>
                              <p className="text-[10px] text-gray-400">{opt.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EDUCATION ── */}
                {step.special === "education" && (
                  <SearchSuggestion
                    dataFile="qualifications.txt"
                    placeholder={step.suggestion}
                    multiple={false}
                    selected={formData.education}
                    onSelect={(v) => updateField("education", v)}
                  />
                )}

                {/* ── DEFAULT TEXT INPUT ── */}
                {!step.special && step.name !== "role" && step.name !== "bio" && (
                  <input
                    value={formData[step.name] || ""}
                    onChange={(e) => updateField(step.name, e.target.value)}
                    placeholder={step.suggestion}
                    className="w-full bg-transparent border-b border-white/25 py-4 text-xl sm:text-2xl font-light outline-none focus:border-white/70 transition-all text-white placeholder-white/30 caret-white"
                    autoFocus
                  />
                )}

                <div className="h-2" />
              </motion.div>
            ) : (
              // ── COMPLETION SCREEN ──
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-3">
                  You're all set.
                </h2>
                <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto font-light leading-relaxed">
                  We have everything we need to craft your digital presence.
                </p>
                <button
                  onClick={onSave}
                  className="px-8 py-3.5 rounded-full bg-white text-black text-base font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl"
                >
                  Generate Portfolio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER NAV ── */}
        {!isLastStep && (
          <div className="shrink-0 flex justify-between items-center px-7 sm:px-10 py-5 border-t border-white/10">
            <button
              onClick={currentStep === 0 ? onExit : prevStep}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              {currentStep === 0 ? "Cancel" : "← Back"}
            </button>
            <button
              onClick={nextStep}
              className="group flex items-center gap-2 text-white text-base font-light hover:gap-3 transition-all"
            >
              {currentStep === WIZARD_STEPS.length - 1 ? "Finish" : "Next"}
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Helper component ──────────────────────────────────────────────────────────
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
        className="w-full bg-transparent border-b border-white/20 py-1.5 text-sm text-white focus:border-white/50 outline-none transition-all placeholder-gray-500"
      />
    </div>
  );
}