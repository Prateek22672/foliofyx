export const DUMMY_DATA = {
  name: "John Doe",
  role: "Creative Developer",
  bio: "I build digital experiences that blend design and technology. Focused on creating intuitive and scalable applications.",
  experience: "3+ Years",
  skills: [
    { name: "React", level: "Expert" },
    { name: "Tailwind CSS", level: "Expert" },
    { name: "Node.js", level: "Intermediate" }
  ],
  education: "B.Tech in Computer Science",
  projects: [
    { title: "E-Commerce Dash", tech: "React, Redux", github: "#", demo: "#" },
    { title: "AI Chatbot", tech: "OpenAI API, Python", github: "#", demo: "#" }
  ],
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  email: "john@example.com",
  cvLink: "#",
  template: "modern"
};

export const WIZARD_STEPS = [
  { name: "name", question: "What’s your full name?", suggestion: "e.g., Prateek Koratala" },
  { name: "role", question: "What’s your professional title or role?", suggestion: "e.g., Web Developer | AI Engineer" },
  { name: "experience", question: "How many years of experience do you have?", suggestion: "e.g., 2 years in full-stack development" },
  { name: "skills", question: "Let's add your skills one by one.", special: "skills" },
  { name: "education", question: "What’s your highest qualification?", special: "education" },
  { name: "projects", question: "Add your projects one by one.", special: "projects" },
  { name: "bio", question: "Write a short bio about yourself.", suggestion: "e.g., Passionate about building intelligent systems and scalable apps." },
  { name: "linkedin", question: "Your LinkedIn profile link?", suggestion: "e.g., https://linkedin.com/in/yourname" },
  { name: "github", question: "Your GitHub profile link?", suggestion: "e.g., https://github.com/yourusername" },
  { name: "cvLink", question: "Do you have a CV or Resume link?", suggestion: "Paste your Google Drive link..." },
  { name: "email", question: "Your professional email address?", suggestion: "e.g., you@example.com" },
];