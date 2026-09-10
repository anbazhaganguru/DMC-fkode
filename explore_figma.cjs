const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(process.env.TEMP, 'figma_file.json'), 'utf8'));

console.log('Document name:', data.name);
console.log('Pages:', data.document.children.map(c => ({ id: c.id, name: c.name, childrenCount: c.children ? c.children.length : 0 })));

const page = data.document.children[0];
console.log('Page 1 frames:', page.children.map(c => ({ id: c.id, name: c.name, type: c.type, bbox: c.absoluteBoundingBox })));
