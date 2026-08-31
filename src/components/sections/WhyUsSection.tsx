// ─────────────────────────────────────────────────────────────
// Trust & Compliance Advisory Section
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { CheckCircle2, Phone, Mail } from 'lucide-react';
import { translations } from '../../translations';
import { CONTACT } from '../../config/constants';

interface WhyUsSectionProps {
  onOpenInquiry: () => void;
  t: typeof translations['en'];
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  onOpenInquiry,
  t,
}) => {
  return (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {t.trust.title}
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>{t.trust.l1Title}</strong>
                  {t.trust.l1Desc}
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>{t.trust.l2Title}</strong>
                  {t.trust.l2Desc}
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-slate-700">
                  <strong>{t.trust.l3Title}</strong>
                  {t.trust.l3Desc}
                </span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {t.trust.contactTitle}
              </h3>
              <p className="text-slate-600 mb-8">{t.trust.contactDesc}</p>

              <div className="space-y-4">
                <a
                  href={`tel:${CONTACT.PHONE}`}
                  className="flex items-center justify-center space-x-3 w-full bg-blue-50 text-blue-700 p-4 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  <Phone className="h-5 w-5" />
                  <span>{CONTACT.PHONE}</span>
                </a>
                <button
                  onClick={onOpenInquiry}
                  className="flex items-center justify-center space-x-3 w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer"
                >
                  <Mail className="h-5 w-5" />
                  <span>{t.modals.contactModalTitle}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
