// ─────────────────────────────────────────────────────────────
// Primary Navigation Bar & Mobile Navigation Drawer
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Building2, Globe, Phone, Menu, X } from 'lucide-react';
import { PageView, Locale } from '../../types';
import { translations } from '../../translations';
import { BRAND, CONTACT } from '../../config/constants';

interface NavbarProps {
  currentPage: PageView;
  locale: Locale;
  onNavigate: (page: PageView) => void;
  onToggleLocale: () => void;
  t: typeof translations['en'];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  locale,
  onNavigate,
  onToggleLocale,
  t,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageView) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);
  };

  const handleSectionScroll = (elementId: string) => {
    setIsMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer focus:outline-none group text-left"
          >
            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-xs">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              {BRAND.DBA}
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {t.nav.home || 'Home'}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors cursor-pointer ${
                currentPage === 'about'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {t.nav.about || 'About Us'}
            </button>

            <button
              onClick={() => handleSectionScroll('services')}
              className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t.nav.services || 'Our Services'}
            </button>

            <button
              onClick={() => handleNavClick('guides')}
              className={`transition-colors cursor-pointer ${
                currentPage === 'guides'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {t.nav.guides || 'Strategy Guides'}
            </button>

            <button
              onClick={() => handleSectionScroll('faq')}
              className="text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {t.nav.faq || 'FAQ'}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              {t.nav.contact || 'Contact Us'}
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={onToggleLocale}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer border border-slate-200"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4 text-slate-500" />
              <span>{locale === 'en' ? 'ES' : 'EN'}</span>
            </button>

            {/* Direct Phone Link */}
            <a
              href={`tel:${CONTACT.PHONE_RAW}`}
              className="hidden xl:flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span>{CONTACT.PHONE}</span>
            </a>

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick('book_consult')}
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-xs hover:shadow-md cursor-pointer"
            >
              {t.nav.book || 'Request Assistance'}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.home || 'Home'}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'about'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.about || 'About Us'}
            </button>

            <button
              onClick={() => handleSectionScroll('services')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t.nav.services || 'Our Services'}
            </button>

            <button
              onClick={() => handleNavClick('guides')}
              className={`text-left py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'guides'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.guides || 'Strategy Guides'}
            </button>

            <button
              onClick={() => handleSectionScroll('faq')}
              className="text-left py-2 px-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {t.nav.faq || 'FAQ'}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'contact'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t.nav.contact || 'Contact Us'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <a
              href={`tel:${CONTACT.PHONE_RAW}`}
              className="flex items-center justify-center space-x-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
            >
              <Phone className="h-4 w-4 text-blue-600" />
              <span>Call Support: {CONTACT.PHONE}</span>
            </a>

            <button
              onClick={() => handleNavClick('book_consult')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {t.nav.book || 'Request Consulting Assistance'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
