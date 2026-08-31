// ─────────────────────────────────────────────────────────────
// Footer Component — Merchant details, payment badges, and legal disclosures
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {

  Phone,
  Mail,
  CheckCircle2,
  Lock,
  ShieldCheck,
  CreditCard,
  Building2,
} from 'lucide-react';
import { PageView, Locale, NewsletterStatus } from '../../types';
import { translations } from '../../translations';
import { BRAND, CONTACT, MCC, STATEMENT_DESCRIPTOR } from '../../config/constants';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  locale: Locale;
  t: typeof translations['en'];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, locale, t }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus>('idle');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('submitting');
    setTimeout(() => {
      setNewsletterStatus('subscribed');
      try {
        localStorage.setItem('subscribed_email', newsletterEmail);
      } catch (err) {
        // ignore storage errors
      }
    }, 650);
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
          {/* Brand & Address Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white tracking-tight">
                {t.footer.entityName}
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-5 text-sm leading-relaxed">
              {t.footer.desc}
            </p>

            {/* International Business Structure & Address Block */}
            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 max-w-md shadow-sm">
              <div className="font-bold text-white text-sm pb-1.5 border-b border-slate-700/60 flex items-center justify-between">
                <span>{t.footer.entityName}</span>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                  Verified Consulting Advisory
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">
                  {t.footer.legalEntityLabel}:
                </span>
                <span className="text-slate-400 block pl-0.5">
                  {t.footer.legalEntityAddress}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">
                  {t.footer.globalOpsLabel}:
                </span>
                <span className="text-slate-400 block pl-0.5">
                  {t.footer.globalOpsAddress}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-x-2 text-slate-300">
                <span className="font-semibold text-slate-200">
                  {t.footer.supportLabel}:
                </span>
                <a
                  href={`tel:${t.footer.phone}`}
                  className="hover:text-blue-400 transition-colors flex items-center font-medium"
                >
                  <Phone className="h-3 w-3 mr-1 text-blue-400" />
                  {t.footer.phone}
                </a>
                <span className="text-slate-600">|</span>
                <a
                  href={`mailto:${t.footer.email}`}
                  className="hover:text-blue-400 transition-colors flex items-center font-medium"
                >
                  <Mail className="h-3 w-3 mr-1 text-blue-400" />
                  {t.footer.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.sTitle}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.footer.about ||
                    (locale === 'es' ? 'Acerca de Nosotros' : 'About Us')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {locale === 'es' ? 'Contacto' : 'Contact Us'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom_strategies')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.services.s2Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('market_research')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.services.s1Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('strategy_prep')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.services.s3Title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('book_consult')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {t.nav.book}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guides')}
                  className="hover:text-white transition-colors text-left cursor-pointer text-blue-400 font-medium"
                >
                  {locale === 'es'
                    ? 'Guías de Asesoría de Consultoría'
                    : 'Consulting Advisory Guides'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.lTitle}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/terms"
                  onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer block"
                >
                  {t.footer.l1}
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer block"
                >
                  {t.footer.l2}
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => { e.preventDefault(); onNavigate('refund'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer block"
                >
                  {t.footer.l3}
                </a>
              </li>
              <li>
                <a
                  href="/cancellation-policy"
                  onClick={(e) => { e.preventDefault(); onNavigate('cancellation'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer block"
                >
                  {locale === 'es' ? 'Política de Cancelación' : 'Cancellation Policy'}
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => { e.preventDefault(); onNavigate('shipping'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer block"
                >
                  {locale === 'es' ? 'Política de Envío' : 'Shipping Policy'}
                </a>
              </li>
              <li>
                <a
                  href="/compliance"
                  onClick={(e) => { e.preventDefault(); onNavigate('compliance'); }}
                  className="hover:text-white transition-colors text-left cursor-pointer text-slate-400 block"
                >
                  Compliance Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-slate-400 text-sm mb-4">
              {t.footer.newsletterDesc}
            </p>
            {newsletterStatus === 'subscribed' ? (
              <div className="bg-emerald-950/90 border border-emerald-500/60 rounded-xl p-4 text-emerald-200 space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>
                    {(t.footer as any).newsletterSuccessTitle ||
                      'Subscribed Successfully!'}
                  </span>
                </div>
                <p className="text-xs text-emerald-300/90 leading-relaxed">
                  {(t.footer as any).newsletterSuccessDesc ||
                    'Thank you for subscribing! You will receive our latest consulting tips and advisory updates directly in your inbox.'}
                </p>
                <p className="text-[11px] text-emerald-400/80 font-mono">
                  {newsletterEmail}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNewsletterStatus('idle');
                    setNewsletterEmail('');
                  }}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-200 underline pt-1 inline-block cursor-pointer transition-colors"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center space-x-2"
                >
                  {newsletterStatus === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-1"></span>
                      <span>
                        {(t.footer as any).newsletterSubscribing ||
                          'Subscribing...'}
                      </span>
                    </>
                  ) : (
                    <span>{t.footer.newsletterBtn}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Payment Methods & Security Badges Section */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Payment Icons */}
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t.footer.paymentsTitle}
            </h5>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Visa */}
              <div
                className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center h-9 w-14 shadow-sm hover:border-slate-600 transition-colors"
                title="Visa"
              >
                <svg
                  className="h-3.5 w-auto text-white"
                  viewBox="0 0 36 12"
                  fill="currentColor"
                >
                  <path d="M13.882 0.208L9.088 11.758H6.16L3.729 2.502C3.585 1.932 3.442 1.724 2.983 1.472C2.266 1.077 1.062 0.704 0 0.462L0.086 0.208H5.064C5.724 0.208 6.298 0.655 6.442 1.373L7.704 8.163L10.775 0.208H13.882ZM25.295 8.118C25.31 5.084 21.081 4.912 21.11 3.535C21.124 3.119 21.526 2.674 22.445 2.559C22.889 2.502 24.138 2.459 25.324 3.018L25.84 0.622C25.137 0.364 24.233 0.12 23.099 0.12C20.198 0.12 18.159 1.662 18.145 3.865C18.116 5.498 19.58 6.416 20.685 6.961C21.819 7.52 22.206 7.878 22.192 8.38C22.178 9.139 21.274 9.483 20.442 9.498C19.007 9.527 18.173 9.111 17.513 8.81L16.968 11.362C17.671 11.692 18.963 11.964 20.313 11.978C23.407 11.978 25.281 10.444 25.295 8.118ZM32.809 11.758H35.536L33.155 0.208H30.643C30.04 0.208 29.538 0.552 29.323 1.083L25.045 11.758H28.116L28.733 10.052H32.493L32.809 11.758ZM29.58 7.717L31.13 3.449L32.02 7.717H29.58ZM17.47 0.208L14.945 11.758H12.003L14.528 0.208H17.47Z" />
                </svg>
              </div>
              {/* Mastercard */}
              <div
                className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center h-9 w-14 shadow-sm hover:border-slate-600 transition-colors"
                title="Mastercard"
              >
                <svg className="h-5 w-auto" viewBox="0 0 24 16" fill="none">
                  <circle cx="8" cy="8" r="7" fill="#EB001B" />
                  <circle
                    cx="16"
                    cy="8"
                    r="7"
                    fill="#F79E1B"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
              {/* AMEX */}
              <div
                className="bg-blue-900/30 border border-blue-500/40 rounded-lg px-3 py-1.5 flex items-center justify-center h-9 w-14 shadow-sm hover:border-blue-400 transition-colors"
                title="American Express"
              >
                <span className="text-[10px] font-black tracking-tighter text-blue-400 uppercase">
                  AMEX
                </span>
              </div>
              {/* Discover */}
              <div
                className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center h-9 w-14 shadow-sm hover:border-slate-600 transition-colors"
                title="Discover"
              >
                <div className="flex items-center space-x-0.5">
                  <span className="text-[9px] font-extrabold text-slate-200 tracking-tighter">
                    DISC
                  </span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full inline-block"></span>
                  <span className="text-[9px] font-extrabold text-slate-200 tracking-tighter">
                    VER
                  </span>
                </div>
              </div>
              {/* Stripe */}
              <div
                className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center justify-center h-9 w-16 shadow-sm hover:border-slate-600 transition-colors"
                title="Stripe"
              >
                <span className="text-xs font-bold text-indigo-400 tracking-tight">
                  stripe
                </span>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 lg:text-right">
              {t.footer.securityTitle}
            </h5>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>Verified Consulting Advisory</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t.footer.sslBadge}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>{t.footer.pciBadge}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <CreditCard className="h-3.5 w-3.5 text-indigo-400" />
                <span>{t.footer.stripeBadge}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t.footer.guaranteeBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing & Operating Entity Disclosure Block */}
        <div className="mt-8 pt-6 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 text-slate-200 font-bold uppercase tracking-wider text-xs">
            <Building2 className="h-4 w-4 text-blue-400 shrink-0" />
            <span>Billing & Operating Entity:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            All direct B2B consulting advisory and research services on this
            website are provided by{' '}
            <strong className="text-white">{BRAND.LEGAL_ENTITY}</strong>. Charges on your
            credit card or bank statement will appear as:{' '}
            <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">
              '{STATEMENT_DESCRIPTOR.FULL}'
            </code>{' '}
            or{' '}
            <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-xs">
              '{STATEMENT_DESCRIPTOR.DOMAIN}'
            </code>
            .
          </p>
          <p className="text-slate-400 leading-relaxed pt-0.5">
            For customer support or billing inquiries, contact us at{' '}
            <a
              href={`mailto:${CONTACT.EMAIL}`}
              className="text-blue-400 font-semibold hover:underline"
            >
              {CONTACT.EMAIL}
            </a>{' '}
            or{' '}
            <a
              href={`tel:${CONTACT.PHONE}`}
              className="text-blue-400 font-semibold hover:underline"
            >
              {CONTACT.PHONE}
            </a>
            .
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {t.footer.rights}
          </div>
          <div className="text-xs text-slate-500">
            <span>
              Independent B2B Consulting Advisory & Destination Intelligence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
