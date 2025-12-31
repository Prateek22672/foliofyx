import * as Modern from "./Modern";
import * as Minimal from "./Minimal";
import * as StudentBright from "./StudentBright";
import * as Nexus from "./Nexus";
import * as Plexis from "./Plexis";
import * as TheGrandEra from "./TheGrandEra";
import * as Business from "./Business";
import * as Luxe from "./Luxe";
import * as Veloura from "./Veloura";
import * as Pulse from "./Pulse";
import * as Neonix from "./Neonix";




export const TEMPLATE_LIST = {

  pulse: {
    module: Pulse,
    label: "Pulse",
    preview: "/preview/pulse/pulse1.png",
    tags: ["Developer", "Creative", "Dark", "Hero", "Smooth UI"],
    themeBg: "#ffffff",
    themeFont: "#000000"
  },
  
  nexus: {
    module: Nexus,
    label: "Nexus",
    preview: "/preview/nexus/blackDesktop.png",
    tags: ["Resume", "Professional", "Clean", "Minimal", "Smooth UI"],
    themeBg: "#ffffff",
    themeFont: "#000000"
  },

  plexis: {
    module: Plexis,
    label: "Plexis",
    preview: "/preview/plexis/desktopBlack.png",
    tags: ["Modern", "Developer", "Dark", "Bold", "Smooth UI"],
    themeBg: "#0a0a0a",
    themeFont: "#ffffff"
  },


  luxe: {
    module: Luxe,
    label: "Luxe",
    preview: "/preview/luxe/luxe3.png",
    tags: ["Premium", "Animation"],
    // ✅ Add Defaults
    themeBg: "#0f0f0f",
    themeFont: "#f0f0f0"
  },

  veloura: {
    module: Veloura,
    label: "Veloura",
    preview: "/preview/veloura/whiteDesktop.png",
    tags: ["Premium", "Animation"],
    tags: ["Creative", "Gradient", "Modern", "Animated", "Smooth UI"],
    themeBg: "#ffffff",
    themeFont: "#000000"
  },



  thegrandera: {
    module: TheGrandEra,
    label: "The Grand Era",
    preview: "/preview/theEra/blackdesk.png",
    tags: ["Cinematic", "Bold", "Dark", "Personal Brand", "Premium"],
    themeBg: "#000000",
    themeFont: "#ffffff"
  },

  neonix: {
    module: Neonix,
    label: "Neonix",
    tags: ["Creative", "Modern", "Bright", "Personal", "Smooth UI"],
    preview: "/preview/neonix/whiteDesktop.png",
    themeBg: "#ffffff",
    themeFont: "#000000"
  },
  minimal: {
    module: Minimal,
    label: "Minimal",
    preview: "/preview/minimal/minimal.png",
    tags: ["Minimal", "Clean", "Resume", "Simple", "Fast"],
    themeBg: "#f8f9fa",
    themeFont: "#1a1a1a"
  },

  modern: {
    module: Modern,
    label: "Modern",
    preview: "/preview/modern/blackDesktop.png",
    tags: ["Modern", "Clean", "Professional", "Portfolio", "Smooth UI"],
    themeBg: "#ffffff",
    themeFont: "#000000"
  },

  studentbright: {
    module: StudentBright,
    label: "Student Bright",
    preview: "/themes/p2.png",
    tags: ["Student", "Beginner", "Bright", "Simple", "Easy Setup"],
    themeBg: "#ffffff",
    themeFont: "#333333"
  },

  business: {
    module: Business,
    label: "Business",
    preview: "/themes/talentbg.jpg",
    tags: ["Business", "Corporate", "Professional", "Clean", "Formal"],
    themeBg: "#ffffff",
    themeFont: "#111827"
  },
};