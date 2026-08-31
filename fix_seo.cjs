const fs = require('fs');

let content = fs.readFileSync('src/components/SEOManager.tsx', 'utf8');

if (!content.includes("'cashfree-checkout': {", 0)) {
  console.log("Not found anywhere.");
}

// Let's just append it to 'shipping' for en
const shippingEnStr = `shipping: {
      title: "Shipping Policy | Your Flights LLC",
      description: "Read the shipping policy for digital services from Your Flights LLC.",
      keywords: "shipping policy, digital delivery, Your Flights LLC",
      ogTitle: "Shipping Policy | Your Flights LLC",
      ogDescription: "Shipping and digital delivery policy for Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/shipping-policy"
    }`;

const newShippingEnStr = `shipping: {
      title: "Shipping Policy | Your Flights LLC",
      description: "Read the shipping policy for digital services from Your Flights LLC.",
      keywords: "shipping policy, digital delivery, Your Flights LLC",
      ogTitle: "Shipping Policy | Your Flights LLC",
      ogDescription: "Shipping and digital delivery policy for Your Flights LLC.",
      canonicalUrl: "https://yourflightsllc.com/shipping-policy"
    },
    'cashfree-checkout': {
      title: 'Secure Checkout Transfer',
      description: 'Redirecting to secure gateway.',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      canonicalUrl: '',
    }`;

content = content.replace(shippingEnStr, newShippingEnStr);

fs.writeFileSync('src/components/SEOManager.tsx', content, 'utf8');
console.log('Fixed SEOManager en');
