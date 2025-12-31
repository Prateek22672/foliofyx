import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

// ✅ PDF Worker Setup
// Ensure the version here matches your installed 'pdfjs-dist' version exactly.
// If you are unsure, check package.json. This fallback usually works for standard installs.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

/**
 * Main Function: Extract Data from Resume (PDF or Image)
 */
export const parseResumeFile = async (file) => {
  console.log(`🚀 Parsing started for: ${file.name} (${file.type})`);
  
  try {
    let rawText = "";

    // === 1. ROUTING: Check File Type ===
    if (file.type === "application/pdf") {
      rawText = await extractTextFromPDF(file);
    } 
    else if (file.type.startsWith("image/")) {
      rawText = await extractTextFromImage(file);
    } 
    else {
      throw new Error("Unsupported file type. Please upload a PDF or Image.");
    }

    console.log("✅ Raw Text Extracted:", rawText.substring(0, 150) + "...");

    // === 2. PARSING: Convert Text to JSON ===
    const structuredData = parseTextToProfile(rawText);
    console.log("✨ Data Structured:", structuredData);
    
    return structuredData;

  } catch (error) {
    console.error("❌ Parse Error:", error);
    // Return fallback data so the app doesn't hang
    return {
      name: "",
      bio: "Could not auto-parse resume. Please fill details manually.",
      skills: [],
      role: "Creative Developer", // Default fallback
      projects: []
    };
  }
};

/**
 * 🔹 HELPER: Extract Text from PDF
 */
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + " ";
    }
    return fullText;
  } catch (e) {
    console.error("PDF Read Error:", e);
    throw new Error("Failed to read PDF text.");
  }
};

/**
 * 🔹 HELPER: Extract Text from Image (OCR)
 */
const extractTextFromImage = async (file) => {
  try {
    console.log("📷 Starting OCR on image...");
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng', // Language
      { logger: m => console.log(m) } // Optional: Logs progress
    );
    return text;
  } catch (e) {
    console.error("OCR Error:", e);
    throw new Error("Failed to recognize text in image.");
  }
};

/**
 * 🔹 HELPER: Logic to map raw text to fields
 */
const parseTextToProfile = (text) => {
  // Clean up text (remove extra spaces/newlines) to make regex easier
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const lowerText = cleanText.toLowerCase();

  // 1. EMAIL (Improved Regex)
  const emailMatch = cleanText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  
  // 2. LINKS (Improved Regex)
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = cleanText.match(/github\.com\/[a-zA-Z0-9_-]+/i);

  // 3. SKILLS (Keyword Search)
  // Add more keywords relevant to your users
  const commonSkills = [
    "React", "JavaScript", "Python", "Node.js", "AWS", "Design", "Figma", 
    "SQL", "Java", "C++", "TypeScript", "Tailwind", "CSS", "HTML", 
    "MongoDB", "PostgreSQL", "Docker", "Git", "Next.js", "Vue"
  ];
  
  const foundSkills = commonSkills
    .filter(skill => lowerText.includes(skill.toLowerCase()))
    .map(skill => ({ name: skill, level: "Intermediate" }));

  // 4. ROLE
  let role = "Professional";
  if (lowerText.includes("full stack") || lowerText.includes("fullstack")) role = "Full Stack Developer";
  else if (lowerText.includes("frontend") || lowerText.includes("front-end")) role = "Frontend Developer";
  else if (lowerText.includes("backend")) role = "Backend Developer";
  else if (lowerText.includes("designer") || lowerText.includes("ui/ux")) role = "UI/UX Designer";
  else if (lowerText.includes("data scientist") || lowerText.includes("analyst")) role = "Data Scientist";
  else if (lowerText.includes("student") || lowerText.includes("university")) role = "Student";

  // 5. PROJECTS (Rudimentary Extraction)
  // Trying to find lines that might look like projects (this is hard without AI)
  const projects = [];
  if (lowerText.includes("project") || lowerText.includes("projects")) {
     // Placeholder: If we detect project keywords, we hint to the user
     projects.push({ title: "My Portfolio", tech: "React, Tailwind", github: "", demo: "" });
  }

  return {
    name: "", // Extracting name strictly via Regex is very error-prone
    role: role,
    email: emailMatch ? emailMatch[0] : "",
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
    github: githubMatch ? `https://${githubMatch[0]}` : "",
    bio: `A ${role} with experience in ${foundSkills.slice(0, 3).map(s => s.name).join(", ")}.`,
    skills: foundSkills,
    projects: projects,
    education: "", // Hard to extract reliably without AI
  };
};