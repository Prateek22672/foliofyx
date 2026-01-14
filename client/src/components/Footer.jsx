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
    <footer className="bg-white text-black font-['Switzer'] border-t border-gray-200">
      
      {/* ====================== TOP GRID ====================== */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-12">

        {/* -------- PRODUCT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Product</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates" className="hover:text-[#0d355c] transition-colors duration-200">Portfolio Templates</Link></li>
            <li><Link to="/create" className="hover:text-[#0d355c] transition-colors duration-200">AI Portfolio Builder</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#0d355c] transition-colors duration-200">Design Studio</Link></li>
            <li><Link to="/studio" className="hover:text-[#0d355c] transition-colors duration-200">FolioFYX Studio</Link></li>
            <li><Link to="/benefits" className="hover:text-[#0d355c] transition-colors duration-200">Pricing & Benefits</Link></li>
          </ul>
        </div>

        {/* -------- SOLUTIONS -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Solutions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates/cs-students" className="hover:text-[#0d355c] transition-colors duration-200">Student Portfolios</Link></li>
            <li><Link to="/templates?category=developer" className="hover:text-[#0d355c] transition-colors duration-200">Developer Showcase</Link></li>
            <li><Link to="/templates?category=freelancer" className="hover:text-[#0d355c] transition-colors duration-200">Freelancer Portfolios</Link></li>
            <li><Link to="/templates?category=design" className="hover:text-[#0d355c] transition-colors duration-200">Design Portfolios</Link></li>
            <li><Link to="/create" className="hover:text-[#0d355c] transition-colors duration-200">Personal Branding</Link></li>
          </ul>
        </div>

        {/* -------- THEMES -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Themes</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/templates?filter=minimal" className="hover:text-[#0d355c] transition-colors duration-200">Minimal Theme</Link></li>
            <li><Link to="/templates?filter=creative" className="hover:text-[#0d355c] transition-colors duration-200">Creative Theme</Link></li>
            <li><Link to="/templates?filter=business" className="hover:text-[#0d355c] transition-colors duration-200">Business Theme</Link></li>
            <li><Link to="/demo/prateek" className="hover:text-[#0d355c] transition-colors duration-200">Prateek’s Studio Theme</Link></li>
          </ul>
        </div>

        {/* -------- TALENT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Talent</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/talent" className="hover:text-[#0d355c] transition-colors duration-200">Explore Public Profiles</Link></li>
            <li><Link to="/talent" className="hover:text-[#0d355c] transition-colors duration-200">Find Talent</Link></li>
            <li><Link to="/create" className="hover:text-[#0d355c] transition-colors duration-200">Become a Creator</Link></li>
            <li><Link to="/dashboard" className="hover:text-[#0d355c] transition-colors duration-200">My Talent Dashboard</Link></li>
          </ul>
        </div>

        {/* -------- SUPPORT -------- */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#0d355c]">Support</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link to="/about" className="hover:text-[#0d355c] transition-colors duration-200">Contact Support</Link></li>
            <li><a href="mailto:support@foliofyx.com" className="hover:text-[#0d355c] transition-colors duration-200">Report an Issue</a></li>
            <li><Link to="/legal" className="hover:text-[#0d355c] transition-colors duration-200">Legal Center</Link></li>
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
            <Link to="/about" className="hover:text-[#0d355c] transition-colors duration-200 block">About</Link>
            <Link to="/release" className="hover:text-[#0d355c] transition-colors duration-200 block">New Releases</Link>
            <Link to="/benefits" className="hover:text-[#0d355c] transition-colors duration-200 block">Plans</Link>
          </div>
        </div>

      </div>

      {/* ====================== BOTTOM ====================== */}
      <div className="border-t border-gray-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">

          {/* Social Icons */}
          <div className="flex space-x-5 mb-4 md:mb-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="hover:text-[#0d355c] transition-colors duration-200 cursor-pointer text-lg" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-[#0d355c] transition-colors duration-200 cursor-pointer text-lg" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-[#0d355c] transition-colors duration-200 cursor-pointer text-lg" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="hover:text-[#0d355c] transition-colors duration-200 cursor-pointer text-lg" />
            </a>
            <a href="https://github.com/Prateek22672" target="_blank" rel="noopener noreferrer">
                <FaGithub className="hover:text-[#0d355c] transition-colors duration-200 cursor-pointer text-lg" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left mb-4 md:mb-0">
            © 2025 FolioFYX™. All rights reserved.
          </p>

          {/* Terms */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/legal" className="hover:text-[#0d355c] transition-colors duration-200">Terms of Use</Link>
            <Link to="/legal" className="hover:text-[#0d355c] transition-colors duration-200">Privacy Policy</Link>
          </div>

        </div>
      </div>

      {/* ====================== BLUE BRAND STRIP ====================== */}
      <div className="bg-[#0d0d82] text-white text-center py-6 rounded-t-[40px]">
        <p className="text-[11px] sm:text-xs mt-1 uppercase tracking-[0.25em] cursor-pointer hover:opacity-80 transition ">
          A <span className="font-bold">FolioFYX</span> Product — Where ideas meet passion.
        </p>
      </div>

    </footer>
  );
};

export default Footer;