const fs = require('fs');

const content = fs.readFileSync('C:/Users/FKode solutiona/.gemini/antigravity-ide/brain/92f7c65d-65e0-4ea5-9cd9-c76033abe811/.system_generated/logs/transcript_full.jsonl', 'utf8');
const lines = content.split('\n');
console.log('Total lines in transcript_full:', lines.length);

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('IMPLEMENT THE ABOUT SECTION UI')) {
    try {
      const o = JSON.parse(lines[i]);
      if (o.type === 'USER_INPUT') {
        fs.writeFileSync('user_prompt_full.txt', o.content);
        console.log('Found and wrote user_prompt_full.txt! Length:', o.content.length);
        break;
      }
    } catch (e) {
      console.error('Error parsing line', i, e);
    }
  }
}
