import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowUpRight, FileText, RefreshCcw, MessageSquare } from "lucide-react";
import Footer from "./components/Footer";

const Legal = () => {
  
  // Helper for consistent section headers
  const SectionHeader = ({ icon: Icon, title, date }) => (
    <div className="mb-12 border-b border-white/10 pb-8">
      <div className="flex items-center gap-3 mb-4 text-violet-400">
        <Icon size={24} />
        <span className="text-xs font-bold uppercase tracking-widest">Policy Section</span>
      </div>
      <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-4">
        {title}
      </h2>
      {date && (
        <p className="text-neutral-500 font-mono text-sm">Last Updated: {date}</p>
      )}
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-violet-500/30" style={{ fontFamily: 'Switzer, sans-serif' }}>
      
      {/* BACKGROUND ACCENT */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-900/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* NAV / TOP BAR (Optional - fitting directly into structure) */}
      <div className="pt-120 sm:pt-35 px-6 md:px-12 lg:px-24 max-w-[90rem] mx-auto">
        <h1 className="text-[16vw] md:text-[10rem] leading-[0.85] font-semibold tracking-tighter text-white mb-24 select-none">
          Legal & <br /> Support
        </h1>

        <p className="text-gray-500 text-3sm sm:text-xs sm:text-w-xl font-medium">Get in touch with the right people at FolioFYX.<br></br> We’re here to help.</p>
        <img src="logow.png" className="absolute sm:right-0 right-0 sm:w-35 opacity-15 hover:opacity-80 hover:transition-transform sm:top-60 top-40 w-30 rotate-90 brightness-1000"/>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-35 pb-32 relative z-10">

        {/* ==========================
            1. TERMS & CONDITIONS
        ========================== */}
        <section id="terms" className="mb-32">
          <SectionHeader icon={FileText} title="Terms & Conditions" date="17 December 2025" />
          
          <div className="space-y-12 text-neutral-300 leading-relaxed text-lg md:text-xl font-light">
            <p>
              Welcome to <strong className="text-white font-medium">FOLIOFYX</strong>. By accessing or using our website, services, or plans, you agree to the following Terms & Conditions. These terms are intended to ensure a transparent, respectful, and fair experience for all users.
            </p>

            <div className="space-y-8">
              <PolicyPoint number="01" title="About Our Services">
                FOLIOFYX provides portfolio website themes and digital solutions primarily for students, individuals, and businesses. We offer free, premium, and custom website development plans, including the FOLIOFYX Gold plan.
              </PolicyPoint>

              <PolicyPoint number="02" title="Usage of Themes & Content">
                All themes, designs, and digital assets provided by FOLIOFYX are for personal or business use by the purchaser only. Reproducing, reselling, redistributing, or claiming ownership of our themes or designs without written permission is not permitted.
              </PolicyPoint>

              <PolicyPoint number="03" title="Custom Website Development">
                Custom websites under the FOLIOFYX Gold plan are developed based on client requirements discussed and agreed upon before development begins.
              </PolicyPoint>

              <PolicyPoint number="04" title="User Responsibility">
                Users are responsible for providing accurate information, content, and requirements during the service process. FOLIOFYX is not responsible for delays caused due to incomplete or incorrect inputs from the user.
              </PolicyPoint>

              <PolicyPoint number="05" title="Intellectual Property">
                All intellectual property, including designs, code, and branding elements, remain the property of FOLIOFYX unless otherwise agreed in writing.
              </PolicyPoint>

              <PolicyPoint number="06" title="Limitation of Liability">
                FOLIOFYX shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. Our total liability, if any, shall be limited to the amount paid for the service.
              </PolicyPoint>

              <PolicyPoint number="07" title="Changes to Terms">
                We may update these Terms & Conditions from time to time to improve clarity or reflect service updates. Any changes will be posted on this page with an updated date.
              </PolicyPoint>
            </div>
          </div>
        </section>


        {/* ==========================
            2. REFUND POLICY
        ========================== */}
        <section id="refund" className="mb-32">
          <SectionHeader icon={RefreshCcw} title="Refund Policy" date="17 December 2025" />

          <div className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 backdrop-blur-sm mb-12">
            <p className="text-lg text-neutral-300 leading-relaxed mb-8">
              At FOLIOFYX, we aim to be transparent with our users regarding payments and services.
            </p>

            <div className="grid gap-8">
               <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <h4 className="text-white font-medium mb-2 text-xl">No Refund Policy</h4>
                    <p className="text-neutral-400">Currently, all payments made for any FOLIOFYX plans or services are non-refundable. Once a plan is purchased, we do not offer refunds, cancellations, or chargebacks at this time.</p>
                  </div>
               </div>
               
               <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-neutral-400 flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <h4 className="text-white font-medium mb-2 text-xl">Reasoning</h4>
                    <p className="text-neutral-400">Our services involve digital products, immediate access, or custom development work, which makes refunds impractical at the current stage.</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-neutral-400 flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <h4 className="text-white font-medium mb-2 text-xl">Future Updates</h4>
                    <p className="text-neutral-400">We are actively working on defining a more flexible refund and cancellation policy. Any future changes will be clearly updated on this page.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>


        {/* ==========================
            3. CONTACT US
        ========================== */}
        <section id="contact">
          <SectionHeader icon={MessageSquare} title="Contact Us" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactCard 
              title="Email Support" 
              value="foliofyx@gmail.com" 
              sub="Response within 24 hours"
              icon={Mail}
              link="mailto:foliofyx@gmail.com"
            />
            <ContactCard 
              title="Phone Support" 
              value="+91 93470 26616" 
              sub="Mon-Fri, 9am - 6pm"
              icon={Phone}
              link="tel:+919347026616"
            />
          </div>

          <div className="mt-12 pt-12 border-t border-white/5 text-center md:text-left">
             <p className="text-neutral-500 text-sm">
               If you have concerns or questions regarding your purchase, you are encouraged to contact us. <br className="hidden md:block"/>
               We are happy to assist and clarify any issues to the best of our ability.
             </p>
          </div>
        </section>

      </div>

        <Footer/>
    </div>
  );
};

// --- Sub-Components ---

const PolicyPoint = ({ number, title, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="flex items-baseline gap-4 mb-2">
      <span className="text-xs font-mono text-neutral-600 font-bold">{number}</span>
      <h3 className="text-2xl text-white font-medium group-hover:text-violet-300 transition-colors">{title}</h3>
    </div>
    <div className="pl-8 md:pl-10 text-neutral-400 border-l border-white/5">
      {children}
    </div>
  </motion.div>
);

const ContactCard = ({ title, value, sub, icon: Icon, link }) => (
  <a href={link} className="block group">
    <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl hover:bg-neutral-800 hover:border-violet-500/50 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
         <ArrowUpRight className="text-white" />
      </div>
      
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      
      <h3 className="text-neutral-400 text-sm uppercase tracking-widest font-bold mb-2">{title}</h3>
      <p className="text-xl md:text-2xl text-white font-medium mb-1 break-all">{value}</p>
      <p className="text-neutral-500 text-sm">{sub}</p>
    </div>
  </a>


);

export default Legal;