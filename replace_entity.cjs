const fs = require('fs');

function replace(file, search, rep) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    content = content.split(search).join(rep);
    fs.writeFileSync(file, content, 'utf8');
}

let f = 'src/translations.ts';

replace(f, 'Your Flights LLC', 'Himanshu Kumar');
