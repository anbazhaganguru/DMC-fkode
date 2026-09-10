const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = "HgSCx2CAWDxpvmiLc82PrT";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'X-Figma-Token': token } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Requesting image URLs for frames 7:2 and 7:75...');
  const res = await fetchJson(`https://api.figma.com/v1/images/${fileKey}?ids=7:2,7:75&scale=2&format=png`);
  console.log('Image URLs response:', res);
  if (res.images) {
    if (res.images['7:2']) {
      console.log('Downloading state 1 image...');
      await downloadFile(res.images['7:2'], path.join(__dirname, 'figma_about_state1.png'));
      console.log('Saved figma_about_state1.png');
    }
    if (res.images['7:75']) {
      console.log('Downloading state 2 image...');
      await downloadFile(res.images['7:75'], path.join(__dirname, 'figma_about_state2.png'));
      console.log('Saved figma_about_state2.png');
    }
  }
}

run().catch(console.error);
