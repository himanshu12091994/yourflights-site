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
    { search: '$150.00 USD', replace: '₹12,500 INR' },
    { search: '$150.00', replace: '₹12,500' },
    { search: '150.00 USD', replace: '₹12,500 INR' },
    { search: '$75.00 USD', replace: '₹6,000 INR' },
    { search: '$75.00', replace: '₹6,000' },
    { search: '75.00 USD', replace: '₹6,000 INR' },
    { search: '$50.00 USD', replace: '₹4,000 INR' },
    { search: '$50.00', replace: '₹4,000' },
    { search: '50.00 USD', replace: '₹4,000 INR' },
    { search: 'in USD', replace: 'in INR' },
    { search: 'in US Dollars (USD)', replace: 'in Indian Rupees (INR)' },
    { search: '(USD)', replace: '(INR)' },
    { search: 'USD One-Time', replace: 'INR One-Time' },
    { search: 'United States Dollars (USD)', replace: 'Indian Rupees (INR)' },
    { search: 'dólares estadounidenses (USD)', replace: 'rupias indias (INR)' },
    { search: 'en USD', replace: 'en INR' },
    { search: 'PRICE_USD: 12500', replace: 'PRICE_USD: 12500' }, // Leave as is or maybe change? Actually we just change strings
    { search: '[Your Registered Aadhar Address Here]', replace: 'Aadhar Address: [Placeholder]' },
    { search: '[Your Global Operations Address Here]', replace: 'Global Operations: [Placeholder]' }
];

walkDir('src', function(filePath) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        for (let r of replacements) {
            content = content.split(r.search).join(r.replace);
        }
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated ' + filePath);
        }
    }
});
