const fs = require('fs');
const content = fs.readFileSync('src/components/Pages.tsx', 'utf8');
const regex = /function\s+([a-zA-Z0-9_]+)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(match[1]);
}
