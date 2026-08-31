// ─────────────────────────────────────────────────────────────
// FAQ Section Component
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { FaqItem } from '../ui/FaqItem';
import { translations } from '../../translations';

interface FaqSectionProps {
  t: typeof translations['en'];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ t }) => {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">{t.faq.title}</h2>
          <p className="mt-4 text-lg text-slate-600">{t.faq.subtitle}</p>
        </div>
        <div className="space-y-1">
          <FaqItem question={t.faq.q1} answer={t.faq.a1} />
          <FaqItem question={t.faq.q2} answer={t.faq.a2} />
          <FaqItem question={t.faq.q3} answer={t.faq.a3} />
          <FaqItem question={t.faq.q4} answer={t.faq.a4} />
          {t.faq.q5 && <FaqItem question={t.faq.q5} answer={t.faq.a5} />}
          {t.faq.q6 && <FaqItem question={t.faq.q6} answer={t.faq.a6} />}
        </div>
      </div>
    </section>
  );
};
