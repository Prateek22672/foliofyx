import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  Wand2, 
  Coffee, 
  Zap, 
  Loader2 
} from "lucide-react"; 
import SearchSuggestion from "../../components/SearchSuggestion"; 
import { WIZARD_STEPS } from "./constants"; 

export default function WizardForm({ formData, setFormData, onSave, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  
  // AI Loading State for Bio
  const [aiLoading, setAiLoading] = useState(null);

  // Project State
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");

  const nextStep = () => { if (currentStep < WIZARD_STEPS.length) setCurrentStep((s) => s + 1); };
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));
  const updateField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const progress = ((currentStep + 1) / (WIZARD_STEPS.length + 1)) * 100;

  // --- Handlers ---
  const toggleSkill = (name) => {
    const exists = formData.skills.find((s) => s.name === name);
    if (exists) setFormData({ ...formData, skills: formData.skills.filter((s) => s.name !== name) });
    else setFormData({ ...formData, skills: [...formData.skills, { name, level: skillLevel }] });
  };
  const removeSkillByName = (name) => setFormData({ ...formData, skills: formData.skills.filter((s) => s.name !== name) });
  
  const addProjectManual = () => {
    if (!projectTitle.trim()) return;
    setFormData({ ...formData, projects: [...formData.projects, { title: projectTitle, tech: "Web Tech", github: projectGithub, demo: projectDemo }] });
    setProjectTitle(""); setProjectGithub(""); setProjectDemo("");
  };
  const removeProject = (idx) => setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== idx) });

  const handleExpChange = (index, field, value) => {
    const currentExp = Array.isArray(formData.experience) ? [...formData.experience] : [];
    currentExp[index] = { ...currentExp[index], [field]: value };
    setFormData({ ...formData, experience: currentExp });
  };

  const addExp = () => {
    const currentExp = Array.isArray(formData.experience) ? [...formData.experience] : [];
    setFormData({ ...formData, experience: [...currentExp, { company: "", role: "", period: "", desc: "" }] });
  };

  const removeExp = (index) => {
    const currentExp = Array.isArray(formData.experience) ? [...formData.experience] : [];
    setFormData({ ...formData, experience: currentExp.filter((_, i) => i !== index) });
  };

  // --- FYX AI BIO GENERATOR LOGIC ---
  const generateBioWithAI = (tone) => {
    // 1. Extract Real User Data from formData
    const { name, role, experience, skills, projects } = formData;

    const myName = name ? name.split(' ')[0] : "there"; 
    const fullName = name || "a Creator";
    const myRole = role || "Professional";
    
    const latestCompany = (experience && experience.length > 0 && experience[0].company) 
      ? experience[0].company : "innovative organizations";
    const duration = (experience && experience.length > 0 && experience[0].period) 
      ? experience[0].period : "my career";

    const topSkills = (skills && skills.length > 0)
      ? skills.slice(0, 3).map(s => s.name).join(", ") : "modern technologies";
    const mainSkill = (skills && skills.length > 0)
      ? skills[0].name : "Problem Solving";

    const latestProject = (projects && projects.length > 0) 
      ? projects[0].title : "digital products";

    // 2. Templates
    const templates = {
      professional: [
        `I am ${fullName}, a ${myRole} with a proven track record at ${latestCompany}. My expertise lies in ${topSkills}, and I am dedicated to building scalable solutions.`,
        `As a ${myRole} currently working with ${latestCompany}, I specialize in ${mainSkill}. I combine technical depth in ${topSkills} with a strategic mindset.`,
        `Results-oriented ${myRole} with experience spanning ${duration}. I focus on ${topSkills} to solve complex problems and delivered projects like ${latestProject}.`
      ],
      creative: [
        `Crafting digital experiences is my passion. I'm ${myName}, a ${myRole} who blends the logic of ${mainSkill} with creative design using ${topSkills}.`,
        `I don't just build; I create. As the creator of ${latestProject}, I use my background as a ${myRole} to tell compelling stories through code.`,
        `Dreaming in code. I am ${fullName}, a ${myRole} obsessed with ${mainSkill}. My work at ${latestCompany} reflects my commitment to merging aesthetics with functionality.`
      ],
      casual: [
        `Hi, I'm ${myName}! 👋 I'm a ${myRole} who loves building cool stuff like ${latestProject}. When I'm not working with ${latestCompany}, I'm geeking out over ${mainSkill}.`,
        `Just a ${myRole} turning coffee into code. I specialize in ${topSkills} and enjoy solving fun puzzles. Currently making waves at ${latestCompany}.`,
        `Hey there! I'm ${fullName}. I build things for the web using ${topSkills}. Check out my work on ${latestProject}!`
      ],
      concise: [
        `${myRole} @ ${latestCompany}. Expert in ${topSkills}. Builder of ${latestProject}.`,
        `${fullName} | ${myRole}. Specialized in ${mainSkill} and ${topSkills}.`,
        `Building ${latestProject}. ${myRole} with a focus on ${topSkills}.`
      ]
    };

    const options = templates[tone] || templates.professional;
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleAiGenerate = (tone) => {
    setAiLoading(tone);
    setTimeout(() => {
      const generatedText = generateBioWithAI(tone);
      setFormData(prev => ({ ...prev, bio: generatedText }));
      setAiLoading(null);
    }, 1000);
  };

  const aiOptions = [
    { id: "professional", label: "Professional", icon: Briefcase, desc: "Corporate & Polished" },
    { id: "creative", label: "Creative", icon: Wand2, desc: "Unique & Storyteller" },
    { id: "casual", label: "Casual", icon: Coffee, desc: "Friendly & Open" },
    { id: "concise", label: "Concise", icon: Zap, desc: "Short & Impactful" },
  ];

  const currentStepConfig = WIZARD_STEPS[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] px-4 z-20 flex items-center justify-center"
    >
      <div className="w-full relative z-10 backdrop-blur-3xl bg-[#0a0a0a]/80 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Progress Header */}
        <div className="flex justify-between items-start mb-10">
           <div className="flex flex-col gap-2">
             <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
             <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-white shadow-[0_0_10px_white]" transition={{ type: "spring", stiffness: 100, damping: 20 }}/>
             </div>
           </div>
           <button onClick={onExit} className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest px-3 py-1 border border-white/5 rounded-full hover:bg-white/5">ESC</button>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[300px] flex flex-col justify-center">
            {currentStep < WIZARD_STEPS.length ? (
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <h2 className="text-3xl md:text-4xl font-light mb-8 text-white tracking-tight leading-tight">{currentStepConfig.question}</h2>
                  
                  <div className="space-y-6">
                    {/* Role Input */}
                    {currentStepConfig.name === "role" ? (
                      <SearchSuggestion dataFile="roles.txt" placeholder={currentStepConfig.suggestion} multiple={false} selected={formData.role} onSelect={(v) => updateField("role", v)} />
                    
                    /* Skills Input */
                    ) : currentStepConfig.special === "skills" ? (
                      <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                           {formData.skills.map(s => (
                             <motion.span layout initial={{ scale: 0 }} animate={{ scale: 1 }} key={s.name} className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm flex items-center gap-3 text-white">
                               {s.name} <span className="opacity-30">|</span> <span className="text-xs text-gray-400">{s.level}</span>
                               <button onClick={()=>removeSkillByName(s.name)} className="hover:text-red-400 ml-1">×</button>
                             </motion.span>
                           ))}
                          </div>
                          <div className="flex gap-4 items-end border-b border-white/10 pb-2 focus-within:border-white/50 transition-colors">
                            <div className="flex-1"><SearchSuggestion dataFile="skills.txt" placeholder="Type a skill..." multiple={false} onSelect={toggleSkill} /></div>
                            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="bg-transparent text-gray-400 text-sm outline-none cursor-pointer hover:text-white transition"><option className="bg-black">Basic</option><option className="bg-black">Intermediate</option><option className="bg-black">Expert</option></select>
                          </div>
                      </div>
                    
                    /* Experience Input */
                    ) : currentStepConfig.special === "experience" ? (
                         <div className="space-y-4">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {(formData.experience || []).map((exp, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group relative bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:border-white/30">
                                            <button onClick={() => removeExp(index)} className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Company</label>
                                                    <input type="text" value={exp.company || ""} onChange={(e) => handleExpChange(index, "company", e.target.value)} placeholder="Company Name" className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white focus:border-white focus:outline-none transition-all placeholder-gray-700"/>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Role</label>
                                                    <input type="text" value={exp.role || ""} onChange={(e) => handleExpChange(index, "role", e.target.value)} placeholder="Job Title" className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white focus:border-white focus:outline-none transition-all placeholder-gray-700"/>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Period</label>
                                                <input type="text" value={exp.period || ""} onChange={(e) => handleExpChange(index, "period", e.target.value)} placeholder="e.g. Jan 2023 - Present" className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white focus:border-white focus:outline-none transition-all placeholder-gray-700"/>
                                            </div>
                                    </motion.div>
                                ))}
                            </div>
                            <button onClick={addExp} className="w-full py-3 border border-dashed border-white/20 rounded-xl flex items-center justify-center gap-2 text-gray-400 font-medium hover:border-white/50 hover:text-white hover:bg-white/5 transition-all">
                                <Plus size={16} /> <span>Add Position</span>
                            </button>
                         </div>

                    /* Projects Input */
                    ) : currentStepConfig.special === "projects" ? (
                        <div className="space-y-4">
                          <input value={projectTitle} onChange={(e)=>setProjectTitle(e.target.value)} placeholder="Project Name" className="w-full bg-transparent border-b border-white/10 py-3 text-xl outline-none focus:border-white transition-colors placeholder-gray-700 text-white"/>
                          <div className="flex gap-4">
                            <input value={projectGithub} onChange={(e)=>setProjectGithub(e.target.value)} placeholder="GitHub Link" className="w-1/2 bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-white transition-colors placeholder-gray-700 text-white"/>
                            <input value={projectDemo} onChange={(e)=>setProjectDemo(e.target.value)} placeholder="Live Demo Link" className="w-1/2 bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-white transition-colors placeholder-gray-700 text-white"/>
                          </div>
                          <button onClick={addProjectManual} className="text-sm text-gray-400 hover:text-white transition uppercase tracking-widest mt-2 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 w-full">+ Add Project</button>
                          <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                            {formData.projects.map((p,i)=>(<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="flex justify-between text-sm text-gray-300 border-b border-white/5 py-2"><span>{p.title}</span><button onClick={()=>removeProject(i)} className="text-red-500 opacity-50 hover:opacity-100">Remove</button></motion.div>))}
                          </div>
                        </div>
                    
                    /* BIO INPUT (FYX AI INTEGRATED) */
                    ) : currentStepConfig.name === "bio" ? (
                       <div className="space-y-4">
                          <div className="relative group">
                            <textarea
                              name="bio"
                              rows={5}
                              value={formData.bio || ""}
                              onChange={(e) => updateField("bio", e.target.value)}
                              placeholder="Write a short intro, or let AI write it for you..."
                              className="w-full p-4 text-sm rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:ring-1 text-white focus:ring-white/50 outline-none resize-none transition-all leading-relaxed placeholder-gray-500"
                            />
                            <div className="absolute bottom-3 right-3 text-[10px] font-medium text-gray-500 bg-black/40 px-2 py-1 rounded-md pointer-events-none">
                              {formData.bio?.length || 0} chars
                            </div>
                          </div>
                          
                          {/* AI Generator Section */}
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-purple-400" />
                                    <span className="text-xs font-bold text-gray-300">FYX AI Writer</span>
                                </div>
                                <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20 font-medium">
                                    Uses your profile data
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {aiOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => handleAiGenerate(opt.id)}
                                  disabled={aiLoading !== null}
                                  className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 group
                                    ${aiLoading === opt.id 
                                        ? "bg-purple-500/20 border-purple-500/50" 
                                        : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                                    }
                                  `}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                                      ${aiLoading === opt.id ? 'bg-purple-500/30' : 'bg-white/5 group-hover:bg-white/10'}
                                  `}>
                                      {aiLoading === opt.id ? (
                                        <Loader2 size={14} className="animate-spin text-purple-400" />
                                      ) : (
                                        <opt.icon size={14} className="text-gray-400 group-hover:text-white" />
                                      )}
                                  </div>
                                  <div className="flex flex-col">
                                      <span className={`text-xs font-bold ${aiLoading === opt.id ? 'text-purple-300' : 'text-gray-200'}`}>
                                          {opt.label}
                                      </span>
                                      <span className="text-[10px] text-gray-500 group-hover:text-gray-400">
                                          {opt.desc}
                                      </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                       </div>

                    /* Education Input */
                    ) : currentStepConfig.special === "education" ? (
                      <SearchSuggestion dataFile="qualifications.txt" placeholder={currentStepConfig.suggestion} multiple={false} selected={formData.education} onSelect={(v) => updateField("education", v)} />
                    
                    /* Standard Input */
                    ) : (
                      <input value={formData[currentStepConfig.name]} onChange={(e) => updateField(currentStepConfig.name, e.target.value)} placeholder={currentStepConfig.suggestion} className="w-full bg-transparent border-b border-white/20 py-4 text-2xl md:text-3xl font-light outline-none focus:border-white transition-all text-white placeholder-white/10" autoFocus />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-4xl font-light text-white mb-4">You're all set.</h2>
                <p className="text-gray-500 text-base mb-10 font-light max-w-sm mx-auto">We have everything we need to craft your digital presence.</p>
                <button onClick={onSave} className="px-10 py-4 rounded-full bg-white text-black text-lg font-bold hover:scale-105 transition-transform duration-300 shadow-xl">
                  Generate Portfolio
                </button>
              </motion.div>
            )}
        </div>

        {/* Navigation */}
        {currentStep < WIZARD_STEPS.length && (
           <div className="flex justify-between mt-12 pt-6 border-t border-white/5">
             <button onClick={currentStep === 0 ? onExit : prevStep} className="text-gray-500 hover:text-white transition-colors text-sm font-medium">{currentStep === 0 ? "Cancel" : "Previous"}</button>
             <button onClick={nextStep} className="group flex items-center gap-2 text-white text-lg font-light hover:gap-4 transition-all">
               Next <span className="opacity-50 group-hover:opacity-100">→</span>
             </button>
           </div>
        )}
      </div>
    </motion.div>
  );
}