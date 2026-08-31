// ─────────────────────────────────────────────────────────────
// Contact Section — Visible on Home Page for Stripe Compliance
// Stripe requires contact info (email, phone, address) accessible
// from the main page without requiring navigation.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { Mail, Phone, MapPin, Clock, Building2, Globe, ShieldCheck } from 'lucide-react';
import { CONTACT, BRAND } from '../../config/constants';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact-us" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Mail className="h-3.5 w-3.5" />
            <span>Contact & Support</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch with Your Flights LLC
          </h2>
          <p className="mt-4 text-lg text-slate-400 leading-relaxed">
            Our client advisory team is available Monday – Friday to assist with service inquiries, 
            billing questions, and consulting advisory needs.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

          {/* Email */}
          <a
            href={`mailto:${CONTACT.EMAIL}`}
            id="contact-email-link"
            className="group flex flex-col items-center text-center p-8 bg-slate-800 border border-slate-700 rounded-3xl hover:border-blue-500/60 hover:bg-slate-800/80 transition-all shadow-sm"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support Email</p>
            <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors break-all">
              {CONTACT.EMAIL}
            </p>
            <p className="text-xs text-slate-500 mt-2">Response within 2 business hours</p>
          </a>

          {/* Phone */}
          <a
            href={`tel:+18105055186`}
            id="contact-phone-link"
            className="group flex flex-col items-center text-center p-8 bg-slate-800 border border-slate-700 rounded-3xl hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all shadow-sm"
          >
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Phone className="h-7 w-7 text-white" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support Phone</p>
            <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {CONTACT.PHONE}
            </p>
            <p className="text-xs text-slate-500 mt-2">Direct billing &amp; advisory assistance</p>
          </a>

          {/* Business Hours */}
          <div className="flex flex-col items-center text-center p-8 bg-slate-800 border border-slate-700 rounded-3xl shadow-sm">
            <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center mb-5">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Hours</p>
            <p className="text-lg font-bold text-white">Mon – Fri</p>
            <p className="text-sm text-slate-300 mt-1">9:00 AM – 6:00 PM EST</p>
            <p className="text-xs text-slate-500 mt-2">Emergency support available by email 24/7</p>
          </div>
        </div>

        {/* Business Information Block (for Stripe compliance) */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-8">
          <div className="flex items-center space-x-3 mb-6 pb-5 border-b border-slate-700">
            <Building2 className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Business Information
            </h3>
            <span className="ml-auto text-[11px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified Business</span>
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legal Business Name</p>
              <p className="text-white font-semibold leading-snug">Your Flights LLC<br/>
                <span className="text-slate-400 font-normal text-xs">Operated by Himanshu Kumar</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Address</p>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-slate-300 leading-snug">{CONTACT.ADDRESS}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p>
              <div className="flex items-start space-x-2">
                <Globe className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <a
                  href={BRAND.WEBSITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {BRAND.DOMAIN}
                </a>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Statement Name</p>
              <p className="text-slate-300 font-mono text-xs bg-slate-700/80 border border-slate-600 rounded-lg px-3 py-1.5 mt-1">
                YOUR FLIGHTS ADVISORY
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
