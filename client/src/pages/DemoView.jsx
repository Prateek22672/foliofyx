import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
// ⚠️ Adjust path to match your structure
import { TEMPLATE_LIST } from "./Portfolio/Templates"; 
import { ThemeContext } from "../context/ThemeContext";
import { ChatbotProvider } from "../context/ChatbotContext";

// === 1. MASTER MOCK DATA ===
const DEMO_DATA = {
  fullName: "Alex Sterling",
  tagline: "Building Digital Experiences",
  bio: "I am a Full Stack Developer and UI/UX Designer based in San Francisco. I specialize in building high-quality websites.",
  email: "hello@alexsterling.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
  },
  skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Framer Motion", "AWS"],
  services: [
    { title: "Web Development", description: "Building fast, responsive, and secure websites." },
    { title: "UI/UX Design", description: "Creating intuitive and aesthetically pleasing user interfaces." },
    { title: "Mobile Apps", description: "Developing cross-platform mobile applications." }
  ],
  experience: [
    { 
      role: "Senior Developer", 
      company: "TechNova Inc.", 
      duration: "2023 - Present", 
      description: "Leading the frontend team and architecting scalable web solutions." 
    },
    { 
      role: "Frontend Engineer", 
      company: "Creative Studio", 
      duration: "2021 - 2023", 
      description: "Developed interactive websites for high-profile clients." 
    }
  ],
  projects: [
    {
      title: "Fintech Dashboard",
      description: "A comprehensive analytics dashboard for online retailers.",
      techStack: ["React", "D3.js", "Node"],
      link: "#",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
    },
    {
      title: "Neon Social",
      description: "A real-time social platform with chat and video calling features.",
      techStack: ["Next.js", "Socket.io", "Redis"],
      link: "#",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
    },
    {
      title: "AI Art Generator",
      description: "An AI-powered tool that generates artwork from text prompts.",
      techStack: ["Python", "TensorFlow", "React"],
      link: "#",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop"
    }
  ],
  testimonials: [
    { name: "Sarah Jenkins", role: "CEO at StartUp", text: "Alex is an incredible developer." },
    { name: "Michael Chen", role: "Product Manager", text: "The attention to detail is world-class." }
  ],
  enableChatbot: false 
};

const DemoView = () => {
  const { templateKey } = useParams();

  // === 2. SMART TEMPLATE LOOKUP ===
  const { selectedTemplate, validKey } = useMemo(() => {
    if (!templateKey) return { selectedTemplate: TEMPLATE_LIST.modern, validKey: "modern" };

    // Normalize helper: "The Grand Era" -> "thegrandera"
    const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    const searchParam = normalize(templateKey);

    // 1. Scan TEMPLATE_LIST for a match on KEY or LABEL
    const foundKey = Object.keys(TEMPLATE_LIST).find((key) => {
        const entry = TEMPLATE_LIST[key];
        const normKey = normalize(key);         // e.g. "thegrandera"
        const normLabel = normalize(entry.label); // e.g. "The Grand Era" -> "thegrandera"
        
        // Match against URL param
        return normKey === searchParam || normLabel === searchParam;
    });

    if (foundKey) {
        return { selectedTemplate: TEMPLATE_LIST[foundKey], validKey: foundKey };
    }

    // 2. Fallback if not found (Prevents Error Screen)
    console.warn(`Template "${templateKey}" not found. Falling back to Modern.`);
    return { selectedTemplate: TEMPLATE_LIST.modern, validKey: "modern" };

  }, [templateKey]);


  const TemplateModule = selectedTemplate.module;

  // === 3. MERGE DATA & THEME ===
  const finalData = {
    ...DEMO_DATA,
    themeBg: selectedTemplate.themeBg || "#ffffff",
    themeFont: selectedTemplate.themeFont || "#000000",
    accentColor: "#3B82F6",
    headerColor: selectedTemplate.themeBg,
  };

  const COMPONENT_ORDER = [
    'Header', 'Home', 'About', 'Services', 'Features', 
    'Experience', 'Projects', 'Process', 'Testimonials', 
    'CTA', 'Contact', 'Footer'
  ];

  return (
    <ThemeContext.Provider
      value={{
        bg: finalData.themeBg,
        fg: finalData.themeFont,
        accent: finalData.accentColor,
        header: finalData.headerColor,
      }}
    >
      <ChatbotProvider>
        <div 
            className="relative min-h-screen overflow-x-hidden selection:bg-blue-500 selection:text-white" 
            style={{ backgroundColor: finalData.themeBg, color: finalData.themeFont }}
        >
            
            {/* OPTIONAL: Floating "Use This Template" CTA */}
            <div className="fixed bottom-6 right-6 z-[9999] animate-bounce-slow">
                <Link 
                    // ✅ Important: Use the 'validKey' (database key) for the link, not the messy URL param
                    to={`/customize/${validKey}`} 
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white border border-white/20 font-bold rounded-full shadow-2xl hover:scale-105 transition-transform"
                >
                    Use {selectedTemplate.label || "This Template"}
                </Link>
            </div>

            {/* Render Components */}
            <div className="relative z-10 w-full">
            {COMPONENT_ORDER.map((compKey) => {
                const Component = TemplateModule[compKey];
                if (!Component) return null;

                return (
                <Component 
                    key={compKey} 
                    portfolioData={finalData} 
                    data={finalData}
                />
                );
            })}
            </div>

        </div>
      </ChatbotProvider>
    </ThemeContext.Provider>
  );
};

export default DemoView;