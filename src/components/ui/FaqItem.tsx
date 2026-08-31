// ─────────────────────────────────────────────────────────────
// Reusable FAQ Accordion Item Component
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl mb-4 bg-white overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:bg-slate-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 pt-1">
          <p className="text-slate-600 leading-relaxed text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
};
