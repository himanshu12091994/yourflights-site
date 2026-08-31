// ─────────────────────────────────────────────────────────────
// Hero Landing Section
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Sparkles, Layers, AlertCircle } from 'lucide-react';
import { translations } from '../../translations';

interface HeroSectionProps {
  onOpenPlanningWizard: () => void;
  onOpenServicesExplorer: () => void;
  error?: string | null;
  t: typeof translations['en'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPlanningWizard,
  onOpenServicesExplorer,
  error,
  t,
}) => {
  return (
    <section className="relative bg-white pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-blue-50/50 mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          {t.hero.title1} <span className="text-blue-600">{t.hero.title2}</span>
        </h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={onOpenPlanningWizard}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="h-5 w-5 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>{t.hero.btn1}</span>
          </button>
          <button
            onClick={onOpenServicesExplorer}
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full font-semibold text-lg transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center space-x-2 group"
          >
            <Layers className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span>{t.hero.btn2}</span>
          </button>
        </div>
        {error && (
          <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg max-w-md mx-auto flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <p className="text-sm text-left">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
};
