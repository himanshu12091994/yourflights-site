// ─────────────────────────────────────────────────────────────
// Application-wide constants — single source of truth.
// Change prices, contact info, MCC codes, and descriptors here.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  DBA: 'Your Flights',
  LEGAL_ENTITY: 'Your Flights LLC Operated By Himanshu Kumar',
  DOMAIN: 'yourflightsllc.com',
  WEBSITE: 'https://yourflightsllc.com',
} as const;

export const CONTACT = {
  PHONE: 'USA +1 (810) 505-5186',
  PHONE_RAW: '8826219438',
  EMAIL: 'support@yourflightsllc.com',
  ADDRESS: '30 N Gould St Ste R, Sheridan, WY, 82801, USA',
  GLOBAL_OPS_ADDRESS: 'E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi, Delhi 110044 INDIA',
} as const;

export const MCC = {
  PRIMARY: '7299',
  PRIMARY_LABEL: 'MCC 8999 (Personal Concierge / Professional Services)',
  SECONDARY: '8999',
  SECONDARY_LABEL: 'MCC 8999 (Professional Services / Independent Consulting)',
} as const;

export const STATEMENT_DESCRIPTOR = {
  FULL: 'YOUR FLIGHTS ADVISORY',
  DOMAIN: 'YOURFLIGHTSLLC.COM',
  SUFFIX: 'ADVISORY',
} as const;

export const SERVICES = {
  STRATEGY: {
    NAME: 'Custom Strategy Advisory & Planning Package',
    PRICE_USD: 15000,
    PRICE_STR: '₹12,500 INR ($150.00 USD)',
    SERVICE_KEY: 'Custom Strategy Advisory & Assistance (₹12,500 INR ($150.00 USD))',
    DELIVERABLE: 'Consulting Advisory Deliverable - Custom Day-by-Day Strategy Planning Strategy',
    ROUTE: '/custom-strategies',
  },
  RESEARCH: {
    NAME: 'Market Research & Intelligence Report',
    PRICE_USD: 7500,
    PRICE_STR: '₹6,000 INR ($75.00 USD)',
    SERVICE_KEY: 'Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))',
    DELIVERABLE: 'Consulting Advisory Deliverable - Market Research Report',
    ROUTE: '/destination-research',
  },
  PREP: {
    NAME: 'Pre-Engagement Strategy Preparation Advisory',
    PRICE_USD: 5000,
    PRICE_STR: '₹4,000 INR ($50.00 USD)',
    SERVICE_KEY: 'Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))',
    DELIVERABLE: 'Consulting Advisory Deliverable - Pre-Engagement Strategy Prep & Safety Advisory',
    ROUTE: '/consulting-prep',
  },
} as const;

export const PAGE_URLS: Record<string, string> = {
  home: '/',
  about: '/about',
  contact: '/contact',
  custom_strategies: '/custom-strategies',
  market_research: '/destination-research',
  strategy_prep: '/consulting-prep',
  book_consult: '/request-assistance',
  terms: '/terms',
  privacy: '/privacy',
  refund: '/refund-policy',
  cancellation: '/cancellation-policy',
  shipping: '/shipping-policy',
  compliance: '/compliance',
  guides: '/guides',
};
