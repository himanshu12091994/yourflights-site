// ─────────────────────────────────────────────────────────────
// Your Flights LLC — Main Application Root Component
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { translations } from './translations';
import { PageView, Locale, LegalModalType, ServiceModalType } from './types';
import { PAGE_URLS } from './config/constants';
import { useCheckout } from './hooks/useCheckout';

// Layout Components
import { TopBar } from './components/layout/TopBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieConsent } from './components/layout/CookieConsent';

// Home Page Sections
import { ComplianceBanner } from './components/sections/ComplianceBanner';
import { HeroSection } from './components/sections/HeroSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { WhyUsSection } from './components/sections/WhyUsSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FaqSection } from './components/sections/FaqSection';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';

// Modals
import { LegalModal } from './components/modals/LegalModal';
import { InquiryModal } from './components/modals/InquiryModal';
import { CustomStrategyModal } from './components/modals/ServiceModals/CustomStrategyModal';
import { MarketResearchModal } from './components/modals/ServiceModals/MarketResearchModal';
import { ConsultingPrepModal } from './components/modals/ServiceModals/ConsultingPrepModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { SEOAuditModal } from './components/SEOAuditModal';
import { StartPlanningWizard } from './components/StartPlanningWizard';
import { ServicesExplorerModal } from './components/ServicesExplorerModal';

