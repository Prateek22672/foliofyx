// ==============================================================================
// 🧠 1. GENERAL PLATFORM KNOWLEDGE (For Main Website / Dashboard / Studio)
// ==============================================================================
const GENERAL_KNOWLEDGE = [
  // --- 🧭 CORE NAVIGATION ---
  {
    keywords: ["home", "main", "start", "landing"],
    response: "Navigating to the Home page.",
    action: "navigate",
    path: "/",
    options: [{ label: "Go to Dashboard", value: "dashboard" }]
  },
  {
    keywords: ["dashboard", "admin", "panel", "my sites"],
    response: "Opening your Dashboard. This is your command center to manage portfolios.",
    action: "navigate",
    path: "/dashboard",
    options: [{ label: "Create New", value: "create" }]
  },
  {
    keywords: ["create", "build", "new", "make portfolio"],
    response: "Let's build something great! Redirecting to the creation flow.",
    action: "navigate",
    path: "/create",
    options: []
  },

  // --- 👤 USER PROFILE & SETTINGS ---
  {
    keywords: ["profile", "account", "settings", "user", "me"],
    response: "Opening your User Profile. You can manage your account details here.",
    action: "navigate",
    path: "/profile",
    options: [{ label: "My Dashboard", value: "dashboard" }]
  },

  // --- 💰 PRICING, OFFERS & BENEFITS ---
  {
    keywords: ["price", "cost", "plan", "money", "premium", "benefits", "upgrade", "max"],
    response: "FolioFYX offers a powerful 'Max' tier with AI features. Check out the benefits page.",
    action: "navigate",
    path: "/Benefits", // Matches App.js route
    options: [{ label: "Student Offer", value: "student offer" }]
  },
  {
    keywords: ["student", "free", "offer", "discount", "education"],
    response: "Great news! FolioFYX is 100% FREE for students. You can claim the Student Offer on the benefits page.",
    action: "navigate",
    path: "/Benefits",
    options: []
  },

  // --- 🎨 TEMPLATES & THEMES ---
  {
    keywords: ["template", "theme", "design", "gallery", "layout"],
    response: "Exploring our collection of Premium and Classic templates.",
    action: "navigate",
    path: "/templates",
    options: [
        { label: "CS Students", value: "cs templates" }, 
        { label: "All Themes", value: "templates" }
    ]
  },
  {
    keywords: ["cs student", "computer science", "developer theme", "coding"],
    response: "We have curated templates specifically for CS students and Developers.",
    action: "navigate",
    path: "/templates/cs-students",
    options: []
  },

  // --- ℹ️ INFO, LEGAL & HELP ---
  {
    keywords: ["about", "contact", "team", "foliofyx", "founder"],
    response: "FolioFYX is a next-gen builder for creators. Learn more about our mission.",
    action: "navigate",
    path: "/about",
    options: []
  },
  {
    keywords: ["legal", "privacy", "terms", "policy", "rules"],
    response: "Navigating to the Legal & Privacy Center.",
    action: "navigate",
    path: "/legal",
    options: []
  },
  {
    keywords: ["help", "support", "guide", "how to"],
    response: "I can help! Try saying 'Create Portfolio', 'Student Offer', or 'Go to Studio'.",
    action: null,
    options: [
        { label: "Dashboard", value: "dashboard" },
        { label: "Pricing", value: "pricing" }
    ]
  },
  {
    keywords: ["new", "update", "release", "feature", "news"],
    response: "Checking the latest release notes and updates.",
    action: "navigate",
    path: "/release",
    options: []
  },

  // --- 🤝 TALENT & STUDIO ---
  {
    keywords: ["talent", "hire", "find", "search", "people"],
    response: "Opening the Talent Pool. Discover top creators using FolioFYX.",
    action: "navigate",
    path: "/talent",
    options: []
  },
  {
    keywords: ["studio", "editor", "tool"],
    response: "The Studio is where the magic happens. Learn more about our editor.",
    action: "navigate",
    path: "/studio",
    options: []
  },

  // --- 🔐 AUTH ---
  {
    keywords: ["login", "signin", "log in"],
    response: "Redirecting to Login.",
    action: "navigate",
    path: "/login",
    options: []
  },
  {
    keywords: ["signup", "register", "join"],
    response: "Redirecting to Sign Up.",
    action: "navigate",
    path: "/signup",
    options: []
  }
];

