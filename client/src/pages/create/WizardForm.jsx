import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchSuggestion from "../../components/SearchSuggestion"; 
import { WIZARD_STEPS } from "./constants"; 

export default function WizardForm({ formData, setFormData, onSave, onExit }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Local States
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");

  const nextStep = () => { if (currentStep < WIZARD_STEPS.length) setCurrentStep((s) => s + 1); };
  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));
  const updateField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const progress = ((currentStep + 1) / (WIZARD_STEPS.length + 1)) * 100;

  // Handlers
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
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${progress}%` }} 
                   className="h-full bg-white shadow-[0_0_10px_white]" 
                   transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
             </div>
           </div>
           <button onClick={onExit} className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest px-3 py-1 border border-white/5 rounded-full hover:bg-white/5">ESC</button>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[300px] flex flex-col justify-center">
            {currentStep < WIZARD_STEPS.length ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
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
                            <div className="flex-1">
                               <SearchSuggestion dataFile="skills.txt" placeholder="Type a skill..." multiple={false} onSelect={toggleSkill} />
                            </div>
                            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="bg-transparent text-gray-400 text-sm outline-none cursor-pointer hover:text-white transition"><option className="bg-black">Basic</option><option className="bg-black">Intermediate</option><option className="bg-black">Expert</option></select>
                          </div>
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
                    
                    /* Education Input */
                    ) : currentStepConfig.special === "education" ? (
                      <SearchSuggestion dataFile="qualifications.txt" placeholder={currentStepConfig.suggestion} multiple={false} selected={formData.education} onSelect={(v) => updateField("education", v)} />
                    
                    /* Standard Input */
                    ) : (
                      <input 
                        value={formData[currentStepConfig.name]} 
                        onChange={(e) => updateField(currentStepConfig.name, e.target.value)} 
                        placeholder={currentStepConfig.suggestion} 
                        className="w-full bg-transparent border-b border-white/20 py-4 text-2xl md:text-3xl font-light outline-none focus:border-white transition-all text-white placeholder-white/10" 
                        autoFocus 
                      />
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