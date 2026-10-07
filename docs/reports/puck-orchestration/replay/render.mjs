#!/usr/bin/env node
// Render the replay canvas to PNG frames or an MP4, by stepping renderFrame() in headless Chrome over CDP.
//   node render.mjs frames <scene> <t1,t2,...> <outdir>
//   node render.mjs video  <scene> <out.mp4> [fps] [--from s] [--to s] [--crf n] [--scale WxH]
import { spawn } from 'node:child_process';
import http from 'node:http';
import { createReadStream, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const SITE = resolve(new URL('.', import.meta.url).pathname, 'site');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const from = +opt('--from', 0), to = opt('--to', null), crf = opt('--crf', '20'), scale = opt('--scale', null);
const [mode, scene, target, extra] = args;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = join(SITE, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(SITE) || !existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
  createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const profile = mkdtempSync(join(tmpdir(), 'replay-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
  '--no-default-browser-check', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1920,1080', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  chrome.stderr.on('data', d => { buf += d; const m = /DevTools listening on (ws:\/\/\S+)/.exec(buf); if (m) res(m[1]); });
  setTimeout(() => rej(new Error('chrome did not start')), 15000);
});
const dport = new URL(wsUrl).port;
const list = await (await fetch(`http://127.0.0.1:${dport}/json/list`)).json();
const pageWs = list.find(t => t.type === 'page').webSocketDebuggerUrl;
const ws = new WebSocket(pageWs);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method === 'Runtime.exceptionThrown') console.error('PAGE EXCEPTION', JSON.stringify(m.params.exceptionDetails).slice(0, 800));
  else if (m.method === 'Runtime.consoleAPICalled') console.error('console', m.params.args.map(a => a.value ?? a.description).join(' '));
});
const send = (method, params = {}, ms = 20000) => new Promise((r, rej) => {
  const i = ++id; const timer = setTimeout(() => { pending.delete(i); rej(new Error(`timeout ${method}`)); }, ms);
  pending.set(i, m => { clearTimeout(timer); r(m); }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expression, awaitPromise = false) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 1200));
  return r.result?.result?.value;
};
await send('Runtime.enable');
await send('Page.enable');
await send('Page.navigate', { url: `http://127.0.0.1:${port}/replay.html` });
for (let i = 0; i < 100; i++) { if (await evaluate('!!window.ready')) break; await new Promise(r => setTimeout(r, 100)); }
await evaluate('window.ready', true);
const duration = await evaluate(`SCENES[${JSON.stringify(scene)}].duration`);
const grab = async t => {
  for (let attempt = 1; ; attempt++) {
    try { return await grabOnce(t); } catch (e) { console.error(`frame at ${t}s: ${e.message} (attempt ${attempt})`); if (attempt >= 4) throw e; }
  }
};
const grabOnce = async t => {
  const url = await evaluate(`renderFrame(${JSON.stringify(scene)}, ${t}); document.getElementById('c').toDataURL('image/png')`);
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
};

if (mode === 'frames') {
  mkdirSync(extra, { recursive: true });
  for (const t of target.split(',').map(Number)) {
    const f = join(extra, `${scene}-${String(t.toFixed(2)).padStart(7, '0')}.png`);
    writeFileSync(f, await grab(t)); console.log(f);
  }
  console.log('duration', duration, 'chapters', JSON.stringify(await evaluate('window.CHAPTERS || null')));
} else if (mode === 'video') {
  const fps = +(extra || 30);
  const end = to ? +to : duration;
  const n = Math.round((end - from) * fps);
  const vf = scale ? ['-vf', `scale=${scale}:flags=lanczos`] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    ...vf, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', crf, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await grab(from + i / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', target, n, 'frames');
}
ws.close(); chrome.kill(); server.close();
