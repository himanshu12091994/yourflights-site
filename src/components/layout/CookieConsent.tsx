import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Locale } from '../../types';

interface CookieConsentProps {
  locale: Locale;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ locale }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      // Small delay to ensure it animates in after initial render
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const t = locale === 'en' 
    ? {
        title: 'Cookie Consent & Privacy',
        text: 'We use cookies to ensure you get the best experience on our website, analyze site traffic, and support our secure checkout process. By continuing to use our site, you agree to our privacy policy and the use of cookies.',
        accept: 'Got it!'
      }
    : {
        title: 'Consentimiento de Cookies y Privacidad',
        text: 'Utilizamos cookies para garantizar que obtenga la mejor experiencia en nuestro sitio web, analizar el tráfico y respaldar nuestro proceso de pago seguro. Al continuar, acepta nuestra política de privacidad.',
        accept: '¡Entendido!'
      };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Cookie className="h-5 w-5 text-blue-600" />
          <h4 className="font-bold text-slate-900">{t.title}</h4>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        {t.text}
      </p>
      <div className="flex justify-end">
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-5 rounded-lg transition-colors cursor-pointer w-full md:w-auto"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
};
