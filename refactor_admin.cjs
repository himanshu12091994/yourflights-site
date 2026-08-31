const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboardPage.tsx', 'utf-8');

// 1. Replace VirtualTerminalForm import with CashfreeCheckoutForm
content = content.replace(
  "import { VirtualTerminalForm } from './VirtualTerminalForm';",
  "import { CashfreeCheckoutForm } from './CashfreeCheckoutForm';\nimport { motion, AnimatePresence } from 'motion/react';"
);

// 2. Update login screen style
content = content.replace(
    'return (\n      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4">\n        <div className="max-w-sm w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">',
    'return (\n      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">\n        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>\n        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl text-center relative z-10">'
);
content = content.replace(
    '<p className="text-[10px] text-slate-600 mt-6 font-mono">MCC 8999 / 8999 Compliance Active</p>\n        </div>\n      </div>',
    '<p className="text-[10px] text-slate-600 mt-6 font-mono">MCC 8999 / 8999 Compliance Active</p>\n        </motion.div>\n      </div>'
);

// 3. Split the file right before the MAIN APPLICATION render
const match = content.match(/\/\/\s*[─]+[\r\n]+\s*\/\/\s*2\. MAIN APPLICATION \(Orders & Payments\)[\r\n]+\s*\/\/\s*[─]+[\r\n]+\s*return \(/);

if (!match) {
    console.error("Could not find the split marker. Available text around 2. MAIN APPLICATION:");
    const idx = content.indexOf('2. MAIN APPLICATION');
    console.log(content.substring(idx - 100, idx + 100));
    process.exit(1);
}

const splitIndex = match.index;
let topHalf = content.substring(0, splitIndex);

// Read the new UI from a separate file
const newUI = fs.readFileSync('new_ui_template.tsx', 'utf-8');

fs.writeFileSync('src/components/AdminDashboardPage.tsx', topHalf + newUI);
console.log('Successfully replaced AdminDashboardPage.tsx UI');