// SEO & Standalone Page Views
import { SEOManager } from './components/SEOManager';
import {
  AboutUsPage,
  ContactPage,
  CustomStrategiesPage,
  DestinationResearchPage,
  ConsultingPrepPage,
  BookConsultPage,
  TermsOfServicePage,
  PrivacyPolicyPage,
  RefundPolicyPage,
  MCCCompliancePage,
  ConsultingGuidesPage,
  CancellationPolicyPage,
  ShippingPolicyPage,
} from './components/Pages';
import { AcknowledgePage } from './components/AcknowledgePage';
import { PayuCheckoutPage } from './components/PayuCheckoutPage';

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeModal, setActiveModal] = useState<LegalModalType | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceModalType>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isPlanningWizardOpen, setIsPlanningWizardOpen] = useState(false);
  const [isServicesExplorerOpen, setIsServicesExplorerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Reusable Checkout & Payment State Hook
  const {
    loading,
    error,
    pendingCheckoutService,
    purchasedServiceName,
    purchasedAmount,
    purchasedAuditRecord,
    isTestModeActive,
    isCheckoutModalOpen,
    isConfirmationModalOpen,
    setPurchasedAuditRecord,
    setIsConfirmationModalOpen,
    setIsCheckoutModalOpen,
    handleOpenCheckout,
    executeCheckout,
  } = useCheckout();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkInitialRoute = () => {
        const pathname = window.location.pathname.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (pathname === '/admin' || pathname === '/admin/' || search.includes('page=admin')) {
          setCurrentPage('admin');
        } else if (pathname === '/audit' || pathname === '/audit/' || search.includes('page=audit')) {
          setIsAuditModalOpen(true);
        } else if (pathname.includes('/about')) {
          setCurrentPage('about');
        } else if (pathname.includes('/contact')) {
          setCurrentPage('contact');
        } else if (
          pathname.includes('/custom-itinerar') ||
          pathname.includes('/custom_strategies') ||
          pathname.includes('/strategy')
        ) {
          setCurrentPage('custom_strategies');
        } else if (
          pathname.includes('/destination-research') ||
          pathname.includes('/market_research') ||
          pathname.includes('/research') ||
          pathname.includes('/destination-intelligence')
        ) {
          setCurrentPage('market_research');
        } else if (
          pathname.includes('/consulting-prep') ||
          pathname.includes('/strategy_prep') ||
          pathname.includes('/prep') ||
          pathname.includes('/consulting-preparation') ||
          pathname.includes('/pre-departure')
        ) {
          setCurrentPage('strategy_prep');
        } else if (pathname.includes('/terms')) {
          setCurrentPage('terms');
        } else if (pathname.includes('/privacy')) {
          setCurrentPage('privacy');
        } else if (pathname.includes('/refund')) {
          setCurrentPage('refund');
        } else if (pathname.includes('/cancellation')) {
          setCurrentPage('cancellation');
        } else if (pathname.includes('/shipping')) {
          setCurrentPage('shipping');
        } else if (pathname.includes('/compliance') || pathname.includes('/mcc')) {
          setCurrentPage('compliance');
        } else if (pathname.includes('/guide') || pathname.includes('/guides') || pathname.includes('/consulting-guides')) {
          setCurrentPage('guides');
        } else if (pathname.includes('/consult') ||
          pathname.includes('/book_consult') ||
          pathname.includes('/book-consult') ||
          pathname.includes('/request-assistance')
        ) {
          setCurrentPage('book_consult');
        } else if (pathname.includes('payu-checkout') || search.includes('page=payu-checkout')) {
          setCurrentPage('payu-checkout');
        } else if (
          pathname.includes('/acknowledge') ||
          search.includes('page=acknowledge')
        ) {
          setCurrentPage('acknowledge');
        } else if (pathname.includes('/services')) {
          setCurrentPage('home');
          setTimeout(() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          setCurrentPage('home');
        }
      };

      checkInitialRoute();
      window.addEventListener('popstate', checkInitialRoute);

      const params = new URLSearchParams(window.location.search);
      const isSuccessParam =
        params.get('success') === 'true' ||
        params.get('redirect_status') === 'succeeded' ||
        params.get('payment_intent') !== null ||
        params.get('session_id') !== null;

      if (isSuccessParam && !params.get('canceled') && !params.get('error')) {
        const auditId = params.get('auditId') || `AUD-${Date.now()}`;
        setPurchasedAuditRecord({
          id: auditId,
          timestamp: new Date().toISOString(),
          mccAgreement: 'ACCEPTED',
        });
        setIsConfirmationModalOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      return () => {
        window.removeEventListener('popstate', checkInitialRoute);
      };
    }
  }, [setPurchasedAuditRecord, setIsConfirmationModalOpen]);

  const t = translations[locale];

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    const targetUrl = PAGE_URLS[page] || '/';
    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <SEOManager currentPage={currentPage} locale={locale} />
      {currentPage !== 'admin' && <TopBar />}
      {currentPage !== 'admin' && (
        <Navbar
          currentPage={currentPage}
          locale={locale}
          onNavigate={navigateTo}
          onToggleLocale={toggleLocale}
          t={t}
        />
      )}

      {currentPage === 'admin' ? (
        <AdminDashboardPage onOpenSEOAudit={() => setIsAuditModalOpen(true)} />
      ) : currentPage === 'home' ? (
        <>
          <ComplianceBanner t={t} />
          <HeroSection
            onOpenPlanningWizard={() => setIsPlanningWizardOpen(true)}
            onOpenServicesExplorer={() => setIsServicesExplorerOpen(true)}
            error={error}
            t={t}
          />
          <ServicesSection
            onNavigate={navigateTo}
            onCheckout={handleOpenCheckout}
            t={t}
          />
          <AboutSection />
          <TestimonialsSection t={t} />
          <FaqSection t={t} />
          <WhyUsSection onOpenInquiry={() => setIsInquiryOpen(true)} t={t} />
          <ContactSection />
        </>
      ) : (
        <main className="min-h-[80vh]">
          {currentPage === 'about' && (
            <AboutUsPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'contact' && (
            <ContactPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'custom_strategies' && (
            <CustomStrategiesPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'market_research' && (
            <DestinationResearchPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'strategy_prep' && (
            <ConsultingPrepPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'book_consult' && (
            <BookConsultPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'terms' && (
            <TermsOfServicePage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'privacy' && (
            <PrivacyPolicyPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'refund' && (
            <RefundPolicyPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'cancellation' && (
            <CancellationPolicyPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'shipping' && (
            <ShippingPolicyPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'compliance' && (
            <MCCCompliancePage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'guides' && (
            <ConsultingGuidesPage t={t} onBack={() => navigateTo('home')} onCheckout={handleOpenCheckout} onNavigate={navigateTo} />
          )}
          {currentPage === 'acknowledge' && (
            <AcknowledgePage onNavigate={navigateTo} />
          )}
          {currentPage === 'payu-checkout' && (
            <PayuCheckoutPage />
          )}
        </main>
      )}

      {currentPage !== 'admin' && <Footer onNavigate={navigateTo} locale={locale} t={t} />}
        <CookieConsent locale={locale} />

      {/* Legal & Policy Modals */}
      <LegalModal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title={t.modals.termsTitle}
        paragraphs={t.modals.termsContent}
        closeLabel={t.modals.close}
      />
      <LegalModal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title={t.modals.privacyTitle}
        paragraphs={t.modals.privacyContent}
        closeLabel={t.modals.close}
      />
      <LegalModal
        isOpen={activeModal === 'refund'}
        onClose={() => setActiveModal(null)}
        title={t.modals.refundTitle}
        paragraphs={t.modals.refundContent}
        closeLabel={t.modals.close}
      />
      <LegalModal
        isOpen={activeModal === 'compliance'}
        onClose={() => setActiveModal(null)}
        title={t.modals.complianceTitle}
        paragraphs={t.modals.complianceContent}
        closeLabel={t.modals.close}
      />

      {/* Service Detail Modals */}
      <CustomStrategyModal
        isOpen={activeServiceModal === 'custom_strategy'}
        onClose={() => setActiveServiceModal(null)}
        onCheckout={handleOpenCheckout}
        onOpenLegalModal={(m) => setActiveModal(m)}
        t={t}
      />
      <MarketResearchModal
        isOpen={activeServiceModal === 'market_research'}
        onClose={() => setActiveServiceModal(null)}
        onCheckout={handleOpenCheckout}
        onOpenLegalModal={(m) => setActiveModal(m)}
        t={t}
      />
      <ConsultingPrepModal
        isOpen={activeServiceModal === 'strategy_prep'}
        onClose={() => setActiveServiceModal(null)}
        onCheckout={handleOpenCheckout}
        onOpenLegalModal={(m) => setActiveModal(m)}
        t={t}
      />

      {/* Discovery Intake & Interactive Wizards */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        t={t}
      />
      <StartPlanningWizard
        isOpen={isPlanningWizardOpen}
        onClose={() => setIsPlanningWizardOpen(false)}
        onCheckout={handleOpenCheckout}
        onBookConsult={() => navigateTo('book_consult')}
        onOpenLegalModal={(m) => setActiveModal(m)}
        locale={locale}
      />
      <ServicesExplorerModal
        isOpen={isServicesExplorerOpen}
        onClose={() => setIsServicesExplorerOpen(false)}
        onCheckout={handleOpenCheckout}
        onNavigatePage={(page) => {
          setIsServicesExplorerOpen(false);
          navigateTo(page);
        }}
        onOpenLegalModal={(m) => setActiveModal(m)}
        locale={locale}
      />

      {/* Transaction & Admin Modals */}
      <OrderConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        serviceName={purchasedServiceName}
        amount={purchasedAmount}
        locale={locale}
        auditRecord={purchasedAuditRecord}
        isTestMode={isTestModeActive}
      />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        serviceName={pendingCheckoutService}
        onProceedCheckout={executeCheckout}
        onOpenLegalModal={(m) => setActiveModal(m)}
        isLoading={loading}
      />
      {/* Removed AdminDashboardModal rendering from here */}
      <SEOAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
          if (
            window.location.pathname.toLowerCase().includes('/audit') ||
            window.location.search.toLowerCase().includes('audit')
          ) {
            window.history.pushState({}, document.title, '/');
          }
        }}
        currentPage={currentPage}
        locale={locale}
        onNavigate={navigateTo}
      />
    </div>
  );
}
