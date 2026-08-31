const fs = require('fs');
let content = fs.readFileSync('src/translations.ts', 'utf8');

// First, strip them all to reset
const stripRegex = /shippingTitle:\s*"[^"]*",\s*shippingContent:\s*\[[\s\S]*?\],\s*cancellationTitle:\s*"[^"]*",\s*cancellationContent:\s*\[[\s\S]*?\],\s*/g;
content = content.replace(stripRegex, '');

// Now replace EVERY complianceTitle block with shipping + cancellation + complianceTitle
content = content.replace(
  /(complianceTitle:\s*".*?")/g,
  `shippingTitle: "Shipping Policy",
      shippingContent: [
        "1. DELIVERY TIMEFRAME: Digital delivery within 3-5 business days."
      ],
      cancellationTitle: "Cancellation Policy",
      cancellationContent: [
        "1. CANCELLATION: Cancellations permitted up to 24 hours in advance."
      ],
      $1`
);

fs.writeFileSync('src/translations.ts', content, 'utf8');
console.log('Done injecting generically.');
