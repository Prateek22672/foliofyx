import React, { useState } from "react";
import { Plus } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 py-4">
      <button
        className="flex justify-between items-center w-full text-lg font-medium text-gray-800 hover:text-indigo-600 transition-colors duration-200 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <Plus className={`h-5 w-5 min-w-[20px] transition-transform duration-300 ${isOpen ? 'rotate-45 text-indigo-600' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600 text-base leading-relaxed animate-fadeIn">
          {answer}
        </p>
      )}
    </div>
  );
};

export default FAQItem;