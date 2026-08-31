const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboardPage.tsx', 'utf8');

const target = `<button type="button"
              onClick={() => {
                setActiveTab('payments');
                setSelectedOrderId(null);
              }}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer \${
                activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }\`}
            >
              Payments
            </button>
          </nav>`;

const replacement = `<button type="button"
              onClick={() => {
                setActiveTab('payments');
                setSelectedOrderId(null);
              }}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer \${
                activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }\`}
            >
              Payments
            </button>
            <button type="button"
              onClick={() => {
                setActiveTab('checkout');
                setSelectedOrderId(null);
              }}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer \${
                activeTab === 'checkout' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }\`}
            >
              Checkout (VT)
            </button>
          </nav>`;

if (content.includes(target)) {
  fs.writeFileSync('src/components/AdminDashboardPage.tsx', content.replace(target, replacement), 'utf8');
  console.log("Success");
} else {
  console.log("Target not found!");
}
