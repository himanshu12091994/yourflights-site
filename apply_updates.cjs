const fs = require('fs');

// 1. Update translations.ts
let tContent = fs.readFileSync('src/translations.ts', 'utf8');

// Update Privacy Policy
tContent = tContent.replace(
  /"8\. CONTACT INFORMATION: If you have any questions or concerns about this Privacy Policy or our data handling practices, please contact our Data Protection Officer at support@yourflightsllc\.com or by calling USA \+1 \(810\) 505-5186\."/,
  `"8. CONTACT INFORMATION: If you have any questions or concerns about this Privacy Policy or our data handling practices, please contact our Data Protection Officer at support@yourflightsllc.com or by calling USA +1 (810) 505-5186.",
        "9. POLICY UPDATES: This Privacy Policy may be updated periodically to reflect changes in our practices. Clients will be notified of significant changes via email."`
);

// Update Refund Policy
tContent = tContent.replace(
  /"2\. ADVISORY SESSION CANCELLATIONS: For services involving a scheduled 1-on-1 advisory session \(video or phone consultation\), clients may cancel or reschedule their appointment up to 24 hours prior to the scheduled start time\. Cancellations made with at least 24 hours' notice are eligible for a 100% full refund of prepaid advisory fees\."/,
  `"2. ADVISORY SESSION CANCELLATIONS: For services involving a scheduled 1-on-1 advisory session, clients may cancel or reschedule their appointment up to 24 hours prior to the scheduled start time. Cancellations made with at least 24 hours' notice are eligible for a 100% full refund of prepaid advisory fees. Approved refunds are credited back to the original method of payment within 5 to 10 business days."`
);

// Add Shipping Policy to translations
// Wait, translations.ts doesn't have shippingTitle and shippingContent. Let's add them.
tContent = tContent.replace(
  /refundContent:\s*\[[\s\S]*?\],\s*complianceTitle:/,
  function(match) {
    return match.replace(/],\s*complianceTitle:/, `],
      shippingTitle: "Shipping & Delivery Policy",
      shippingContent: [
        "1. DIGITAL DELIVERY ONLY: Your Flights LLC Operated By Himanshu Kumar provides exclusively digital consulting deliverables and advisory services. We do not manufacture, sell, or ship any physical goods.",
        "2. DELIVERY TIMEFRAME: All custom deliverables, including Day-by-Day Strategies, Market Research Reports, and Prep Guides, are delivered electronically via secure email within 3 to 5 business days following the completion of your initial advisory session or upon receipt of your completed intake questionnaire.",
        "3. EXPEDITED DELIVERY: If you require expedited digital delivery, please contact our support team prior to purchasing to confirm availability. Expedited timelines may incur additional consulting fees.",
        "4. ACCEPTANCE OF DELIVERY: A digital deliverable is considered 'delivered' and accepted once it is successfully transmitted to the email address provided during checkout. It is the client's responsibility to ensure their email address is accurate and capable of receiving digital attachments."
      ],
      cancellationTitle: "Cancellation Policy",
      cancellationContent: [
        "1. CANCELLATION TIMEFRAME: Clients may cancel their purchase of any consulting package for a full refund provided the cancellation request is received at least 24 hours prior to any scheduled 1-on-1 advisory session or before any bespoke research work has commenced.",
        "2. HOW TO CANCEL: To cancel, please email support@yourflightsllc.com with your order details. Requests must explicitly state the intention to cancel.",
        "3. LATE CANCELLATIONS: Cancellations made less than 24 hours before a scheduled session, or after custom research has officially begun, are strictly non-refundable due to the labor-intensive nature of our preparation.",
        "4. NO-SHOWS: Failure to attend a scheduled advisory session without prior 24-hour notice is considered a no-show and forfeits the right to any refund or complimentary rescheduling."
      ],
      complianceTitle:`);
  }
);

// Also need to ensure Modals interface has shippingTitle, shippingContent, cancellationTitle, cancellationContent if using typescript, but it's just an object so it's fine.

