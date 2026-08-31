// ─────────────────────────────────────────────────────────────
// Services Section & Interactive Package Comparison Table
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { MapPin, Map, ShieldCheck } from 'lucide-react';
import { PageView } from '../../types';
import { translations } from '../../translations';
import { SERVICES } from '../../config/constants';

interface ServicesSectionProps {
  onNavigate: (page: PageView) => void;
  onCheckout: (serviceName: string) => void;
  t: typeof translations['en'];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onNavigate,
  onCheckout,
  t,
}) => {
  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900">
            {t.services.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t.services.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: $75.00 USD Market Research */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t.services.s1Title}
              </h3>
              <p className="text-slate-600 mb-4">{t.services.s1Desc}</p>
            </div>
            <div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-2xl font-bold text-slate-900">$75.00 USD</span>
                <span className="text-slate-500">
                  {t.services.s1Price || ' / research report'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('market_research')}
                className="w-full mt-6 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 py-3 rounded-xl font-medium transition-colors border border-slate-200 cursor-pointer"
              >
                {t.services.s1Btn || 'Explore Market Research'}
              </button>
            </div>
          </div>

          {/* Card 2: $150.00 USD Custom Strategy Planning (Featured Badge) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative transform md:-translate-y-4 flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wide">
              {t.services.s2Badge}
            </div>
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Map className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t.services.s2Title}
              </h3>
              <p className="text-slate-600 mb-4">{t.services.s2Desc}</p>
            </div>
            <div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-2xl font-bold text-slate-900">$150.00 USD</span>
                <span className="text-slate-500">{t.services.s2Price}</span>
              </div>
              <button
                onClick={() => onNavigate('custom_strategies')}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors shadow-sm cursor-pointer"
              >
                {t.services.s2Btn}
              </button>
            </div>
          </div>

          {/* Card 3: $50.00 USD Strategy Preparation */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t.services.s3Title}
              </h3>
              <p className="text-slate-600 mb-4">{t.services.s3Desc}</p>
            </div>
            <div>
              <div className="pt-4 mt-4 border-t border-slate-100">
                <span className="text-2xl font-bold text-slate-900">$50.00 USD</span>
                <span className="text-slate-500">
                  {t.services.s3Price || ' / prep guide'}
                </span>
              </div>
              <button
                onClick={() => onNavigate('strategy_prep')}
                className="w-full mt-6 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 py-3 rounded-xl font-medium transition-colors border border-slate-200 cursor-pointer"
              >
                {t.services.s3Btn || 'Explore Strategy Preparation'}
              </button>
            </div>
          </div>
        </div>

        {/* Package Comparison Table */}
        <div className="mt-20 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl mx-auto">
          <div className="p-8 border-b border-slate-200 text-center bg-slate-50/50">
            <h3 className="text-2xl font-bold text-slate-900">
              {t.services.compareTitle}
            </h3>
            <p className="mt-2 text-slate-600 text-sm max-w-2xl mx-auto">
              {t.services.compareSubtitle}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-2/5">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-3/10 text-center">
                    <span className="block text-base">{t.services.pkgInitial}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {t.services.pkgInitialPrice}
                    </span>
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-900 w-3/10 text-center bg-blue-50/60 border-l border-r border-blue-100">
                    <span className="block text-base text-blue-700">
                      {t.services.pkgComplete}
                    </span>
                    <span className="text-xs text-blue-600 font-bold">
                      {t.services.pkgCompletePrice}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {t.services.featureLabels.map((label, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                  >
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {label}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600">
                      {t.services.initialValues[idx]}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-slate-900 bg-blue-50/30 border-l border-r border-blue-100">
                      {t.services.completeValues[idx]}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td className="py-4 px-6"></td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onCheckout(SERVICES.RESEARCH.SERVICE_KEY)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {t.services.selectPkg}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center bg-blue-50/60 border-l border-r border-blue-100">
                    <button
                      onClick={() => onCheckout(SERVICES.STRATEGY.SERVICE_KEY)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      {t.services.selectPkg}
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
