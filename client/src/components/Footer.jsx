import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

// Link groups kept as data so columns stay balanced and easy to maintain.
const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Portfolio Templates", to: "/designs" },
      { label: "AI Portfolio Builder", to: "/create" },
      { label: "AI Chat Builder", to: "/ai-builder" },
      { label: "Design Studio", to: "/dashboard" },
      { label: "Pricing & Benefits", to: "/Benefits" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Student Portfolios", to: "/templates/cs-students" },
      { label: "Developer Showcase", to: "/designs" },
      { label: "Freelancer Portfolios", to: "/designs" },
      { label: "Personal Branding", to: "/create" },
      { label: "FolioFYX Studio", to: "/studio" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Design Collections", to: "/designs" },
      { label: "Find Talent", to: "/talent" },
      { label: "Become a Creator", to: "/create" },
      { label: "New Releases", to: "/release" },
      { label: "About FolioFYX", to: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Support", to: "/about" },
      { label: "Report an Issue", href: "mailto:support@foliofyx.com" },
      { label: "Legal Center", to: "/legal" },
      { label: "Terms of Use", to: "/legal" },
      { label: "Privacy Policy", to: "/legal" },
    ],
  },
];

const FooterLink = ({ link }) =>
  link.href ? (
    <a href={link.href} className="hover:text-[#0d0d82] transition-colors duration-200">
      {link.label}
    </a>
  ) : (
    <Link to={link.to} className="hover:text-[#0d0d82] transition-colors duration-200">
      {link.label}
    </Link>
  );

const Footer = () => {
  return (
    <footer className="bg-white text-black font-['Switzer'] border-t border-gray-200">

      {/* ====================== TOP GRID ====================== */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-14 grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10">

        {/* -------- BRAND (leads the grid, anchors the layout) -------- */}
        <div className="col-span-2 md:col-span-4 pr-0 md:pr-10">
          <img
            src="/fyx3.png"
            alt="FolioFYX Logo"
            className="w-28 mb-4 rounded-xl"
          />
          <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-xs">
            Design, build, and launch a powerful AI-made website — no code
            needed. Your online identity, ready in minutes.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/foliofyx" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="text-gray-500 hover:text-[#0d0d82] transition-colors duration-200">
              <FaInstagram className="text-xl" />
            </a>
            <a href="https://www.linkedin.com/company/foliofyx" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="text-gray-500 hover:text-[#0d0d82] transition-colors duration-200">
              <FaLinkedin className="text-xl" />
            </a>
            <a href="https://github.com/Prateek22672" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="text-gray-500 hover:text-[#0d0d82] transition-colors duration-200">
              <FaGithub className="text-xl" />
            </a>
          </div>
        </div>

        {/* -------- LINK COLUMNS (equal length, no orphan whitespace) -------- */}
        {COLUMNS.map((col) => (
          <div key={col.title} className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#0d0d82]">
              {col.title}
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* ====================== BOTTOM BAR ====================== */}
      <div className="border-t border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2025 FolioFYX™. All rights reserved.</p>
          <p className="text-gray-400">Made for students, developers & creators.</p>
        </div>
      </div>

      {/* ====================== BLUE BRAND STRIP ====================== */}
      <div className="bg-[#0d0d82] text-white rounded-t-[28px] md:rounded-t-[36px] py-5 md:py-6 px-6 flex items-center justify-center">
        <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-center leading-relaxed">
          A <span className="font-bold">FolioFYX</span> Product — Where ideas meet passion.
        </p>
      </div>

    </footer>
  );
};

export default Footer;