// Update About Us
tContent = tContent.replace(
  /"Your Flights LLC Operated By Himanshu Kumar is a enterprise-focused consulting advisory and market intelligence service\. We specialize in helping clients design custom, tailored strategies and prepare for seamless consulting experiences worldwide\."/,
  `"Your Flights LLC Operated By Himanshu Kumar is a premier enterprise-focused consulting advisory and market intelligence service. With a deep commitment to independent, unbiased strategy planning, we specialize in helping discerning clients design custom, tailored strategies and prepare for seamless consulting experiences worldwide. Our team consists of seasoned strategy experts dedicated to providing meticulous research, ensuring every detail of your project is optimized for success, safety, and efficiency."`
);

// Update Dual Currencies
// In translations.ts: replace "$150.00 USD" with "₹12,500 INR ($150.00 USD)", "$75.00 USD" with "₹6,000 INR ($75.00 USD)", "$50.00 USD" with "₹4,000 INR ($50.00 USD)"
// Be careful not to double replace.
const currencyReplacements = [
  { search: /\$150\.00 USD/g, replace: '₹12,500 INR ($150.00 USD)' },
  { search: /\$150\.00/g, replace: '₹12,500 INR ($150.00 USD)' }, // If there are naked ones
  { search: /\$75\.00 USD/g, replace: '₹6,000 INR ($75.00 USD)' },
  { search: /\$75\.00/g, replace: '₹6,000 INR ($75.00 USD)' },
  { search: /\$50\.00 USD/g, replace: '₹4,000 INR ($50.00 USD)' },
  { search: /\$50\.00/g, replace: '₹4,000 INR ($50.00 USD)' },
  { search: /US Dollars \(USD\)/g, replace: 'Indian Rupees (INR) and US Dollars (USD)' }
];

// Clean up first if they already exist
tContent = tContent.replace(/₹12,500 INR \(\₹12,500 INR \(\$150\.00 USD\)\)/g, '₹12,500 INR ($150.00 USD)');

for (let r of currencyReplacements) {
  tContent = tContent.replace(r.search, r.replace);
}

// Fix potential duplicates resulting from the crude regex above
tContent = tContent.replace(/₹12,500 INR \(₹12,500 INR \(\$150\.00 USD\) USD\)/g, '₹12,500 INR ($150.00 USD)');
tContent = tContent.replace(/₹12,500 INR \(\$150\.00 USD\) USD/g, '₹12,500 INR ($150.00 USD)');

fs.writeFileSync('src/translations.ts', tContent, 'utf8');

// 2. Update constants.ts
let cContent = fs.readFileSync('src/config/constants.ts', 'utf8');
cContent = cContent.replace(/PRICE_STR: '\$150\.00 USD'/g, `PRICE_STR: '₹12,500 INR ($150.00 USD)'`);
cContent = cContent.replace(/PRICE_STR: '\$75\.00 USD'/g, `PRICE_STR: '₹6,000 INR ($75.00 USD)'`);
cContent = cContent.replace(/PRICE_STR: '\$50\.00 USD'/g, `PRICE_STR: '₹4,000 INR ($50.00 USD)'`);

cContent = cContent.replace(/SERVICE_KEY: 'Custom Strategy Advisory & Assistance \(\$150\.00 USD\)'/g, `SERVICE_KEY: 'Custom Strategy Advisory & Assistance (₹12,500 INR ($150.00 USD))'`);
cContent = cContent.replace(/SERVICE_KEY: 'Market Research & Intelligence Assistance \(\$75\.00 USD\)'/g, `SERVICE_KEY: 'Market Research & Intelligence Assistance (₹6,000 INR ($75.00 USD))'`);
cContent = cContent.replace(/SERVICE_KEY: 'Pre-Engagement Preparation Assistance \(\$50\.00 USD\)'/g, `SERVICE_KEY: 'Pre-Engagement Preparation Assistance (₹4,000 INR ($50.00 USD))'`);
fs.writeFileSync('src/config/constants.ts', cContent, 'utf8');

// 3. Update Pages.tsx
let pContent = fs.readFileSync('src/components/Pages.tsx', 'utf8');

// Replace pricing strings manually in Pages.tsx to be safe
const pagesReplacements = [
  { search: /\$150\.00 USD/g, replace: '₹12,500 INR ($150.00 USD)' },
  { search: /\$75\.00 USD/g, replace: '₹6,000 INR ($75.00 USD)' },
  { search: /\$50\.00 USD/g, replace: '₹4,000 INR ($50.00 USD)' },
  { search: /US Dollars \(USD\)/g, replace: 'Indian Rupees (INR) and US Dollars (USD)' }
];
for (let r of pagesReplacements) {
  pContent = pContent.replace(r.search, r.replace);
}

