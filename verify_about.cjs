const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.callbacks = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function run() {
  console.log('Launching headless Edge...');
  const tempProfile = path.join(process.env.TEMP, 'edge_cdp_profile_' + Date.now());
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    'about:blank'
  ]);

  edge.on('error', (err) => console.error('Edge spawn error:', err));

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      targets = await fetchJson(`http://127.0.0.1:${PORT}/json`);
      if (targets && targets.length) break;
    } catch (e) {}
  }

  if (!targets || !targets.length) {
    console.error('Failed to connect to Edge CDP');
    edge.kill();
    process.exit(1);
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Connecting to target:', pageTarget.webSocketDebuggerUrl);

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.ready;
  console.log('CDP Client connected!');

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  async function setViewport(width, height, isMobile = false) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
    await client.send('Emulation.setVisibleSize', { width, height });
  }

  async function captureScreenshot(filename) {
    const res = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filename, buffer);
    console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
  }

  async function evaluate(expression) {
    const res = await client.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  // 1. DESKTOP VERIFICATION (1280x900)
  console.log('\n--- Testing Desktop 1280x900 ---');
  await setViewport(1280, 900);
  await client.send('Page.navigate', { url: 'http://localhost:5174/' });
  await sleep(1500);

  // Check initial load
  const initialTitle = await evaluate('document.title');
  console.log('Page Title:', initialTitle);

  // Journey pin distance is window.innerHeight * 4.2
  async function scrollToAboutProgress(p) {
    const pinDist = await evaluate('window.innerHeight * 4.2');
    const aboutGlobalP = (1.28 + (p * 1.0)) / 6.08;
    const targetScroll = Math.round(aboutGlobalP * pinDist);
    await evaluate(`window.scrollTo(0, ${targetScroll});`);
    await sleep(400);
    // Return DOM state
    return evaluate(`(() => {
      const stage = document.querySelector('.about-cinematic-stage');
      const card1 = document.querySelector('.about-card--primary');
      const card2 = document.querySelector('.about-card--secondary');
      const cardsStage = document.querySelector('.about-cards-stage');
      const balanceStage = document.querySelector('.about-balance-stage');
      const balanceContent = document.querySelector('.about-balance-showcase');
      return {
        cardsStageOpacity: cardsStage ? cardsStage.style.opacity : null,
        cardsStageVis: cardsStage ? cardsStage.style.visibility : null,
        card1Transform: card1 ? card1.style.transform : null,
        card1Opacity: card1 ? card1.style.opacity : null,
        card2Transform: card2 ? card2.style.transform : null,
        card2Opacity: card2 ? card2.style.opacity : null,
        balanceOpacity: balanceStage ? balanceStage.style.opacity : null,
        balanceVis: balanceStage ? balanceStage.style.visibility : null,
        balanceTransform: balanceContent ? balanceContent.style.transform : null
      };
    })()`);
  }

  // 1A. About Entry (p = 0.10)
  console.log('\n[Desktop 1280x900] p = 0.10 (Entry - cards emerging from depth):');
  let st = await scrollToAboutProgress(0.10);
  console.log(st);
  await captureScreenshot('shot_1_about_entry_1280x900.png');

  // 1B. Cards Coming Forward (p = 0.35)
  console.log('\n[Desktop 1280x900] p = 0.35 (Cards moving forward):');
  st = await scrollToAboutProgress(0.35);
  console.log(st);
  await captureScreenshot('shot_2_cards_forward_1280x900.png');

  // 1C. Cards Settled (p = 0.55)
  console.log('\n[Desktop 1280x900] p = 0.55 (Cards settled):');
  st = await scrollToAboutProgress(0.55);
  console.log(st);
  await captureScreenshot('shot_3_cards_settled_1280x900.png');

  // 1D. Balance Content Moving Left -> Right (p = 0.75)
  console.log('\n[Desktop 1280x900] p = 0.75 (Balance content moving left -> right):');
  st = await scrollToAboutProgress(0.75);
  console.log(st);
  await captureScreenshot('shot_4_balance_moving_1280x900.png');

  // 1E. Balance Content Traveled Right (p = 0.88)
  console.log('\n[Desktop 1280x900] p = 0.88 (Balance content arrived right):');
  st = await scrollToAboutProgress(0.88);
  console.log(st);
  await captureScreenshot('shot_5_balance_right_1280x900.png');

  // 1F. Handoff to Therapy (p = 0.96)
  console.log('\n[Desktop 1280x900] p = 0.96 (Handoff to Therapy):');
  st = await scrollToAboutProgress(0.96);
  console.log(st);
  await captureScreenshot('shot_6_therapy_handoff_1280x900.png');

  // 1G. Reverse Scroll Verification
  console.log('\n[Desktop 1280x900] Reverse scrolling back to p = 0.30...');
  st = await scrollToAboutProgress(0.30);
  console.log('After reverse scroll to p = 0.30:', st);
  await captureScreenshot('shot_7_reverse_scroll_1280x900.png');

  // 2. MOBILE VERIFICATION (390x844)
  console.log('\n--- Testing Mobile 390x844 ---');
  await setViewport(390, 844, true);
  await sleep(500);

  console.log('[Mobile 390x844] p = 0.35 (Cards forward stacked):');
  st = await scrollToAboutProgress(0.35);
  console.log(st);
  await captureScreenshot('shot_8_mobile_cards_390x844.png');

  console.log('[Mobile 390x844] p = 0.80 (Balance content mobile travel):');
  st = await scrollToAboutProgress(0.80);
  console.log(st);
  await captureScreenshot('shot_9_mobile_balance_390x844.png');

  // 3. WIDE DESKTOP (1440x900)
  console.log('\n--- Testing Wide Desktop 1440x900 ---');
  await setViewport(1440, 900, false);
  await sleep(500);

  console.log('[Wide Desktop 1440x900] p = 0.55 (Cards settled):');
  st = await scrollToAboutProgress(0.55);
  console.log(st);
  await captureScreenshot('shot_10_desktop_1440x900.png');

  console.log('\nAll test snapshots completed successfully!');
  edge.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
