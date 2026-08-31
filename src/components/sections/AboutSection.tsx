// ─────────────────────────────────────────────────────────────
// About Section — Visible on Home Page for Stripe Compliance
// Stripe requires a clear business description on the main page
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Building2, ShieldCheck, Globe, Users, Award, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Building2 className="h-3.5 w-3.5" />
            <span>About Your Flights LLC</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Who We Are & What We Do
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Your Flights LLC is a registered US-based independent consulting advisory and market intelligence firm, 
            providing bespoke strategy planning, destination research, and pre-engagement preparation services.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-14">

          {/* Left: Company Description */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Flights LLC</h3>
                  <p className="text-xs text-slate-500">Operated by Himanshu Kumar · Wyoming, USA</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Founded and operated as a premier enterprise-focused consulting advisory and market intelligence service, 
                <strong> Your Flights LLC</strong> specializes in helping corporate clients design custom, tailored strategies 
                and prepare for seamless consulting engagements worldwide. Our team consists of seasoned strategy experts 
                dedicated to providing meticulous research and personalized advisory deliverables.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                We are <strong>not</strong> a licensed travel agency, tour operator, or software vendor. We are an 
                independent professional advisory firm providing research, strategy design, and planning intelligence 
                exclusively. All consulting or software contracts are made directly by the client with their providers.
              </p>
            </div>

            {/* Registration Details */}
            <div className="bg-blue-600 text-white rounded-3xl p-7 space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wide text-blue-100">
                Business Registration & Contact
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-4 w-4 text-blue-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Legal Entity</span>
                    <span className="text-blue-200">Your Flights LLC Operated By Himanshu Kumar</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-blue-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Registered Address</span>
                    <span className="text-blue-200">30 N Gould St Ste R, Sheridan, WY 82801, USA</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="h-4 w-4 text-blue-300 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Website</span>
                    <span className="text-blue-200">yourflightsllc.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Core Values / What Sets Us Apart */}
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-slate-900">Why Choose Your Flights?</h3>
            {[
              {
                icon: ShieldCheck,
                color: 'emerald',
                title: '100% Independent & Unbiased Advisory',
                desc: 'We earn zero commissions from consulting suppliers, hotels, or airlines. Our advice is based solely on your goals, not vendor kickbacks or sales quotas.',
              },
              {
                icon: Award,
                color: 'blue',
                title: 'Expert Strategy Specialists',
                desc: 'Every deliverable is crafted by experienced strategy consultants with deep knowledge of global markets, compliance frameworks, and business travel logistics.',
              },
              {
                icon: Users,
                color: 'indigo',
                title: '1-on-1 Dedicated Advisory Sessions',
                desc: 'You work directly with a dedicated consulting advisor — not a chatbot or generic template. Your strategy is built specifically around your project goals.',
              },
              {
                icon: Globe,
                color: 'violet',
                title: 'Global Coverage, US-Registered Business',
                desc: 'Incorporated in Wyoming, USA with global operations capability. We serve corporate clients across North America, Europe, Asia-Pacific, and India.',
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={i}
                className="flex items-start space-x-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Wyoming LLC', sub: 'US Registered Business', icon: Building2 },
            { label: 'Stripe Secured', sub: 'PCI-DSS Compliant Payments', icon: ShieldCheck },
            { label: 'Global Advisory', sub: 'B2B Corporate Clients', icon: Globe },
            { label: 'Fixed Pricing', sub: 'No Hidden Fees, No Renewals', icon: Award },
          ].map(({ label, sub, icon: Icon }, i) => (
            <div key={i} className="text-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <Icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
