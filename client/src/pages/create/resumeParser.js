// src/resumeParser.js

import axiosInstance from "../../api/axiosInstance";

/**
 * @param {File} file
 * @returns {Promise<object>}
 */
export const parseResumeFile = async (file) => {
  console.log(`🚀 Uploading resume: ${file.name} (${file.size} bytes)`);

  const formData = new FormData();
  formData.append("resume", file);

  try {
    // Note: no manual Content-Type here — axios/the browser must set the
    // multipart boundary itself.
    const response = await axiosInstance.post("/parse-resume", formData);

    const json = response.data;

    if (!json.success || !json.data) {
      throw new Error(json.error || "The server returned an unexpected response.");
    }

    const d = json.data;
    console.log("✅ Resume parsed:", d.name, "|", d.role);

    // Normalize to the exact shape the builder (WizardForm / ResumePreviewModal
    // / saveOrUpdatePortfolio payload) expects.
    return {
      name: d.name || "",
      role: d.role || "",
      bio: d.bio || "",
      email: d.email || "",
      linkedin: d.linkedin || "",
      github: d.github || "",
      cvLink: d.cvLink || "",
      education: d.education || "",
      skills: (Array.isArray(d.skills) ? d.skills : [])
        .filter((s) => s && s.name)
        .map((s) => ({
          name: String(s.name),
          level: ["Basic", "Intermediate", "Expert"].includes(s.level) ? s.level : "Intermediate",
        })),
      experience: (Array.isArray(d.experience) ? d.experience : [])
        .filter((e) => e && (e.company || e.role))
        .map((e) => ({
          company: e.company || "",
          role: e.role || "",
          period: e.period || "",
          desc: e.desc || "",
        })),
      projects: (Array.isArray(d.projects) ? d.projects : [])
        .filter((p) => p && p.title)
        .map((p) => ({
          title: p.title || "",
          tech: p.tech || "",
          github: p.github || "",
          demo: p.demo || "",
          description: p.description || "",
        })),
    };
  } catch (err) {
    console.error("❌ Resume parsing failed:", err);
    // Surface the REAL reason to the UI instead of a generic message:
    // the server sends { error: "..." } on 4xx/5xx.
    const serverMsg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      (err.response?.status === 429
        ? "Too many uploads — please wait a minute and try again."
        : "");
    const message = serverMsg || err.message || "Failed to parse resume.";
    const wrapped = new Error(message);
    wrapped.status = err.response?.status;
    throw wrapped;
  }
};