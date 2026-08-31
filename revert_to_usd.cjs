const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const replacements = [
    { search: '₹12,500.00 INR ($150.00 USD)', replace: '$150.00 USD' },
    { search: '₹12,500 INR ($150.00 USD)', replace: '$150.00 USD' },
    { search: '₹12,500 INR', replace: '$150.00 USD' },
    { search: '₹12,500', replace: '$150.00' },
    
    { search: '₹6,000.00 INR ($75.00 USD)', replace: '$75.00 USD' },
    { search: '₹6,000 INR ($75.00 USD)', replace: '$75.00 USD' },
    { search: '₹6,000 INR', replace: '$75.00 USD' },
    { search: '₹6,000', replace: '$75.00' },
    
    { search: '₹4,000.00 INR ($50.00 USD)', replace: '$50.00 USD' },
    { search: '₹4,000 INR ($50.00 USD)', replace: '$50.00 USD' },
    { search: '₹4,000 INR', replace: '$50.00 USD' },
    { search: '₹4,000', replace: '$50.00' },

    { search: 'PRICE_USD: 12500', replace: 'PRICE_USD: 15000' },
    { search: 'PRICE_USD: 6000', replace: 'PRICE_USD: 7500' },
    { search: 'PRICE_USD: 4000', replace: 'PRICE_USD: 5000' },
    
    { search: 'Indian Rupees (INR) and US Dollars (USD)', replace: 'United States Dollars (USD)' },
    { search: 'Indian Rupees (INR)', replace: 'US Dollars (USD)' },
    { search: 'in INR', replace: 'in USD' },
    { search: 'en INR', replace: 'en USD' },
    { search: 'rupias indias (INR)', replace: 'dólares estadounidenses (USD)' },
    { search: 'INR One-Time', replace: 'USD One-Time' }
];

walkDir('src', function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        for (let r of replacements) {
            content = content.split(r.search).join(r.replace);
        }
        
        // Final catch-all for (INR) just in case, but only where it makes sense
        content = content.replace(/\(INR\)/g, '(USD)');
        content = content.replace(/INR/g, 'USD');
        
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated ' + filePath);
        }
    }
});
