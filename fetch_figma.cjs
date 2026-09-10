const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = "HgSCx2CAWDxpvmiLc82PrT";

const options = {
  hostname: 'api.figma.com',
  path: `/v1/files/${fileKey}`,
  headers: {
    'X-Figma-Token': token
  }
};

console.log('Fetching latest Figma file...');

https.get(options, (res) => {
  console.log('Status code:', res.statusCode);
  if (res.statusCode !== 200) {
    res.resume();
    return;
  }
  const fileStream = fs.createWriteStream(path.join(__dirname, 'figma_latest.json'));
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Figma file saved to d:\\DMC-fkode\\figma_latest.json. File size:', fs.statSync(path.join(__dirname, 'figma_latest.json')).size);
  });
}).on('error', (err) => {
  console.error('Error fetching Figma file:', err);
});
