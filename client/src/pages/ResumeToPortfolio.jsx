import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom"; // Import Link for internal navigation

const ResumeToPortfolio = () => {
  return (
    <>
      <Helmet>
        <title>Resume to Portfolio Website Builder | FolioFYX</title>
        <meta
          name="description"
          content="Convert your resume into a professional portfolio website instantly with FolioFYX. Free hosting, modern templates, and portfolio builder for students and developers."
        />
        <meta property="og:title" content="Resume to Portfolio Website Builder | FolioFYX" />
        <meta property="og:description" content="Instantly transform static PDFs into high-converting portfolio websites." />
      </Helmet>

      <div className="min-h-screen bg-white text-black px-6 py-20 selection:bg-black selection:text-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="max-w-3xl mt-10">
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight">
              Convert Your Resume into a <span className="text-gray-400">Portfolio Website</span>
            </h1>

            <p className="text-xl text-gray-500 mt-8 leading-relaxed">
              FolioFYX helps students and developers instantly transform static PDFs 
              into high-converting portfolio websites with modern templates and free hosting.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/create"
                className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all active:scale-95"
              >
                Start Building Your Portfolio
              </Link>
            </div>
          </div>

          {/* Clickable SEO-Optimized Product Preview */}
          <div className="mt-20">
            <Link 
              to="/create" 
              className="group block relative cursor-pointer overflow-hidden rounded-[2rem]"
            >
              <img
                src="/seo/resume-builder-preview.png" 
                alt="Dashboard preview of FolioFYX resume to portfolio website converter showing template customization"
                className="w-full rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/50 transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Optional: Subtle hover overlay to signal clickability */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </Link>
          </div>

          {/* Features Grid - Minimalist Cards */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 bg-black rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3">Resume to Website</h2>
              <p className="text-gray-600 leading-relaxed">
                Upload your resume and generate a portfolio instantly. Our AI extracts your experience so you don't have to type a thing.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 bg-black rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3">Recruiter-Ready UI</h2>
              <p className="text-gray-600 leading-relaxed">
                Designed for developer placements and internships. Premium layouts that pass the 6-second recruiter skim test.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 bg-black rounded-lg mb-6 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-3">Instant Free Hosting</h2>
              <p className="text-gray-600 leading-relaxed">
                Publish with one click. Every portfolio gets a dedicated FolioFYX link, hosted on our lightning-fast global edge network.
              </p>
            </div>
          </div>

          {/* SEO Footer Text */}
          <div className="mt-32 pt-10 border-t border-gray-100">
            <p className="text-sm text-gray-400 italic">
              Keywords: Resume to portfolio, developer portfolio builder, student resume website, free portfolio hosting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeToPortfolio;