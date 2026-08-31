import React, { useEffect } from 'react';
import { translations, Locale } from '../translations';
import { PageView } from '../types';
import consultingGuidesData from '../data/consultingGuides.json';

interface SEOProps {
  currentPage: PageView;
  locale: Locale;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  canonicalUrl: string;
}

export const seoTranslations: Record<Locale, Record<PageView, SEOMetadata>> = {
  en: {
    home: {
      title: "Your Flights LLC | Expert Consulting Advisory, Custom Strategies & Market Research",
      description: "Your Flights LLC provides professional consulting advisory, bespoke day-by-day strategy design, and market intelligence research. Fixed one-time fees: $150.00 USD Strategy · $75.00 USD Research · $50.00 USD Prep. No consulting services sold.",
      keywords: "consulting advisory, custom strategy planning, market research, strategy prep, day-by-day consulting plan, Your Flights LLC, bespoke strategy, market intelligence",
      ogTitle: "Expert Consulting Advisory, Custom Strategies & Market Research | Your Flights LLC",
      ogDescription: "Professional strategy planning, bespoke strategy advisory, and market intelligence research. Fixed fees — $150.00 USD · $75.00 USD · $50.00 USD. Advisory services only; no consulting services sold.",
      canonicalUrl: "https://yourflightsllc.com/"
    },
    about: {
      title: "About Us | Independent Consulting Advisory Firm | Your Flights LLC",
      description: "Learn about Your Flights (operated by Your Flights LLC), an independent consulting advisory and market intelligence consulting firm specializing in custom strategies and strategy planning.",
      keywords: "about Your Flights LLC, consulting advisory firm, independent consulting consultant, consulting strategist, custom strategy",
      ogTitle: "About Us | Your Flights LLC Consulting Advisory",
      ogDescription: "Your Flights (operated by Your Flights LLC) provides expert consulting advisory, custom day-by-day strategy design, market research, and pre-engagement consulting.",
      canonicalUrl: "https://yourflightsllc.com/about"
    },
    contact: {
      title: "Contact Us | Client Advisory Support | Your Flights LLC",
      description: "Get in touch with Your Flights (operated by Your Flights LLC). Support Email: support@yourflightsllc.com, Phone: USA +1 (810) 505-5186. Legal Entity: 30 N Gould St Ste R, Sheridan, WY, 82801, USA Global Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA.",
      keywords: "contact Your Flights LLC, consulting support, consulting advisory phone, Sheridan WY consulting consulting, support email",
      ogTitle: "Contact Us | Your Flights LLC",
      ogDescription: "Connect with Your Flights client support team for consulting advisory, custom strategy design, and market research inquiries.",
      canonicalUrl: "https://yourflightsllc.com/contact"
    },
    custom_strategies: {
      title: "Custom Strategy Advisory & Planning Package ($150.00 USD) | Your Flights LLC",
      description: "Get bespoke day-by-day consulting schedules tailored to your style and budget with our Custom Strategy Advisory package. Fixed one-time fee: $150.00 USD. Professional strategy planning advisory — no consulting services sold.",
      keywords: "custom strategy planning, day by day consulting schedule, consulting strategy package, $150.00 USD strategy planning, bespoke consulting strategy",
      ogTitle: "Custom Strategy Advisory Package ($150.00 USD) | Your Flights LLC",
      ogDescription: "Bespoke day-by-day strategy planning, 1-on-1 strategy sessions, and digital strategy access with Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/custom-strategies"
    },
    market_research: {
      title: "Market Research & Intelligence Report ($75.00 USD) | Your Flights LLC",
      description: "In-depth market research assistance ($75.00 USD) covering compliance requirements, safety reports, cultural norms, and hidden gems. Expert consulting advisory by Your Flights LLC.",
      keywords: "market research, consulting intelligence report, compliance requirement check, consulting safety analysis, local cultural norms, $75.00 USD destination guide",
      ogTitle: "Market Research & Intelligence ($75.00 USD) | Your Flights LLC",
      ogDescription: "Detailed destination safety analysis, compliance requirement checks, and cultural navigation reports.",
      canonicalUrl: "https://yourflightsllc.com/destination-research"
    },
    strategy_prep: {
      title: "Pre-Engagement Strategy Preparation Advisory ($50.00 USD) | Your Flights LLC",
      description: "Expert pre-engagement preparation assistance ($50.00 USD) with strategy preparations, budget handling, mobile transit apps, and safety rules for your upcoming project.",
      keywords: "pre-engagement strategy prep, packing guide, foreign currency strategy, transit app setup, consulting safety checklist, $50.00 USD strategy prep",
      ogTitle: "Pre-Engagement Preparation Assistance ($50.00 USD) | Your Flights LLC",
      ogDescription: "Minimalist strategy guides, FX currency strategies, transit app setup, and health & safety advice.",
      canonicalUrl: "https://yourflightsllc.com/consulting-prep"
    },
    book_consult: {
      title: "Request Consulting Assistance Session | 30-Min Discovery | Your Flights LLC",
      description: "Schedule a 30-minute discovery session with Your Flights LLC for personalized strategy planning advice, custom strategy consultation, and market intelligence.",
      keywords: "request consulting assistance, consulting consultation call, book consulting advisor, discovery session, strategy planning appointment",
      ogTitle: "Request 30-Min Consulting Assistance Call | Your Flights LLC",
      ogDescription: "Speak directly with an expert consulting advisor to align on your consulting goals, budget, and custom planning needs.",
      canonicalUrl: "https://yourflightsllc.com/request-assistance"
    },
    terms: {
      title: "Terms of Service | Consulting Advisory Agreement | Your Flights LLC",
      description: "Read our Terms of Service. Your Flights LLC operates strictly as an independent strategy planning and advisory firm. Fixed one-time fees; no consulting services or software licenses sold.",
      keywords: "terms of service, consulting advisory legal terms, independent consulting agreement, advisory service terms",
      ogTitle: "Terms of Service | Your Flights LLC",
      ogDescription: "Official legal terms defining independent consulting advisory and planning services provided by Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/terms"
    },
    privacy: {
      title: "Privacy Policy & PCI-DSS Disclosures | Your Flights LLC",
      description: "Our Privacy Policy outlines how Your Flights LLC protects client data using Stripe PCI-DSS encrypted payment processing and strict confidentiality under US and international privacy standards.",
      keywords: "privacy policy, PCI-DSS compliance, Stripe payment security, client data protection, Your Flights LLC privacy",
      ogTitle: "Privacy Policy & PCI-DSS Disclosures | Your Flights LLC",
      ogDescription: "Transparent data protection and Stripe encrypted payment processing policies.",
      canonicalUrl: "https://yourflightsllc.com/privacy"
    },
    refund: {
      title: "Refund & Cancellation Policy (24-Hour Guarantee) | Your Flights LLC",
      description: "Review our transparent 24-hour pre-session refund policy and digital deliverable policy for all consulting assistance and advisory packages ($50.00 USD - $150.00 USD).",
      keywords: "refund policy, cancellation policy, 24-hour refund, consulting consulting refund, revision guarantee, merchant return policy",
      ogTitle: "Refund & Cancellation Policy | Your Flights LLC",
      ogDescription: "24-hour pre-session cancellation rules and revision guarantees for consulting advisory deliverables.",
      canonicalUrl: "https://yourflightsllc.com/refund-policy"
    },
    compliance: {
      title: "Service Classification & Compliance Notice | Your Flights LLC",
      description: "Service transparency statement for Your Flights LLC. We provide independent consulting advisory and consulting services only. Fixed one-time fees: $150.00 USD · $75.00 USD · $50.00 USD. No consulting services sold.",
      keywords: "consulting advisory compliance, independent consulting notice, service transparency, strategy planning advisory",
      ogTitle: "Service Classification & Compliance Notice | Your Flights LLC",
      ogDescription: "Full transparency statement regarding independent consulting advisory and consulting services provided by Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/compliance"
    },
    guides: {
      title: "Consulting Advisory Insights & Destination Intelligence Guides | Your Flights LLC",
      description: "Explore expert consulting advice, cultural etiquette guides, packing checklists, and market research tips provided by Your Flights LLC consulting advisors.",
      keywords: "strategy guides, cultural etiquette tips, packing checklists, market intelligence, transit guides, consulting advice articles",
      ogTitle: "Consulting Advisory Insights & Destination Guides | Your Flights LLC",
      ogDescription: "High-value consulting advice, cultural navigation tips, and pre-engagement checklists for global clients.",
      canonicalUrl: "https://yourflightsllc.com/guides"
    },
    admin: {
      title: "Admin Dashboard | Your Flights LLC",
      description: "Internal staff administration dashboard for Your Flights LLC.",
      keywords: "admin, staff, internal",
      ogTitle: "Admin Dashboard | Your Flights LLC",
      ogDescription: "Staff portal.",
      canonicalUrl: "https://yourflightsllc.com/admin"
    },
    acknowledge: {
      title: "Acknowledge Advisory Terms | Your Flights LLC",
      description: "Officially acknowledge receipt of your consulting advisory details and confirm your agreement to the service terms provided by Your Flights LLC.",
      keywords: "advisory acknowledgement, terms acknowledgement, Your Flights LLC",
      ogTitle: "Acknowledge Advisory Terms | Your Flights LLC",
      ogDescription: "Confirm receipt and agreement to your consulting advisory terms from Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/acknowledge"
    },
    cancellation: {
      title: "Cancellation Policy | Your Flights LLC",
      description: "Read the cancellation policy for Your Flights LLC consulting advisory services.",
      keywords: "cancellation policy, Your Flights LLC",
      ogTitle: "Cancellation Policy | Your Flights LLC",
      ogDescription: "Cancellation policy and terms for Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/cancellation-policy"
    },
    shipping: {
      title: "Shipping Policy | Your Flights LLC",
      description: "Read the shipping policy for digital services from Your Flights LLC.",
      keywords: "shipping policy, digital delivery, Your Flights LLC",
      ogTitle: "Shipping Policy | Your Flights LLC",
      ogDescription: "Shipping and digital delivery policy for Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/shipping-policy"
    },
    'payu-checkout': {
      title: 'Secure Checkout Transfer',
      description: 'Redirecting to secure gateway.',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      canonicalUrl: '',
    }
  },
  es: {
    home: {
      title: "Your Flights LLC | Asesoría de Consultoría Experta, Estrategias Personalizados e Investigación de Destinos",
      description: "Your Flights LLC brinda asesoría profesional de consultoría, diseño de viajes personalizados e investigación de inteligencia de destinos. Tarifas únicas fijas: $150.00 USD Plan estratégico · $75.00 USD Investigación · $50.00 USD Preparación. Sin venta de licencias de software.",
      keywords: "asesoría de consultoría, viajes personalizados, investigación de destinos, preparación de estrategia, Your Flights LLC",
      ogTitle: "Asesoría Profesional de Consultoría y Destinos | Your Flights LLC",
      ogDescription: "Planificación de consultoría a medida, asesoría de estrategias e investigación de destinos. Solo servicios de asesoría; sin venta de licencias de software.",
      canonicalUrl: "https://yourflightsllc.com/es/"
    },
    about: {
      title: "Acerca de Nosotros | Firma Independiente de Asesoría de Consultoría | Your Flights LLC",
      description: "Conozca Your Flights (operado por Your Flights LLC), firma independiente de asesoría de consultoría e investigación de destinos especializada en viajes personalizados.",
      keywords: "acerca de Your Flights LLC, firma de asesoría de consultoría, consultor de consultoría",
      ogTitle: "Acerca de Nosotros - Your Flights",
      ogDescription: "Your Flights (operado por Your Flights LLC) ofrece asesoría de consultoría experta, diseño de viajes personalizados e investigación de destinos.",
      canonicalUrl: "https://yourflightsllc.com/es/about"
    },
    contact: {
      title: "Contacto | Atención al Cliente de Asesoría | Your Flights LLC",
      description: "Póngase en contacto con Your Flights (operado por Your Flights LLC). Correo de soporte: support@yourflightsllc.com, Teléfono: USA +1 (810) 505-5186.",
      keywords: "contacto Your Flights LLC, soporte de consultoría, teléfono de asesoría, correo de soporte",
      ogTitle: "Contacto - Your Flights",
      ogDescription: "Conéctese con el equipo de atención al cliente de Your Flights para consultas sobre asesoría de consultoría e viajes personalizados.",
      canonicalUrl: "https://yourflightsllc.com/es/contact"
    },
    custom_strategies: {
      title: "Asesoría de Estrategias Personalizados ($150.00 USD) | Your Flights LLC",
      description: "Obtenga estrategias día a día adaptados a su estilo y presupuesto con nuestro paquete de Asesoría de Estrategias. Tarifa única: $150.00 USD. Asesoría profesional de consultoría — sin venta de boletos.",
      keywords: "plan estratégico personalizado, plan de estrategia día a día, paquete de estrategias $150.00 USD, planificación de consultoría",
      ogTitle: "Paquete de Asesoría de Estrategias ($150.00 USD) | Your Flights LLC",
      ogDescription: "Planificación paso a paso, sesiones estratégicas 1 a 1 y acceso a plan estratégico móvil con Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/custom-strategies"
    },
    market_research: {
      title: "Asistencia de Investigación de Destinos ($75.00 USD) | Your Flights LLC",
      description: "Investigación profunda de destinos ($75.00 USD) cubriendo visas, seguridad, normas culturales y lugares ocultos. Asesoría experta de consultoría por Your Flights LLC.",
      keywords: "investigación de destinos, informe de inteligencia de consultoría, requisitos de cumplimiento, seguridad de estrategia",
      ogTitle: "Investigación de Destinos e Inteligencia ($75.00 USD) | Your Flights LLC",
      ogDescription: "Análisis de seguridad, requisitos de cumplimiento e informes de etiqueta cultural.",
      canonicalUrl: "https://yourflightsllc.com/es/destination-research"
    },
    strategy_prep: {
      title: "Asistencia de Preparación Pre-Estrategia ($50.00 USD) | Your Flights LLC",
      description: "Asistencia experta de preparación pre-estrategia ($50.00 USD) con estrategias de equipaje, manejo de divisas, aplicaciones de servicios y normas de seguridad.",
      keywords: "preparación pre-estrategia, guía de equipaje, cambio de divisas, apps de servicios",
      ogTitle: "Asistencia de Preparación Pre-Estrategia ($50.00 USD) | Your Flights LLC",
      ogDescription: "Guías de equipaje, estrategias de divisas, servicios móvil y consejos de salud y seguridad.",
      canonicalUrl: "https://yourflightsllc.com/es/consulting-prep"
    },
    book_consult: {
      title: "Solicitar Sesión de Asistencia de Estrategia | 30 Minutos | Your Flights LLC",
      description: "Programe una sesión de descubrimiento de 30 minutos con Your Flights LLC para consejos personalizados de planificación, estrategias e investigación de destinos.",
      keywords: "solicitar llamada de estrategia, consulta de asesoría, reservar asesor de consultoría",
      ogTitle: "Solicitar Llamada de Asistencia de Estrategia | Your Flights LLC",
      ogDescription: "Hable directamente con un asesor experto para alinear sus objetivos de estrategia, presupuesto y necesidades.",
      canonicalUrl: "https://yourflightsllc.com/es/request-assistance"
    },
    terms: {
      title: "Términos de Servicio | Acuerdo de Asesoría de Consultoría | Your Flights LLC",
      description: "Lea nuestros Términos de Servicio. Your Flights LLC opera estrictamente como firma independiente de planificación y asesoría de consultoría. Tarifas únicas fijas; sin venta de boletos ni reservas de hotel.",
      keywords: "términos de servicio, acuerdo de asesoría de consultoría, contrato de consultoría independiente",
      ogTitle: "Términos de Servicio | Your Flights LLC",
      ogDescription: "Términos legales oficiales de los servicios independientes de asesoría y planificación de consultoría de Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/terms"
    },
    privacy: {
      title: "Política de Privacidad y Divulgaciones PCI-DSS | Your Flights LLC",
      description: "Nuestra Política de Privacidad describe cómo Your Flights LLC protege los datos usando el procesamiento de pagos cifrado Stripe PCI-DSS.",
      keywords: "política de privacidad, seguridad PCI-DSS, protección de datos Stripe",
      ogTitle: "Política de Privacidad y PCI-DSS | Your Flights LLC",
      ogDescription: "Políticas transparentes de protección de datos y procesamiento de pagos cifrados Stripe.",
      canonicalUrl: "https://yourflightsllc.com/es/privacy"
    },
    refund: {
      title: "Política de Reembolso y Cancelación (Garantía de 24 Horas) | Your Flights LLC",
      description: "Consulte nuestra política transparente de reembolso de 24 horas previas y entregables digitales para paquetes de asistencia de estrategia ($50.00 USD - $150.00 USD).",
      keywords: "política de reembolso, política de cancelación, reembolso de 24 horas, garantía de revisión",
      ogTitle: "Política de Reembolso y Cancelación | Your Flights LLC",
      ogDescription: "Reglas de cancelación de 24 horas y garantías de revisión para entregables de asesoría.",
      canonicalUrl: "https://yourflightsllc.com/es/refund-policy"
    },
    compliance: {
      title: "Aviso de Clasificación de Servicio y Cumplimiento | Your Flights LLC",
      description: "Declaración de transparencia de Your Flights LLC. Ofrecemos servicios independientes de asesoría y consultoría de consultoría. Tarifas únicas: $150.00 USD · $75.00 USD · $50.00 USD. Sin venta de licencias de software.",
      keywords: "cumplimiento de asesoría de consultoría, aviso de consultoría independiente, transparencia de servicio",
      ogTitle: "Aviso de Clasificación de Servicio y Cumplimiento | Your Flights LLC",
      ogDescription: "Declaración completa de transparencia de los servicios independientes de asesoría de consultoría de Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/compliance"
    },
    guides: {
      title: "Guías y Perspectivas de Asesoría de Consultoría | Your Flights LLC",
      description: "Explore consejos expertos de estrategia, guías de etiqueta cultural, listas de equipaje e investigación de destinos preparados por Your Flights LLC.",
      keywords: "guías de estrategia, consejos de etiqueta cultural, lista de equipaje, investigación de destinos",
      ogTitle: "Guías y Perspectivas de Asesoría de Consultoría | Your Flights LLC",
      ogDescription: "Consejos de alto valor, guías de etiqueta cultural y listas de preparación pre-estrategia para viajeros.",
      canonicalUrl: "https://yourflightsllc.com/es/guides"
    },
    admin: {
      title: "Panel de Administración | Your Flights LLC",
      description: "Panel de administración interna para el personal de Your Flights LLC.",
      keywords: "admin, personal, interno",
      ogTitle: "Panel de Administración | Your Flights LLC",
      ogDescription: "Portal del personal.",
      canonicalUrl: "https://yourflightsllc.com/es/admin"
    },
    acknowledge: {
      title: "Reconocer Términos de Asesoría | Your Flights LLC",
      description: "Reconozca oficialmente el recibo de los detalles de su asesoría de consultoría y confirme su acuerdo con los términos de servicio proporcionados por Your Flights LLC.",
      keywords: "reconocimiento de asesoría, reconocimiento de términos, Your Flights LLC",
      ogTitle: "Reconocer Términos de Asesoría | Your Flights LLC",
      ogDescription: "Confirme el recibo y el acuerdo con sus términos de asesoría de consultoría de Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/acknowledge"
    },
    cancellation: {
      title: "Política de Cancelación | Your Flights LLC",
      description: "Lea la política de cancelación de los servicios de asesoría de consultoría de Your Flights LLC.",
      keywords: "política de cancelación, Your Flights LLC",
      ogTitle: "Política de Cancelación | Your Flights LLC",
      ogDescription: "Política de cancelación y términos de Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/cancellation-policy"
    },
    shipping: {
      title: "Política de Envío | Your Flights LLC",
      description: "Lea la política de envío para los servicios digitales de Your Flights LLC.",
      keywords: "política de envío, entrega digital, Your Flights LLC",
      ogTitle: "Política de Envío | Your Flights LLC",
      ogDescription: "Política de envío y entrega digital de Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/es/shipping-policy"
    },
    'payu-checkout': {
      title: 'Secure Checkout Transfer',
      description: 'Redirecting to secure gateway.',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      canonicalUrl: '',
    }
  }
};

