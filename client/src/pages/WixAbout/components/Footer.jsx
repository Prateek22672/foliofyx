import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-sm">
        <div>
            <h4 className="font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Website Templates</a></li>
                <li><a href="#" className="hover:text-blue-600">Website Builder</a></li>
                <li><a href="#" className="hover:text-blue-600">Website Design</a></li>
                <li><a href="#" className="hover:text-blue-600">Wix Features</a></li>
                <li><a href="#" className="hover:text-blue-600">App Market</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-4">Solutions</h4>
            <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Online Store</a></li>
                <li><a href="#" className="hover:text-blue-600">Online Booking</a></li>
                <li><a href="#" className="hover:text-blue-600">Restaurant Website</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog Website</a></li>
                <li><a href="#" className="hover:text-blue-600">Portfolio Website</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-4">Learn</h4>
            <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Wix Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy and Security Hub</a></li>
                <li><a href="#" className="hover:text-blue-600">SEO Learning Hub</a></li>
                <li><a href="#" className="hover:text-blue-600">Wix Encyclopedia</a></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Investor Relations</a></li>
                <li><a href="#" className="hover:text-blue-600">Wix Capital</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
            </ul>
        </div>
         <div className="col-span-2 md:col-span-4 lg:col-span-1">
             <span className="text-3xl font-extrabold tracking-tighter block mb-4">WiX.com</span>
             <p className="text-gray-500 text-xs leading-relaxed">
                The Wix website builder offers a complete solution from enterprise-grade infrastructure and business features to advanced SEO and marketing tools.
             </p>
         </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
         <p>© 2006-2025 Wix.com, Inc</p>
         <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Accessibility Statement</a>
         </div>
      </div>
    </footer>
  );
};

export default Footer;