// src/Portfolio/ThemeAssets.js

export const THEME_ASSETS = {
  // === 1. PREMIUM / DARK ===
  thegrandera: {
    desktop: "/preview/theEra/blackdesk.png",
    mobile: [
      "/preview/theEra/blackMobile.png",
      "/preview/theEra/blackMobile2.png",
      "/preview/theEra/blackMobile3.png",
      "/preview/theEra/blackMobile4.png"
    ]
  },
  luxe: {
    desktop: "/preview/luxe/luxe3.png",
    mobile: [
      "/preview/luxe/blackMobile.png",
      "/preview/luxe/blackMobile2.png",
      "/preview/luxe/blackMobile3.png",
        "/preview/luxe/blackMobile4.png"
    ]
  },
  veloura: {
    desktop: "/preview/veloura/whiteDesktop.png",
    mobile: [
      "/preview/veloura/whiteMobile.png",
      "/preview/veloura/whiteMobile2.png",
      "/preview/veloura/whiteMobile3.png",
      "/preview/veloura/whiteMobile4.png"
    ]
  },
  plexis: {
    desktop: "/preview/plexis/desktopBlack.png",
    mobile: [
      "/preview/plexis/whiteMobile.png",
      "/preview/plexis/blackMobile.png",
        "/preview/plexis/whiteMobile2.png",
        "/preview/plexis/whiteMobile3.png"
    ]
  },
  nexus: {
    desktop: "/preview/nexus/blackDesktop.png",
    mobile: [
      "/preview/nexus/whitemobile.png",
      "/preview/nexus/Mobile.png",
        "/preview/nexus/blackMobile3.png",
        "/preview/nexus/blackMobile.png"
    ]
  },
  pulse: {
    desktop: "/preview/pulse/pulse1.png",
    mobile: ["/preview/pulse/whiteMobile.png",
        "/preview/pulse/whiteMobile2.png",
        "/preview/pulse/whiteMobile3.png",
        "/preview/pulse/whiteMobile4.png"
    ] // Empty array will show "Coming Soon" state
  },

  // === 2. CLASSIC / LIGHT ===
  neonix: {
    desktop: "/preview/neonix/whiteDesktop.png",
    mobile: ["/preview/neonix/whiteMobile.png",
        "/preview/neonix/whiteMobile2.png", 
        "/preview/neonix/whiteMobile3.png",
        "/preview/neonix/whiteMobile4.png"
    ]
  },
  modern: {
    desktop: "/preview/modern/blackDesktop.png",
    mobile: [
        "/preview/modern/blackMobile.png", // Fallback/Generic example
        "/preview/modern/blackMobile2.png",
        "/preview/modern/blackMobile3.png",
        "/preview/modern/blackMobile4.png"
    ]
  },
  minimal: {
    desktop: "/preview/minimal/minimal.png",
    mobile: ["/preview/minimal/m.png",
        "/preview/minimal/m2.png",
        "/preview/minimal/m3.png",
        "/preview/minimal/m4.png"
    ]
  },
  business: {
    desktop: "/preview/business/d.png",
    mobile: ["/preview/business/m.png",
        "/preview/business/m2.png",
        "/preview/business/m3.png",
        "/preview/business/m4.png"
    ]
  },
  studentbright: {
    desktop: "/themes/p2.png",
    mobile: ["/preview/sb/m.png",
        "/preview/sb/m2.png",
        "/preview/sb/m3.png",
        "/preview/sb/m4.png"
    ]
  },
};

// Helper to safely get assets with fallbacks
export const getThemeAssets = (themeKey) => {
  const assets = THEME_ASSETS[themeKey];
  return {
    desktop: assets?.desktop || "/themes/placeholder-desktop.jpg",
    mobile: assets?.mobile || [], // Returns empty array if no mobile images defined
  };
};