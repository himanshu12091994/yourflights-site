const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for CashfreeRedirectPage
content = content.replace(
  "import { AcknowledgePage } from './components/AcknowledgePage';",
  "import { AcknowledgePage } from './components/AcknowledgePage';\nimport { CashfreeRedirectPage } from './components/CashfreeRedirectPage';"
);

// 2. Add routing logic in useEffect
content = content.replace(
  "} else if (\n          pathname.includes('/acknowledge') ||",
  "} else if (pathname.includes('cashfree-checkout') || search.includes('page=cashfree-checkout')) {\n          setCurrentPage('cashfree-checkout');\n        } else if (\n          pathname.includes('/acknowledge') ||"
);

// 3. Render CashfreeRedirectPage in the main block
content = content.replace(
  "{currentPage === 'acknowledge' && (\n            <AcknowledgePage onNavigate={navigateTo} />\n          )}",
  "{currentPage === 'acknowledge' && (\n            <AcknowledgePage onNavigate={navigateTo} />\n          )}\n          {currentPage === 'cashfree-checkout' && (\n            <CashfreeRedirectPage />\n          )}"
);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Done updating App.tsx for Cashfree');
