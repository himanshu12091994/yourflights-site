const fs = require('fs');

function replace(file, search, rep) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.split(search).join(rep);
    fs.writeFileSync(file, content, 'utf8');
}

let f = 'src/translations.ts';

replace(f, '$150.00 USD', '₹12,500 INR');
replace(f, '$75.00 USD', '₹6,000 INR');
replace(f, '$50.00 USD', '₹4,000 INR');