// ==============================================================================
// 🧠 2. THE LOGIC CONTROLLER
// ==============================================================================
export const getBotResponse = (userText, portfolioData) => {
  const lowerText = userText.toLowerCase();

  // ---------------------------------------------------------
  // 🅰️ MODE A: PLATFORM AI (Main Website Navigation)
  // ---------------------------------------------------------
  if (!portfolioData) {
      // 1. Search Knowledge Base
      const match = GENERAL_KNOWLEDGE.find((item) =>
          item.keywords.some((k) => lowerText.includes(k))
      );

      if (match) return match;

      // 2. Greetings
      if (lowerText.includes("hi") || lowerText.includes("hello")) {
          return {
              response: "Hello! I am the FolioFYX Platform AI. I can navigate you anywhere—ask about 'Student Offers', 'Templates', or 'Profile'.",
              options: [{ label: "Create Portfolio", value: "create" }, { label: "Student Offer", value: "student" }]
          };
      }

      // 3. Fallback
      return {
          response: "I can help you explore FolioFYX. Try asking to 'View Templates', 'Check Benefits', or 'Go to Dashboard'.",
          options: [
              { label: "View Templates", value: "templates" },
              { label: "Pricing & Benefits", value: "pricing" }
          ]
      };
  }

  // ---------------------------------------------------------
  // 🅱️ MODE B: PERSONAL AGENT (Portfolio Mode - The "Hype Man")
  // ---------------------------------------------------------
  
  const { name, role, bio, email, linkedin, github, projects, skills, experience } = portfolioData;
  const firstName = name ? name.split(" ")[0] : "The Creator";
  const topSkill = skills && skills.length > 0 ? (typeof skills[0] === 'string' ? skills[0] : skills[0].name) : "Technology";

  // --- 1. HOME / GREETING (High Praise) ---
  if (lowerText.includes("home") || lowerText.includes("start") || lowerText.includes("hi") || lowerText.includes("hello")) {
      return { 
          response: `Welcome! I am ${firstName}'s personal agent. ${firstName} is an exceptional ${role} with deep expertise in ${topSkill}. I highly recommend reviewing their work.`, 
          action: "scroll", 
          path: "home",
          options: [
              { label: "Why Hire?", value: "why hire" },
              { label: "View Projects", value: "projects" },
              { label: "Contact", value: "contact" }
          ]
      };
  }

  // --- 2. "WHY HIRE" / PRAISE / BIO ---
  if (lowerText.includes("hire") || lowerText.includes("why") || lowerText.includes("good") || lowerText.includes("about")) {
      return { 
          response: `${firstName} is a problem solver. ${bio ? bio : `With a strong background as a ${role}, they bring creativity and technical precision to every project.`} You would be lucky to have them on your team!`, 
          action: "scroll", 
          path: "about" 
      };
  }

  // --- 3. SKILLS (Technical Validation) ---
  if (lowerText.includes("skill") || lowerText.includes("stack") || lowerText.includes("tech")) {
      const skillList = skills && skills.length > 0 
          ? skills.map(s => typeof s === 'string' ? s : s.name).join(", ") 
          : "modern web technologies.";
      
      return { 
          response: `Technically, ${firstName} is very strong. They are proficient in: ${skillList}. A perfect fit for modern tech stacks.`,
          action: "scroll", 
          path: "skills" 
      };
  }

  // --- 4. EXPERIENCE (Professionalism) ---
  if (lowerText.includes("experience") || lowerText.includes("history") || lowerText.includes("resume") || lowerText.includes("work")) {
      if (experience && experience.length > 0) {
          const companies = experience.map(e => e.company).join(", ");
          return { 
              response: `${firstName} has delivered results at companies like ${companies}. Their industry experience is a major asset.`,
              action: "scroll",
              path: "experience"
          };
      }
      return { response: `${firstName} is a dedicated professional currently building their career trajectory. Highly motivated and ready to work.` };
  }

  // --- 5. PROJECTS (Proof of Work) ---
  if (lowerText.includes("project") || lowerText.includes("portfolio") || lowerText.includes("case study")) {
      const projectNames = projects && projects.length > 0
          ? projects.map(p => p.title).join(", ")
          : "";
      
      return { 
          response: projectNames ? `Proof of competence? Look no further. ${firstName} built: ${projectNames}. Impressive work.` : `${firstName} is currently stealth-building some innovative projects.`,
          action: "scroll", 
          path: "projects",
          options: [{ label: "Contact Now", value: "contact" }]
      };
  }

  // --- 6. CONTACT (Closing the Deal) ---
  if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("reach") || lowerText.includes("call")) {
      return { 
          response: `Ready to collaborate? You can reach ${firstName} directly at ${email}. I suggest getting in touch quickly!`, 
          action: "scroll", 
          path: "contact",
          link: `mailto:${email}`
      };
  }

  // --- 7. SOCIAL PROOF ---
  if (lowerText.includes("linkedin")) return { response: `Checking their professional network on LinkedIn...`, action: "link", path: linkedin };
  if (lowerText.includes("github")) return { response: `Reviewing their code repositories on GitHub...`, action: "link", path: github };

  // --- 8. FOLIOFYX BRANDING ---
  if (lowerText.includes("foliofyx") || lowerText.includes("platform")) {
      return { 
          response: "This professional portfolio is powered by FolioFYX.",
          action: "link",
          path: "https://foliofyx.in"
      };
  }

  // --- FALLBACK (Personalized) ---
  return {
      response: `I'm focused on showcasing ${firstName}'s talents. Would you like to see their Projects or Professional Experience?`,
      options: [
          { label: "Show Projects", value: "projects" },
          { label: "Experience", value: "experience" },
          { label: "Contact", value: "contact" }
      ]
  };
};