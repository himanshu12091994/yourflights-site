const fs = require('fs');

let content = fs.readFileSync('src/components/Pages.tsx', 'utf8');

const disclaimerHTML = `
      {/* Currency Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 mb-8 shadow-sm">
        <div className="flex items-center space-x-3 text-blue-900 border-b border-blue-200 pb-3">
          <h2 className="text-xl font-bold">Supported Currencies</h2>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          We securely accept and process payments in both <strong>US Dollars (USD)</strong> and <strong>Indian Rupees (INR)</strong>. 
          All international transactions are fully supported.
        </p>
      </div>
`;

// Inject after PageHeader in AboutUsPage, ContactPage, and LegalPageLayout
// We can find the exact spots. 
// AboutUsPage:
content = content.replace(
  /(<PageHeader\s+onBack=\{onBack\}\s+title=\{pageT\.title \|\| "Welcome to Your Flights"\}\s+subtitle="Bespoke Day-by-Day Strategies, Deep Market Research & Pre-Departure Consulting"\s+badgeText="Your Flights \(operated by Your Flights LLC\)"\s+backText=\{t\.pages\.backToHome\}\s+mccBadgeText=\{t\.pages\.mccBadge\}\s+\/>)/,
  `$1\n${disclaimerHTML}`
);

// ContactPage:
content = content.replace(
  /(<PageHeader \s+onBack=\{onBack\} \s+title=\{pageT\.title\} \s+subtitle=\{pageT\.subtitle\} \s+badgeText=\{pageT\.badge\} \s+backText=\{t\.pages\.backToHome\}\s+mccBadgeText=\{t\.pages\.mccBadge\}\s+\/>)/,
  `$1\n${disclaimerHTML}`
);

// LegalPageLayout:
content = content.replace(
  /(<PageHeader\s+onBack=\{onBack\}\s+title=\{title\}\s+subtitle=\{subtitle\}\s+badgeText=\{badgeText\}\s+backText=\{backText\}\s+mccBadgeText=\{mccBadgeText\}\s+\/>)/,
  `$1\n${disclaimerHTML}`
);

fs.writeFileSync('src/components/Pages.tsx', content, 'utf8');
console.log('Injected Currency Disclaimer');