// Update the About Us hardcoded paragraph in Pages.tsx
pContent = pContent.replace(
  /"Your Flights \(operated by Your Flights LLC\) is a enterprise-focused consulting advisory and market intelligence service\. We specialize in helping clients design custom, tailored strategies and prepare for seamless consulting experiences worldwide\."/,
  `"Your Flights (operated by Your Flights LLC) is a premier enterprise-focused consulting advisory and market intelligence service. With a deep commitment to independent, unbiased strategy planning, we specialize in helping discerning clients design custom, tailored strategies and prepare for seamless consulting experiences worldwide. Our team consists of seasoned strategy experts dedicated to providing meticulous research, ensuring every detail of your project is optimized for success, safety, and efficiency."`
);

// We need to make sure ShippingPolicyPage and CancellationPolicyPage in Pages.tsx read from the new translation keys.
// By default, they might be using generic placeholders or reading from something else. Let's see how they are structured.
pContent = pContent.replace(
  /export function CancellationPolicyPage\(\{ t, onBack, onCheckout, onNavigate \}: PageProps\) \{\s*return \(\s*<LegalPageLayout\s*title="Cancellation Policy"\s*subtitle="Details regarding service cancellations"\s*badgeText="Your Flights"\s*paragraphs=\{t\.modals\.refundContent \|\| \[\]\}\s*onBack=\{onBack\}\s*onCheckout=\{onCheckout\}\s*onNavigate=\{onNavigate\}\s*backText=\{t\.pages\.backToHome\}\s*mccBadgeText=\{t\.pages\.mccBadge\}\s*\/>\s*\);\s*\}/,
  `export function CancellationPolicyPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  return (
    <LegalPageLayout 
      title="Cancellation Policy" 
      subtitle="Details regarding service cancellations" 
      badgeText="Your Flights" 
      paragraphs={t.modals.cancellationContent || []} 
      onBack={onBack} 
      onCheckout={onCheckout} 
      onNavigate={onNavigate} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
    />
  );
}`
);

pContent = pContent.replace(
  /export function ShippingPolicyPage\(\{ t, onBack, onCheckout, onNavigate \}: PageProps\) \{\s*return \(\s*<LegalPageLayout\s*title="Shipping Policy"\s*subtitle="Delivery details for our digital consulting services"\s*badgeText="Your Flights"\s*paragraphs=\{t\.modals\.refundContent \|\| \[\]\}\s*onBack=\{onBack\}\s*onCheckout=\{onCheckout\}\s*onNavigate=\{onNavigate\}\s*backText=\{t\.pages\.backToHome\}\s*mccBadgeText=\{t\.pages\.mccBadge\}\s*\/>\s*\);\s*\}/,
  `export function ShippingPolicyPage({ t, onBack, onCheckout, onNavigate }: PageProps) {
  return (
    <LegalPageLayout 
      title="Shipping Policy" 
      subtitle="Delivery timeframe and details for our digital consulting deliverables" 
      badgeText="Your Flights" 
      paragraphs={t.modals.shippingContent || []} 
      onBack={onBack} 
      onCheckout={onCheckout} 
      onNavigate={onNavigate} 
      backText={t.pages.backToHome}
      mccBadgeText={t.pages.mccBadge}
    />
  );
}`
);

fs.writeFileSync('src/components/Pages.tsx', pContent, 'utf8');

// Update other components that might have hardcoded USD values
const otherComponents = [
  'src/components/CheckoutModal.tsx',
  'src/components/StartPlanningWizard.tsx',
  'src/components/ServicesExplorerModal.tsx',
  'src/components/modals/ServiceModals/CustomStrategyModal.tsx',
  'src/components/modals/ServiceModals/MarketResearchModal.tsx',
  'src/components/modals/ServiceModals/ConsultingPrepModal.tsx'
];

for (const file of otherComponents) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (let r of pagesReplacements) {
      content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(file, content, 'utf8');
  }
}

console.log('Applied updates for policies, About Us, and dual currency.');
