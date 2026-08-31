import React, { useState } from 'react';
import { 
  X, Compass, MapPin, Calendar, Users, Sparkles, Check, 
  ArrowRight, ArrowLeft, CreditCard, Shield, Info, CheckCircle2,
  Clock, Heart, ShieldCheck, HelpCircle, PhoneCall
} from 'lucide-react';
import { translations, Locale } from '../translations';

interface StartPlanningWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (serviceName: string) => void;
  onBookConsult: () => void;
  onOpenLegalModal: (modal: 'terms' | 'privacy' | 'refund' | 'compliance') => void;
  locale: Locale;
}

const DESTINATIONS = [
  { id: 'apac', name: 'APAC Region (Tokyo, Singapore, Sydney)', badge: 'Growth', image: '🏙️' },
  { id: 'emea', name: 'EMEA Region (London, Paris, Frankfurt)', badge: 'Established', image: '🏛️' },
  { id: 'latam', name: 'LATAM Region (São Paulo, Mexico City)', badge: 'Emerging', image: '🌎' },
  { id: 'na', name: 'North America (New York, San Francisco)', badge: 'Core', image: '🗽' },
  { id: 'mena', name: 'MENA Region (Dubai, Riyadh)', badge: 'Strategic', image: '🐪' },
  { id: 'custom', name: 'Other / Custom Global Market', badge: 'Tailored', image: '🌐' }
];

const CONSULTING_FOCUS = [
  { id: 'market_entry', title: 'Market Entry Strategy', desc: 'Vendor HQ, local market infrastructure, regional corporate visits', icon: '🏢' },
  { id: 'supply_chain', title: 'Supply Chain Optimization', desc: 'Logistics hubs, vendor evaluations, distribution networks', icon: '⚙️' },
  { id: 'talent_acquisition', title: 'Talent & HR Expansion', desc: 'Local hiring practices, talent hubs, workspace planning', icon: '🤝' },
  { id: 'compliance', title: 'Regulatory & Compliance', desc: 'Local tax laws, operational licensing, legal frameworks', icon: '⚖️' },
  { id: 'team_building', title: 'Corporate Team Expansion', desc: 'Team-approved corporate venues, stress-free transit, spacious conferencing', icon: '👨‍💼' }
];

const PACKAGES = [
  {
    id: 'custom_strategy',
    title: 'Custom Day-by-Day Strategy Advisory',
    price: '₹12,500 INR ($150.00 USD)',
    feeLabel: 'USD One-Time Advisory Fee',
    serviceName: 'Custom Strategy Advisory Package (₹12,500 INR ($150.00 USD))',
    popular: true,
    highlights: [
      'Bespoke day-by-day time-blocked schedule',
      'Curated accommodation & transit recommendations',
      'Neighborhood maps with local hidden gems',
      'Direct 1-on-1 advisor review session'
    ]
  },
  {
    id: 'market_research',
    title: 'Market Research & Intelligence Report',
    price: '₹6,000 INR ($75.00 USD)',
    feeLabel: 'USD One-Time Advisory Fee',
    serviceName: 'Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))',
    popular: false,
    highlights: [
      'Comprehensive digital destination guide',
      'Compliance guidelines, currency & safe zone maps',
      'Cultural etiquette & tipping rules',
      'Offline transit app recommendations'
    ]
  },
  {
    id: 'strategy_prep',
    title: 'Pre-Engagement Logistics & Safety Prep',
    price: '₹4,000 INR ($50.00 USD)',
    feeLabel: 'USD One-Time Advisory Fee',
    serviceName: 'Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))',
    popular: false,
    highlights: [
      'Customized minimalist packing list',
      'Foreign exchange & no-fee card advisory',
      'Emergency contacts & regulatory directory',
      'Pre-engagement Q&A call'
    ]
  }
];

