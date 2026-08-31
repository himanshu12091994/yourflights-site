import React, { useState } from 'react';
import { 
  ArrowLeft, Building2 as Building2Icon, Briefcase, BarChart, Target, CheckCircle2, Info, ShieldCheck, MapPin, Map, Compass,
  Calendar, Clock, CreditCard, Lock, Sparkles, Send, 
  Phone, Mail, FileText, Globe, HelpCircle, Shield, AlertTriangle, ChevronRight, Building2, ChevronDown, ExternalLink, BookOpen
} from 'lucide-react';
import { Locale } from '../translations';
import { PageView } from '../types';
import consultingGuidesData from '../data/consultingGuides.json';



interface PageProps {
  t: any;
  onBack: () => void;
  onCheckout: (serviceName: string) => void;
  onNavigate: (page: PageView) => void;
}

{/* Common Back Button and Header Component */}
function PageHeader({ onBack, title, subtitle, badgeText, backText, mccBadgeText }: { onBack: () => void, title: string, subtitle?: string, badgeText?: string, backText?: string, mccBadgeText?: string }) {
  return (
    <div className="mb-8 border-b border-slate-200 pb-6 text-left">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-6 group cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>{backText || '← Back to Home'}</span>
      </button>

      <div className="flex flex-wrap items-center gap-3 mb-2">
        {badgeText && (
          <span className="bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {badgeText}
          </span>
        )}
        <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
          <span>{mccBadgeText || 'Verified Consulting Advisory'}</span>
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

{/* Mandatory Advisory Notice Banner */}
function MCCBanner({ text }: { text: string }) {
  return (
    <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start space-x-3 mb-8 shadow-sm text-left">
      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold mb-0.5">Advisory Service Scope Notice:</p>
        <p className="leading-relaxed text-amber-800">{text}</p>
      </div>
    </div>
  );
}

{/* 1. Custom Strategies Page */}
export function CustomStrategiesPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const pageT = t.pages.customStrategies;
  const markets = pageT.markets || [];
  const [selectedMarket, setSelectedMarket] = useState('apac_region');
  const [daysCount, setDaysCount] = useState(7);
  const [selectedStyle, setSelectedStyle] = useState('Cultural & Historic');
  const [selectedPace, setSelectedPace] = useState('Balanced Exploration');
  const [activeDayTab, setActiveDayTab] = useState(1);

  const currentDest = markets.find((d: any) => d.id === selectedMarket) || markets[0];
  const currentDays = currentDest?.days || pageT.days || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title} 
        subtitle={pageT.subtitle} 
        badgeText={pageT.badge} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      {/* Currency Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 mb-8 shadow-sm">
        <div className="flex items-center space-x-3 text-blue-900 border-b border-blue-200 pb-3">
          <h2 className="text-xl font-bold">Supported Currencies</h2>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          We securely accept and process payments in both <strong>Indian Rupees (INR) and US Dollars (USD)</strong> and <strong>Indian Rupees (INR)</strong>. 
          All international transactions are fully supported.
        </p>
      </div>


      <MCCBanner text={t.pages.mccDisclaimer} />

      {/* Interactive Parameters Builder */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10 text-left">
        <div className="flex items-center space-x-2.5 mb-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">{pageT.paramsTitle}</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">{pageT.paramsDesc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Market Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {pageT.destLabel}
            </label>
            <div className="relative">
              <Building2Icon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedMarket}
                onChange={(e) => {
                  setSelectedMarket(e.target.value);
                  setActiveDayTab(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm"
              >
                {markets.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Project Duration */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {pageT.durationLabel}
              </label>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {daysCount} Days
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={14}
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-3"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>3 Days (Express)</span>
              <span>7 Days (Classic)</span>
              <span>14 Days (In-Depth)</span>
            </div>
          </div>

          {/* Consulting Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {pageT.styleLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {pageT.styles.map((style: string) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedStyle === style
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Pace */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {pageT.paceLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {pageT.paces.map((pace: string) => (
                <button
                  key={pace}
                  type="button"
                  onClick={() => setSelectedPace(pace)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedPace === pace
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Config Summary Tag */}
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Configured: <strong className="text-slate-900">{daysCount}-Day {selectedStyle} Strategy</strong> for <strong className="text-blue-700 font-bold">{currentDest?.label || selectedMarket}</strong> ({selectedPace} Pace).
            </span>
          </div>
          <span className="text-blue-600 font-semibold">₹12,500 INR ($150.00 USD) One-Time Fee</span>
        </div>
      </div>

      {/* Interactive Sample Strategy Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold text-slate-900">{pageT.sampleTitle}</h2>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full w-fit flex items-center space-x-1">
            <Building2Icon className="h-3 w-3 text-blue-600 inline mr-1" />
            <span>{currentDest?.label}</span>
          </span>
        </div>

        {/* Day Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          {currentDays.map((d: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveDayTab(idx + 1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeDayTab === idx + 1
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d.day}: {d.title.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Active Day Content */}
        {currentDays.map((d: any, idx: number) => {
          if (activeDayTab !== idx + 1) return null;
          return (
            <div key={idx} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  {d.day} Strategy Overview — {currentDest?.label}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-1">{d.title}</h3>
                <p className="text-sm text-slate-600">{d.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">
                    {d.morning?.title || 'Morning Schedule (09:00 - 12:30)'}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{d.morning?.desc || d.desc}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">
                    {d.afternoon?.title || 'Afternoon Cultural Focus (13:30 - 17:00)'}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{d.afternoon?.desc || d.desc}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">
                    {d.evening?.title || 'Evening Networking & Corporate Events (18:30 - 21:30)'}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{d.evening?.desc || d.desc}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">
                    {d.transit?.title || 'Transit & Logistics Map'}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{d.transit?.desc || d.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Deliverables & Purchase Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl text-left mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="h-64 w-64 text-white" />
        </div>

        <div className="relative z-10">
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider inline-block mb-4">
            Complete Package Included
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">{pageT.deliverablesTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {pageT.deliverables.map((item: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-3 bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-200 leading-snug">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">₹12,500 INR ($150.00 USD)</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">USD One-Time Fee</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">No subscriptions or hidden fees. Secured by Stripe PCI-DSS.</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                * Note: Consulting planning and advisory fees are non-refundable once strategy planning services have been rendered.
              </p>
            </div>

            <button
              onClick={() => onCheckout('Custom Strategy Advisory & Assistance (₹12,500 INR ($150.00 USD))')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="h-5 w-5" />
              <span>{pageT.checkoutBtn}</span>
            </button>
          </div>

          {/* Standalone Legal Links for Checkout Policy Transparency */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Policy Links:</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Terms of Service</button>
            <span>•</span>
            <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('refund')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Refund Policy</button>
            <span>•</span>
            <button onClick={() => onNavigate('compliance')} className="hover:text-blue-400 underline transition-colors cursor-pointer">MCC Compliance</button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* 2. Market Research Page */}
export function DestinationResearchPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const pageT = t.pages.marketResearch;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title} 
        subtitle={pageT.subtitle} 
        badgeText={pageT.badge} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      <MCCBanner text={t.pages.mccDisclaimer} />

      {/* 4 Deep Intelligence Sections */}
      <div className="space-y-6 mb-10">
        {pageT.sections.map((sec: any, idx: number) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pl-12">{sec.desc}</p>
          </div>
        ))}
      </div>

      {/* Purchase & Inquiry Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Research Intelligence Report</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl font-extrabold">₹6,000 INR ($75.00 USD)</span>
              <span className="text-xs text-slate-400">USD one-time fee</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Delivered as a clean, in-depth digital report with visa guidelines, safe zone maps, and local etiquette.
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              * Note: Expert consulting research and intelligence fees are non-refundable once report generation has commenced.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('book_consult')}
              className="w-full sm:w-auto px-5 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl font-medium text-xs transition-colors cursor-pointer text-center"
            >
              {pageT.inquiryBtn}
            </button>
            <button
              onClick={() => onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              <span>{pageT.checkoutBtn}</span>
            </button>
          </div>
        </div>

        {/* Standalone Legal Links for Checkout Policy Transparency */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Policy Links:</span>
          <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Terms of Service</button>
          <span>•</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => onNavigate('refund')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Refund Policy</button>
          <span>•</span>
          <button onClick={() => onNavigate('compliance')} className="hover:text-blue-400 underline transition-colors cursor-pointer">MCC Compliance</button>
        </div>
      </div>
    </div>
  );
}

{/* 3. Strategy Preparation Page */}
export function ConsultingPrepPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const pageT = t.pages.consultingPrep;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title} 
        subtitle={pageT.subtitle} 
        badgeText={pageT.badge} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      <MCCBanner text={t.pages.mccDisclaimer} />

      {/* Core Preparation Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {pageT.sections.map((sec: any, idx: number) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{sec.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs text-blue-600 font-semibold">
              <span>Included in ₹4,000 INR ($50.00 USD) Prep Package</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Logistics & Safety Prep</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl font-extrabold">₹4,000 INR ($50.00 USD)</span>
              <span className="text-xs text-slate-400">USD one-time fee</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              Includes custom packing guide, currency advice, offline transit map links, and emergency contacts.
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              * Note: Consulting prep and advisory service fees are non-refundable once strategy preparation services have been delivered.
            </p>
          </div>

          <button
            onClick={() => onCheckout('Pre-Departure Preparation Assistance (₹4,000 INR ($50.00 USD))')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            <span>{pageT.checkoutBtn}</span>
          </button>
        </div>

        {/* Standalone Legal Links for Checkout Policy Transparency */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Policy Links:</span>
          <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Terms of Service</button>
          <span>•</span>
          <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => onNavigate('refund')} className="hover:text-blue-400 underline transition-colors cursor-pointer">Refund Policy</button>
          <span>•</span>
          <button onClick={() => onNavigate('compliance')} className="hover:text-blue-400 underline transition-colors cursor-pointer">MCC Compliance</button>
        </div>
      </div>
    </div>
  );
}

{/* 4. Book Consult Page */}
export function BookConsultPage({ t, onBack }: PageProps) {
  const pageT = t.pages.bookConsult;
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destDates: '',
    timezone: pageT.timezones[0],
    timeSlot: pageT.timeSlots[0],
    goals: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title} 
        subtitle={pageT.subtitle} 
        badgeText={pageT.badge} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      <MCCBanner text={t.pages.mccDisclaimer} />

      {/* 4-Step Consultation Process */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">{pageT.stepsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pageT.steps.map((st: any, idx: number) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-2xl font-black text-blue-600 block mb-2">{st.step}</span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{st.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{pageT.formTitle}</h2>
          <p className="text-sm text-slate-600 mb-8">{pageT.formDesc}</p>

          {isSubmitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                <h3 className="text-xl font-bold">Inquiry Received Successfully!</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">{pageT.successMsg}</p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    destDates: '',
                    timezone: pageT.timezones[0],
                    timeSlot: pageT.timeSlots[0],
                    goals: ''
                  });
                }}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.destDates}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Italy in September 2025"
                    value={formData.destDates}
                    onChange={(e) => setFormData({ ...formData, destDates: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.timezone}
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pageT.timezones.map((tz: string, idx: number) => (
                      <option key={idx} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {pageT.timeSlot}
                  </label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pageT.timeSlots.map((ts: string, idx: number) => (
                      <option key={idx} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {pageT.goals}
                </label>
                <textarea
                  rows={4}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Tell us what you're hoping to achieve on your project..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? pageT.submittingBtn : pageT.submitBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

{/* Generic Legal Page Component */}
function LegalPageLayout({ onBack, title, subtitle, sections, disclaimer, backText, mccBadgeText, footerT }: { onBack: () => void, title: string, subtitle: string, sections: { h?: string, title?: string, p?: string, desc?: string }[], disclaimer: string, backText?: string, mccBadgeText?: string, footerT?: any }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader onBack={onBack} title={title} subtitle={subtitle} backText={backText} mccBadgeText={mccBadgeText} />
      <MCCBanner text={disclaimer} />

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {sections.map((sec: any, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {sec.h || sec.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {sec.p || sec.desc}
            </p>
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                {sec.bullets.map((b: string, bIdx: number) => (
                  <li key={bIdx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold text-xs mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Corporate Entity & International Contact Block */}
        {footerT && (
          <div className="mt-8 pt-8 border-t border-slate-200 bg-slate-50/80 rounded-2xl p-6 space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="font-bold text-slate-900 text-base flex items-center space-x-2 pb-2 border-b border-slate-200">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>{footerT.entityName}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block sm:inline">{footerT.legalEntityLabel}: </span>
              <span className="text-slate-600">{footerT.legalEntityAddress}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-900 block sm:inline">{footerT.globalOpsLabel}: </span>
              <span className="text-slate-600">{footerT.globalOpsAddress}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-x-2 text-slate-800 font-medium">
              <span className="font-semibold text-slate-900">{footerT.supportLabel}: </span>
              <a href={`tel:${footerT.phone}`} className="text-blue-600 hover:underline flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1" />
                {footerT.phone}
              </a>
              <span className="text-slate-400">|</span>
              <a href={`mailto:${footerT.email}`} className="text-blue-600 hover:underline flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {footerT.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{/* 5. Terms of Service Page */}
export function TermsOfServicePage({ t, onBack }: PageProps) {
  const pageT = t.pages.termsOfService;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}

{/* 6. Privacy Policy Page */}
export function PrivacyPolicyPage({ t, onBack }: PageProps) {
  const pageT = t.pages.privacyPolicy;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}

{/* 7. Refund Policy Page */}
export function RefundPolicyPage({ t, onBack }: PageProps) {
  const pageT = t.pages.refundPolicy;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}

{/* 8. MCC Compliance Page */}
export function MCCCompliancePage({ t, onBack }: PageProps) {
  const pageT = t.pages.mccCompliance;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}

{/* 9. Consulting Insights & Guides Page */}
export function ConsultingGuidesPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const pageT = t.pages.guides;
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Combine local JSON dataset with localized articles if available
  const localizedArticles = pageT?.articles || [];
  const articlesList = consultingGuidesData.map((guide: any) => {
    const locMatch = localizedArticles.find((a: any) => a.id === guide.id);
    return {
      ...guide,
      title: locMatch?.title || guide.title,
      category: locMatch?.category || guide.category,
      readTime: locMatch?.readTime || guide.readTime,
      summary: locMatch?.summary || guide.summary,
      content: locMatch?.content || guide.content
    };
  });

  const selectedArticle = articlesList.find((a: any) => a.id === selectedArticleId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT?.title || 'Consulting Advisory Insights & Destination Guides'} 
        subtitle={pageT?.subtitle || 'Expert destination advice, pre-departure checklists, and cultural navigation guides prepared by Your Flights LLC consulting advisors.'} 
        badgeText={pageT?.badge || 'Advisory Insights & Consulting Tips'} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      <MCCBanner text={t.pages.mccDisclaimer} />

      {selectedArticle ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 mt-6">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to All Strategy Guides</span>
          </button>

          <div className="border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {selectedArticle.readTime}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {selectedArticle.serviceName || 'Consulting Advisory Service'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              {selectedArticle.title}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {selectedArticle.summary}
            </p>
          </div>

          {/* Article Sections */}
          <div className="space-y-6">
            {selectedArticle.content.map((sec: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {sec.heading}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {sec.text}
                </p>
              </div>
            ))}
          </div>

          {/* Direct Service Recommendation for this Guide */}
          <div className="p-6 bg-linear-to-r from-blue-900 to-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Recommended Advisory Service</span>
              <h4 className="text-lg font-bold text-white mt-1">Need customized support for this topic?</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Get personalized 1-on-1 assistance with our advisors for {selectedArticle.serviceName || 'Custom Consulting Advisory'}.
              </p>
            </div>
            <button
              onClick={() => onCheckout(selectedArticle.serviceTarget || 'Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer flex items-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Order {selectedArticle.serviceName || 'Advisory Package'}</span>
            </button>
          </div>

          {/* Embedded MCC Compliance Disclosure Callout Box */}
          <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-900 flex items-start space-x-3 shadow-sm">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 mb-1">MCC Compliance Disclosure (7299 / 8999):</p>
              <p className="leading-relaxed font-medium">
                {pageT.complianceNotice}
              </p>
            </div>
          </div>

          {/* Call-to-Action Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white">{pageT.ctaTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {pageT.ctaDesc}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onCheckout('Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                {pageT.ctaCustomBtn}
              </button>
              <button
                onClick={() => onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {pageT.ctaResearchBtn}
              </button>
              <button
                onClick={() => onCheckout('Pre-Departure Preparation Assistance (₹4,000 INR ($50.00 USD))')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {pageT.ctaPrepBtn}
              </button>
              <button
                onClick={() => onNavigate('book_consult')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {pageT.ctaInquiryBtn}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Guides Card Grid */
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesList.map((art: any) => (
              <div 
                key={art.id} 
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{art.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {art.summary}
                  </p>

                  {/* Related Service Link Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-lg px-2.5 py-1">
                      <Sparkles className="h-3 w-3 mr-1 text-blue-600" />
                      Relevant Service: {art.serviceName || 'Consulting Advisory'}
                    </span>
                  </div>
                </div>

                <div>
                  {/* Embedded Compliance Note */}
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 mb-4">
                    <p className="font-semibold text-amber-950">MCC Advisory Note:</p>
                    <p className="line-clamp-2 leading-tight text-amber-800">
                      {pageT.complianceNotice}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedArticleId(art.id)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-600" />
                      <span>Read Full Article</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onCheckout(art.serviceTarget || 'Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Order Advisory Package</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 mt-8 space-y-4">
            <h3 className="text-2xl font-extrabold text-white">{pageT?.ctaTitle}</h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {pageT?.ctaDesc}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onCheckout('Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                {pageT?.ctaCustomBtn}
              </button>
              <button
                onClick={() => onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                {pageT?.ctaResearchBtn}
              </button>
              <button
                onClick={() => onCheckout('Pre-Departure Preparation Assistance (₹4,000 INR ($50.00 USD))')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                {pageT?.ctaPrepBtn}
              </button>
              <button
                onClick={() => onNavigate('book_consult')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                {pageT?.ctaInquiryBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

{/* 10. About Us Page */}
export function AboutUsPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const pageT = t.pages.aboutUs || {
    pageTitle: "About Us - Your Flights",
    title: "Welcome to Your Flights",
    subtitle: "Bespoke Day-by-Day Strategies, Deep Market Research & Pre-Departure Consulting",
    paragraph1: "Your Flights (operated by Your Flights LLC) is a premier enterprise-focused consulting advisory and market intelligence service. With a deep commitment to independent, unbiased strategy planning, we specialize in helping discerning clients design custom, tailored strategies and prepare for seamless consulting experiences worldwide. Our team consists of seasoned strategy experts dedicated to providing meticulous research, ensuring every detail of your project is optimized for success, safety, and efficiency.",
    whatWeDoTitle: "What We Do:",
    whatWeDoContent: "We provide expert B2B consulting advisory, custom day-by-day strategy design, market research, and pre-departure preparation consulting. Our goal is to make strategy planning effortless by delivering comprehensive research, activity recommendations, and personalized strategy guides.",
    independentTitle: "Independent Advisory Clarification:",
    independentContent: "Your Flights operates strictly as an independent corporate consulting service. We are not a licensed consulting agency, tour operator, or software vendor contracting agent. We do not issue consulting services, execute software or transport licenses, or sell consulting supplier inventory. All consulting licenses made based on our strategy advice are booked directly by the client with their respective consulting providers."
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title || "Welcome to Your Flights"} 
        subtitle="Bespoke Day-by-Day Strategies, Deep Market Research & Pre-Departure Consulting" 
        badgeText="Your Flights (operated by Your Flights LLC)" 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      {/* Currency Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 mb-8 shadow-sm">
        <div className="flex items-center space-x-3 text-blue-900 border-b border-blue-200 pb-3">
          <h2 className="text-xl font-bold">Supported Currencies</h2>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          We securely accept and process payments in both <strong>Indian Rupees (INR) and US Dollars (USD)</strong> and <strong>Indian Rupees (INR)</strong>. 
          All international transactions are fully supported.
        </p>
      </div>


      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Intro Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
            {pageT.paragraph1}
          </p>
        </div>

        {/* 3 Core Advisory Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
              <Map className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Bespoke Strategies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Custom day-by-day schedules structured around your exact pacing, culinary preferences, and consulting budget (₹12,500 INR ($150.00 USD) package).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Location Intelligence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comprehensive safety analysis, entry visa guidance, transit strategies, and curated local hidden gems (₹6,000 INR ($75.00 USD) report).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">100% Unbiased Advice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero commissions or inventory kickbacks from consulting vendors. You receive authentic, independent advice tailored solely to you.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-3 text-blue-950">
            <Sparkles className="h-6 w-6 text-blue-600 shrink-0" />
            <h2 className="text-xl font-bold text-slate-900">{pageT.whatWeDoTitle}</h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {pageT.whatWeDoContent}
          </p>
        </div>

        {/* Independent Advisory Clarification */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center space-x-3 text-amber-950">
            <ShieldCheck className="h-6 w-6 text-amber-600 shrink-0" />
            <h2 className="text-xl font-bold text-amber-950">{pageT.independentTitle}</h2>
          </div>
          <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
            {pageT.independentContent}
          </p>
        </div>

        {/* Business Information & Product Catalog for Stripe Compliance */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 text-slate-900 mb-2 border-b border-slate-200 pb-4">
            <Building2 className="h-6 w-6 text-blue-600 shrink-0" />
            <h2 className="text-xl font-bold">Business Information & Product Catalog</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Corporate Details</h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p><strong className="text-slate-900">Legal Business Entity:</strong> Your Flights LLC Operated By Himanshu Kumar</p>
                <p><strong className="text-slate-900">Legal Entity Registration:</strong> 30 N Gould St Ste R, Sheridan, WY, 82801, USA</p>
                <p><strong className="text-slate-900">Customer Support Phone:</strong> USA +1 (810) 505-5186</p>
                <p><strong className="text-slate-900">Customer Support Email:</strong> support@yourflightsllc.com</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Products & Pricing</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex flex-col">
                  <strong className="text-slate-900">Custom Strategy Advisory (₹12,500 INR ($150.00 USD))</strong>
                  <span className="text-xs text-slate-600 mt-1">A complete bespoke day-by-day consulting plan, 1-on-1 strategy session, and digital map recommendations.</span>
                </li>
                <li className="flex flex-col">
                  <strong className="text-slate-900">Market Research Report (₹6,000 INR ($75.00 USD))</strong>
                  <span className="text-xs text-slate-600 mt-1">In-depth safety analysis, visa rules, and hidden gem intelligence for your target location.</span>
                </li>
                <li className="flex flex-col">
                  <strong className="text-slate-900">Pre-Departure Preparation (₹4,000 INR ($50.00 USD))</strong>
                  <span className="text-xs text-slate-600 mt-1">Packing guides, currency advice, and essential safety checklist consulting.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Direct Action Links */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Need Dedicated Consulting Advisory?</h3>
            <p className="text-xs text-slate-500">Explore custom day-by-day strategies (₹12,500 INR ($150.00 USD)) and market research (₹6,000 INR ($75.00 USD)).</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('custom_strategies')}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Order Custom Strategy
            </button>
            <button
              onClick={() => onNavigate('book_consult')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-slate-200"
            >
              Request Assistance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* 11. Contact Us Page */}
export function ContactPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Consulting Advisory Inquiry', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const pageT = t.pages?.contactUs || {
    pageTitle: "Contact Us - Your Flights",
    title: "Get in Touch with Your Flights",
    subtitle: "Have questions about our custom strategy planning, market research, or consulting advisory packages? Our client support team is here to assist you.",
    badge: "Your Flights (operated by Your Flights LLC)"
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <PageHeader 
        onBack={onBack} 
        title={pageT.title} 
        subtitle={pageT.subtitle} 
        badgeText={pageT.badge} 
        backText={t.pages.backToHome}
        mccBadgeText={t.pages.mccBadge}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Support Channels & Locations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Support Channels Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Client Support Channels</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Customer Support</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Email</p>
                  <a href="mailto:support@yourflightsllc.com" className="text-sm font-bold text-blue-600 hover:underline">
                    support@yourflightsllc.com
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average response time: &lt; 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Phone</p>
                  <a href="tel:+918826219438" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    USA +1 (810) 505-5186
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">Direct client assistance & billing verification</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Hours</p>
                  <p className="text-sm font-semibold text-slate-800">Monday – Friday</p>
                  <p className="text-xs text-slate-600">9:00 AM – 6:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Corporate Entity & Locations Card */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-md space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">Merchant Information</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Corporate Entity & Locations</h2>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div>
                <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">Brand Name</span>
                <span className="text-sm font-bold text-white">Your Flights</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">Legal Business Entity</span>
                <span className="text-sm font-bold text-blue-300">Your Flights LLC Operated By Himanshu Kumar</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-start space-x-2.5">
                  <Building2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 font-bold block text-xs">Legal Entity Registration:</span>
                    <p className="text-slate-300 text-xs mt-0.5">30 N Gould St Ste R, Sheridan, WY, 82801, USA</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-start space-x-2.5">
                  <Globe className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 font-bold block text-xs">Global Operations Center</span>
                    <p className="text-slate-300 text-xs mt-0.5">E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi, Delhi 110044 INDIA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-4 mb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Send Us A Message</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Direct Client Inquiry Form</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below to connect with a personal consulting advisory manager regarding custom day-by-day strategies, market research, or strategy preparation.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 my-6">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">Inquiry Received Successfully!</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    Thank you for contacting <strong>Your Flights LLC</strong>. Our consulting support team will review your message and respond directly to <strong>{formData.email}</strong> within 2 to 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Consulting Advisory Inquiry', message: '' });
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. eleanor@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Topic / Service Interest
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="General Consulting Advisory Inquiry">General Consulting Advisory Inquiry</option>
                      <option value="Custom Day-by-Day Strategy (₹12,500 INR ($150.00 USD))">Custom Day-by-Day Strategy Package (₹12,500 INR ($150.00 USD))</option>
                      <option value="Market Research & Intelligence (₹6,000 INR ($75.00 USD))">Market Research & Intelligence (₹6,000 INR ($75.00 USD))</option>
                      <option value="Pre-Departure Strategy Prep (₹4,000 INR ($50.00 USD))">Pre-Departure Strategy Prep (₹4,000 INR ($50.00 USD))</option>
                      <option value="Billing / Receipt Assistance">Billing / Receipt Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your upcoming project goals, target markets, consulting dates, or specific questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Client Inquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Micro Non-Licenseing Notice at Bottom of Form */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Notice:</strong> Your Flights LLC is an independent consulting advisory and consulting firm. We provide expert consulting research, custom strategy design, and market intelligence. We do not issue consulting services or process passenger licenses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* Cancellation Policy Page */}
export function CancellationPolicyPage({ t, onBack }: PageProps) {
  const pageT = (t.pages as any).cancellationPolicy;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}

{/* Shipping Policy Page */}
export function ShippingPolicyPage({ t, onBack }: PageProps) {
  const pageT = (t.pages as any).shippingPolicy;
  return (
    <LegalPageLayout 
      onBack={onBack} 
      title={pageT.title} 
      subtitle={pageT.subtitle} 
      sections={pageT.sections} 
      disclaimer={t.pages.mccDisclaimer} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
      footerT={t.footer}
    />
  );
}
