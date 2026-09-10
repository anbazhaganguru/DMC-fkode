const fs = require('fs');

const data = JSON.parse(fs.readFileSync('figma_latest.json', 'utf8'));

console.log('Document name:', data.name);
console.log('Pages count:', data.document.children.length);

data.document.children.forEach((page, pIdx) => {
  console.log(`\nPage ${pIdx + 1}: ${page.name} (id: ${page.id})`);
  if (page.children) {
    page.children.forEach(frame => {
      console.log(`  Frame: "${frame.name}" (id: ${frame.id}, type: ${frame.type}, bbox: ${JSON.stringify(frame.absoluteBoundingBox)})`);
    });
  }
});

// Search for any node matching "About" or similar text
function searchNodes(node, query) {
  let matches = [];
  const name = node.name || '';
  const chars = node.characters || '';
  if (name.toLowerCase().includes(query.toLowerCase()) || chars.toLowerCase().includes(query.toLowerCase())) {
    matches.push({ id: node.id, name: node.name, type: node.type, text: chars.slice(0, 100) });
  }
  if (node.children) {
    for (const child of node.children) {
      matches = matches.concat(searchNodes(child, query));
    }
  }
  return matches;
}

console.log('\nNodes matching "About":', searchNodes(data.document, 'About'));
console.log('\nNodes matching "Daniel":', searchNodes(data.document, 'Daniel'));