export function StartPlanningWizard({
  isOpen,
  onClose,
  onCheckout,
  onBookConsult,
  onOpenLegalModal,
  locale
}: StartPlanningWizardProps) {
  const t = translations[locale];
  const [step, setStep] = useState(1);
  
  // Form Selections
  const [selectedDestination, setSelectedDestination] = useState(DESTINATIONS[0]);
  const [customDestinationText, setCustomDestinationText] = useState('');
  const [duration, setDuration] = useState('7-10 Days');
  const [consultingMonth, setConsultingMonth] = useState('Spring 2026');
  const [groupType, setGroupType] = useState('Couple / 2 Individuals');
  const [selectedStyle, setSelectedStyle] = useState('culture');
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const finalDestinationName = selectedDestination.id === 'custom' && customDestinationText 
    ? customDestinationText 
    : selectedDestination.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-6 text-left flex flex-col">
        
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-t-3xl relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
            <Compass className="h-4 w-4 text-blue-400" />
            <span>Interactive Project Planning Wizard</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Start Your Custom Consulting Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Answer 3 quick questions to receive a tailored consulting advisory recommendation and custom strategy framework.
          </p>

          {/* Step Progress Indicator */}
          <div className="mt-6 flex items-center justify-between max-w-md">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/30' 
                      : step > s 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className={`text-xs hidden sm:inline font-medium ${step === s ? 'text-white' : 'text-slate-400'}`}>
                  {s === 1 ? 'Destination' : s === 2 ? 'Style' : s === 3 ? 'Package' : 'Summary'}
                </span>
                {s < 4 && <div className="w-6 sm:w-10 h-0.5 bg-slate-800" />}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          
          {/* STEP 1: Destination & Dates */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  1. Where are you planning to consulting?
                </h3>
                <p className="text-xs text-slate-500">
                  Select a popular destination or enter your custom target country.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => setSelectedDestination(dest)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                      selectedDestination.id === dest.id
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{dest.image}</span>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{dest.name}</span>
                        <span className="text-[11px] text-slate-500">{dest.badge}</span>
                      </div>
                    </div>
                    {selectedDestination.id === dest.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selectedDestination.id === 'custom' && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Custom Destination / Countries:
                  </label>
                  <input
                    type="text"
                    value={customDestinationText}
                    onChange={(e) => setCustomDestinationText(e.target.value)}
                    placeholder="e.g. Iceland Ring Road, Portugal Coast, South Africa Safari"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="flex text-xs font-semibold text-slate-700 mb-1 items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    Project Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="3-5 Days">3-5 Days (Weekend Getaway)</option>
                    <option value="7-10 Days">7-10 Days (Standard Project)</option>
                    <option value="10-14 Days">10-14 Days (Extended Project)</option>
                    <option value="14+ Days">14+ Days (Multi-Country)</option>
                  </select>
                </div>

                <div>
                  <label className="flex text-xs font-semibold text-slate-700 mb-1 items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Target Consulting Timeframe
                  </label>
                  <select
                    value={consultingMonth}
                    onChange={(e) => setConsultingMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Spring 2026">Spring 2026 (Mar - May)</option>
                    <option value="Summer 2026">Summer 2026 (Jun - Aug)</option>
                    <option value="Fall 2026">Fall 2026 (Sep - Nov)</option>
                    <option value="Winter 2026">Winter 2026 (Dec - Feb)</option>
                    <option value="Flexible">Flexible / TBD</option>
                  </select>
                </div>

                <div>
                  <label className="flex text-xs font-semibold text-slate-700 mb-1 items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    Consulting Party
                  </label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    <option value="Solo Client">Solo Client</option>
                    <option value="Couple / 2 Individuals">Couple / 2 Individuals</option>
                    <option value="Corporate Team">Corporate Team</option>
                    <option value="Group of Friends">Group of Friends</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Consulting Preferences & Style */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  2. What is your preferred consulting style & focus?
                </h3>
                <p className="text-xs text-slate-500">
                  This allows our advisors to tailor the operational strategy, vendor priorities, and corporate engagement focus.
                </p>
              </div>

              <div className="space-y-3">
                {CONSULTING_FOCUS.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedStyle === style.id
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 block">{style.title}</span>
                        <span className="text-xs text-slate-500">{style.desc}</span>
                      </div>
                    </div>
                    {selectedStyle === style.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Advisory Service Package Selection */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  3. Select your advisory package level
                </h3>
                <p className="text-xs text-slate-500">
                  All packages are non-refundable one-time professional advisory fees.
                </p>
              </div>

              <div className="space-y-4">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedPackage.id === pkg.id
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                        Recommended
                      </span>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">{pkg.title}</h4>
                        <span className="text-xs text-slate-500">{pkg.feeLabel}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-2xl font-extrabold text-blue-600">{pkg.price}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
                      {pkg.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Service Advisory Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Service Advisory Disclosure:</strong> Your Flights LLC provides professional planning and advisory services only. We do not process software vendor licenseing or vendor contracts.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Direct Action */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Your Custom Project Profile</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Ready for Advisory
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Destination</span>
                    <span className="font-bold text-white text-sm">{finalDestinationName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-bold text-white text-sm">{duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Window</span>
                    <span className="font-bold text-white text-sm">{consultingMonth}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Party Size</span>
                    <span className="font-bold text-white text-sm">{groupType}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Selected Advisory Package:</span>
                    <span className="font-bold text-white text-base">{selectedPackage.title}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-extrabold text-blue-400">{selectedPackage.price}</span>
                    <span className="text-[10px] text-slate-400 block">USD One-Time Fee</span>
                  </div>
                </div>
              </div>

              {/* What Happens Next Deliverables */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  What You Receive Within 24 Hours:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Personalized digital advisory deliverable formatted for offline phone access.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Comprehensive neighborhood breakdown with curated local hidden gems.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>1-on-1 direct phone/email consultation with a dedicated Your Flights LLC advisor.</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onCheckout(selectedPackage.serviceName);
                  }}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout ({selectedPackage.price})</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onBookConsult();
                    }}
                    className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <PhoneCall className="h-4 w-4 text-blue-600" />
                    <span>Request Discovery Call First</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-8 flex items-center justify-between rounded-b-3xl">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Secured by Stripe PCI-DSS</span>
            </div>
          )}
        </div>

        {/* Legal Links Footer inside Wizard */}
        <div className="py-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 rounded-b-3xl">
          <span className="font-semibold text-slate-600">Compliance & Legal:</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Terms</a>
          <span>•</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Privacy</a>
          <span>•</span>
          <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Refund Policy</a>
          <span>•</span>
          <a href="/compliance" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline cursor-pointer">Service Disclosure</a>
        </div>

      </div>
    </div>
  );
}
