// src/pages/Templates/Custom/index.js
// Registers the Custom template in the FolioFyx template system.
// Drop-in entry into TEMPLATE_LIST — no other system changes needed.

export { CustomCanvas as default } from "./CustomCanvas";

// The template config object — spread into TEMPLATE_LIST in index.js
export const CUSTOM_TEMPLATE_CONFIG = {
  label:   "Custom Builder",
  preview: "/preview/custom/preview.png", // add a screenshot here later
  tags:    ["Custom", "Drag & Drop", "Full Control", "Wix-style", "Any Layout"],
  themeBg:   "#ffffff",
  themeFont: "#111827",
  isCustom:  true, // flag used by RightPanel + EditorPanel to activate builder UI
};