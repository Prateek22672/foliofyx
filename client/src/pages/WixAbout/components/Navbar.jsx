import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <span className="text-3xl tracking-tighter">FolioFYX</span>
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-800">
            <a href="#" className="hover:text-blue-600 flex items-center gap-1">Product <ChevronDown size={14}/></a>
            <a href="#" className="hover:text-blue-600 flex items-center gap-1">Solutions <ChevronDown size={14}/></a>
            <a href="#" className="hover:text-blue-600 flex items-center gap-1">Resources <ChevronDown size={14}/></a>
            <a href="#" className="hover:text-blue-600">Pricing</a>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-800 hover:text-blue-600">Log In</a>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-800">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      {/* Mobile Menu Placeholder */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 shadow-lg absolute w-full">
           <div className="flex flex-col gap-4 font-medium">
             <a href="#">Product</a>
             <a href="#">Solutions</a>
             <a href="#">Resources</a>
             <a href="#">Pricing</a>
             <hr />
             <a href="#">Log In</a>
             <a href="#" className="text-blue-600">Get Started</a>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;