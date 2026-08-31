const fs = require('fs');
function replace(file, search, rep) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.split(search).join(rep);
    fs.writeFileSync(file, content, 'utf8');
}

let f = 'src/translations.ts';

// English
replace(f, 'title2: "Destination Intelligence"', 'title2: "Market Intelligence"');
replace(f, 'your specific destination', 'your target market');
replace(f, 'In-Depth Destination Report', 'In-Depth Market Report');
replace(f, 'Custom Destination Guide', 'Custom Market Guide');
replace(f, 'destination and consulting style', 'target market and focus area');
replace(f, 'destination preferences', 'target market preferences');
replace(f, 'Destination Questions', 'Market Questions');
replace(f, 'destination goals', 'market goals');
replace(f, 'destinationResearchDetail:', 'marketResearchDetail:');
replace(f, 'your destination', 'your target market');
replace(f, 'Destination-specific', 'Market-specific');
replace(f, 'destinationResearch:', 'marketResearch:');
replace(f, 'destination weather', 'local market conditions');
replace(f, 'destination ideas', 'target market ideas');
replace(f, 'Target Destination &', 'Target Market &');
replace(f, 'Destination Guides', 'Market Guides');
replace(f, 'destination advice', 'market advice');
replace(f, 'category: "Destination Intelligence"', 'category: "Market Intelligence"');
replace(f, 'destinationResearch', 'marketResearch'); // catch-all key change
replace(f, 'travelPrep', 'consultingPrep'); // catch-all key change

// Spanish
replace(f, 'Investigación de Destino', 'Investigación de Mercado');

// pdfTemplates.ts
let p = 'src/data/pdfTemplates.ts';
replace(p, 'PHASE 1: RESEARCH & FLIGHT ANALYSIS', 'PHASE 1: RESEARCH & VENDOR ANALYSIS');
replace(p, 'PHASE 2: DESTINATION & ACCOMMODATION STRATEGY', 'PHASE 2: MARKET & LOGISTICS STRATEGY');
replace(p, 'destination_dossier.pdf', 'market_dossier.pdf');

// useCheckout.ts
let c = 'src/hooks/useCheckout.ts';
replace(c, 'destinationResearch', 'marketResearch');
replace(c, 'travelPrep', 'consultingPrep');

// Pages.tsx
let pg = 'src/components/Pages.tsx';
replace(pg, 'destinationResearch', 'marketResearch');
replace(pg, 'travelPrep', 'consultingPrep');
