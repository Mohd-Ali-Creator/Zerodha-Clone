const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk('./src/landing_page');
allFiles.forEach(file => {
    if (file.endsWith('.js')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.trim() === '') {
            const fileName = path.basename(file, '.js');
            const boilerplate = `import React from 'react';

function ${fileName}() {
    return (
        <h1>${fileName}</h1>
    );
}

export default ${fileName};
`;
            fs.writeFileSync(file, boilerplate);
            console.log('Fixed empty file: ' + file);
        }
    }
});
