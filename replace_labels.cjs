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
    { search: 'US Registered Address (Physical):', replace: 'US Legal Address :' },
    { search: 'Aadhar Address: [Placeholder]', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA' },
    { search: 'Customer Support Phone:</strong> +91-8826219438', replace: 'Customer Support Phone:</strong> IN +91-8826219438 and USA +1 (810) 505-5186' },
    { search: '+91-8826219438', replace: 'IN +91-8826219438 and USA +1 (810) 505-5186' },
    { search: '>Registered Address<', replace: '>US Legal Address :<' },
    { search: 'Registered Address: 30 N Gould', replace: 'US Legal Address : 30 N Gould' },
    { search: 'US Registered Address', replace: 'US Legal Address :' },
    { search: 'USA +1 (810) 505-5186 and IN IN +91-8826219438 and USA +1 (810) 505-5186', replace: 'IN +91-8826219438 and USA +1 (810) 505-5186' },
    { search: 'USA +1 (810) 505-5186 and IN+91-8826219438', replace: 'IN +91-8826219438 and USA +1 (810) 505-5186' },
    { search: 'USA +1 (810) 505-5186 and IN IN+91-8826219438', replace: 'IN +91-8826219438 and USA +1 (810) 505-5186' }
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
