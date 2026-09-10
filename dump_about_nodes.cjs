const fs = require('fs');

const data = JSON.parse(fs.readFileSync('figma_latest.json', 'utf8'));

function hex(c) {
  if (!c) return 'none';
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

function dumpTree(node, indent = '') {
  const b = node.absoluteBoundingBox;
  let text = '';
  if (node.characters) {
    text = ` => "${node.characters.replace(/\n/g, ' \\n ')}"`;
  }
  let font = '';
  if (node.style) {
    const s = node.style;
    font = ` [font=${s.fontFamily} w=${s.fontWeight} sz=${s.fontSize}px lh=${s.lineHeightPx ? s.lineHeightPx.toFixed(1) : 'auto'} ls=${s.letterSpacing ? s.letterSpacing.toFixed(2) : 0}${s.italic ? ' italic' : ''}]`;
  }
  let fill = '';
  if (node.fills && node.fills[0]) {
    const f = node.fills[0];
    if (f.color) fill = ` fill=${hex(f.color)}${f.opacity !== undefined ? ' op=' + f.opacity : ''}`;
    else if (f.type) fill = ` fill=${f.type}`;
  }
  let stroke = '';
  if (node.strokes && node.strokes[0]) {
    stroke = ` stroke=${hex(node.strokes[0].color)} w=${node.strokeWeight}`;
  }
  let radius = node.cornerRadius ? ` r=${node.cornerRadius}` : '';
  let pad = node.paddingLeft !== undefined ? ` pad=[${node.paddingTop},${node.paddingRight},${node.paddingBottom},${node.paddingLeft}] gap=${node.itemSpacing}` : '';

  console.log(`${indent}${node.name} (${node.type} id:${node.id}) (${b ? Math.round(b.x) + ',' + Math.round(b.y) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height) : ''})${text}${font}${fill}${stroke}${radius}${pad}`);
  if (node.children) {
    node.children.forEach(c => dumpTree(c, indent + '  '));
  }
}

console.log('=================== STATE 1 TREE ===================');
dumpTree(data.document.children[0].children[0]);

console.log('\n=================== STATE 2 TREE ===================');
dumpTree(data.document.children[0].children[1]);
