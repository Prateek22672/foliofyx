// src/chatbot/chatLogic.js

// 1. DEFAULT MENU
const DEFAULT_MENU = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Create Portfolio", value: "create" },
  { label: "Explore Templates", value: "templates" }, // Updated label
  { label: "View Talent", value: "talent" },
];

// 2. KNOWLEDGE BASE
const KNOWLEDGE_BASE = [
  // --- 🧭 NAVIGATION & MAIN PAGES ---
  {
    keywords: ["home", "main page", "landing", "start"],
    response: "Navigating to the Home page.",
    action: "navigate",
    path: "/",
    options: []
  },
  {
    keywords: ["dashboard", "admin", "panel", "login"],
    response: "Accessing your Dashboard. This is where you manage your active sites.",
    action: "navigate",
    path: "/dashboard",
    options: []
  },
  {
    keywords: ["talent", "experts", "hire", "find people"],
    response: "Opening the Talent directory. Here you can discover top professionals using FolioFYX.",
    action: "navigate",
    path: "/talent",
    options: []
  },

  // --- 🎨 TEMPLATES & COLLECTIONS (Trained on ThemesPage.jsx) ---
  {
    keywords: ["template", "templates", "layout", "design", "collection", "gallery"],
    response: "Our gallery is divided into two collections: 'FolioFYX Originals' (Handcrafted Premium designs like *The Grand Aesthetic Era*) and 'Classic Essentials'.",
    action: "navigate",
    path: "/templates",
    options: [
      { label: "Browse Originals", value: "templates" },
      { label: "Browse Classics", value: "templates" }
    ]
  },
  {
    keywords: ["original", "handcrafted", "premium theme", "dark section"],
    response: "Our 'FolioFYX Originals' are exclusive, high-end layouts found in the dark section of the Templates page. These include 'Minimal CraFT' and 'The Grand Aesthetic Era'.",
    action: "navigate",
    path: "/templates",
    options: []
  },
  {
    keywords: ["aesthetic", "grand aesthetic", "aesthetic era"],
    response: "'The Grand Aesthetic Era™' is a FolioFYX Original. It features a premium editorial look and is currently available for use.",
    action: "navigate",
    path: "/templates",
    options: []
  },
  {
    keywords: ["minimal", "craft", "minimalist"],
    response: "'Minimal CraFT' is one of our most popular Originals. It offers a clean, distraction-free layout for creative professionals.",
    action: "navigate",
    path: "/templates",
    options: []
  },
  {
    keywords: ["prateek", "studio theme", "modern"],
    response: "'Prateek™'s Studio' is a Classic Essential template available for immediate use. It features a balanced, modern grid layout.",
    action: "navigate",
    path: "/templates",
    options: []
  },
  {
    keywords: ["coco", "rose", "lemontree", "collab", "creative art"],
    response: "Legacy themes like 'Coco Gonser', 'Rose Ben Yehuda', and 'Lemontree Co.' are currently archived or unavailable. Please check the 'Available' tag on the Templates page.",
    action: "navigate",
    path: "/templates",
    options: []
  },

  // --- 👤 USER PORTFOLIO PAGES ---
  {
    keywords: ["about", "bio", "story", "myself"],
    response: "Navigating to the About page.",
    action: "navigate",
    path: "/about",
    options: []
  },
  {
    keywords: ["service", "services", "offering", "skills"],
    response: "Navigating to the Services page.",
    action: "navigate",
    path: "/services",
    options: []
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "case study"],
    response: "Navigating to the Projects page.",
    action: "navigate",
    path: "/projects",
    options: []
  },
  {
    keywords: ["contact", "email", "touch", "hire me"],
    response: "Navigating to the Contact page.",
    action: "navigate",
    path: "/contact",
    options: []
  },

  // --- 🛠️ CREATION & STUDIO CONTROLS ---
  {
    keywords: ["create", "build", "new website", "start"],
    response: "To begin, please navigate to the Creation Studio. You will need to select a template (Original or Classic) to proceed.",
    action: "navigate",
    path: "/create",
    options: [
      { label: "Open Studio", value: "create" }
    ]
  },
  {
    keywords: ["edit", "change text", "update", "modify"],
    response: "In the Studio, you can edit text directly on the canvas. Use the sidebar to update 'Personal Information' and 'Professional Title'.",
    action: null,
    options: []
  },

  // --- ℹ️ ABOUT FOLIOFYX ---
  {
    keywords: ["foliofyx", "founder", "prateek", "origin"],
    response: "FolioFYX is a next-generation portfolio builder founded by Prateek. It leverages AI to construct professional personal websites in seconds.",
    action: "navigate",
    path: "/about", 
    options: []
  },

  // --- ⚙️ SYSTEM & SCROLLING ---
  {
    keywords: ["scroll", "down", "move down"],
    response: "Scrolling down.",
    action: "scroll_down", 
    path: null,
    options: []
  },
  {
    keywords: ["top", "up", "start"],
    response: "Scrolling to the top.",
    action: "scroll_top",
    path: null,
    options: []
  },
  {
    keywords: ["clear", "reset", "delete chat"],
    response: "Conversation history has been cleared.",
    action: "clear",
    path: null,
    options: DEFAULT_MENU
  },

  // --- 👋 GREETINGS ---
  {
    keywords: ["hi", "hello", "hey", "greetings"],
    response: "Hello. I am FYX Ai. I have full control over the platform's navigation. How may I assist you?",
    action: null,
    options: DEFAULT_MENU
  }
];

export const getBotResponse = (userText) => {
  const lowerText = userText.toLowerCase();

  // 1. Exact/Partial Match Search
  const match = KNOWLEDGE_BASE.find((item) =>
    item.keywords.some((keyword) => lowerText.includes(keyword))
  );

  if (match) {
    return match;
  }

  // 2. Default / Fallback Response
  return {
    response: "I do not recognize that command. Access the menu below for available actions.",
    action: null,
    options: DEFAULT_MENU,
  };
};