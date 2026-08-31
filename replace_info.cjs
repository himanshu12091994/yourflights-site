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
    { search: '+1-810-505-5186', replace: 'USA +1 (810) 505-5186 and IN+91-8826219438' },
    { search: '30 N Gould St, Ste R, Sheridan, WY 82801, EE. UU.', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA' },
    { search: '30 N Gould St, Ste R, Sheridan, WY 82801 EE. UU.', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA' },
    { search: '30 N Gould St, Ste R, Sheridan, WY 82801', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA' },
    { search: '30 N Gould St, Ste R, Sheridan, WY 82801, USA (Your Consulting LLC)', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA (Your Flights LLC Operated By Himanshu Kumar)' },
    { search: '30 N Gould St Ste R, Sheridan, WY, 82801, USA.', replace: '30 N Gould St Ste R, Sheridan, WY, 82801, USA' },
    { search: '30 N Gould St, Ste R', replace: '30 N Gould St Ste R' }
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
