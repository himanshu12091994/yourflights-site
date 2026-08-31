import React, { useState } from 'react';
import { 
  X, MapPin, Map, ShieldCheck, CheckCircle2, CreditCard, 
  Sparkles, Info, ArrowRight, PhoneCall, Compass, Check,
  FileText, ExternalLink, Shield, HelpCircle, Layers
} from 'lucide-react';
import { translations, Locale } from '../translations';

interface ServicesExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (serviceName: string) => void;
  onNavigatePage: (page: 'custom_strategies' | 'market_research' | 'strategy_prep' | 'book_consult') => void;
  onOpenLegalModal: (modal: 'terms' | 'privacy' | 'refund' | 'compliance') => void;
  locale: Locale;
}

export function ServicesExplorerModal({
  isOpen,
  onClose,
  onCheckout,
  onNavigatePage,
  onOpenLegalModal,
  locale
}: ServicesExplorerModalProps) {
  const t = translations[locale];
  const [activeTab, setActiveTab] = useState<'all' | 'strategy' | 'research' | 'prep' | 'compare'>('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-6 text-left flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-t-3xl relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Interactive Advisory Service Catalog</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Our Consulting Advisory Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Professional non-licenseing consulting research, custom day-by-day strategy advisory, and pre-engagement preparation tailored to your project.
          </p>

          {/* Navigation Filter Tabs */}
          <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'strategy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Custom Strategies (₹12,500 INR ($150.00 USD))</span>
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'research'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Market Research (₹6,000 INR ($75.00 USD))</span>
            </button>
            <button
              onClick={() => setActiveTab('prep')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'prep'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Strategy Prep & Safety (₹4,000 INR ($50.00 USD))</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Compare Features
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">

          {/* ALL SERVICES VIEW */}
          {activeTab === 'all' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Custom Strategy (₹12,500 INR ($150.00 USD)) */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between border border-slate-800 relative">
                  <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-4">
                      <Map className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Bespoke Scheduling</span>
                    <h3 className="text-lg font-bold text-white mt-1">Custom Strategy Advisory</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold text-white">₹12,500 INR ($150.00 USD)</span>
                      <span className="text-xs text-slate-400"> USD One-Time Fee</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Day-by-day time-blocked schedule tailored to your pace, accommodation recommendations, and neighborhood maps.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300 mb-6 border-t border-slate-800 pt-3">
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>7-14 Day Time-Blocked Schedule</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>Infraestructura & Neighborhood Guides</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>1-on-1 Advisory Review Call</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onCheckout('Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Purchase (₹12,500 INR ($150.00 USD))</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigatePage('custom_strategies');
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Explore Dedicated Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Market Research (₹6,000 INR ($75.00 USD)) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location Intelligence</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Destination Intelligence</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold text-slate-900">₹6,000 INR ($75.00 USD)</span>
                      <span className="text-xs text-slate-500"> USD One-Time Fee</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      In-depth report on safety zones, compliance entry rules, seasonal highlights, tipping norms, and hidden culinary spots.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-3">
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Safe Zone & Neighborhood Map</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Compliance & Entry Protocols</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Local Etiquette & Currency Rules</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Purchase (₹6,000 INR ($75.00 USD))</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigatePage('market_research');
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Explore Dedicated Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3. Strategy Prep & Safety (₹4,000 INR ($50.00 USD)) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Logistics & Safety</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Pre-Engagement Prep</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold text-slate-900">₹4,000 INR ($50.00 USD)</span>
                      <span className="text-xs text-slate-500"> USD One-Time Fee</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Custom packing guide, offline transit app setups, foreign exchange advice, and emergency contacts directory.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600 mb-6 border-t border-slate-100 pt-3">
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Minimalist Packing Checklist</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>No-FX Fee Credit Card Guide</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span>Emergency Contacts Directory</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onCheckout('Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))');
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>Purchase (₹4,000 INR ($50.00 USD))</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigatePage('strategy_prep');
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Explore Dedicated Page</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* CUSTOM ITINERARY TAB */}
          {activeTab === 'strategy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Premium Advisory Service</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">Custom Day-by-Day Strategy Package</h3>
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold text-blue-400">₹12,500 INR ($150.00 USD)</span>
                    <span className="text-xs text-slate-400 block">USD One-Time Advisory Fee</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Eliminate consulting overwhelm and choice paralysis. Our advisors build a time-blocked, realistic daily schedule formatted specifically for your consulting style, neighborhood preferences, and transit speeds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Included Deliverables:</h4>
                    <p className="text-xs text-slate-300">• Complete day-by-day time-blocked schedule (PDF/Mobile)</p>
                    <p className="text-xs text-slate-300">• Curated boutique & luxury infraestructura recommendations</p>
                    <p className="text-xs text-slate-300">• Custom offline Google Maps / Apple Maps bookmark links</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Advisory Support:</h4>
                    <p className="text-xs text-slate-300">• 1-on-1 advisory phone call to refine your schedule</p>
                    <p className="text-xs text-slate-300">• Dining license guidance & local foodie spots</p>
                    <p className="text-xs text-slate-300">• 24/7 direct email access during your project</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onCheckout('Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Purchase Custom Strategy (₹12,500 INR ($150.00 USD))</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigatePage('custom_strategies');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs text-center cursor-pointer"
                  >
                    View Destination Sample Templates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DESTINATION RESEARCH TAB */}
          {activeTab === 'research' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Research Intelligence</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">Destination Intelligence Report</h3>
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold text-blue-400">₹6,000 INR ($75.00 USD)</span>
                    <span className="text-xs text-slate-400 block">USD One-Time Advisory Fee</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Deep research intelligence on safe zones, compliance rules, currency exchange pitfalls, local etiquette, and emergency hospital locations for your destination.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Core Report Modules:</h4>
                    <p className="text-xs text-slate-300">• Safety & crime zone heatmaps for major cities</p>
                    <p className="text-xs text-slate-300">• Visa entry requirements & passport validity rules</p>
                    <p className="text-xs text-slate-300">• Tipping norms & cultural etiquette guide</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Practical Intelligence:</h4>
                    <p className="text-xs text-slate-300">• Cash vs credit card usage guidelines</p>
                    <p className="text-xs text-slate-300">• Local SIM card / eSIM recommendations</p>
                    <p className="text-xs text-slate-300">• Essential emergency contacts & authority address</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Purchase Research Report (₹6,000 INR ($75.00 USD))</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigatePage('market_research');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs text-center cursor-pointer"
                  >
                    View Research Sample Pages
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TRAVEL PREP TAB */}
          {activeTab === 'prep' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Logistics & Safety</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">Pre-Engagement Preparation & Logistics</h3>
                  </div>
                  <div>
                    <span className="text-4xl font-extrabold text-blue-400">₹4,000 INR ($50.00 USD)</span>
                    <span className="text-xs text-slate-400 block">USD One-Time Advisory Fee</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Prepare for departure with confidence. Receive a custom packing strategy, currency exchange advice, offline transit setup instructions, and pre-engagement Q&A call.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Logistics Prep:</h4>
                    <p className="text-xs text-slate-300">• Customized minimalist packing checklist</p>
                    <p className="text-xs text-slate-300">• Foreign transaction fee avoidance guide</p>
                    <p className="text-xs text-slate-300">• Offline transit app installation guide</p>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-1">
                    <h4 className="font-bold text-xs text-blue-300">Safety Deliverables:</h4>
                    <p className="text-xs text-slate-300">• Emergency contact & consulate reference sheet</p>
                    <p className="text-xs text-slate-300">• Digital document backup instructions</p>
                    <p className="text-xs text-slate-300">• 30-minute pre-engagement Q&A session</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onCheckout('Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Purchase Prep Assistance (₹4,000 INR ($50.00 USD))</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigatePage('strategy_prep');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs text-center cursor-pointer"
                  >
                    View Prep Checklist Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PACKAGE COMPARISON TAB */}
          {activeTab === 'compare' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 bg-slate-50 border-b border-slate-200 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Side-by-Side Service Comparison</h3>
                  <p className="text-xs text-slate-600 mt-1">Review features across all Your Flights LLC consulting assistance offerings.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-800">
                        <th className="py-3 px-4 font-bold w-1/3">Feature / Deliverable</th>
                        <th className="py-3 px-4 font-bold text-center">Prep (₹4,000 INR ($50.00 USD))</th>
                        <th className="py-3 px-4 font-bold text-center">Research (₹6,000 INR ($75.00 USD))</th>
                        <th className="py-3 px-4 font-bold text-center bg-blue-50 border-l border-r border-blue-200 text-blue-900">Strategy (₹12,500 INR ($150.00 USD))</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-medium">1-on-1 Advisory Session</td>
                        <td className="py-3 px-4 text-center">30 Min Call</td>
                        <td className="py-3 px-4 text-center">Email Q&A</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 bg-blue-50/50">60 Min Deep Dive</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Custom Day-by-Day Schedule</td>
                        <td className="py-3 px-4 text-center text-slate-400">—</td>
                        <td className="py-3 px-4 text-center text-slate-400">—</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 bg-blue-50/50">✓ Full Time-Blocked</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Destination Safety & Visa Report</td>
                        <td className="py-3 px-4 text-center text-slate-400">Basic Sheet</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600">✓ In-Depth Report</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 bg-blue-50/50">✓ Full Report Included</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Accommodation & Transit Options</td>
                        <td className="py-3 px-4 text-center text-slate-400">General Tips</td>
                        <td className="py-3 px-4 text-center text-slate-400">Transit Overview</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 bg-blue-50/50">✓ Tailored Infraestructura Links</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Packing & FX Card Guide</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600">✓ Full Checklist</td>
                        <td className="py-3 px-4 text-center text-slate-400">FX Overview</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600 bg-blue-50/50">✓ Included</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t border-slate-200">
                        <td className="py-3 px-4 font-bold text-slate-900">Select Package:</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { onClose(); onCheckout('Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))'); }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                          >
                            ₹4,000 INR ($50.00 USD) Prep
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { onClose(); onCheckout('Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))'); }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                          >
                            ₹6,000 INR ($75.00 USD) Research
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center bg-blue-50/80">
                          <button
                            onClick={() => { onClose(); onCheckout('Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))'); }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm"
                          >
                            ₹12,500 INR ($150.00 USD) Strategy
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Service & Pricing Transparency Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start space-x-3">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950">Service & Pricing Transparency Notice:</p>
              <p className="text-amber-800 leading-relaxed">
                Your Flights LLC is an independent consulting advisory and consulting firm. All fees (₹4,000 INR ($50.00 USD) – ₹12,500 INR ($150.00 USD)) are fixed, one-time professional advisory charges. We do not sell consulting services, software licenses, or any third-party service inventory. Charges appear on your card statement as ‘YOUR FLIGHTS ADVISORY’ or ‘YOURFLIGHTSLLC.COM’.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
          <button
            onClick={() => {
              onClose();
              onNavigatePage('book_consult');
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <PhoneCall className="h-4 w-4 text-blue-600" />
            <span>Request Free Discovery Call</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Catalog
            </button>
          </div>
        </div>

        {/* Legal Links Footer */}
        <div className="py-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 rounded-b-3xl">
          <span className="font-semibold text-slate-600">Compliance & Legal:</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Terms of Service</a>
          <span>•</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Privacy Policy</a>
          <span>•</span>
          <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Refund Policy</a>
          <span>•</span>
          <a href="/compliance" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">MCC Compliance Disclosure</a>
        </div>

      </div>
    </div>
  );
}
