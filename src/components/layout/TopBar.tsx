// ─────────────────────────────────────────────────────────────
// Top Merchant Compliance & Support Utility Banner
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { BRAND, CONTACT } from '../../config/constants';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-medium">
        <div className="flex items-center space-x-2 text-slate-300 justify-center sm:justify-start">
          <span className="font-bold text-white">{BRAND.LEGAL_ENTITY}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Independent B2B Consulting Advisory & Custom Strategy Consulting
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-300 text-[10px] shrink-0 justify-center">
          <a
            href={`tel:${CONTACT.PHONE}`}
            className="text-slate-300 hover:text-white flex items-center space-x-1 font-semibold transition-colors"
          >
            <Phone className="h-3 w-3 text-blue-400" />
            <span>{CONTACT.PHONE}</span>
          </a>
          <span className="text-slate-600">•</span>
          <a
            href={`mailto:${CONTACT.EMAIL}`}
            className="text-blue-400 hover:underline flex items-center space-x-1 transition-colors"
          >
            <Mail className="h-3 w-3 text-blue-400" />
            <span>{CONTACT.EMAIL}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
