import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGithub,
  FaArrowRight
} from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  // Helper to scroll to top when clicking links
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white text-black border-t border-gray-200 font-sans relative z-50">
      
      {/* ====================== TOP GRID ====================== */}
      <div className="max-w-[95rem] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

        {/* -------- BRANDING (Span 2 Columns on Large Screens) -------- */}
        <div className="lg:col-span-2 pr-8">
          <Link to="/" onClick={handleLinkClick} className="inline-block mb-6">
             {/* Replace with your actual Logo Image if available, or text */}
             <div className="flex items-center gap-2">
                <img src="/fyx3.png" alt="Foliofy Logo" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-2xl font-bold tracking-tight">FolioFYX.</span>
             </div>
          </Link>

          <p className="text-gray-500 leading-relaxed mb-8 max-w-sm text-sm">
            FolioFYX helps developers, students, and agencies design, build, and launch powerful React portfolios—no code needed. 
            <br /><br />
            Stop wasting time building. Start creating impact.
          </p>

          <div className="flex items-center gap-4">
             <Link 
                to="/create" 
                onClick={handleLinkClick}
                className="px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-violet-600 transition-colors flex items-center gap-2"
             >
                Start Building <FaArrowRight />
             </Link>
             <Link 
                to="/studio" 
                onClick={handleLinkClick}
                className="px-6 py-3 border border-gray-200 text-black rounded-full text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
             >
                Hire Studio
             </Link>
          </div>
        </div>

        {/* -------- PRODUCT -------- */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-black">Product</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><Link to="/Designs" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">All Templates</Link></li>
            <li><Link to="/create" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">AI Portfolio Builder</Link></li>
            <li><Link to="/dashboard" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Design Studio</Link></li>
            <li><Link to="/Pricing" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Pricing & Plans</Link></li>
            <li><Link to="/release" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">New Releases</Link></li>
          </ul>
        </div>

        {/* -------- POPULAR THEMES -------- */}
        {/* Directly linking to customization for faster conversion */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-black">Trending Themes</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><Link to="/customize/nexus" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Nexus (Resume)</Link></li>
            <li><Link to="/customize/plexis" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Plexis (Dev)</Link></li>
            <li><Link to="/customize/luxe" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Luxe (Premium)</Link></li>
            <li><Link to="/customize/veloura" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Veloura (Creative)</Link></li>
            <li><Link to="/Designs" onClick={handleLinkClick} className="text-violet-600 hover:underline text-xs mt-2 block">View All →</Link></li>
          </ul>
        </div>

        {/* -------- TALENT & STUDIO -------- */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-black">Community</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><Link to="/talent" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Find Talent</Link></li>
            <li><Link to="/studio" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">FolioFYX Studio</Link></li>
            <li><Link to="/about" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">About Us</Link></li>
            <li><Link to="/profile" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">My Profile</Link></li>
          </ul>
        </div>

        {/* -------- SUPPORT -------- */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-black">Support</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            <li><Link to="/about" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Contact Us</Link></li>
            <li><Link to="/legal" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Refund Policy</Link></li>
            <li><Link to="/legal" onClick={handleLinkClick} className="hover:text-violet-600 transition-colors">Terms & Conditions</Link></li>
            <li><a href="mailto:foliofyx@gmail.com" className="hover:text-violet-600 transition-colors">Report Issue</a></li>
          </ul>
        </div>

      </div>

      {/* ====================== BOTTOM ====================== */}
      <div className="border-t border-gray-100 py-8 bg-gray-50">
        <div className="max-w-[95rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">

          {/* Social Icons */}
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors transform hover:-translate-y-1"><FaInstagram size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors transform hover:-translate-y-1"><FaLinkedin size={18} /></a>
            <a href="https://github.com/Prateek22672" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors transform hover:-translate-y-1"><FaGithub size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors transform hover:-translate-y-1"><FaYoutube size={18} /></a>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-right">
            © 2025 FolioFYX™. Based in India.
          </p>

        </div>
      </div>

      {/* ====================== BLUE BRAND STRIP ====================== */}
      {/* Kept your brand strip but updated color to match the violet theme used in Pricing */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-violet-900 text-white text-center py-4 cursor-pointer hover:bg-violet-950 transition-colors"
      >
        <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] opacity-80">
          Designed for <span className="text-white font-bold opacity-100">Excellence</span>
        </p>
      </div>

    </footer>
  );
};

export default Footer;