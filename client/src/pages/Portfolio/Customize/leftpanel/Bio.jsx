import React, { useState } from "react";
import { AlignLeft, Briefcase, Coffee, Zap, Wand2, Loader2, Sparkles } from "lucide-react";

const Bio = ({ portfolioData, setPortfolioData }) => {
  const [loading, setLoading] = useState(null);

  // --- 1. FYX AI: DATA EXTRACTION ENGINE ---
  const generateBioWithAI = (tone) => {
    // 1. Extract Real User Data (with smart fallbacks)
    const { name, role, experience, skills, projects, education } = portfolioData;

    const myName = name ? name.split(' ')[0] : "there"; // First name only
    const fullName = name || "a Creator";
    const myRole = role || "Professional";
    
    // Extract Company (Check if experience exists)
    const latestCompany = (experience && experience.length > 0 && experience[0].company) 
      ? experience[0].company 
      : "innovative organizations";

    // Extract Experience Duration
    const duration = (experience && experience.length > 0 && experience[0].period) 
      ? experience[0].period 
      : "my career";

    // Extract Top 3 Skills formatted nicely
    const topSkills = (skills && skills.length > 0)
      ? skills.slice(0, 3).map(s => (typeof s === 'string' ? s : s.name)).join(", ")
      : "modern technologies";

    const mainSkill = (skills && skills.length > 0)
      ? (typeof skills[0] === 'string' ? skills[0] : skills[0].name)
      : "Problem Solving";

    // Extract Project (if exists)
    const latestProject = (projects && projects.length > 0) 
      ? projects[0].title 
      : "digital products";

    // --- 2. PERSONALIZED TEMPLATES ---
    const templates = {
      professional: [
        `I am ${fullName}, a ${myRole} with a proven track record at ${latestCompany}. My expertise lies in ${topSkills}, and I am dedicated to building scalable solutions that drive business growth.`,
        `As a ${myRole} currently working with ${latestCompany}, I specialize in ${mainSkill}. I combine technical depth in ${topSkills} with a strategic mindset to deliver high-quality results.`,
        `Results-oriented ${myRole} with experience spanning ${duration}. I focus on ${topSkills} to solve complex problems and have successfully delivered projects like ${latestProject}.`
      ],
      creative: [
        `Crafting digital experiences is my passion. I'm ${myName}, a ${myRole} who blends the logic of ${mainSkill} with creative design. I turn ideas into reality using ${topSkills}.`,
        `I don't just build; I create. As the creator of ${latestProject}, I use my background as a ${myRole} to tell compelling stories through code and design, powered by ${topSkills}.`,
        `Dreaming in code. I am ${fullName}, a ${myRole} obsessed with ${mainSkill}. My work at ${latestCompany} reflects my commitment to merging aesthetics with functionality.`
      ],
      casual: [
        `Hi, I'm ${myName}! 👋 I'm a ${myRole} who loves building cool stuff like ${latestProject}. When I'm not working with ${latestCompany}, I'm probably geeking out over ${mainSkill}.`,
        `Just a ${myRole} turning coffee into code. I specialize in ${topSkills} and enjoy solving fun puzzles. Currently making waves at ${latestCompany}.`,
        `Hey there! I'm ${fullName}. I build things for the web using ${topSkills}. Check out my work on ${latestProject} to see what I'm all about!`
      ],
      concise: [
        `${myRole} @ ${latestCompany}. Expert in ${topSkills}. Builder of ${latestProject}.`,
        `${fullName} | ${myRole}. Specialized in ${mainSkill} and ${topSkills}.`,
        `Building ${latestProject}. ${myRole} with a focus on ${topSkills}. Based in the digital world.`
      ]
    };

    // 3. Select Random Template from Tone
    const options = templates[tone] || templates.professional;
    const randomChoice = options[Math.floor(Math.random() * options.length)];

    return randomChoice;
  };

  const handleGenerate = (tone) => {
    setLoading(tone);
    
    // Simulate AI "Thinking"
    setTimeout(() => {
      const generatedText = generateBioWithAI(tone);
      setPortfolioData(prev => ({ ...prev, bio: generatedText }));
      setLoading(null);
    }, 1000); // 1 second delay for effect
  };

  const aiOptions = [
    { id: "professional", label: "Professional", icon: Briefcase, desc: "Corporate & Polished" },
    { id: "creative", label: "Creative", icon: Wand2, desc: "Unique & Storyteller" },
    { id: "casual", label: "Casual", icon: Coffee, desc: "Friendly & Open" },
    { id: "concise", label: "Concise", icon: Zap, desc: "Short & Impactful" },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">

      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <AlignLeft size={16} className="text-indigo-600" />
          Biography
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Your personal elevator pitch.
        </p>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <textarea
          name="bio"
          rows={6}
          value={portfolioData.bio || ""}
          onChange={(e) => setPortfolioData({...portfolioData, bio: e.target.value})}
          placeholder="Write a short introduction about yourself, or let AI write it for you..."
          className="w-full p-4 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 text-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none transition-all leading-relaxed"
        />
        {/* Character Count */}
        <div className="absolute bottom-3 right-3 text-[10px] font-medium text-slate-400 bg-slate-100/80 px-2 py-1 rounded-md pointer-events-none">
           {portfolioData.bio?.length || 0} chars
        </div>
      </div>

      {/* AI Generator Section */}
      <div className="pt-4 border-t border-slate-100">
        
        {/* AI Header */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                   <Sparkles size={14} className="text-white" />
                </div>
                <span className="text-xs font-bold text-slate-700">FYX AI Writer</span>
            </div>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 font-medium">
               Uses your profile data
            </span>
        </div>

        {/* Tone Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {aiOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleGenerate(opt.id)}
              disabled={loading !== null}
              className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 group
                ${
                  loading === opt.id
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-slate-100 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
                }
              `}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                 ${loading === opt.id ? 'bg-indigo-200' : 'bg-slate-50 group-hover:bg-indigo-50'}
              `}>
                 {loading === opt.id ? (
                   <Loader2 size={14} className="animate-spin text-indigo-600" />
                 ) : (
                   <opt.icon size={14} className="text-slate-500 group-hover:text-indigo-600" />
                 )}
              </div>
              
              <div className="flex flex-col">
                  <span className={`text-xs font-bold ${loading === opt.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-indigo-400/80">
                      {opt.desc}
                  </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bio;