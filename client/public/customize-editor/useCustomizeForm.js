// src/pages/Customize/customize-editor/useCustomizeForm.js
import { useState } from "react";

export const useCustomizeForm = (portfolioData, setPortfolioData) => {
  // Local Form States
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectDemo, setProjectDemo] = useState("");
  const [projectTechs, setProjectTechs] = useState([]);
  const [projectTechQuery, setProjectTechQuery] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [skillQuery, setSkillQuery] = useState("");

  // -- Handlers --

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData({ ...portfolioData, [name]: value });
  };

  const toggleSkill = (name) => {
    const exists = portfolioData.skills?.find((s) => s.name === name);
    if (exists) {
      setPortfolioData({ ...portfolioData, skills: portfolioData.skills.filter((s) => s.name !== name) });
    } else {
      setPortfolioData({ ...portfolioData, skills: [...(portfolioData.skills || []), { name, level: skillLevel }] });
    }
    setSkillQuery("");
  };

  const addSkillManual = () => {
    const n = skillQuery.trim();
    if (!n) return;
    if (!portfolioData.skills?.find((s) => s.name.toLowerCase() === n.toLowerCase())) {
      setPortfolioData({ ...portfolioData, skills: [...(portfolioData.skills || []), { name: n, level: skillLevel }] });
    }
    setSkillQuery("");
    setSkillLevel("Intermediate");
  };

  const removeSkillByName = (name) => {
    setPortfolioData({ ...portfolioData, skills: portfolioData.skills.filter((s) => s.name !== name) });
  };

  const toggleProjectTech = (tech) => {
    setProjectTechs((prev) => prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]);
  };

  const addProjectManual = () => {
    const title = projectTitle.trim();
    const techs = projectTechs.length ? projectTechs.join(", ") : projectTechQuery.trim();
    if (!title) return;
    setPortfolioData({
      ...portfolioData,
      projects: [...(portfolioData.projects || []), { title, tech: techs, github: projectGithub.trim(), demo: projectDemo.trim() }],
    });
    setProjectTitle(""); setProjectTechs([]); setProjectTechQuery(""); setProjectGithub(""); setProjectDemo("");
  };

  const removeProject = (idx) => {
    setPortfolioData({ ...portfolioData, projects: portfolioData.projects.filter((_, i) => i !== idx) });
  };

  return {
    // Methods
    handleChange,
    toggleSkill,
    addSkillManual,
    removeSkillByName,
    toggleProjectTech,
    addProjectManual,
    removeProject,
    // States
    projectTitle, setProjectTitle,
    projectGithub, setProjectGithub,
    projectDemo, setProjectDemo,
    projectTechs, setProjectTechs,
    projectTechQuery, setProjectTechQuery,
    skillLevel, setSkillLevel,
    skillQuery, setSkillQuery
  };
};