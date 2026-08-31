// ─────────────────────────────────────────────────────────────
// Legal Policy Modal Component (Terms, Privacy, Refund, MCC Compliance)
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { X, Info } from 'lucide-react';
import { BRAND } from '../../config/constants';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  paragraphs: string[];
  closeLabel: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  paragraphs,
  closeLabel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 relative my-8 text-left">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Official Policy Document
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={closeLabel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scope Notice Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start space-x-2.5 mb-5">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            {BRAND.LEGAL_ENTITY} operates strictly as an independent consulting advisory
            and strategy planning service. We do not issue software licenses or software
            contracts directly.
          </p>
        </div>

        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
