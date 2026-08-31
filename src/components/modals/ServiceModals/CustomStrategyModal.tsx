// ─────────────────────────────────────────────────────────────
// Custom Day-by-Day Strategy Planning (₹12,500 INR ($150.00 USD)) Detail Modal
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { X, Info, CheckCircle2 } from 'lucide-react';
import { LegalModalType } from '../../../types';
import { translations } from '../../../translations';
import { SERVICES } from '../../../config/constants';

interface CustomStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (serviceName: string) => void;
  onOpenLegalModal: (modal: LegalModalType) => void;
  t: typeof translations['en'];
}

export const CustomStrategyModal: React.FC<CustomStrategyModalProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onOpenLegalModal,
  t,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const data = t.modals.customStrategyDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 p-6 md:p-8 relative my-8 text-left">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                ₹12,500 INR ($150.00 USD) Complete Package
              </span>
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Expert Consulting Advisory
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{data.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={t.modals.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5 mb-5">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.modals.mccDisclaimer}</p>
        </div>

        <p className="text-sm text-slate-600 mb-6">{data.subtitle}</p>

        {/* What's Included */}
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            {data.featuresTitle}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {data.features.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Strategy Preview */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            {data.sampleTitle}
          </h4>
          <div className="flex space-x-2 border-b border-slate-200 pb-2 mb-3">
            {data.days.map((dayItem, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === idx
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dayItem.day}
              </button>
            ))}
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
            <h5 className="font-semibold text-sm text-blue-950 mb-1">
              {data.days[activeTab].day}: {data.days[activeTab].title}
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              {data.days[activeTab].desc}
            </p>
          </div>
        </div>

        {/* Fee Disclaimer */}
        <p className="text-[11px] text-slate-500 mb-4 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg">
          * Note: The ₹12,500 INR ($150.00 USD) strategy planning and advisory service fee is
          non-refundable once strategy planning services have been rendered.
        </p>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-slate-900">₹12,500 INR ($150.00 USD)</span>
            <span className="text-xs text-slate-500 ml-1">
              / strategy package
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              {t.modals.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckout(SERVICES.STRATEGY.SERVICE_KEY);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              {data.btn}
            </button>
          </div>
        </div>

        {/* Legal Links (Bottom) */}
        <div className="py-2.5 bg-slate-100/50 border-t border-slate-200 mt-auto rounded-b-2xl">
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Terms</a>
            <span className="text-slate-300">•</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Privacy</a>
            <span className="text-slate-300">•</span>
            <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Refund</a>
            <span className="text-slate-300">•</span>
            <a href="/compliance" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Compliance</a>
          </div>
        </div>
      </div>
    </div>
  );
};
