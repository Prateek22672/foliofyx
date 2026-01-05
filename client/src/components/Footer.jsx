import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // UPDATED: Font changed to Switzer
    <footer className="bg-white text-black font-['Switzer'] border-t border-gray-200">
      
      {/* ====================== TOP GRID ====================== */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-12">

        {/* -------- PRODUCT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Product</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates" className="footer-link">Portfolio Templates</Link></li>
            <li><Link to="/create" className="footer-link">AI Portfolio Builder</Link></li>
            <li><Link to="/dashboard" className="footer-link">Design Studio</Link></li>
            <li><Link to="/studio" className="footer-link">FolioFYX Studio</Link></li>
            <li><Link to="/benefits" className="footer-link">Pricing & Benefits</Link></li>
          </ul>
        </div>

        {/* -------- SOLUTIONS -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Solutions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates/cs-students" className="footer-link">Student Portfolios</Link></li>
            <li><Link to="/templates?category=developer" className="footer-link">Developer Showcase</Link></li>
            <li><Link to="/templates?category=freelancer" className="footer-link">Freelancer Portfolios</Link></li>
            <li><Link to="/templates?category=design" className="footer-link">Design Portfolios</Link></li>
            <li><Link to="/create" className="footer-link">Personal Branding</Link></li>
          </ul>
        </div>

        {/* -------- THEMES -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Themes</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates?filter=minimal" className="footer-link">Minimal Theme</Link></li>
            <li><Link to="/templates?filter=creative" className="footer-link">Creative Theme</Link></li>
            <li><Link to="/templates?filter=business" className="footer-link">Business Theme</Link></li>
            <li><Link to="/demo/prateek" className="footer-link">Prateek’s Studio Theme</Link></li>
          </ul>
        </div>

        {/* -------- TALENT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Talent</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/talent" className="footer-link">Explore Public Profiles</Link></li>
            <li><Link to="/talent" className="footer-link">Find Talent</Link></li>
            <li><Link to="/create" className="footer-link">Become a Creator</Link></li>
            <li><Link to="/dashboard" className="footer-link">My Talent Dashboard</Link></li>
          </ul>
        </div>

        {/* -------- SUPPORT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Support</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/about" className="footer-link">Contact Support</Link></li>
            <li><a href="mailto:support@foliofyx.com" className="footer-link">Report an Issue</a></li>
            <li><Link to="/legal" className="footer-link">Legal Center</Link></li>
          </ul>
        </div>

        {/* -------- COMPANY -------- */}
        <div>
          <img
            src="/fyx3.png"
            alt="FolioFYX Logo"
            className="w-35 mb-4 rounded-xl"
          />

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            FolioFYX helps you design, build, and launch powerful AI-powered
            portfolios — no code needed. Create your online identity in minutes.
          </p>

          <div className="space-y-2 font-medium">
            <Link to="/about" className="footer-link block">About</Link>
            <Link to="/release" className="footer-link block">New Releases</Link>
            <Link to="/benefits" className="footer-link block">Plans</Link>
          </div>
        </div>

      </div>

      {/* ====================== BOTTOM ====================== */}
      <div className="border-t border-gray-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">

          {/* Social Icons */}
          <div className="flex space-x-5 mb-4 md:mb-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="footer-icon" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="footer-icon" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="footer-icon" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube className="footer-icon" /></a>
            <a href="https://github.com/Prateek22672" target="_blank" rel="noopener noreferrer"><FaGithub className="footer-icon" /></a>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left mb-4 md:mb-0">
            © 2025 FolioFYX™. All rights reserved.
          </p>

          {/* Terms */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/legal" className="footer-link">Terms of Use</Link>
            <Link to="/legal" className="footer-link">Privacy Policy</Link>
          </div>

        </div>
      </div>

      {/* ====================== BLUE BRAND STRIP ====================== */}
      <div className="bg-[#0d0d82] text-white text-center py-6 rounded-t-[40px]">
        <p className="text-[11px] sm:text-xs mt-1 uppercase tracking-[0.25em] cursor-pointer hover:opacity-80 transition ">
          A <span className="font-bold">FolioFYX</span> Product — Where ideas meet passion.
        </p>
      </div>

      {/* Global Footer Hover Class */}
      <style>{`
        .footer-link { 
          transition: 0.2s;
        }
        .footer-link:hover {
          color: #0d355c;
        }
        .footer-icon {
          cursor: pointer;
          transition: 0.2s;
        }
        .footer-icon:hover {
          color: #0d355c;
        }
      `}</style>

    </footer>
  );
};

export default Footer;