export function SEOManager({ currentPage, locale }: SEOProps) {
  useEffect(() => {
    const seoData = seoTranslations[locale]?.[currentPage] || seoTranslations['en'].home;

    // 1. Update HTML lang
    document.documentElement.lang = locale;

    // 2. Update Document Title
    document.title = seoData.title;

    // Helper to set meta tags
    const setMetaTag = (selector: string, attributeName: string, attributeVal: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attributeName, attributeVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper to set link tags
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let tag = document.querySelector(selector) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        if (hreflang) tag.setAttribute('hreflang', hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // Helper to set or update jsonld script
    const setJsonLd = (id: string, data: object | null) => {
      let script = document.querySelector(`#${id}`) as HTMLScriptElement | null;
      if (!data) {
        if (script) script.remove();
        return;
      }
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    // 3. Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', seoData.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seoData.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('meta[name="merchant.mcc"]', 'name', 'merchant.mcc', '7299, 8999');

    // 4. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seoData.ogTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seoData.ogDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', currentPage === 'guides' ? 'article' : 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Your Flights LLC');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', seoData.canonicalUrl);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', locale === 'es' ? 'es_ES' : 'en_US');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=630&q=80');
    setMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'Your Flights LLC Professional Consulting Advisory');

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', seoData.ogTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', seoData.ogDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&h=630&q=80');

    // 6. Canonical & Hreflang
    const baseUrl = 'https://yourflightsllc.com';
    const pagePath = seoData.canonicalUrl.replace(baseUrl, '').replace(/^\/es/, '') || '/';
    setLinkTag('canonical', seoData.canonicalUrl);
    setLinkTag('alternate', `${baseUrl}${pagePath === '/' ? '' : pagePath}`, 'en');
    setLinkTag('alternate', `${baseUrl}/es${pagePath === '/' ? '' : pagePath}`, 'es');
    setLinkTag('alternate', `${baseUrl}${pagePath === '/' ? '' : pagePath}`, 'x-default');

    // 7. Schema.org Organization & ConsultingService
    const organizationJsonLd = {
      "@context": "https://schema.org",
      "@type": ["ConsultingService", "ProfessionalService", "Organization"],
      "@id": "https://yourflightsllc.com/#organization",
      "name": "Your Flights",
      "legalName": "Your Flights LLC",
      "url": "https://yourflightsllc.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourflightsllc.com/logo.png",
        "caption": "Your Flights LLC Logo"
      },
      "description": "Professional consulting advisory firm specializing in custom strategy design, market intelligence research, and pre-engagement consulting. Advisory services only; no consulting services or vendor contracts are sold.",
      "provider": {
        "@type": "Organization",
        "name": "Your Flights LLC",
        "legalName": "Your Flights LLC"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "30 N Gould St Ste R",
        "addressLocality": "Sheridan",
        "addressRegion": "WY",
        "postalCode": "82801",
        "addressCountry": "US"
      },
      "location": {
        "@type": "Place",
        "name": "Global Operations Center",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "E-1/149 Jaitpur Extn Part-1, Badarpur",
          "addressLocality": "Delhi",
          "addressRegion": "Delhi",
          "postalCode": "110044",
          "addressCountry": "IN"
        }
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 44.7972,
        "longitude": -106.9562
      },
      "telephone": "USA +1 (810) 505-5186",
      "email": "support@yourflightsllc.com",
      "priceRange": "$50.00 USD - $150.00 USD",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Credit Card, Debit Card, Visa, Mastercard, American Express, Discover, Stripe",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Consulting Advisory & Consulting Services Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "@id": "https://yourflightsllc.com/custom-strategies#offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Strategy Advisory & Assistance Package",
              "description": "Bespoke day-by-day strategy planning, 1-on-1 strategy sessions, and digital strategy access. Fixed one-time fee: $150.00 USD.",
              "category": "Consulting Consulting"
            },
            "price": "150.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://yourflightsllc.com/custom-strategies",
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          },
          {
            "@type": "Offer",
            "@id": "https://yourflightsllc.com/destination-research#offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Market Research & Intelligence Assistance Report",
              "description": "In-depth compliance rules, entry guidance, local safety analysis, and hidden gem curation. Fixed one-time fee: $75.00 USD.",
              "category": "Consulting Research"
            },
            "price": "75.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://yourflightsllc.com/destination-research",
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          },
          {
            "@type": "Offer",
            "@id": "https://yourflightsllc.com/consulting-prep#offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pre-Engagement Preparation Assistance Advisory",
              "description": "Packing strategies, currency advice, mobile transit setup, and compliance/risk rules. Fixed one-time fee: $50.00 USD.",
              "category": "Consulting Logistics"
            },
            "price": "50.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://yourflightsllc.com/consulting-prep",
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          }
        ]
      }
    };
    setJsonLd('jsonld-schema', organizationJsonLd);

    // 8. Specific Product & Service Schema (For Service Pages)
    if (currentPage === 'custom_strategies' || currentPage === 'market_research' || currentPage === 'strategy_prep') {
      let serviceItem: any = null;
      if (currentPage === 'custom_strategies') {
        serviceItem = {
          "@context": "https://schema.org",
          "@type": ["Product", "Service"],
          "@id": "https://yourflightsllc.com/custom-strategies#product",
          "name": "Custom Strategy Advisory & Planning Package ($150.00 USD)",
          "description": "Bespoke day-by-day strategy planning, 1-on-1 strategy sessions, and digital strategy access. Fixed one-time fee: $150.00 USD. Advisory services only; no consulting services sold.",
          "category": "Consulting Advisory & Custom Strategy Design",
          "brand": {
            "@type": "Brand",
            "name": "Your Flights LLC"
          },
          "offers": {
            "@type": "Offer",
            "price": "150.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2027-12-31",
            "url": "https://yourflightsllc.com/custom-strategies",
            "seller": {
              "@type": "Organization",
              "name": "Your Flights LLC",
              "telephone": "USA +1 (810) 505-5186"
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.95",
            "reviewCount": "128"
          }
        };
      } else if (currentPage === 'market_research') {
        serviceItem = {
          "@context": "https://schema.org",
          "@type": ["Product", "Service"],
          "@id": "https://yourflightsllc.com/destination-research#product",
          "name": "Market Research & Intelligence Report ($75.00 USD)",
          "description": "In-depth market research assistance covering compliance rules, safety reports, cultural norms, and hidden gems. Fixed one-time fee: $75.00 USD.",
          "category": "Destination Intelligence & Research",
          "brand": {
            "@type": "Brand",
            "name": "Your Flights LLC"
          },
          "offers": {
            "@type": "Offer",
            "price": "75.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2027-12-31",
            "url": "https://yourflightsllc.com/destination-research",
            "seller": {
              "@type": "Organization",
              "name": "Your Flights LLC",
              "telephone": "USA +1 (810) 505-5186"
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.92",
            "reviewCount": "94"
          }
        };
      } else if (currentPage === 'strategy_prep') {
        serviceItem = {
          "@context": "https://schema.org",
          "@type": ["Product", "Service"],
          "@id": "https://yourflightsllc.com/consulting-prep#product",
          "name": "Pre-Engagement Preparation Advisory ($50.00 USD)",
          "description": "Expert pre-engagement preparation assistance covering minimalist packing, currency management, transit apps, and safety rules. Fixed one-time fee: $50.00 USD.",
          "category": "Pre-Engagement Strategy Preparation",
          "brand": {
            "@type": "Brand",
            "name": "Your Flights LLC"
          },
          "offers": {
            "@type": "Offer",
            "price": "50.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2027-12-31",
            "url": "https://yourflightsllc.com/consulting-prep",
            "seller": {
              "@type": "Organization",
              "name": "Your Flights LLC",
              "telephone": "USA +1 (810) 505-5186"
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "merchantReturnLink": "https://yourflightsllc.com/refund-policy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 1,
              "applicableCountry": "US"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.89",
            "reviewCount": "76"
          }
        };
      }
      setJsonLd('jsonld-product-schema', serviceItem);
    } else {
      setJsonLd('jsonld-product-schema', null);
    }

    // 9. Schema.org Articles Collection Schema for Strategy Guides
    if (currentPage === 'guides') {
      const articlesData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://yourflightsllc.com/guides#collection",
        "name": "Consulting Advisory Insights & Destination Intelligence Guides",
        "description": "Curated collection of professional strategy planning insights, cultural etiquette guides, and transit checklists by Your Flights LLC.",
        "url": "https://yourflightsllc.com/guides",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": consultingGuidesData.map((guide, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "Article",
              "headline": guide.title,
              "description": guide.summary,
              "articleSection": guide.category,
              "author": {
                "@type": "Organization",
                "name": "Your Flights LLC Consulting Advisory Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Your Flights LLC",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://yourflightsllc.com/logo.png"
                }
              },
              "mainEntityOfPage": `https://yourflightsllc.com/guides#${guide.id}`
            }
          }))
        }
      };
      setJsonLd('jsonld-article-schema', articlesData);
    } else {
      setJsonLd('jsonld-article-schema', null);
    }

    // 10. Schema.org FAQPage Structured Data
    const currentFaq = translations[locale]?.faq || translations['en'].faq;
    const faqJsonLdData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://yourflightsllc.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": currentFaq.q1,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a1
          }
        },
        {
          "@type": "Question",
          "name": currentFaq.q2,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a2
          }
        },
        {
          "@type": "Question",
          "name": currentFaq.q3,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a3
          }
        },
        {
          "@type": "Question",
          "name": currentFaq.q4,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a4
          }
        },
        ...(currentFaq.q5 ? [{
          "@type": "Question",
          "name": currentFaq.q5,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a5
          }
        }] : []),
        ...(currentFaq.q6 ? [{
          "@type": "Question",
          "name": currentFaq.q6,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": currentFaq.a6
          }
        }] : [])
      ]
    };
    setJsonLd('jsonld-faq-schema', faqJsonLdData);

    // 11. Schema.org BreadcrumbList Structured Data
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yourflightsllc.com/"
      }
    ];

    if (currentPage !== 'home') {
      const pageTitleShort = seoData.title.split('|')[0].trim();
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageTitleShort,
        "item": seoData.canonicalUrl
      });
    }

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    };
    setJsonLd('jsonld-breadcrumb-schema', breadcrumbData);

  }, [currentPage, locale]);

  return null;
}

