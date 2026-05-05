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
    const response = await axiosInstance.post(
      "/parse-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const json = response.data;

    if (!json.success || !json.data) {
      throw new Error(json.error || "Invalid server response");
    }

    const d = json.data;
    console.log("✅ Resume parsed:", d.name, "|", d.role);

    return {
      name: d.name || "",
      role: d.role || "",
      bio: d.bio || "",
      email: d.email || "",
      linkedin: d.linkedin || "",
      github: d.github || "",
      cvLink: d.cvLink || "",
      education: d.education || "",
      skills: Array.isArray(d.skills) ? d.skills : [],
      experience: Array.isArray(d.experience) ? d.experience : [],
      projects: Array.isArray(d.projects) ? d.projects : [],
    };
  } catch (err) {
    console.error("❌ Resume parsing failed:", err);
    throw new Error("Failed to parse resume. Please try again.");
  }
};