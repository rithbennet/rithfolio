'use strict';
// Replay of the Puck store builder orchestration (6-7 Oct 2026), drawn frame by frame from
// replay-data.js (times and token counts taken from the Claude Code and Codex session logs).
// renderFrame(scene, seconds) draws one frame; render.mjs steps it and pipes PNGs to ffmpeg.

const D = window.REPLAY;
const cv = document.getElementById('c');
const X = cv.getContext('2d');
const W = 1920, H = 1080;

const P = {
  bg: '#282A36', raised: '#21222C', deep: '#191A21', panel: '#343746', sel: '#44475A',
  ink: '#F8F8F2', ink2: '#C9CBDA', ink3: '#9EA3C4', ink4: '#6272A4', line: '#44475A', lineSoft: '#363848',
  purple: '#BD93F9', pink: '#FF79C6', cyan: '#8BE9FD', green: '#50FA7B', orange: '#FFB86C', yellow: '#F1FA8C', red: '#FF5555',
  c1: '#A876E9', c2: '#C8822C', c3: '#02A6BE', c4: '#32AF53', c5: '#DB62A8',
  clawd: '#D97757', bot: '#ECEDF3', botShade: '#C5C8D8', visor: '#191A21', sol: '#5CCFE2',
};
const SANS = 'Geist, system-ui, sans-serif';
const MONO = 'FMono, Menlo, monospace';

// ---------- small helpers ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const backOut = k => { k = clamp(k); const s = 1.6; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const MIN = 60000;
const T = s => {
  const [md, hm] = s.split(' ');
  const [mo, da] = md.split('-').map(Number);
  const [h, m] = hm.split(':').map(Number);
  return Date.UTC(2026, mo - 1, da, h - 8, m);
};
const myt = ms => new Date(ms + 8 * 3600000);
const hhmm = ms => { const d = myt(ms); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
const dayLabel = ms => { const d = myt(ms); return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getUTCDay()] + ' ' + d.getUTCDate() + ' OCT'; };
const kfmt = n => n >= 999500 ? (n / 1e6).toFixed(2) + 'M' : Math.round(n / 1000) + 'k';
const durfmt = m => { m = Math.round(m); const h = Math.floor(m / 60), r = m % 60; return h ? `${h} h ${String(r).padStart(2, '0')} min` : `${r} min`; };

function font(px, w = 400, mono = false) { X.font = `${w} ${px}px ${mono ? MONO : SANS}`; }
function txt(s, x, y, o = {}) {
  const { px = 22, w = 400, mono = false, color = P.ink, align = 'left', base = 'alphabetic', alpha = 1, ls = 0, maxW } = o;
  X.save();
  X.globalAlpha *= alpha;
  font(px, w, mono);
  X.letterSpacing = ls ? ls + 'px' : '0px';
  X.fillStyle = color; X.textAlign = align; X.textBaseline = base;
  if (maxW) X.fillText(s, x, y, maxW); else X.fillText(s, x, y);
  X.restore();
}
function tw(s, px, w = 400, mono = false, ls = 0) {
  X.save(); font(px, w, mono); X.letterSpacing = ls ? ls + 'px' : '0px';
  const m = X.measureText(s).width; X.restore(); return m;
}
function wrap(s, px, maxW, w = 400, mono = false) {
  const out = []; let cur = '';
  for (const word of s.split(' ')) {
    const t = cur ? cur + ' ' + word : word;
    if (tw(t, px, w, mono) > maxW && cur) { out.push(cur); cur = word; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
}
function rr(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r); }
function box(x, y, w, h, r, fill, stroke, lw = 1.5, dash) {
  rr(x, y, w, h, r);
  if (fill) { X.fillStyle = fill; X.fill(); }
  if (stroke) { X.save(); X.strokeStyle = stroke; X.lineWidth = lw; if (dash) X.setLineDash(dash); X.stroke(); X.restore(); }
}
function line(x1, y1, x2, y2, color, lw = 1.5, dash) {
  X.save(); X.strokeStyle = color; X.lineWidth = lw; if (dash) X.setLineDash(dash);
  X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.stroke(); X.restore();
}
function withAlpha(a, fn) { X.save(); X.globalAlpha *= a; fn(); X.restore(); }

const patterns = {};
function hatch(key, color, bg, gap = 7, lw = 2) {
  if (patterns[key]) return patterns[key];
  const s = gap * 2, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, s, s); }
  g.strokeStyle = color; g.lineWidth = lw; g.beginPath();
  for (let i = -s; i <= s; i += gap) { g.moveTo(i, s); g.lineTo(i + s, 0); }
  g.stroke();
  return (patterns[key] = X.createPattern(c, 'repeat'));
}

// status icons: good = filled check, bad = filled cross, warn = ring with ?, dot = state marker
function icon(kind, cx, cy, s, col) {
  X.save(); X.strokeStyle = col; X.fillStyle = col; X.lineWidth = Math.max(1.6, s * 0.16); X.lineCap = 'round'; X.lineJoin = 'round';
  const r = s / 2;
  if (kind === 'good') {
    X.beginPath(); X.arc(cx, cy, r, 0, 7); X.fill();
    X.strokeStyle = P.deep; X.beginPath(); X.moveTo(cx - r * 0.45, cy + r * 0.02); X.lineTo(cx - r * 0.1, cy + r * 0.38); X.lineTo(cx + r * 0.5, cy - r * 0.35); X.stroke();
  } else if (kind === 'bad') {
    X.beginPath(); X.arc(cx, cy, r, 0, 7); X.fill();
    X.strokeStyle = P.deep; X.beginPath();
    X.moveTo(cx - r * 0.36, cy - r * 0.36); X.lineTo(cx + r * 0.36, cy + r * 0.36);
    X.moveTo(cx + r * 0.36, cy - r * 0.36); X.lineTo(cx - r * 0.36, cy + r * 0.36); X.stroke();
  } else if (kind === 'warn') {
    X.beginPath(); X.arc(cx, cy, r - 1, 0, 7); X.stroke();
    font(Math.round(s * 0.72), 700); X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('?', cx, cy + 1);
  } else {
    X.beginPath(); X.arc(cx, cy, r - 1, 0, 7); X.stroke();
    X.beginPath(); X.arc(cx, cy, r * 0.38, 0, 7); X.fill();
  }
  X.restore();
}
const KIND = {
  good: [P.green, 'good'], bad: [P.red, 'bad'], warn: [P.yellow, 'warn'],
  orange: [P.orange, 'dot'], review: [P.cyan, 'dot'], neutral: [P.ink3, 'dot'], purple: [P.purple, 'dot'],
};
function pill(x, y, label, kind, px = 15, align = 'left', alpha = 1) {
  const [col, ik] = KIND[kind] || KIND.neutral;
  const pad = Math.round(px * 0.7), ic = Math.round(px * 0.95);
  const w = pad + ic + 8 + tw(label, px, 600, true, 1) + pad;
  const h = Math.round(px + 14);
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  withAlpha(alpha, () => {
    box(x0, y, w, h, h / 2, 'rgba(25,26,33,0.92)', col, 1.6);
    icon(ik, x0 + pad + ic / 2, y + h / 2, ic, col);
    txt(label, x0 + pad + ic + 8, y + h / 2 + 1, { px, w: 600, mono: true, color: P.ink, base: 'middle', ls: 1 });
  });
  return w;
}
function verdictKind(v) {
  if (!v) return 'neutral';
  if (v.startsWith('PASS') || v.startsWith('GREEN')) return 'good';
  if (v.startsWith('NOT')) return 'warn';
  return 'bad';
}

// ---------- mascots ----------
// Claude: the Claude Code mascot, drawn from its terminal block glyphs (pixels twice as tall as wide).
const CLAWD = ['...############...', '...##e######e##...', '.################.', '...############...', '....#.#....#.#....'];
const CLAWD_STEP = '...#.#......#.#...';
function drawClawd(cx, by, u, o = {}) {
  u = Math.max(1, Math.round(u));
  const x0 = Math.round(cx - 9 * u), y0 = Math.round(by - 10 * u + (o.bob || 0));
  X.save(); X.globalAlpha *= (o.alpha ?? 1);
  const body = o.body || P.clawd;
  const closed = o.sleep || o.blink;
  for (let r = 0; r < 5; r++) {
    const row = r === 4 && o.step ? CLAWD_STEP : CLAWD[r];
    for (let c = 0; c < 18; c++) {
      const ch = row[c]; if (ch === '.') continue;
      X.fillStyle = ch === 'e' ? (closed ? body : P.deep) : body;
      X.fillRect(x0 + c * u, y0 + r * 2 * u, u, 2 * u);
    }
  }
  if (closed) { X.fillStyle = P.deep; for (const c of [5, 12]) X.fillRect(x0 + c * u, y0 + 3 * u, u, Math.max(2, Math.round(u * 0.6))); }
  if (o.hat) {
    const [a, b] = o.hat;
    X.fillStyle = a; X.fillRect(x0 + 6 * u, y0 - 4 * u, 6 * u, u); X.fillRect(x0 + 5 * u, y0 - 3 * u, 8 * u, 2 * u);
    X.fillStyle = b; X.fillRect(x0 + 3 * u, y0 - u, 12 * u, u);
  }
  if (o.crown) {
    X.fillStyle = P.yellow; for (const c of [4, 8, 9, 13]) X.fillRect(x0 + c * u, y0 - 3 * u, u, 2 * u);
    X.fillRect(x0 + 4 * u, y0 - u, 10 * u, u);
    X.fillStyle = P.purple; X.fillRect(x0 + 8 * u, y0 - u, 2 * u, u);
  }
  if (o.headset) {
    X.fillStyle = P.ink3; X.fillRect(x0 + 2 * u, y0 - 2 * u, 14 * u, u);
    X.fillRect(x0 + 2 * u, y0 - u, u, 3 * u); X.fillRect(x0 + 15 * u, y0 - u, u, 3 * u);
    X.fillStyle = P.cyan; X.fillRect(x0 + u, y0 + u, u, 2 * u);
  }
  if (o.mark) { // red cross for a builder that failed on launch
    X.strokeStyle = P.red; X.lineWidth = Math.max(3, u); X.lineCap = 'round';
    X.beginPath(); X.moveTo(x0 + 4 * u, y0); X.lineTo(x0 + 14 * u, y0 + 8 * u); X.moveTo(x0 + 14 * u, y0); X.lineTo(x0 + 4 * u, y0 + 8 * u); X.stroke();
  }
  X.restore();
  return { x0, y0, w: 18 * u, h: 10 * u, top: y0 - (o.hat || o.crown || o.headset ? 4 * u : 0) };
}
const HATS = { opus: [P.yellow, '#C9D15A'], sonnet: [P.pink, '#D35FA3'], fable: null };
function zzz(x, y, t, s = 1, alpha = 1) {
  for (let i = 0; i < 3; i++) {
    const k = ((t * 0.45 + i / 3) % 1);
    txt('z', x - k * 14 * s + i * 7 * s, y - k * 40 * s, { px: Math.round((16 + i * 6) * s), w: 700, mono: true, color: P.ink3, alpha: alpha * Math.sin(k * Math.PI) });
  }
}

// GPT: an original "knot bot" for the GPT-6 reviewers (hexagon head, visor, antenna symbol).
const BOT = ['....######....', '...########...', '..##########..', '..#vvvvvvvv#..', '..#vvvvvvvv#..', '..#vvvvvvvv#..', '..##########..',
  '...########...', '....######....', '.....####.....', '...########...', '.#.###hh###.#.', '.#.###hh###.#.', '...##....##...'];
const STAR = ['...#...', '...#...', '..###..', '#######', '..###..', '...#...', '...#...'];
const SUN = ['#..#..#', '.#####.', '.#####.', '#######', '.#####.', '.#####.', '#..#..#'];
const LENS = ['.###.', '#...#', '#...#', '#...#', '.###.'];
function grid(rows, x0, y0, q, colOf) {
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
    const ch = rows[r][c]; if (ch === '.') continue;
    X.fillStyle = colOf(ch, r, c); X.fillRect(x0 + c * q, y0 + r * q, q, q);
  }
}
function drawBot(cx, by, p, o = {}) {
  p = Math.max(1, Math.round(p));
  const x0 = Math.round(cx - 7 * p), y0 = Math.round(by - 14 * p + (o.bob || 0));
  X.save(); X.globalAlpha *= (o.alpha ?? 1);
  grid(BOT, x0, y0, p, (ch, r, c) => ch === 'v' ? P.visor : ch === 'h' ? (o.dim ? P.ink4 : P.cyan) : (c >= 9 && r < 9 ? P.botShade : P.bot));
  const s = o.look || 0;
  if (o.blink || o.sleep) { X.fillStyle = P.ink4; X.fillRect(x0 + (4 + s) * p, y0 + 4 * p + Math.round(p * 0.4), 2 * p, Math.max(2, Math.round(p * 0.3))); X.fillRect(x0 + (8 + s) * p, y0 + 4 * p + Math.round(p * 0.4), 2 * p, Math.max(2, Math.round(p * 0.3))); }
  else { X.fillStyle = o.dim ? P.ink4 : P.cyan; X.fillRect(x0 + (4 + s) * p, y0 + 4 * p, 2 * p, p); X.fillRect(x0 + (8 + s) * p, y0 + 4 * p, 2 * p, p); }
  X.fillStyle = P.botShade; X.fillRect(x0 + 6 * p, y0 - p, 2 * p, p);
  const q = Math.max(1, Math.round(p / 2));
  if (o.symbol) {
    const sym = o.symbol === 'star' ? STAR : SUN, col = o.symbol === 'star' ? P.yellow : P.orange;
    grid(sym, Math.round(x0 + 7 * p - 3.5 * q), Math.round(y0 - p - 7 * q - q), q, () => col);
  }
  if (o.tool === 'lens') {
    grid(LENS, x0 + 12 * p, y0 + 6 * p, p, () => P.ink3);
    X.fillStyle = 'rgba(139,233,253,0.25)'; X.fillRect(x0 + 13 * p, y0 + 7 * p, 3 * p, 3 * p);
  }
  if (o.tool === 'clip') {
    X.fillStyle = '#E9DFC9'; X.fillRect(x0 + 12 * p, y0 + 7 * p, 5 * p, 6 * p);
    X.fillStyle = P.ink4; X.fillRect(x0 + 13 * p, y0 + 6 * p, 3 * p, p);
    X.fillStyle = '#9EA3C4'; for (let i = 0; i < 3; i++) X.fillRect(x0 + 13 * p, y0 + (8.5 + i * 1.4) * p, 3 * p, Math.max(1, Math.round(p * 0.4)));
  }
  X.restore();
  return { x0, y0, w: 14 * p, h: 14 * p };
}

// ---------- data prep ----------
const START = T('10-06 20:58'), END = T('10-07 12:00');
const MORNING = T('10-07 10:55');
const agents = D.agents.slice().sort((a, b) => a.start - b.start);
const FAN = { 'R1-04': 0, 'R1-05': 1, 'R1-06': 2, 'R1-07': 3 };
for (const a of agents) {
  a.bench = FAN[a.task] ?? 0;
  a.hatKey = a.model === 'opus' ? 'opus' : 'sonnet';
  const m = /fix:r(\d)/.exec(a.label); a.fixRound = m ? +m[1] : 0;
  let o = 0, th = 0; a.pre = a.calls.map(c => { o += c[1]; th += c[2]; return [c[0], o, th]; });
}
const real = a => !a.ghost && !a.relay && (a.role === 'build' || a.role === 'fix');
const relaunch = agents.filter(a => a.task === 'R1-02' && a.role === 'build' && !a.ghost)[1];
const reviews = D.reviews;
const night = r => r.start < MORNING;
const mergeAt = Object.fromEntries(D.merges.map(m => [m.task, m.t]));
const TITLES = { 'R1-01': 'Phase 1 gaps', 'R1-02': 'Release 1 contract', 'R1-03': 'Migration', 'R1-04': 'Backfill', 'R1-05': 'Public render', 'R1-06': 'Editor', 'R1-07': 'MCP tools' };
const ALLCALLS = D.cum; // [t, cumulative]
function cumAt(arr, w) { // arr sorted by [0]; returns arr[i][1] for last i with arr[i][0] <= w
  let lo = 0, hi = arr.length - 1, ans = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (arr[m][0] <= w) { ans = m; lo = m + 1; } else hi = m - 1; }
  return ans;
}
const WINDOWS = [
  { start: START, end: T('10-07 02:00'), limit: T('10-06 23:49'), reset: '02:00', cap: '728k' },
  { start: T('10-07 02:00'), end: T('10-07 07:00'), limit: T('10-07 05:04'), reset: '07:00', cap: '724k' },
  { start: T('10-07 07:00'), end: T('10-07 12:01'), limit: T('10-07 09:39'), reset: '12:00', cap: '762k' },
];
function totalAt(w) { const i = cumAt(ALLCALLS, w); return i < 0 ? 0 : ALLCALLS[i][1]; }
const fableCalls = D.fable;

// ---------- main timeline: video seconds <-> wall clock ----------
const TITLE_END = 6.5, TREE_DUR = 17, TREE_END = TITLE_END + TREE_DUR, PRO_START = TREE_END, PRO_END = TREE_END + 12.5;
const R = 8; // wall minutes per video second while playing
const SEG = [];
let vcur = PRO_END;
function seg(a, b, dur, kind = 'play', note) { SEG.push({ v0: vcur, v1: vcur + dur, w0: T(a), w1: T(b), kind, note }); vcur += dur; }
seg('10-06 20:58', '10-06 21:37', 39 / R);
seg('10-06 21:37', '10-06 21:37', 1.8, 'hold');
seg('10-06 21:37', '10-06 21:50', 13 / R);
seg('10-06 21:50', '10-06 21:50', 1.4, 'hold');
seg('10-06 21:50', '10-06 22:57', 67 / R);
seg('10-06 22:57', '10-06 22:57', 1.3, 'hold');
seg('10-06 22:57', '10-06 23:49', 52 / R);
seg('10-06 23:49', '10-06 23:49', 2.2, 'hold');
seg('10-06 23:49', '10-07 02:00', 2.6, 'skip', '2 h 11 min');
seg('10-07 02:00', '10-07 03:44', 104 / R);
seg('10-07 03:44', '10-07 03:44', 1.3, 'hold');
seg('10-07 03:44', '10-07 05:04', 80 / R);
seg('10-07 05:04', '10-07 05:04', 2.4, 'hold');
seg('10-07 05:04', '10-07 08:37', 3.6, 'skip', '3 h 33 min');
seg('10-07 08:37', '10-07 08:37', 1.2, 'hold');
seg('10-07 08:37', '10-07 09:39', 62 / R);
seg('10-07 09:39', '10-07 09:39', 2.8, 'hold');
seg('10-07 09:39', '10-07 10:55', 2.2, 'skip', '1 h 16 min');
seg('10-07 10:55', '10-07 11:21', 26 / 4, 'play4');
seg('10-07 11:21', '10-07 11:21', 2.8, 'hold');
seg('10-07 11:21', '10-07 12:00', 1.0, 'skip', '39 min');
const MAIN_END = vcur;
const OUTRO = 13.5;
const TOTAL = MAIN_END + OUTRO;

function wallAt(t) {
  if (t <= SEG[0].v0) return SEG[0].w0;
  for (const s of SEG) if (t < s.v1) {
    let k = (t - s.v0) / (s.v1 - s.v0);
    if (s.kind === 'skip') k = smooth(k);
    return s.w0 + (s.w1 - s.w0) * k;
  }
  return SEG[SEG.length - 1].w1;
}
function segAt(t) { for (const s of SEG) if (t < s.v1) return s; return SEG[SEG.length - 1]; }
function videoAt(w) {
  for (const s of SEG) if (s.w1 > s.w0 && w >= s.w0 && w <= s.w1) return s.v0 + (w - s.w0) / (s.w1 - s.w0) * (s.v1 - s.v0);
  return w < SEG[0].w0 ? SEG[0].v0 : MAIN_END;
}
for (const a of agents) a.vcalls = a.calls.map(c => videoAt(c[0]));
const fableV = fableCalls.map(c => videoAt(c[0]));

// ---------- layout ----------
const LP = { x: 40, y: 112, w: 430, h: 520 };
const CP = { x: 490, y: 112, w: 800, h: 520 };
const RP = { x: 1310, y: 112, w: 570, h: 520 };
const FABLE = { cx: 140, by: 304, u: 8 };
const BENCH = i => ({ x: 510 + (i % 2) * 390, y: 158 + Math.floor(i / 2) * 188, w: 370, h: 176 });
const BOTS_NIGHT = { astra: { cx: 1470, by: 372 }, sol: { cx: 1745, by: 372 } };
const slotMorning = (who, i) => ({ cx: 1388 + i * 140, by: who === 'astra' ? 300 : 470 });
const LEDGER = [['R1', ['01', '02', '03', '03b', '04', '05', '06', '07', '08', '09']], ['R2', ['01', '02', '03', '04', '05', '06', '07', '08']],
  ['R3', ['01', '02', '03', '04', '05']], ['R4', ['01', '02', '03', '04', '05']], ['F', ['01', '02', '03']]];
const cellPos = (row, i) => ({ x: 96 + i * 36, y: 398 + row * 32, w: 32, h: 26 });
function cellOf(task) {
  for (let r = 0; r < LEDGER.length; r++) { const i = LEDGER[r][1].findIndex(n => `${LEDGER[r][0]}-${n}` === task); if (i >= 0) return cellPos(r, i); }
  return cellPos(0, 0);
}

// ---------- state at wall time ----------
function inLimit(w) { return WINDOWS.find(x => w >= x.limit && w < x.end); }
function fableAsleep(w) { return (w >= T('10-06 23:49') && w < T('10-07 02:00')) || (w >= T('10-07 05:04') && w < T('10-07 08:36')) || w >= T('10-07 09:39'); }
function fableBusy(w) {
  const i = cumAt(fableCalls, w + 0.4 * MIN);
  return i >= 0 && fableCalls[i][0] > w - 1.6 * MIN;
}
const FABLE_SAYS = [
  ['10-06 20:58', 'Reading the spec and the 31-task ledger'],
  ['10-06 21:09', 'R1-01 is building. Waiting for the workflow'],
  ['10-06 21:36', "Relays can't reach Codex. Reworking the harness"],
  ['10-06 21:44', 'Astra and Sol are on R1-01. Waiting'],
  ['10-06 21:59', 'Bundling findings into fix round 1'],
  ['10-06 22:18', 'Round 2 out. Waiting for both verdicts'],
  ['10-06 22:26', 'Fix round 2, the last one allowed'],
  ['10-06 22:31', 'Round 3 out. Merge on PASS + GREEN'],
  ['10-06 22:57', 'R1-01 merged. Launching the contract'],
  ['10-06 23:00', 'The contract is building. Waiting'],
  ['10-06 23:49', 'Session limit. Back at 02:00'],
  ['10-07 02:00', 'Reconciling, then resuming R1-02'],
  ['10-07 02:26', 'Contract review at xhigh. Waiting'],
  ['10-07 02:38', 'Fix round 1: 6 majors, 3 minors'],
  ['10-07 03:03', 'Round 2 out. Waiting'],
  ['10-07 03:15', 'Fix round 2, the last one allowed'],
  ['10-07 03:32', 'Round 3 out. Waiting'],
  ['10-07 03:44', 'Contract frozen. Starting R1-03'],
  ['10-07 04:14', 'Migration review at xhigh. Waiting'],
  ['10-07 04:22', 'Fix round 1'],
  ['10-07 04:30', 'Round 2 out. Waiting'],
  ['10-07 04:39', 'Fix round 2, the last one allowed'],
  ['10-07 04:59', 'Harness-only failure: splitting it off'],
  ['10-07 05:03', 'R1-03 merged. Fanning out four builders'],
  ['10-07 05:04', 'Session limit. Back at 07:00'],
  ['10-07 07:00', 'Window reset. Nobody said continue'],
  ['10-07 07:07', 'Auto-resume failed (ENOTFOUND)'],
  ['10-07 08:36', 'Four builders out. No calls until they return'],
  ['10-07 09:38', 'Reading four results…'],
  ['10-07 09:39', 'Session limit. Back at 12:00'],
].map(([a, b]) => [T(a), b]);
function fableSays(w) { let s = FABLE_SAYS[0][1]; for (const [t, x] of FABLE_SAYS) if (w >= t) s = x; return s; }

const reviewsDone = task => { const r = reviews.filter(x => x.task === task && !night(x)); return r.length ? Math.max(...r.map(x => x.end)) : Infinity; };
function benchState(b, w) {
  const list = agents.filter(a => a.bench === b && !a.ghost && !a.relay && a.task);
  const relayOn = b === 0 && agents.some(a => a.relay && w >= a.start - 0.2 * MIN && w <= a.end + 0.6 * MIN);
  let cur = null;
  for (const a of list) if (a.start <= w + 0.3 * MIN) cur = a;
  const ghost = agents.find(a => a.ghost && a.bench === b);
  const ghostOn = ghost && w >= ghost.start - 0.2 * MIN && w < T('10-07 08:37');
  if (!cur || (ghostOn && cur.start < T('10-07 05:00') && b > 0) || (ghostOn && b === 0 && w >= T('10-07 05:04'))) {
    if (ghostOn) return { ghost, task: ghost.task, status: ['FAILED AT LAUNCH', 'bad'], agent: ghost, mode: 'ghost' };
    if (!cur) return null;
  }
  const task = cur.task;
  const m = mergeAt[task];
  const active = w >= cur.start - 0.2 * MIN && w <= cur.end + 0.4 * MIN;
  const rvs = reviews.filter(r => r.task === task && (r.who === 'astra' || r.who === 'sol') && w >= r.start && w <= r.end);
  let status, mode = 'idle';
  if (m && w >= m) status = ['MERGED', 'good'];
  else if (relayOn) status = ['RELAYS FAIL', 'bad'];
  else if (active && w > (inLimit(w) ? inLimit(w).limit : Infinity)) { status = ['CUT OFF BY THE LIMIT', 'bad']; mode = 'sleep'; }
  else if (active) { status = cur.role === 'fix' ? [`FIX ROUND ${cur.fixRound}`, 'orange'] : cur === relaunch ? ['RELAUNCHED', 'orange'] : ['BUILDING', 'orange']; mode = 'work'; }
  else if (rvs.length) status = [`IN REVIEW · ROUND ${Math.max(...rvs.map(r => r.round))}`, 'review'];
  else if (cur === agents.find(a => a.task === 'R1-02' && a.role === 'build' && !a.ghost) && w > cur.end && w < T('10-07 02:01')) { status = ['CUT OFF BY THE LIMIT', 'bad']; mode = 'sleep'; }
  else if (FAN[task] !== undefined && w >= reviewsDone(task)) status = ['NEEDS A FIX ROUND', 'warn'];
  else if (FAN[task] !== undefined && w > cur.end) status = ['COMMITTED · NOT REVIEWED', 'warn'];
  else status = ['BETWEEN ROUNDS', 'neutral'];
  if (mode !== 'sleep' && inLimit(w) && !active) mode = 'sleep';
  if (mode === 'idle' && m && w >= m) mode = 'idle';
  return { agent: cur, task, status, mode, active };
}

function ledgerStatus(task, w) {
  const m = mergeAt[task];
  if (m && w >= m) return 'done';
  if (task === 'R1-03b') return w >= T('10-07 05:01') ? 'deferred' : 'todo';
  if (reviews.some(r => r.task === task && w >= r.start && w <= r.end && r.who !== 'astra-sub')) return 'review';
  const own = agents.filter(a => a.task === task);
  if (own.some(a => a.ghost && w >= a.start - 0.2 * MIN && w < T('10-07 08:37'))) return 'failed';
  const ag = own.filter(real);
  if (ag.some(a => w >= a.start - 0.2 * MIN && w <= a.end + 0.4 * MIN)) return 'building';
  if (!ag.length || w < ag[0].start) return 'todo';
  if (FAN[task] !== undefined) return w >= reviewsDone(task) ? 'fix' : 'waiting';
  return 'active';
}

// ---------- captions ----------
const CAPTIONS = [
  ['10-06 20:58', 'Fable reads the spec and the 31-task ledger, then checks git before starting.'],
  ['10-06 21:09', 'R1-01 starts in its own worktree: a Sonnet builder at xhigh effort.'],
  ['10-06 21:36', "The workflow's relay agents try to start the GPT reviews and fail. Only Fable's own thread can call Codex."],
  ['10-06 21:44', 'So Fable launches Astra (code review) and Sol (checks and browser tests) itself.'],
  ['10-06 21:50', 'Astra fails R1-01 on 4 majors in 5 minutes. Fable waits for Sol, then sends one fix round.'],
  ['10-06 22:00', 'Fix round 1: a fresh agent re-reads the task before it fixes the findings.'],
  ['10-06 22:18', "Round 2: Astra finds 2 more majors, and Sol's browser host drops mid-check."],
  ['10-06 22:31', "Round 3: Astra passes in 5 minutes. Sol's browser checks take 25."],
  ['10-06 22:57', 'R1-01 merged after 3 review rounds. The R1-02 contract starts on Opus.'],
  ['10-06 23:49', "Claude's 5-hour limit hits at 728k output tokens. Builds, reviews and merges all stop."],
  ['10-07 02:00', 'The window resets. The cut-off R1-02 builder restarts as a new agent and re-reads its own work.'],
  ['10-07 02:26', 'Contract review at xhigh: Astra finds 6 majors and 3 minors. Sol is green.'],
  ['10-07 03:03', 'Round 2: 2 new majors. Fix round 2 is the last one allowed.'],
  ['10-07 03:44', 'R1-02 merged and frozen. R1-03 builds the migration and applies it to staging.'],
  ['10-07 04:14', 'Astra fails R1-03 three times, mostly on its test-cleanup code.'],
  ['10-07 05:03', 'A scoped review passes the production code. R1-03 merged; the harness fix is deferred.'],
  ['10-07 05:04', 'Fable launches four builders just as the window runs out. All four fail on their first call.'],
  ['10-07 07:07', 'The window reset at 07:00, but the automatic resume fails (ENOTFOUND) and nothing retries it.'],
  ['10-07 08:37', 'You restart the loop. Four builders run at once: three on Opus, one on Sonnet.'],
  ['10-07 08:52', 'Four builders spend the window three times faster: 738k output per working hour.'],
  ['10-07 09:08', 'R1-04 is committed but waits: reviews start only when the whole batch is back.'],
  ['10-07 09:39', 'Fable wakes to read the results and hits the limit at 762k. Codex still has 45% of its week.'],
  ['10-07 10:55', 'From a second thread on a separate quota, all eight reviews start at once.'],
  ['10-07 11:21', '26 minutes later all eight are back. Each of the four tasks needs one fix round.'],
].map(([a, b]) => ({ w: T(a), v: videoAt(T(a)), text: b }));

// ---------- flights (packets between stations) ----------
function station(name, w) {
  const morning = w >= MORNING - 2 * MIN;
  if (name === 'fable') return { x: FABLE.cx + 30, y: FABLE.by - 60 };
  if (name === 'second') return { x: 380, y: 250 };
  if (name.startsWith('cell:')) { const c = cellOf(name.slice(5)); return { x: c.x + c.w / 2, y: c.y + c.h / 2 }; }
  if (name.startsWith('bench:')) { const b = BENCH(+name.slice(6)); return { x: b.x + 70, y: b.y + 40 }; }
  if (name.startsWith('track:')) return trackPos(+name.slice(6));
  const [who, i] = name.split(':');
  if (morning && i !== undefined) return { x: who === 'astra' ? 1440 : 1655, y: 190 + +i * 86 + 40 };
  const s = BOTS_NIGHT[who]; return { x: s.cx, y: s.by - 56 };
}
const flights = [];
for (const a of agents) {
  if (!real(a)) continue;
  if (a.role === 'build' && a !== relaunch) flights.push({ w: a.start, from: 'cell:' + a.task, to: 'bench:' + a.bench, color: P.orange, label: a.task });
  if (a.role === 'fix') flights.push({ w: a.start, from: 'fable', to: 'bench:' + a.bench, color: P.red, label: 'fix' });
}
for (const r of reviews) {
  if (r.who === 'astra-sub') continue;
  const morning = !night(r);
  const slot = morning ? FAN[r.task] : undefined;
  const dest = r.who + (morning ? ':' + slot : '');
  flights.push({ w: r.start, from: 'bench:' + (FAN[r.task] ?? 0), to: dest, color: P.cyan, label: 'diff' });
  flights.push({ w: r.end, from: dest, to: morning ? 'second' : 'fable', color: KIND[verdictKind(r.verdict)][0], label: '' });
}
for (const m of D.merges) flights.push({ w: m.t, from: 'bench:0', to: 'track:' + D.merges.indexOf(m), color: P.green, label: m.task });
const relayFlights = agents.filter(a => a.relay && a.role === 'relay').map(a => ({ w: a.start }));
for (const f of flights) f.v = videoAt(f.w);
for (const f of relayFlights) f.v = videoAt(f.w);

function drawFlights(t, w) {
  for (const f of flights) {
    const k = (t - f.v) / 0.85;
    if (k < 0 || k > 1) continue;
    const a = station(f.from, f.w), b = station(f.to, f.w);
    const e = smooth(k);
    const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 70 - Math.abs(a.x - b.x) * 0.06;
    const px = (1 - e) * (1 - e) * a.x + 2 * (1 - e) * e * mx + e * e * b.x;
    const py = (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * my + e * e * b.y;
    withAlpha(Math.sin(k * Math.PI) * 0.9 + 0.1, () => {
      X.save(); X.shadowColor = f.color; X.shadowBlur = 14;
      box(px - 13, py - 9, 26, 18, 4, f.color);
      X.restore();
      if (f.label) txt(f.label, px, py - 16, { px: 13, mono: true, color: P.ink, align: 'center' });
    });
  }
  // relay envelopes bounce off the Codex panel edge
  for (const f of relayFlights) {
    const k = (t - f.v) / 1.1;
    if (k < 0 || k > 1) continue;
    const a = station('bench:0', f.w), wall = RP.x - 6;
    const go = Math.min(1, k / 0.6), back = Math.max(0, (k - 0.6) / 0.4);
    const px = lerp(a.x, wall, smooth(go)) - back * 90, py = a.y - 120 * Math.sin(go * Math.PI * 0.5) + back * 40;
    withAlpha(1 - back, () => {
      box(px - 12, py - 8, 24, 16, 3, P.ink2);
      line(px - 12, py - 8, px, py + 1, P.deep, 1.5); line(px + 12, py - 8, px, py + 1, P.deep, 1.5);
      if (go >= 1) icon('bad', wall + 2, py - 18, 22, P.red);
    });
  }
}

// ---------- drawing: shared pieces ----------
function header(w, t, mode) {
  const chipW = tw('REPLAY', 15, 600, true, 2) + 26;
  box(40, 26, chipW, 30, 15, null, P.purple, 1.6);
  txt('REPLAY', 40 + chipW / 2, 46, { px: 15, w: 600, mono: true, color: P.purple, align: 'center', ls: 2 });
  const title = mode === 'outro' ? 'What the replay shows' : mode === 'pro' ? 'Before the night: one planning thread' : 'One night of orchestration: the Puck store builder';
  txt(title, 40 + chipW + 18, 50, { px: 30, w: 600 });
  txt('Fable 5.1 orchestrator · Opus and Sonnet builders · GPT-6 Astra and GPT-6.1 Sol reviewers', 40, 84, { px: 17, mono: true, color: P.ink3 });
  if (mode === 'outro') return;
  const clock = hhmm(w);
  const cw = tw(clock, 54, 400, true);
  txt(clock, 1880, 80, { px: 54, mono: true, align: 'right' });
  txt(dayLabel(w) + ' · MYT', 1880 - cw - 20, 52, { px: 16, mono: true, color: P.ink3, align: 'right', ls: 1 });
  const s = mode === 'pro' ? null : segAt(t);
  let speed = mode === 'pro' ? '▶ 1 s ≈ 15 min' : s.kind === 'skip' ? `⏩ skipping ${s.note}` : s.kind === 'play4' ? '▶ 1 s ≈ 4 min' : s.kind === 'hold' ? '❚❚ paused on an event' : `▶ 1 s ≈ ${R} min`;
  txt(speed, 1880 - cw - 20, 80, { px: 16, mono: true, color: s && s.kind === 'skip' ? P.orange : P.ink3, align: 'right' });
  line(40, 104, 1880, 104, P.lineSoft, 1);
}
function panel(p, title, sub, alpha = 1) {
  withAlpha(alpha, () => {
    box(p.x, p.y, p.w, p.h, 16, P.raised, P.lineSoft, 1.5);
    txt(title, p.x + 20, p.y + 32, { px: 15, w: 600, mono: true, color: P.ink3, ls: 2 });
    if (sub) txt(sub, p.x + p.w - 20, p.y + 32, { px: 14, mono: true, color: P.ink4, align: 'right' });
  });
}
function bubble(x, y, maxW, s, o = {}) {
  const px = o.px || 17;
  const lines = wrap(s, px, maxW - 28);
  const h = lines.length * (px + 6) + 18, w = Math.min(maxW, Math.max(...lines.map(l => tw(l, px))) + 28);
  const bx = o.align === 'right' ? x - w : x;
  withAlpha(o.alpha ?? 1, () => {
    box(bx, y, w, h, 12, o.fill || P.panel, o.stroke || P.line, 1.5);
    if (o.tail) {
      X.fillStyle = o.fill || P.panel; X.beginPath();
      X.moveTo(o.tail[0], o.tail[1]); X.lineTo(bx + 18, y + h - 2); X.lineTo(bx + 40, y + h - 2); X.closePath(); X.fill();
    }
    lines.forEach((l, i) => txt(l, bx + 14, y + 12 + px + i * (px + 6) - 3, { px, color: o.color || P.ink }));
  });
  return { w, h };
}
function meter(x, y, w, label, value, frac, color, o = {}) {
  txt(label, x, y, { px: 13, mono: true, color: P.ink3, ls: 1 });
  txt(value, x + w, y, { px: 13, mono: true, color: o.valueColor || P.ink2, align: 'right' });
  const by = y + 8, bh = o.h || 16;
  box(x, by, w, bh, 4, P.deep, P.lineSoft, 1);
  if (frac > 0) box(x + 1, by + 1, Math.max(2, (w - 2) * clamp(frac)), bh - 2, 3, color);
  if (o.cap !== undefined) {
    const cx = x + w * o.cap;
    line(cx, by - 4, cx, by + bh + 4, P.ink, 2);
    txt(o.capLabel || 'cap', cx - 6, by + bh - 4, { px: 12, mono: true, color: P.ink2, align: 'right' });
  }
}

// ---------- the night ----------
function drawNight(t, o = {}) {
  const w = o.w ?? wallAt(t);
  const stageA = o.stageAlpha ?? 1;
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  if (stageA > 0.01) withAlpha(stageA, () => {
    header(w, t, 'night');
    drawStage(t, w);
    drawCaption(t);
  });
  drawSwim(t, w, o.swim || {});
  if (stageA > 0.01) withAlpha(stageA, () => legend(1032));
}

function drawStage(t, w) {
  const morning = w >= MORNING - 0.5 * MIN;
  const limit = inLimit(w);
  const out = w >= T('10-07 07:00') && w < T('10-07 08:37');
  panel(LP, 'ORCHESTRATOR');
  panel(CP, 'CLAUDE QUOTA · BUILDERS', 'one worktree per task');
  panel(RP, 'CODEX QUOTA · REVIEWERS', morning ? 'launched by a 2nd thread' : 'launched only by Fable');

  // Fable
  const asleep = fableAsleep(w);
  const busy = !asleep && fableBusy(w);
  const blink = (t * 0.9 + 0.3) % 3.3 < 0.12;
  drawClawd(FABLE.cx, FABLE.by, FABLE.u, { crown: true, sleep: asleep, blink, bob: busy && Math.floor(t * 4) % 2 ? -FABLE.u : 0 });
  if (asleep) zzz(FABLE.cx + 70, FABLE.by - 96, t, 1);
  txt('FABLE 5.1 · xhigh', FABLE.cx, FABLE.by + 30, { px: 14, w: 600, mono: true, color: P.ink2, align: 'center', ls: 1 });
  for (let i = 0; i < fableCalls.length; i++) {
    const k = (t - fableV[i]) / 0.6; if (k < 0 || k > 1) continue;
    const h = hash(i);
    txt(h > 0.5 ? '✎' : '·', FABLE.cx - 40 + h * 80, FABLE.by - 110 - k * 40, { px: 18, color: P.purple, alpha: 1 - k, align: 'center' });
  }
  if (!morning) bubble(226, 150, 230, fableSays(w), { tail: [FABLE.cx + 60, FABLE.by - 70], px: 17, color: asleep ? P.ink3 : P.ink });

  drawLedger(w);

  // benches
  for (let b = 0; b < 4; b++) drawBench(b, t, w);

  // Claude meters
  const win = WINDOWS.find(x => w >= x.start && w < x.end) || WINDOWS[2];
  const winOut = totalAt(Math.min(w, win.end)) - totalAt(win.start - 1);
  const hit = w >= win.limit;
  meter(510, 548, 760, `CLAUDE · 5-HOUR WINDOW ${hhmm(win.start === START ? T('10-06 21:00') : win.start)}–${hhmm(win.end)}`,
    hit ? `limit at ${win.cap} output · resets ${win.reset}` : `${kfmt(winOut)} output tokens`, winOut / 800000, hit ? P.red : P.c2,
    { cap: 730000 / 800000, capLabel: '≈730k', valueColor: hit ? P.red : P.ink2 });
  const tot = totalAt(w);
  meter(510, 596, 760, 'CLAUDE · WEEK USED (EST. FROM OUTPUT)', `${Math.round(tot / 2.306e6 * 100)}%`, tot / 2.306e6, P.c1, { h: 10 });

  // overlays for the Claude side while it can't work
  if (limit || out) {
    const k = clamp((t - videoAt(limit ? limit.limit : T('10-07 07:00'))) / 0.45);
    withAlpha(0.66 * k, () => { box(LP.x, LP.y + 44, LP.w, LP.h - 44, 0, P.deep); box(CP.x, CP.y + 44, CP.w, CP.h - 120, 0, P.deep); });
    const s = segAt(t);
    const lines = limit
      ? ["CLAUDE'S 5-HOUR LIMIT", `${limit.cap} output tokens · resets ${limit.reset}`]
      : ['WINDOW RESET AT 07:00', w >= T('10-07 07:07') ? 'auto-resume failed · idle until you return' : 'automatic resume at 07:07…'];
    const cx = CP.x + CP.w / 2, cy = 300;
    withAlpha(k, () => {
      box(cx - 270, cy - 58, 540, s.kind === 'skip' ? 140 : 110, 14, 'rgba(25,26,33,0.96)', limit ? P.red : P.yellow, 2);
      txt(lines[0], cx, cy - 12, { px: 30, w: 700, color: limit ? P.red : P.yellow, align: 'center', ls: 1 });
      txt(lines[1], cx, cy + 24, { px: 19, mono: true, color: P.ink2, align: 'center' });
      if (s.kind === 'skip') txt(`⏩ skipping ${s.note}`, cx, cy + 62, { px: 18, mono: true, color: P.orange, align: 'center' });
    });
  }

  drawCodex(t, w);
  if (morning) drawSecondThread(t, w);
  drawTrack(t, w);
  drawFlights(t, w);
}

function drawLedger(w) {
  txt('LEDGER · 31 TASKS', 60, 382, { px: 14, w: 600, mono: true, color: P.ink3, ls: 2 });
  let done = 0, waiting = 0, fix = 0, deferred = 0, inrev = 0;
  LEDGER.forEach(([rel, ids], r) => {
    txt(rel, 60, cellPos(r, 0).y + 18, { px: 13, mono: true, color: P.ink4 });
    ids.forEach((n, i) => {
      const id = `${rel}-${n}`;
      const st = ledgerStatus(id, w);
      const c = cellPos(r, i);
      const S = {
        todo: [null, P.line, P.ink4], done: [P.c4, null, P.deep], building: [P.c2, null, P.deep], active: ['rgba(200,130,44,0.35)', P.c2, P.ink],
        review: [P.c3, null, P.deep], waiting: [null, P.cyan, P.cyan], fix: [null, P.yellow, P.yellow], deferred: ['rgba(98,114,164,0.5)', null, P.ink2],
        failed: [null, P.red, P.red],
      }[st];
      box(c.x, c.y, c.w, c.h, 5, S[0], S[1], 1.5, st === 'waiting' ? [4, 3] : undefined);
      txt(n, c.x + c.w / 2, c.y + c.h / 2 + 1, { px: n.length > 2 ? 11 : 13, mono: true, color: S[2], align: 'center', base: 'middle' });
      if (st === 'done') done++; if (st === 'waiting') waiting++; if (st === 'review' && FAN[id] !== undefined) inrev++; if (st === 'fix') fix++; if (st === 'deferred') deferred++;
    });
  });
  txt(`${done} of 31 done`, 60, 598, { px: 24, w: 600 });
  const extra = fix + inrev === 4 && fix ? `· ${fix} of 4 need a fix round` : inrev ? `· ${inrev} in review` : waiting ? `· ${waiting} built, not reviewed` : deferred ? '· 1 deferred' : '';
  txt(extra, 60 + tw(`${done} of 31 done`, 24, 600) + 10, 598, { px: 16, mono: true, color: P.ink3 });
}

function drawBench(b, t, w) {
  const B = BENCH(b);
  const st = benchState(b, w);
  if (!st) {
    box(B.x, B.y, B.w, B.h, 12, null, P.line, 1.5, [6, 6]);
    txt('idle worktree', B.x + B.w / 2, B.y + B.h / 2 + 6, { px: 16, mono: true, color: P.ink4, align: 'center' });
    return;
  }
  const a = st.agent;
  box(B.x, B.y, B.w, B.h, 12, P.bg, st.mode === 'work' ? P.c2 : P.line, st.mode === 'work' ? 2 : 1.5);
  pill(B.x + B.w - 12, B.y + 12, st.status[0], st.status[1], 12, 'right');
  const cx = B.x + 72, by = B.y + 140, u = 6;
  txt(`puck/${st.task.toLowerCase()}`, cx, B.y + B.h - 12, { px: 12, mono: true, color: P.ink4, align: 'center' });
  const work = st.mode === 'work';
  const blink = (t * 1.1 + b * 0.7) % 3.1 < 0.12;
  if (st.mode === 'ghost') {
    drawClawd(cx, by, u, { hat: HATS[a.hatKey], alpha: 0.55, mark: true });
  } else {
    drawClawd(cx, by, u, { hat: HATS[a.hatKey], sleep: st.mode === 'sleep', blink, bob: work && Math.floor(t * 4 + b) % 2 ? -u : 0, step: work && Math.floor(t * 4 + b) % 2 === 0 });
    if (st.mode === 'sleep') zzz(cx + 30, by - 70, t + b, 0.7);
  }
  // code and thinking glyphs, one per model call
  if (st.mode !== 'ghost') for (let i = 0; i < a.vcalls.length; i++) {
    const k = (t - a.vcalls[i]) / 0.5; if (k < 0 || k > 1) continue;
    const c = a.calls[i], h = hash(i + b * 1000);
    const thinking = c[2] > c[1] * 0.5;
    const glyph = thinking ? '···' : ['{ }', '</>', '=>', 'fn', '++', '[ ]', '//'][Math.floor(h * 7)];
    txt(glyph, B.x + 22 + h * 100, B.y + 62 - k * 26, { px: Math.round(12 + Math.min(5, Math.sqrt(c[1]) / 14)), w: 600, mono: true, color: thinking ? P.purple : P.orange, alpha: 0.85 * (1 - k), align: 'center' });
  }
  const tx = B.x + 150, tr = B.x + B.w - 16;
  txt(st.task, tx, B.y + 72, { px: 28, w: 600 });
  txt(TITLES[st.task] || '', tx, B.y + 96, { px: 17, color: P.ink2 });
  txt(`${a.model === 'opus' ? 'Opus 5.5' : 'Sonnet 5.5'} · xhigh${a.role === 'fix' ? ` · fix ${a.fixRound}` : ''}`, tx, B.y + 120, { px: 14, mono: true, color: P.ink3 });
  if (st.mode !== 'ghost') {
    const i = cumAt(a.pre, w);
    const o = i < 0 ? 0 : a.pre[i][1], th = i < 0 ? 0 : a.pre[i][2];
    txt(`${kfmt(o)} out`, tx, B.y + 146, { px: 15, mono: true, color: P.ink });
    if (o > 0) txt(`${Math.round(th / o * 100)}% thinking`, tr, B.y + 146, { px: 15, mono: true, color: P.purple, align: 'right' });
    // this agent's output so far (orange) and the thinking part of it (purple), against 420k
    const bw = tr - tx; box(tx, B.y + 156, bw, 6, 3, P.deep);
    if (o > 0) { box(tx, B.y + 156, bw * clamp(o / 420000), 6, 3, P.c2); box(tx, B.y + 156, bw * clamp(th / 420000), 6, 3, P.c1); }
  } else txt('failed on its first call', tx, B.y + 146, { px: 14, mono: true, color: P.red });
}

function reviewerNight(who, w) {
  const list = reviews.filter(r => r.who === who && night(r));
  const act = list.find(r => w >= r.start && w <= r.end);
  let last = null; for (const r of list) if (r.end <= w) last = r;
  return { act, last };
}
function drawCodex(t, w) {
  const morning = w >= MORNING - 0.5 * MIN;
  const k = clamp((w - (MORNING - 0.5 * MIN)) / (2 * MIN));
  if (k < 1) withAlpha(1 - k, () => {
    for (const who of ['astra', 'sol']) {
      const s = BOTS_NIGHT[who];
      const { act, last } = reviewerNight(who, w);
      const look = act ? [-1, 0, 1, 0][Math.floor(t * 2.6 + (who === 'sol' ? 2 : 0)) % 4] : 0;
      const blink = (t * 0.8 + (who === 'sol' ? 1.3 : 0)) % 3.6 < 0.12;
      drawBot(s.cx, s.by, 8, { symbol: who === 'astra' ? 'star' : 'sun', tool: who === 'astra' ? 'lens' : 'clip', look, blink, dim: !act, bob: act && Math.floor(t * 3) % 2 ? -4 : 0 });
      txt(who === 'astra' ? 'ASTRA' : 'SOL', s.cx, s.by + 32, { px: 22, w: 600, align: 'center', ls: 2 });
      txt(who === 'astra' ? 'GPT-6 · code review' : 'GPT-6.1 · checks + browser', s.cx, s.by + 54, { px: 14, mono: true, color: P.ink3, align: 'center' });
      const cur = act || last;
      if (cur) {
        const effort = cur.effort === 'xhigh' ? 'xhigh' : 'high';
        txt(`${cur.task} · round ${cur.round} · ${effort}`, s.cx, s.by + 80, { px: 15, mono: true, color: act ? P.ink : P.ink3, align: 'center' });
        if (act) {
          const mins = Math.max(0, (w - act.start) / MIN);
          pill(s.cx, s.by + 92, `${who === 'astra' ? 'REVIEWING' : 'VERIFYING'} · ${Math.floor(mins)} MIN`, 'review', 13, 'center');
        } else if (last) {
          const pop = backOut((t - videoAt(last.end)) / 0.4);
          const stale = w - last.end > 40 * MIN;
          X.save(); X.translate(s.cx, s.by + 106); X.scale(pop, pop); X.translate(-s.cx, -(s.by + 106));
          pill(s.cx, s.by + 92, last.verdict, verdictKind(last.verdict), 13, 'center', stale ? 0.45 : 1);
          X.restore();
        }
      } else txt('waiting for work', s.cx, s.by + 80, { px: 15, mono: true, color: P.ink4, align: 'center' });
    }
    // Astra's own sub-reviewers
    const subs = reviews.filter(r => r.who === 'astra-sub' && w >= r.start && w <= r.end);
    subs.slice(0, 2).forEach((r, i) => {
      const cx = 1352, by = 300 + i * 66;
      drawBot(cx, by, 3, { symbol: 'star', look: [-1, 0, 1, 0][Math.floor(t * 3 + i) % 4] });
      txt(i === 0 ? 'standards' : 'spec', cx, by + 16, { px: 11, mono: true, color: P.ink3, align: 'center' });
    });
    if (subs.length) txt("Astra's sub-reviews", 1352, 228, { px: 11, mono: true, color: P.ink4, align: 'center' });
    if (w >= T('10-07 09:39') && w < MORNING) {
      bubble(RP.x + 70, 148, 430, '4 tasks are committed and ready. Only Fable can launch us, and Fable is out of Claude.', { px: 17, stroke: P.cyan });
    }
  });
  if (morning) withAlpha(k, () => {
    const colA = 1440, colS = 1655;
    txt('TASK', RP.x + 22, 178, { px: 12, mono: true, color: P.ink4, ls: 1 });
    txt('ASTRA · review · high', colA - 30, 178, { px: 12, mono: true, color: P.ink3, ls: 1 });
    txt('SOL · verify · high', colS - 30, 178, { px: 12, mono: true, color: P.ink3, ls: 1 });
    const SHORT = { 'NOT VERIFIED': 'NOT RUN' };
    for (const r of reviews.filter(x => !night(x))) {
      const row = FAN[r.task], y0 = 190 + row * 86;
      const cx = r.who === 'astra' ? colA : colS, by = y0 + 72;
      if (r.who === 'astra') { line(RP.x + 20, y0 - 2, RP.x + RP.w - 20, y0 - 2, P.lineSoft, 1); txt(r.task, RP.x + 22, y0 + 50, { px: 18, w: 600, mono: true }); }
      const act = w >= r.start && w <= r.end, done = w > r.end;
      if (w < r.start - 0.3 * MIN) { drawBot(cx, by, 4, { symbol: r.who === 'astra' ? 'star' : 'sun', dim: true, alpha: 0.35 }); continue; }
      drawBot(cx, by, 4, { symbol: r.who === 'astra' ? 'star' : 'sun', dim: !act, look: act ? [-1, 0, 1, 0][Math.floor(t * 2.6 + row) % 4] : 0, bob: act && Math.floor(t * 3 + row) % 2 ? -3 : 0 });
      if (done) {
        const pop = backOut((t - videoAt(r.end)) / 0.4);
        X.save(); X.translate(cx + 40, y0 + 44); X.scale(pop, pop); X.translate(-(cx + 40), -(y0 + 44));
        pill(cx + 38, y0 + 30, SHORT[r.verdict] || r.verdict, verdictKind(r.verdict), 11);
        X.restore();
      } else if (act) txt(`working · ${Math.floor((w - r.start) / MIN)} min`, cx + 40, y0 + 50, { px: 14, mono: true, color: P.cyan });
    }
  });
  const cm = cumAt(D.codexMeter, w);
  const pct = cm < 0 ? 38 : D.codexMeter[cm][1];
  meter(RP.x + 20, 560, RP.w - 40, 'CODEX · WEEK USED', `${Math.round(pct)}%`, pct / 100, P.c3);
  if (!morning) txt('Reviews start only when Fable asks.', RP.x + 20, 616, { px: 13, mono: true, color: P.ink4 });
  else txt('Started from a second thread instead.', RP.x + 20, 616, { px: 13, mono: true, color: P.cyan });
}

function drawSecondThread(t, w) {
  const k = clamp((w - (MORNING - 1.2 * MIN)) / (1.5 * MIN));
  if (k <= 0) return;
  withAlpha(k, () => {
    const cx = 372, by = 304;
    box(282, 132, 180, 214, 12, 'rgba(33,34,44,0.97)', P.c3, 2);
    drawClawd(cx, by - 14, 5, { headset: true, bob: w < T('10-07 11:21') && Math.floor(t * 3) % 2 ? -5 : 0 });
    txt('OPUS · 2ND THREAD', cx, by + 12, { px: 12, w: 600, mono: true, color: P.ink, align: 'center' });
    txt('separate quota', cx, by + 30, { px: 12, mono: true, color: P.cyan, align: 'center' });
    txt(w < T('10-07 11:21') ? 'launching 8 reviews' : 'all 8 back', cx, 164, { px: 14, mono: true, color: P.ink2, align: 'center' });
  });
}

function trackPos(i) { return { x: 340 + i * 250, y: 674 }; }
function drawTrack(t, w) {
  txt('INTEGRATION BRANCH', 40, 668, { px: 13, w: 600, mono: true, color: P.ink3, ls: 1 });
  txt('feat/puck-store-editor', 40, 688, { px: 13, mono: true, color: P.ink4 });
  line(300, 674, 1500, 674, P.line, 2);
  D.merges.forEach((m, i) => {
    if (w < m.t) return;
    const p = trackPos(i), k = backOut((t - videoAt(m.t)) / 0.5);
    X.save(); X.translate(p.x, p.y); X.scale(k, k);
    icon('good', 0, 0, 22, P.green);
    X.restore();
    txt(`${m.task} · ${m.sha}`, p.x + 18, p.y + 5, { px: 14, mono: true, color: P.ink2 });
  });
  if (w >= T('10-07 11:19')) {
    const k = clamp((t - videoAt(T('10-07 11:19'))) / 0.4);
    withAlpha(k, () => pill(1520, 659, 'R1-01…R1-03 PUSHED TO STAGING', 'good', 12));
  }
}

function drawCaption(t) {
  let cur = null, idx = -1;
  CAPTIONS.forEach((c, i) => { if (t >= c.v) { cur = c; idx = i; } });
  box(40, 712, 1840, 74, 12, P.raised, P.lineSoft, 1.5);
  if (!cur) return;
  const k = clamp((t - cur.v) / 0.35);
  withAlpha(k, () => {
    txt(hhmm(cur.w), 64, 758, { px: 20, w: 600, mono: true, color: P.purple });
    const px = tw(cur.text, 26) > 1680 ? 22 : 26;
    txt(cur.text, 150 + (1 - k) * 12, 757, { px, color: P.ink });
  });
}

// ---------- swimlanes ----------
const SW = { x0: 200, x1: 1860 };
function swimGeom(o = {}) {
  const y0 = o.y0 ?? 808, s = o.s ?? 1;
  const L = {};
  let y = y0;
  L.fable = { y, h: 16 * s }; y += (16 + 8) * s;
  L.b = []; for (let i = 0; i < 4; i++) { L.b.push({ y, h: 14 * s }); y += 17 * s; }
  y += 6 * s;
  L.astra = { y, h: 16 * s }; y += 22 * s;
  L.sol = { y, h: 16 * s }; y += 24 * s;
  L.wait = { y, h: 16 * s }; y += 26 * s;
  L.axis = y; L.s = s; L.y0 = y0;
  return L;
}
const xOf = w => SW.x0 + (w - START) / (END - START) * (SW.x1 - SW.x0);
function drawSwim(t, w, o) {
  const L = swimGeom(o);
  const s = L.s, fpx = Math.round(13 * Math.min(s, 1.25));
  const labels = [['FABLE', L.fable], ['BUILDERS', { y: L.b[0].y, h: L.b[3].y + L.b[3].h - L.b[0].y }], ['ASTRA', L.astra], ['SOL', L.sol], ['WAITING', L.wait]];
  for (const [n, l] of labels) txt(n, 40, l.y + l.h / 2 + 5, { px: fpx, w: 600, mono: true, color: P.ink3, ls: 1, alpha: o.dimLabels?.includes(n) ? 0.35 : 1 });
  for (const l of [L.fable, ...L.b, L.astra, L.sol, L.wait]) box(SW.x0, l.y, SW.x1 - SW.x0, l.h, 3, 'rgba(25,26,33,0.7)');
  // hour ticks
  for (let h = T('10-06 21:00'); h <= END; h += 60 * MIN) {
    const x = xOf(h);
    line(x, L.fable.y - 4, x, L.wait.y + L.wait.h + 4, 'rgba(98,114,164,0.18)', 1);
    const lab = hhmm(h).slice(0, 2);
    txt(lab, x, L.axis + 12, { px: fpx, mono: true, color: P.ink4, align: 'center' });
    if (lab === '21' || lab === '00') txt(lab === '21' ? '6 Oct' : '7 Oct', x, L.axis + 12 + fpx + 4, { px: fpx - 1, mono: true, color: P.ink3, align: 'center' });
  }
  const reveal = o.full ? END : w;
  const rx = xOf(Math.max(START, Math.min(END, reveal)));
  X.save(); X.beginPath(); X.rect(SW.x0 - 2, L.y0 - 40, rx - SW.x0 + 2, L.axis - L.y0 + 44); X.clip();
  const dim = n => (o.focus && !o.focus.includes(n) ? 0.25 : 1);
  // waits
  withAlpha(dim('wait'), () => {
    for (const x of D.waits) {
      const a = xOf(x.start), b = xOf(Math.min(x.end, END));
      box(a, L.wait.y, b - a, L.wait.h, 3, hatch(x.kind, x.kind === 'limit' ? 'rgba(255,85,85,0.55)' : 'rgba(158,163,196,0.45)', 'rgba(25,26,33,0.6)'));
      if (b - a > 120) txt(x.kind === 'limit' ? 'Claude limit' : 'you were out', (a + b) / 2, L.wait.y + L.wait.h / 2 + 4, { px: Math.round(11 * Math.min(s, 1.3)), mono: true, color: P.ink, align: 'center' });
    }
  });
  // Fable calls
  withAlpha(dim('fable'), () => { X.fillStyle = P.c1; for (const c of fableCalls) X.fillRect(xOf(c[0]) - 0.75, L.fable.y + 2, 1.5, L.fable.h - 4); });
  // builders
  withAlpha(dim('builders'), () => {
    for (const a of agents) {
      const lane = L.b[a.bench];
      if (a.ghost) { txt('✕', xOf(a.start), lane.y + lane.h - 2, { px: Math.round(12 * s), w: 700, color: P.red, align: 'center' }); continue; }
      if (a.relay) { box(xOf(a.start), lane.y + 2, Math.max(2, xOf(a.end) - xOf(a.start)), lane.h - 4, 2, P.red); continue; }
      const x = xOf(a.start), bw = Math.max(2, xOf(a.end) - x);
      box(x, lane.y, bw, lane.h, 3, a.role === 'fix' ? hatch('fix', P.orange, 'rgba(200,130,44,0.55)', 6, 2) : P.c2);
      if (bw > 44) txt(a.role === 'fix' ? `fix ${a.fixRound}` : a.task, x + 4, lane.y + lane.h - 3, { px: Math.round(11 * Math.min(s, 1.3)), w: 600, mono: true, color: P.deep, maxW: bw - 6 });
    }
  });
  // reviewers
  for (const who of ['astra', 'sol']) withAlpha(dim(who), () => {
    const lane = L[who];
    const morning = reviews.filter(r => r.who === who && !night(r));
    for (const r of reviews.filter(r => (r.who === who || (who === 'astra' && r.who === 'astra-sub')) && night(r))) {
      const x = xOf(r.start), bw = Math.max(2, xOf(r.end) - x);
      if (r.who === 'astra-sub') { box(x, lane.y + lane.h - 4, bw, 3, 1, P.cyan); continue; }
      box(x, lane.y, bw, r.who === 'astra' ? lane.h - 5 : lane.h, 3, who === 'astra' ? P.c3 : P.sol);
    }
    morning.forEach((r, i) => { const x = xOf(r.start); box(x, lane.y + i * lane.h / 4, Math.max(2, xOf(r.end) - x), lane.h / 4 - 1, 1, who === 'astra' ? P.c3 : P.sol); });
  });
  // merges and limits
  for (const m of D.merges) {
    const x = xOf(m.t);
    line(x, L.fable.y - 6, x, L.sol.y + L.sol.h + 2, P.green, 1.5, [3, 3]);
    txt(`✓ ${m.task}`, x + 4, L.fable.y - 8, { px: Math.round(11 * Math.min(s, 1.3)), w: 600, mono: true, color: P.green });
  }
  for (const win of WINDOWS) {
    const x = xOf(win.limit);
    line(x, L.fable.y - 6, x, L.wait.y + L.wait.h, P.red, 1.5);
  }
  X.restore();
  if (!o.full && w < END) {
    line(rx, L.y0 - 18, rx, L.axis - 4, P.ink, 2);
    X.fillStyle = P.ink; X.beginPath(); X.moveTo(rx - 6, L.y0 - 22); X.lineTo(rx + 6, L.y0 - 22); X.lineTo(rx, L.y0 - 14); X.fill();
  }
  return L;
}
function legend(y) {
  const items = [
    [P.c1, 'Fable call', 'tick'], [P.c2, 'build'], ['fix', 'fix round'], [P.c3, 'Astra review'], [P.sol, 'Sol verify'],
    ['limit', 'waiting for the Claude limit'], ['out', 'you were out'], [P.green, 'merge', 'dash'], [P.red, 'Claude limit hit', 'line'],
  ];
  let x = 40;
  for (const [c, label, kind] of items) {
    if (kind === 'tick') box(x + 6, y - 12, 3, 16, 1, c);
    else if (kind === 'dash') line(x + 7, y - 13, x + 7, y + 4, c, 2, [3, 3]);
    else if (kind === 'line') line(x + 7, y - 13, x + 7, y + 4, c, 2);
    else if (c === 'fix') box(x, y - 12, 18, 14, 3, hatch('fix', P.orange, 'rgba(200,130,44,0.55)', 6, 2));
    else if (c === 'limit') box(x, y - 12, 18, 14, 3, hatch('limit', 'rgba(255,85,85,0.55)', 'rgba(25,26,33,0.6)'));
    else if (c === 'out') box(x, y - 12, 18, 14, 3, hatch('out', 'rgba(158,163,196,0.45)', 'rgba(25,26,33,0.6)'));
    else box(x, y - 12, 18, 14, 3, c);
    txt(label, x + 26, y, { px: 14, mono: true, color: P.ink3 });
    x += 26 + tw(label, 14, 400, true) + 30;
  }
}

// ---------- title ----------
function drawTitle(t) {
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  const k = clamp(t / 0.6);
  withAlpha(k, () => {
    const chipW = tw('REPLAY', 16, 600, true, 2) + 28;
    box(160, 150, chipW, 32, 16, null, P.purple, 1.6);
    txt('REPLAY', 160 + chipW / 2, 172, { px: 16, w: 600, mono: true, color: P.purple, align: 'center', ls: 2 });
    txt('One night of orchestration', 160, 270, { px: 76, w: 600 });
    txt('The Puck store builder, 6 to 7 Oct 2026: one orchestrator, builders on one quota, reviewers on another.', 160, 330, { px: 28, color: P.ink2 });
  });
  const cast = [
    { kind: 'clawd', o: { crown: true }, u: 9, name: 'Fable 5.1', role: 'orchestrator' },
    { kind: 'clawd', o: { hat: HATS.opus }, u: 8, name: 'Opus 5.5', role: 'builder' },
    { kind: 'clawd', o: { hat: HATS.sonnet }, u: 8, name: 'Sonnet 5.5', role: 'builder' },
    { kind: 'bot', o: { symbol: 'star', tool: 'lens' }, p: 9, name: 'GPT-6 Astra', role: 'code review' },
    { kind: 'bot', o: { symbol: 'sun', tool: 'clip' }, p: 9, name: 'GPT-6.1 Sol', role: 'checks + browser' },
  ];
  const xs = [300, 600, 880, 1270, 1580], base = 700;
  cast.forEach((c, i) => {
    const k2 = backOut((t - 0.9 - i * 0.28) / 0.5);
    if (k2 <= 0) return;
    X.save(); X.translate(xs[i], base); X.scale(k2, k2); X.translate(-xs[i], -base);
    const blink = (t + i) % 2.4 < 0.12;
    if (c.kind === 'clawd') drawClawd(xs[i], base, c.u, { ...c.o, blink, bob: Math.floor(t * 2.5 + i) % 2 ? -c.u : 0 });
    else drawBot(xs[i], base, c.p, { ...c.o, blink, look: [-1, 0, 1, 0][Math.floor(t * 2 + i) % 4] });
    X.restore();
    withAlpha(clamp((t - 1.1 - i * 0.28) / 0.4), () => {
      txt(c.name, xs[i], base + 54, { px: 28, w: 600, align: 'center' });
      txt(c.role, xs[i], base + 86, { px: 19, mono: true, color: P.ink3, align: 'center' });
    });
  });
  const k3 = clamp((t - 2.8) / 0.5);
  withAlpha(k3, () => {
    line(200, 830, 980, 830, P.c2, 3); txt('CLAUDE · one quota, one 5-hour window', 590, 866, { px: 19, w: 600, mono: true, color: P.orange, align: 'center', ls: 1 });
    line(1150, 830, 1700, 830, P.c3, 3); txt('CODEX · a separate weekly quota', 1425, 866, { px: 19, w: 600, mono: true, color: P.cyan, align: 'center', ls: 1 });
  });
  withAlpha(clamp((t - 3.6) / 0.5), () => {
    txt('Only the orchestrator can start a review. Every number in this replay comes from the session logs.', 960, 960, { px: 22, color: P.ink3, align: 'center' });
  });
  if (t > TITLE_END - 0.5) withAlpha((t - (TITLE_END - 0.5)) / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
}

// ---------- prologue: the planning thread ----------
const PRO = D.prologue;
const PRO_W0 = T('10-06 18:15'), PRO_W1 = T('10-06 20:58');
const PRO_PLAY = [PRO_START + 0.4, PRO_END - 1.6];
const proWall = t => PRO_W0 + clamp((t - PRO_PLAY[0]) / (PRO_PLAY[1] - PRO_PLAY[0])) * (PRO_W1 - PRO_W0);
const proVideo = w => PRO_PLAY[0] + (w - PRO_W0) / (PRO_W1 - PRO_W0) * (PRO_PLAY[1] - PRO_PLAY[0]);
const PRO_CAPS = [
  ['10-06 18:15', 'You ask an Opus thread which page builder the platform uses. It sends a Sonnet agent to read the code.'],
  ['10-06 18:35', 'An Opus agent builds a working Puck trial on a real store in 32 minutes.'],
  ['10-06 19:13', 'More Sonnet agents survey open-source builders, theme cloning and extension points.'],
  ['10-06 19:46', 'A Sonnet agent turns the trial into a real editor: phase 1, 36 minutes.'],
  ['10-06 20:07', 'Then the plan is grilled: 31 questions, each with a recommended answer you accept or change.'],
  ['10-06 20:44', 'The thread writes the spec, a 31-task ledger and a start prompt. Fable takes over at 20:58.'],
].map(([a, b]) => ({ w: T(a), text: b }));
function drawPrologue(t) {
  const lt = t + PRO_START;
  const w = proWall(lt);
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  header(w, lt, 'pro');
  // planner
  box(40, 130, 380, 520, 16, P.raised, P.lineSoft);
  txt('PLANNING THREAD', 60, 162, { px: 15, w: 600, mono: true, color: P.ink3, ls: 2 });
  const busy = PRO.subagents.some(s => w >= s.start && w <= s.end) || (w >= PRO.grill[0] && w <= PRO.grill[1]);
  drawClawd(230, 420, 10, { blink: (lt % 2.9) < 0.12, bob: Math.floor(lt * 3) % 2 && busy ? -10 : 0 });
  txt('OPUS 5.5 · xhigh', 230, 460, { px: 18, w: 600, mono: true, color: P.ink, align: 'center' });
  txt('one chat with you', 230, 486, { px: 15, mono: true, color: P.ink3, align: 'center' });
  const nSub = PRO.subagents.filter(s => w >= s.start).length;
  txt(`${nSub} sub-agents so far`, 230, 560, { px: 22, w: 600, align: 'center' });
  txt('each with a fresh context', 230, 590, { px: 15, mono: true, color: P.ink3, align: 'center' });
  // sub-agent cards
  box(440, 130, 880, 520, 16, P.raised, P.lineSoft);
  txt('SUB-AGENTS', 460, 162, { px: 15, w: 600, mono: true, color: P.ink3, ls: 2 });
  txt('research, a trial build, phase 1', 1300, 162, { px: 14, mono: true, color: P.ink4, align: 'right' });
  PRO.subagents.forEach((s, i) => {
    if (w < s.start) return;
    const col = i % 2, row = Math.floor(i / 2);
    const x = 460 + col * 425, y = 180 + row * 92;
    const k = backOut((lt - proVideo(s.start)) / 0.4);
    const done = w >= s.end;
    X.save(); X.translate(x + 200, y + 40); X.scale(k, k); X.translate(-(x + 200), -(y + 40));
    box(x, y, 410, 80, 10, P.bg, done ? P.line : P.c2, done ? 1.5 : 2);
    drawClawd(x + 44, y + 62, 3, { hat: HATS[s.model], bob: !done && Math.floor(lt * 4 + i) % 2 ? -3 : 0 });
    txt(s.label, x + 86, y + 34, { px: 18, w: 600, maxW: 300 });
    const mins = Math.max(1, Math.round((Math.min(w, s.end) - s.start) / MIN));
    txt(`${s.model === 'opus' ? 'Opus' : 'Sonnet'} · ${mins} min`, x + 86, y + 60, { px: 14, mono: true, color: P.ink3 });
    if (done) icon('good', x + 384, y + 26, 20, P.green);
    else txt('working', x + 396, y + 30, { px: 12, mono: true, color: P.orange, align: 'right' });
    X.restore();
  });
  // grill + documents
  box(1340, 130, 540, 520, 16, P.raised, P.lineSoft);
  txt('GRILL', 1360, 162, { px: 15, w: 600, mono: true, color: P.ink3, ls: 2 });
  const gk = clamp((w - PRO.grill[0]) / (PRO.grill[1] - PRO.grill[0]));
  const q = w < PRO.grill[0] ? 0 : Math.max(1, Math.round(gk * 31));
  txt(q ? `Q${q}` : '—', 1360, 250, { px: 72, w: 600, color: q ? P.ink : P.ink4 });
  txt('of 31 decisions', 1360 + tw(q ? `Q${q}` : '—', 72, 600) + 16, 250, { px: 20, mono: true, color: P.ink3 });
  for (let i = 0; i < 31; i++) {
    const x = 1360 + (i % 11) * 44, y = 280 + Math.floor(i / 11) * 40;
    box(x, y, 36, 30, 6, i < q ? P.c1 : null, i < q ? null : P.line, 1.5);
  }
  const docs = [['Spec', 'every decision'], ['Ledger', '31 tasks · 4 releases'], ['Start prompt', 'for Fable']];
  docs.forEach(([a, b], i) => {
    const k = backOut((lt - proVideo(PRO.spec) - i * 0.18) / 0.4);
    if (k <= 0) return;
    const x = 1360 + i * 168, y = 430;
    X.save(); X.translate(x + 75, y + 90); X.scale(k, k); X.translate(-(x + 75), -(y + 90));
    box(x, y, 150, 190, 8, '#ECE7DA', null);
    X.fillStyle = '#C9C2B0'; for (let j = 0; j < 6; j++) X.fillRect(x + 18, y + 70 + j * 16, 114 - (j % 3) * 18, 5);
    txt(a, x + 18, y + 40, { px: 20, w: 700, color: P.deep });
    txt(b, x + 18, y + 176, { px: 12, mono: true, color: '#6B6656' });
    X.restore();
  });
  // mini timeline
  const tx0 = 200, tx1 = 1860, ty = 700;
  const xo = m => tx0 + (m - PRO_W0) / (PRO_W1 - PRO_W0) * (tx1 - tx0);
  txt('SUB-AGENTS', 40, ty + 30, { px: 13, w: 600, mono: true, color: P.ink3, ls: 1 });
  txt('GRILL', 40, ty + 98, { px: 13, w: 600, mono: true, color: P.ink3, ls: 1 });
  const rows = [];
  X.save(); X.beginPath(); X.rect(tx0, ty - 10, xo(w) - tx0, 160); X.clip();
  PRO.subagents.forEach(s => {
    let r = rows.findIndex(e => e < s.start); if (r < 0) { r = rows.length; rows.push(0); } rows[r] = s.end + 4 * MIN;
    box(xo(s.start), ty + 12 + r * 20, Math.max(4, xo(s.end) - xo(s.start)), 14, 3, s.model === 'opus' ? P.yellow : P.pink);
  });
  box(xo(PRO.grill[0]), ty + 86, xo(PRO.grill[1]) - xo(PRO.grill[0]), 16, 3, P.c1);
  X.restore();
  for (let h = T('10-06 18:30'); h <= PRO_W1; h += 30 * MIN) {
    const x = xo(h); line(x, ty + 4, x, ty + 112, 'rgba(98,114,164,0.2)', 1);
    txt(hhmm(h), x, ty + 132, { px: 13, mono: true, color: P.ink4, align: 'center' });
  }
  const px = xo(w); line(px, ty - 6, px, ty + 114, P.ink, 2);
  txt('Opus', 1700, ty - 14, { px: 13, mono: true, color: P.yellow }); txt('Sonnet', 1760, ty - 14, { px: 13, mono: true, color: P.pink });
  // caption
  let cap = null; for (const c of PRO_CAPS) if (w >= c.w) cap = c;
  box(40, 880, 1840, 74, 12, P.raised, P.lineSoft);
  if (cap) {
    const k = clamp((lt - proVideo(cap.w)) / 0.35);
    withAlpha(k, () => {
      txt(hhmm(cap.w), 64, 926, { px: 20, w: 600, mono: true, color: P.purple });
      txt(cap.text, 150, 925, { px: tw(cap.text, 26) > 1680 ? 22 : 26 });
    });
  }
  // fade in, and hand over to the night
  if (t < 0.4) withAlpha(1 - t / 0.4, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  if (lt > PRO_END - 0.9) withAlpha(clamp((lt - (PRO_END - 0.9)) / 0.4), () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  if (lt > PRO_END - 0.5) withAlpha(clamp((lt - (PRO_END - 0.5)) / 0.5), () => drawNight(PRO_END));
}

// ---------- outro ----------
const FINDINGS = [
  { k: 'turns', title: '0 minutes of overlap', text: 'Claude builders and Codex reviewers never worked at the same time. Out of 417 working minutes, builders ran 274 and reviewers 103.', focus: ['builders', 'astra', 'sol'] },
  { k: 'loop', title: 'Review took longer than building', text: 'From first review to merge took 199 minutes across the three merged tasks, against 131 minutes of first builds.', focus: ['builders', 'astra', 'sol'] },
  { k: 'wait', title: '6 h 28 min at the limit', text: "43% of the night went to waiting for Claude's 5-hour limit. Fan-out reached it in 62 minutes.", focus: ['wait', 'builders'] },
  { k: 'morning', title: '8 reviews in 26 minutes', text: 'Launched from a second thread on a separate quota, all eight ran side by side while Claude was still out.', focus: ['astra', 'sol', 'wait'] },
];
function drawOutro(u) {
  const k = smooth(u / 1.6);
  const step = Math.min(FINDINGS.length - 1, Math.max(-1, Math.floor((u - 1.6) / 2.4)));
  const f = FINDINGS[step];
  const swim = { y0: lerp(808, 640, k), s: lerp(1, 1.3, k), full: true, focus: k >= 1 && f ? f.focus : null };
  drawNight(MAIN_END - 0.001, { stageAlpha: 1 - k, swim, w: END });
  if (k > 0.2) withAlpha(clamp((k - 0.2) / 0.8), () => {
    header(END, MAIN_END, 'outro');
    FINDINGS.forEach((g, i) => {
      const a = clamp((u - 1.6 - i * 2.4) / 0.5);
      if (a <= 0) return;
      const x = 40 + (i % 2) * 930, y = 140 + Math.floor(i / 2) * 200;
      withAlpha(a * (i === step ? 1 : 0.55), () => {
        box(x, y, 910, 180, 14, i === step ? P.panel : P.raised, i === step ? P.purple : P.lineSoft, i === step ? 2 : 1.5);
        txt(String(i + 1).padStart(2, '0'), x + 24, y + 50, { px: 22, w: 600, mono: true, color: P.purple });
        txt(g.title, x + 70, y + 52, { px: 34, w: 600 });
        wrap(g.text, 22, 820).forEach((l, j) => txt(l, x + 70, y + 92 + j * 30, { px: 22, color: P.ink2 }));
      });
    });
    if (step >= 0 && u > 1.6) {
      const L = swimGeom(swim);
      withAlpha(clamp((u - 1.6 - step * 2.4) / 0.5), () => outroMarks(f.k, L));
    }
  });
  if (u > OUTRO - 2.6) {
    const e = clamp((u - (OUTRO - 2.6)) / 0.6);
    withAlpha(e, () => {
      X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
      txt('3 of 31 tasks merged', 960, 420, { px: 64, w: 600, align: 'center' });
      txt('2.21M Claude output tokens · 10 review rounds · 3 Claude limits', 960, 490, { px: 28, mono: true, color: P.ink2, align: 'center' });
      drawClawd(860, 640, 7, { crown: true, sleep: true });
      zzz(910, 560, u, 0.9);
      drawBot(1060, 640, 7, { symbol: 'star', tool: 'lens', dim: true });
      txt('Data: Claude Code and Codex session logs, 6 to 7 Oct 2026 · rith.dev', 960, 760, { px: 20, mono: true, color: P.ink4, align: 'center' });
    });
  }
}
function outroMarks(kind, L) {
  const lab = (s, x, y, c = P.ink, align = 'center') => txt(s, x, y, { px: 15, w: 600, mono: true, color: c, align });
  if (kind === 'loop') {
    for (const task of ['R1-01', 'R1-02', 'R1-03']) {
      const b = agents.filter(a => a.task === task && a.role === 'build' && !a.ghost);
      const rv = reviews.filter(r => r.task === task && (r.who === 'astra' || r.who === 'sol'));
      const bs = xOf(b[0].start), be = xOf(b[b.length - 1].end), rs = xOf(Math.min(...rv.map(r => r.start))), me = xOf(mergeAt[task]);
      const y = L.y0 - 34;
      line(bs, y, be, y, P.orange, 3); line(bs, y - 6, bs, y + 6, P.orange, 2); line(be, y - 6, be, y + 6, P.orange, 2);
      line(rs, y, me, y, P.cyan, 3); line(rs, y - 6, rs, y + 6, P.cyan, 2); line(me, y - 6, me, y + 6, P.cyan, 2);
      const bm = Math.round(b.reduce((s, a) => s + (a.end - a.start), 0) / MIN), rm = Math.round((mergeAt[task] - Math.min(...rv.map(r => r.start))) / MIN);
      lab(`${bm}m`, (bs + be) / 2, y - 10, P.orange); lab(`${rm}m`, (rs + me) / 2, y - 10, P.cyan);
    }
  }
  if (kind === 'wait') {
    for (const x of D.waits.filter(x => x.kind === 'limit')) {
      const a = xOf(x.start), b = xOf(Math.min(x.end, END));
      box(a - 2, L.wait.y - 3, b - a + 4, L.wait.h + 6, 4, null, P.red, 2);
    }
    const f = agents.filter(a => FAN[a.task] !== undefined && !a.ghost);
    const a = xOf(T('10-07 08:37')), b = xOf(T('10-07 09:39'));
    box(a - 3, L.b[0].y - 3, b - a + 6, L.b[3].y + L.b[3].h - L.b[0].y + 6, 4, null, P.orange, 2);
    lab('4 at once · 62 min', (a + b) / 2, L.y0 - 30, P.orange);
    void f;
  }
  if (kind === 'morning') {
    const a = xOf(T('10-07 10:55')), b = xOf(T('10-07 11:21'));
    box(a - 4, L.astra.y - 4, b - a + 8, L.sol.y + L.sol.h - L.astra.y + 8, 4, null, P.cyan, 2);
    lab('8 at once', (a + b) / 2, L.astra.y - 10, P.cyan);
  }
  if (kind === 'turns') {
    const iv = reviews.filter(r => r.who !== 'astra-sub').map(r => [r.start, r.end]).sort((a, b) => a[0] - b[0]);
    const u = []; for (const [a, b] of iv) { if (u.length && a <= u[u.length - 1][1]) u[u.length - 1][1] = Math.max(u[u.length - 1][1], b); else u.push([a, b]); }
    X.save(); X.fillStyle = 'rgba(2,166,190,0.22)';
    for (const [a, b] of u) X.fillRect(xOf(a), L.b[0].y - 4, Math.max(2, xOf(b) - xOf(a)), L.sol.y + L.sol.h - L.b[0].y + 8);
    X.restore();
    lab('cyan bands = a review was running', SW.x1, L.y0 - 30, P.cyan, 'right');
  }
}


// ---------- tree: how it all started (fan-out and loops) ----------
const HARITH_C = { H: '#2b1d15', S: '#c68b62', E: '#1b1b1b', M: '#9a5440', W: '#7a9cff', P: '#2f3340', B: '#1b1b1b' };
const HARITH = [
  '....HHHHHH....', '...HHHHHHHH...', '..HHHHHHHHHH..', '..HHSSSSSSHH..', '..HSSSSSSSSH..', '..HSESSSSESH..',
  '...SSSSSSSS...', '...SSSMMSSS...', '....SSSSSS....', '...WWWWWWWW...', '..WWWWWWWWWW..', '.SWWWWWWWWWWS.',
  '.SWWWWWWWWWWS.', '..WWWWWWWWWW..', '...PPPPPPPP...', '...PPP..PPP...', '...PPP..PPP...', '..BBBB..BBBB..'];
const HARITH_WAVE = [
  '....HHHHHH....', '...HHHHHHHH...', '..HHHHHHHHHH.S', '..HHSSSSSSHH.S', '..HSSSSSSSSH.S', '..HSESSSSESH.W',
  '...SSSSSSSS..W', '...SSSMMSSS.WW', '....SSSSSS.WW.', '...WWWWWWWWW..', '..WWWWWWWWWW..', '.SWWWWWWWWWW..',
  '.SWWWWWWWWWW..', '..WWWWWWWWWW..', '...PPPPPPPP...', '...PPP..PPP...', '...PPP..PPP...', '..BBBB..BBBB..'];
function drawHarith(cx, by, q, wave) {
  const rows = wave ? HARITH_WAVE : HARITH;
  grid(rows, Math.round(cx - 7 * q), Math.round(by - 18 * q), q, ch => HARITH_C[ch]);
}
const bez = ([a, b, c, d], u) => { const v = 1 - u; return { x: v * v * v * a.x + 3 * v * v * u * b.x + 3 * v * u * u * c.x + u * u * u * d.x, y: v * v * v * a.y + 3 * v * v * u * b.y + 3 * v * u * u * c.y + u * u * u * d.y }; };
const sCurve = (a, b, bend = 0.5) => { const mx = a.x + (b.x - a.x) * bend; return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b]; };
function growCurve(pts, k, color, lw = 2.5, dash) {
  k = clamp(k); if (k <= 0) return null;
  X.save(); X.strokeStyle = color; X.lineWidth = lw; X.lineCap = 'round'; if (dash) X.setLineDash(dash);
  X.beginPath(); const N = 48;
  for (let i = 0; i <= Math.ceil(N * k); i++) { const p = bez(pts, Math.min(k, i / N)); i ? X.lineTo(p.x, p.y) : X.moveTo(p.x, p.y); }
  X.stroke(); X.restore();
  return bez(pts, k);
}
function popScale(t, at) { return t < at ? 0 : backOut((t - at) / 0.35); }
function popAt(t, at, cx, cy, fn) { const k = popScale(t, at); if (k <= 0) return; X.save(); X.translate(cx, cy); X.scale(k, k); X.translate(-cx, -cy); fn(); X.restore(); }

const TR = { you: { x: 130, y: 600 }, plan: { x: 330, y: 250 }, fable: { x: 330, y: 600 }, second: { x: 330, y: 905 } };
const TBOX = { w: 310, h: 84 };
const SUBS = [['which builder', 'sonnet'], ['Puck limits', 'sonnet'], ['Sites MCP', 'sonnet'], ['Puck trial', 'opus'], ['OSS survey', 'sonnet'],
  ['theme cloning', 'sonnet'], ['extension pts', 'sonnet'], ['phase 1 editor', 'sonnet'], ['Elementor facts', 'sonnet'], ['reference site', 'sonnet']];
const subPos = i => ({ x: 740 + (i % 5) * 150, y: i < 5 ? 196 : 304 });
const BATCH = [['R1a', 470, ['R1-01']], ['R1b', 560, ['R1-02']], ['R1c', 650, ['R1-03']], ['R1d', 785, ['R1-04', 'R1-05', 'R1-06', 'R1-07']]];
const TROW = { 'R1-01': 470, 'R1-02': 560, 'R1-03': 650, 'R1-04': 740, 'R1-05': 800, 'R1-06': 860, 'R1-07': 920 };
const TB = { x: 735, w: 150 }, TX = { lab: 935, clawd: 985, astra: 1480, sol: 1550, out: 1600 };
// review loops: each round is [time, passed?]
const RS = 0.38;
const LOOPS = {
  'R1-01': { batch: 4.4, rounds: [false, false, true] },
  'R1-02': { batch: 6.8, rounds: [false, false, true] },
  'R1-03': { batch: 8.7, rounds: [false, false, false, true] },
};
for (const k in LOOPS) { const L = LOOPS[k]; L.builder = L.batch + 0.45; L.start = L.builder + (k === 'R1-01' ? 1.0 : 0.25); L.end = L.start + L.rounds.length * RS; }
const R1D = { batch: 11.0, builders: 11.3, limit: 12.0, second: 12.6, reviews: 13.3, done: 13.3 + RS + 0.1 };
const TOUT = 16.5;

function threadNode(n, t, at, opt) {
  popAt(t, at, n.x + 60, n.y, () => {
    box(n.x - 70, n.y - TBOX.h / 2, TBOX.w, TBOX.h, 14, P.raised, opt.stroke, 2);
    drawClawd(n.x - 22, n.y + 22, 4, { crown: opt.crown, headset: opt.headset, sleep: opt.sleep, blink: (t % 2.7) < 0.12, bob: opt.busy && Math.floor(t * 4) % 2 ? -4 : 0 });
    txt(opt.title, n.x + 30, n.y - 8, { px: 19, w: 600 });
    txt(opt.sub, n.x + 30, n.y + 18, { px: 13, mono: true, color: opt.subColor || P.ink3 });
  });
  if (opt.sleep && t >= at) zzz(n.x + 6, n.y - 34, t, 0.7);
}
function drawTreeLoop(task, y, t, L, outcome) {
  const a = { x: TX.clawd + 34, y }, b = { x: TX.astra - 34, y };
  const top = [a, { x: a.x + 120, y: y - 34 }, { x: b.x - 120, y: y - 34 }, b];
  const bot = [b, { x: b.x - 120, y: y + 34 }, { x: a.x + 120, y: y + 34 }, a];
  if (t < L.start) return;
  // faint loop track
  withAlpha(0.35, () => { growCurve(top, 1, P.c3, 1.5, [4, 5]); growCurve(bot, 1, P.c2, 1.5, [4, 5]); });
  const r = Math.min(L.rounds.length - 1, Math.floor((t - L.start) / RS));
  const u = (t - L.start - r * RS) / RS;
  if (t < L.end) {
    const half = u < 0.5;
    const pts = half ? top : bot, k = half ? u * 2 : (u - 0.5) * 2;
    if (half || !L.rounds[r]) {
      const p = bez(pts, k);
      X.save(); X.shadowColor = half ? P.cyan : P.red; X.shadowBlur = 12;
      box(p.x - 9, p.y - 7, 18, 14, 3, half ? P.cyan : P.red); X.restore();
    }
    txt(`round ${r + 1}`, (a.x + b.x) / 2, y + 5, { px: 14, w: 600, mono: true, color: P.ink2, align: 'center' });
  } else {
    txt(`${L.rounds.length} round${L.rounds.length > 1 ? 's' : ''}`, (a.x + b.x) / 2, y + 5, { px: 14, w: 600, mono: true, color: P.ink3, align: 'center' });
  }
  // verdict marks above the loop, one per finished round
  const doneRounds = Math.min(L.rounds.length, Math.floor((t - L.start) / RS + 0.5));
  for (let i = 0; i < doneRounds; i++) icon(L.rounds[i] ? 'good' : 'bad', (a.x + b.x) / 2 - (L.rounds.length - 1) * 13 + i * 26, y - 34, 18, L.rounds[i] ? P.green : P.red);
  if (t >= L.end + 0.05) popAt(t, L.end + 0.05, TX.out + 80, y, () => outcome());
}
function drawTree(t, standalone) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  const chipW = tw('REPLAY', 15, 600, true, 2) + 26;
  box(40, 26, chipW, 30, 15, null, P.purple, 1.6);
  txt('REPLAY', 40 + chipW / 2, 46, { px: 15, w: 600, mono: true, color: P.purple, align: 'center', ls: 2 });
  txt('How it all started: one person, three threads, fanning out', 40 + chipW + 18, 50, { px: 30, w: 600 });
  txt('Each node is a model session. Each loop is a review round: Astra and Sol review, then a fresh agent fixes.', 40, 84, { px: 17, mono: true, color: P.ink3 });
  line(40, 104, 1880, 104, P.lineSoft, 1);
  const Y = TR.you;
  const fableSleep = t >= R1D.limit;
  // edges from you
  const youOut = { x: Y.x + 52, y: Y.y - 40 };
  growCurve(sCurve(youOut, { x: TR.plan.x - 70, y: TR.plan.y }, 0.45), (t - 0.6) / 0.5, P.c2, 3);
  growCurve(sCurve(youOut, { x: TR.fable.x - 70, y: TR.fable.y }, 0.45), (t - 3.6) / 0.4, P.c2, 3);
  growCurve(sCurve(youOut, { x: TR.second.x - 70, y: TR.second.y }, 0.45), (t - R1D.second) / 0.4, P.c3, 3);
  // you
  popAt(t, 0.25, Y.x, Y.y - 60, () => drawHarith(Y.x, Y.y, 7, t > 0.5 && t < 1.6 && Math.floor(t * 4) % 2 === 0));
  if (t >= 0.25) { txt('You', Y.x, Y.y + 34, { px: 22, w: 600, align: 'center' }); txt('two chats, one prompt', Y.x, Y.y + 58, { px: 13, mono: true, color: P.ink3, align: 'center' }); }
  // planning thread and its sub-agents
  // org-chart bus: planning thread -> one line -> a drop to each sub-agent
  const busY = TR.plan.y, bus0 = TR.plan.x + TBOX.w - 70, bus1 = subPos(4).x;
  const busK = clamp((t - 1.1) / 1.4);
  if (busK > 0) line(bus0, busY, lerp(bus0, bus1, busK), busY, P.c2, 2.5);
  SUBS.forEach(([lab, model], i) => {
    const p = subPos(i), at = 1.1 + 1.4 * (p.x - bus0) / (bus1 - bus0) + (i >= 5 ? 0.12 : 0);
    const top = i < 5, end = top ? p.y + 20 : p.y - 28;
    const k = clamp((t - at) / 0.2);
    if (k > 0) line(p.x, busY, p.x, lerp(busY, end, k), P.c2, 2);
    popAt(t, at + 0.18, p.x, p.y, () => {
      drawClawd(p.x, p.y + 16, 3, { hat: HATS[model], bob: t < at + 1.2 && Math.floor(t * 5 + i) % 2 ? -3 : 0 });
      txt(lab, p.x, top ? p.y - 30 : p.y + 40, { px: 13, mono: true, color: P.ink2, align: 'center' });
    });
    if (t > at + 1.2) icon('good', p.x + 34, p.y - 2, 16, P.green);
  });
  if (t > 1.6) withAlpha(clamp((t - 1.6) / 0.5), () => {
    txt('10 sub-agents', 1440, 230, { px: 20, w: 600 });
    txt('9 Sonnet, 1 Opus', 1440, 258, { px: 15, mono: true, color: P.ink3 });
    txt('each in a fresh context', 1440, 282, { px: 15, mono: true, color: P.ink3 });
  });
  threadNode(TR.plan, t, 1.0, { title: 'Planning thread', sub: 'Opus 5.5 · xhigh · 18:15', stroke: P.c2, busy: t < 3.2 });
  // hand-off documents
  const docs = [['Spec', 255], ['Ledger', 330], ['Prompt', 405]];
  growCurve([{ x: TR.plan.x + 10, y: TR.plan.y + 42 }, { x: TR.plan.x + 10, y: 330 }, { x: 330, y: 330 }, { x: 330, y: 372 }], (t - 2.9) / 0.3, P.purple, 2, [6, 5]);
  docs.forEach(([lab, x], i) => popAt(t, 3.1 + i * 0.12, x + 26, 410, () => {
    box(x, 378, 52, 64, 5, '#ECE7DA');
    X.fillStyle = '#C9C2B0'; for (let j = 0; j < 4; j++) X.fillRect(x + 8, 398 + j * 9, 36 - (j % 2) * 10, 3);
    txt(lab, x + 26, 462, { px: 13, mono: true, color: P.ink2, align: 'center' });
  }));
  if (t > 3.4) withAlpha(clamp((t - 3.4) / 0.4), () => txt('spec · 31-task ledger · start prompt', 330, 486, { px: 12, mono: true, color: P.purple, align: 'center' }));
  growCurve([{ x: 330, y: 492 }, { x: 330, y: 520 }, { x: 330, y: 530 }, { x: 330, y: TR.fable.y - 42 }], (t - 3.7) / 0.3, P.purple, 2, [6, 5]);
  // Fable and its workflow batches
  threadNode(TR.fable, t, 4.0, { title: 'Fable 5.1', sub: fableSleep ? 'out of Claude · 09:39' : 'orchestrator · xhigh · 20:58', subColor: fableSleep ? P.red : P.ink3, stroke: P.purple, crown: true, sleep: fableSleep, busy: t > 4 && t < R1D.limit });
  for (const [name, y, tasks] of BATCH) {
    const at = name === 'R1d' ? R1D.batch : LOOPS[tasks[0]].batch;
    growCurve(sCurve({ x: TR.fable.x + TBOX.w - 70, y: TR.fable.y }, { x: TB.x - TB.w / 2, y }, 0.5), (t - at) / 0.3, P.c2, 2.5);
    popAt(t, at + 0.28, TB.x, y, () => {
      box(TB.x - TB.w / 2, y - 22, TB.w, 44, 10, P.raised, P.c2, 1.8);
      txt(`workflow ${name}`, TB.x, y + 6, { px: 15, w: 600, mono: true, align: 'center' });
    });
    tasks.forEach((task, i) => {
      const ty = TROW[task], bat = name === 'R1d' ? R1D.builders + i * 0.1 : LOOPS[task].builder;
      growCurve(sCurve({ x: TB.x + TB.w / 2, y }, { x: TX.clawd - 32, y: ty }, 0.5), (t - bat) / 0.25, P.c2, 2);
      const model = { 'R1-01': 'sonnet', 'R1-02': 'opus', 'R1-03': 'sonnet', 'R1-04': 'opus', 'R1-05': 'opus', 'R1-06': 'opus', 'R1-07': 'sonnet' }[task];
      const working = name === 'R1d' ? t < R1D.limit : t < LOOPS[task].end;
      popAt(t, bat + 0.22, TX.clawd, ty, () => {
        drawClawd(TX.clawd, ty + 16, 3, { hat: HATS[model], sleep: name === 'R1d' && t >= R1D.limit, bob: working && Math.floor(t * 5 + i) % 2 ? -3 : 0 });
        txt(task, TX.lab, ty + 6, { px: 16, w: 600, mono: true, align: 'right' });
      });
    });
  }
  // relay agents bounce off Codex
  if (t > 4.95 && t < 5.9) {
    const k = clamp((t - 4.95) / 0.5), y = TROW['R1-01'];
    const head = growCurve([{ x: TB.x + 40, y: y - 22 }, { x: TB.x + 200, y: y - 90 }, { x: TX.astra - 260, y: y - 90 }, { x: TX.astra - 140, y: y - 60 }], k, P.red, 2, [5, 5]);
    if (k >= 1 && head) { icon('bad', head.x, head.y, 22, P.red); txt("relays can't reach Codex", head.x + 18, head.y - 14, { px: 13, mono: true, color: P.red }); }
  }
  // night review loops, launched from Fable
  for (const task of ['R1-01', 'R1-02', 'R1-03']) {
    const L = LOOPS[task], y = TROW[task];
    const launch = (t - (L.start - 0.25)) / 0.3;
    if (launch > 0 && t < L.start + 0.6) withAlpha(1 - clamp((t - L.start) / 0.6), () => growCurve([{ x: TR.fable.x + 60, y: TR.fable.y + 42 }, { x: 900, y: 1010 }, { x: TX.astra - 60, y: 1010 }, { x: TX.astra, y: y + 30 }], launch, P.c3, 2, [6, 5]));
    if (t >= L.start - 0.05) {
      const act = t < L.end;
      drawBot(TX.astra, y + 20, 3, { symbol: 'star', dim: !act, look: act ? [-1, 0, 1, 0][Math.floor(t * 4) % 4] : 0 });
      drawBot(TX.sol, y + 20, 3, { symbol: 'sun', dim: !act, look: act ? [1, 0, -1, 0][Math.floor(t * 4) % 4] : 0 });
    }
    drawTreeLoop(task, y, t, L, () => { icon('good', TX.out + 12, y, 20, P.green); txt('merged', TX.out + 30, y + 5, { px: 15, w: 600, mono: true, color: P.green }); });
  }
  if (t > LOOPS['R1-01'].start - 0.25 && t < LOOPS['R1-01'].start + 0.9) withAlpha(clamp((t - LOOPS['R1-01'].start + 0.25) / 0.3), () => txt('Fable launches every review itself', 900, 1000, { px: 14, mono: true, color: P.cyan, align: 'center' }));
  // R1d: builders fan out, Fable runs out, the second thread launches the reviews
  if (t >= R1D.limit && t < R1D.reviews) withAlpha(1 - clamp((t - (R1D.reviews - 0.35)) / 0.3), () => popAt(t, R1D.limit, TX.astra + 30, 790, () => pill(TX.astra + 34, 776, 'NO REVIEWS: FABLE IS OUT', 'bad', 13, 'center')));
  threadNode(TR.second, t, R1D.second + 0.38, { title: '2nd thread', sub: 'Opus · other quota · 10:55', subColor: P.cyan, stroke: P.c3, headset: true, busy: t > R1D.second && t < R1D.done });
  for (const task of ['R1-04', 'R1-05', 'R1-06', 'R1-07']) {
    const y = TROW[task];
    const launch = (t - R1D.reviews + 0.4) / 0.35;
    if (launch > 0 && t < R1D.reviews + 0.8) withAlpha(1 - clamp((t - R1D.reviews - 0.1) / 0.7), () => growCurve([{ x: TR.second.x + TBOX.w - 70, y: TR.second.y }, { x: 900, y: TR.second.y + 60 }, { x: TX.astra - 80, y: y + 60 }, { x: TX.astra, y: y + 26 }], launch, P.c3, 2, [6, 5]));
    const L = { start: R1D.reviews, end: R1D.reviews + RS, rounds: [false] };
    if (t >= L.start - 0.05) {
      const act = t < L.end;
      drawBot(TX.astra, y + 20, 3, { symbol: 'star', dim: !act, look: act ? [-1, 0, 1, 0][Math.floor(t * 4) % 4] : 0 });
      drawBot(TX.sol, y + 20, 3, { symbol: 'sun', dim: !act, look: act ? [1, 0, -1, 0][Math.floor(t * 4) % 4] : 0 });
    }
    drawTreeLoop(task, y, t, L, () => { icon('warn', TX.out + 12, y, 20, P.yellow); txt('needs a fix', TX.out + 30, y + 5, { px: 15, w: 600, mono: true, color: P.yellow }); });
  }
  // column labels
  withAlpha(clamp((t - 4.2) / 0.5), () => {
    txt('WORKFLOW RUNS', TB.x, 418, { px: 13, w: 600, mono: true, color: P.ink4, align: 'center', ls: 1 });
    txt('BUILDERS', TX.clawd - 10, 418, { px: 13, w: 600, mono: true, color: P.ink4, align: 'center', ls: 1 });
    txt('REVIEW LOOP', (TX.clawd + TX.astra) / 2, 418, { px: 13, w: 600, mono: true, color: P.ink4, align: 'center', ls: 1 });
    txt('ASTRA  SOL', (TX.astra + TX.sol) / 2, 418, { px: 13, w: 600, mono: true, color: P.ink4, align: 'center', ls: 1 });
  });
  // summary
  const chips = ['10 planning sub-agents', '10 workflow runs', '14 builder and fix agents', '37 GPT review sessions', '3 of 31 tasks merged'];
  let cx = 40;
  chips.forEach((c, i) => {
    const a = clamp((t - 14.0 - i * 0.18) / 0.35);
    if (a <= 0) return;
    const w = tw(c, 17, 600, true) + 36;
    withAlpha(a, () => { box(cx, 1022, w, 36, 18, P.raised, i === 4 ? P.green : P.line, 1.5); txt(c, cx + w / 2, 1046, { px: 17, w: 600, mono: true, align: 'center', color: P.ink }); });
    cx += w + 14;
  });
  if (standalone) {
    if (t < 0.3) withAlpha(1 - t / 0.3, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
    if (t > TREE_DUR - 0.5) withAlpha((t - (TREE_DUR - 0.5)) / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  } else {
    if (t < 0.4) withAlpha(1 - t / 0.4, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
    if (t > TREE_DUR - 0.5) withAlpha((t - (TREE_DUR - 0.5)) / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  }
}

// ---------- entry points ----------
function drawMain(t) {
  X.setTransform(1, 0, 0, 1, 0, 0);
  X.globalAlpha = 1;
  if (t < TITLE_END) return drawTitle(t);
  if (t < TREE_END) return drawTree(t - TITLE_END, false);
  if (t < PRO_END) return drawPrologue(t - PRO_START);
  if (t < MAIN_END) return drawNight(t);
  return drawOutro(t - MAIN_END);
}

// ---------- loop: one task's review loop (R1-02, as it ran) ----------
function taskSegments(task) {
  const segs = [];
  for (const a of agents.filter(a => a.task === task && real(a))) segs.push({ kind: a.role === 'fix' ? 'fix' : 'build', start: a.start, end: a.end, out: a.out, label: a.role === 'fix' ? `fix ${a.fixRound}` : 'build', agent: a });
  for (const k of [1, 2, 3, 4]) {
    const rv = reviews.filter(r => r.task === task && r.round === k && (r.who === 'astra' || r.who === 'sol'));
    if (!rv.length) continue;
    segs.push({ kind: 'review', round: k, start: Math.min(...rv.map(r => r.start)), end: Math.max(...rv.map(r => r.end)), astra: rv.find(r => r.who === 'astra'), sol: rv.find(r => r.who === 'sol') });
  }
  return segs.sort((a, b) => a.start - b.start);
}
const LOOP_TASK = 'R1-02';
const TSEG = taskSegments(LOOP_TASK);
const RIB = { x0: 120, x1: 1800, gap: 70 };
(function layoutRibbon() {
  const mins = TSEG.map(s => (s.end - s.start) / MIN);
  const breaks = TSEG.slice(1).filter((s, i) => s.start - TSEG[i].end > 30 * MIN).length;
  const total = mins.reduce((a, b) => a + b, 0);
  const pxPerMin = (RIB.x1 - RIB.x0 - breaks * RIB.gap - (TSEG.length - 1) * 6) / total;
  let x = RIB.x0;
  TSEG.forEach((sg, i) => {
    if (i && sg.start - TSEG[i - 1].end > 30 * MIN) { sg.breakBefore = [x, x + RIB.gap, sg.start - TSEG[i - 1].end]; x += RIB.gap; }
    else if (i) x += 6;
    sg.x0 = x; sg.x1 = x + mins[i] * pxPerMin; x = sg.x1;
  });
})();
const LT = { dur: 15, run: [0.8, 12.2] };
function drawLoopTask(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  txt('ONE TASK, AS IT RAN', 120, 108, { px: 22, w: 600, mono: true, color: P.purple, ls: 3 });
  txt('R1-02, the Release 1 contract: built, reviewed three times, fixed twice', 120, 168, { px: 46, w: 600 });
  const k = clamp((t - LT.run[0]) / (LT.run[1] - LT.run[0]));
  const px = lerp(RIB.x0, RIB.x1, k);
  let cur = TSEG[0]; for (const sg of TSEG) if (px >= sg.x0 - 3) cur = sg;
  const within = clamp((px - cur.x0) / Math.max(1, cur.x1 - cur.x0));
  const inBreak = TSEG.find(sg => sg.breakBefore && px >= sg.breakBefore[0] && px < sg.breakBefore[1]);
  const done = t >= LT.run[1];
  // stage
  const B = { cx: 470, by: 560 }, A = { cx: 1190, by: 560 }, S = { cx: 1530, by: 560 };
  const building = !done && !inBreak && cur.kind !== 'review';
  const reviewing = !done && !inBreak && cur.kind === 'review';
  drawClawd(B.cx, B.by, 13, { hat: HATS.opus, sleep: !!inBreak, bob: building && Math.floor(t * 4) % 2 ? -13 : 0, step: building && Math.floor(t * 4) % 2 === 0 });
  if (inBreak) zzz(B.cx + 60, B.by - 190, t, 1.3);
  txt(cur.kind === 'fix' && !inBreak && !done ? `Opus · fix round ${cur.agent.fixRound}` : 'Opus 5.5 · builder', B.cx, B.by + 56, { px: 28, w: 600, align: 'center' });
  txt(inBreak ? 'cut off by the 5-hour limit' : done ? 'merged into the integration branch' : building ? (cur.kind === 'fix' ? 'a fresh agent re-reads, then fixes' : 'writing the contract') : 'waiting for both verdicts', B.cx, B.by + 94, { px: 22, mono: true, color: inBreak ? P.red : P.ink3, align: 'center' });
  const last = TSEG.filter(sg => sg.kind === 'review' && px >= sg.x1).pop();
  for (const [who, pos] of [['astra', A], ['sol', S]]) {
    const r = reviewing ? cur[who] : null;
    const act = r && lerp(cur.start, cur.end, within) <= r.end;
    drawBot(pos.cx, pos.by, 11, { symbol: who === 'astra' ? 'star' : 'sun', tool: who === 'astra' ? 'lens' : 'clip', dim: !act, look: act ? [-1, 0, 1, 0][Math.floor(t * 3) % 4] : 0, bob: act && Math.floor(t * 3) % 2 ? -5 : 0 });
    txt(who === 'astra' ? 'Astra · review' : 'Sol · verify', pos.cx, pos.by + 56, { px: 28, w: 600, align: 'center' });
    const v = reviewing ? (act ? null : r && r.verdict) : last && last[who] && last[who].verdict;
    if (act) txt('working…', pos.cx, pos.by + 94, { px: 22, mono: true, color: P.cyan, align: 'center' });
    else if (v) pill(pos.cx, pos.by + 74, v, verdictKind(v), 18, 'center');
  }
  // packet between builder and reviewers
  if (reviewing && within < 0.25) {
    const e = smooth(within / 0.25), x = lerp(B.cx + 120, A.cx - 90, e), y = B.by - 120 - Math.sin(e * Math.PI) * 80;
    box(x - 26, y - 17, 52, 34, 6, P.cyan); txt('diff', x, y - 26, { px: 20, mono: true, align: 'center' });
  }
  if (cur.kind === 'fix' && within < 0.25 && !inBreak && !done) {
    const e = smooth(within / 0.25), x = lerp(A.cx - 90, B.cx + 120, e), y = B.by - 120 - Math.sin(e * Math.PI) * 80;
    box(x - 26, y - 17, 52, 34, 6, P.red); txt('findings', x, y - 26, { px: 20, mono: true, align: 'center' });
  }
  // counters
  const wNow = inBreak ? inBreak.breakBefore ? TSEG[TSEG.indexOf(inBreak) - 1].end : cur.end : lerp(cur.start, cur.end, within);
  let claude = 0; for (const sg of TSEG) if (sg.agent) { const i = cumAt(sg.agent.pre, done ? Infinity : wNow); if (i >= 0) claude += sg.agent.pre[i][1]; }
  const rounds = TSEG.filter(sg => sg.kind === 'review' && (done || px >= sg.x1)).length;
  txt(`${kfmt(claude)}`, 1800, 290, { px: 64, w: 600, align: 'right' });
  txt('Claude output tokens', 1800, 324, { px: 22, mono: true, color: P.ink3, align: 'right' });
  txt(`${rounds} of 3`, 1800, 410, { px: 64, w: 600, align: 'right' });
  txt('review rounds', 1800, 444, { px: 22, mono: true, color: P.ink3, align: 'right' });
  // ribbon
  const ry = 820;
  TSEG.forEach(sg => {
    if (sg.breakBefore) {
      const [a, b, gap] = sg.breakBefore;
      box(a + 4, ry, b - a - 8, 44, 4, hatch('limitBig', 'rgba(255,85,85,0.55)', 'rgba(25,26,33,0.6)', 10, 3));
      txt(`limit · ${durfmt(gap / MIN)} wait`, (a + b) / 2, ry - 16, { px: 18, mono: true, color: P.red, align: 'center' });
    }
    const fill = sg.kind === 'build' ? P.c2 : sg.kind === 'fix' ? hatch('fixBig', P.orange, 'rgba(200,130,44,0.55)', 10, 3) : P.c3;
    withAlpha(px >= sg.x0 ? 1 : 0.25, () => box(sg.x0, ry, sg.x1 - sg.x0, 44, 5, fill));
    const m = Math.round((sg.end - sg.start) / MIN);
    const lab = sg.kind === 'review' ? `review ${sg.round} · ${m}m` : `${sg.label} · ${m}m`;
    txt(lab, (sg.x0 + sg.x1) / 2, ry + (sg.kind === 'review' ? 112 : 80), { px: 18, mono: true, color: sg.kind === 'review' ? P.cyan : P.ink2, align: 'center' });
    if (sg.kind === 'review' && px >= sg.x1) {
      const ok = verdictKind(sg.astra.verdict) === 'good' && verdictKind(sg.sol.verdict) === 'good';
      icon(ok ? 'good' : 'bad', (sg.x0 + sg.x1) / 2, ry - 26, 30, ok ? P.green : P.red);
    }
  });
  if (!done) { line(px, ry - 52, px, ry + 56, P.ink, 3); }
  else withAlpha(clamp((t - LT.run[1]) / 0.4), () => {
    icon('good', RIB.x1 + 34, ry + 22, 36, P.green);
    txt('Merged after 3 review rounds. The fix rounds cost 221k of the 624k Claude output.', 960, 1020, { px: 28, color: P.ink, align: 'center' });
  });
  if (!done) txt('A fresh agent for every fix round, and a full re-review every round.', 960, 1020, { px: 28, color: P.ink2, align: 'center' });
  // loop seam
  if (t < 0.5) withAlpha(1 - t / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  if (t > LT.dur - 0.5) withAlpha((t - (LT.dur - 0.5)) / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
}

// ---------- loop: the same window, spent serially vs by four builders ----------
const FW = [
  { label: 'One builder at a time', sub: '02:00 window · R1-02, R1-03', w0: T('10-07 02:00'), work: T('10-07 02:00'), limit: T('10-07 05:04'), n: 1, cx: 520 },
  { label: 'Four builders at once', sub: '07:00 window · R1-04 to 07', w0: T('10-07 07:00'), work: T('10-07 08:37'), limit: T('10-07 09:39'), n: 4, cx: 1400 },
];
const FL = { dur: 12, run: [0.8, 8.8], span: 190 };
function drawLoopFanout(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  X.fillStyle = P.bg; X.fillRect(0, 0, W, H);
  txt('SAME WINDOW, SPENT FASTER', 120, 108, { px: 22, w: 600, mono: true, color: P.purple, ls: 3 });
  txt('Both 5-hour windows stopped at the same output. Fan-out only got there sooner.', 120, 168, { px: 44, w: 600 });
  const m = clamp((t - FL.run[0]) / (FL.run[1] - FL.run[0])) * FL.span;
  txt(`${durfmt(m)} into the window's work`, 960, 1030, { px: 26, mono: true, color: P.ink2, align: 'center' });
  for (const f of FW) {
    const w = Math.min(f.work + m * MIN, f.limit);
    const out = totalAt(w + (w >= f.limit ? MIN : 0)) - totalAt(f.w0 - 1);
    const hit = f.work + m * MIN >= f.limit;
    const bx = f.cx + 80, by = 300, bw = 220, bh = 560, cap = 730000, max = 800000;
    box(bx, by, bw, bh, 12, P.deep, P.line, 2);
    const fh = (bh - 8) * clamp(out / max);
    box(bx + 4, by + bh - 4 - fh, bw - 8, fh, 8, hit ? P.red : P.c2);
    const cy = by + bh - 4 - (bh - 8) * cap / max;
    line(bx - 16, cy, bx + bw + 16, cy, P.ink, 3, [10, 6]);
    txt('limit ≈ 730k', bx + bw + 24, cy + 8, { px: 22, mono: true, color: P.ink2 });
    txt(kfmt(out), bx + bw / 2, by + bh + 52, { px: 40, w: 600, align: 'center' });
    txt('Claude output', bx + bw / 2, by + bh + 84, { px: 20, mono: true, color: P.ink3, align: 'center' });
    txt(f.label, f.cx - 300, 300, { px: 34, w: 600 });
    txt(f.sub, f.cx - 300, 338, { px: 20, mono: true, color: P.ink3 });
    for (let i = 0; i < f.n; i++) {
      const cx = f.cx - 220 + (i % 2) * 150, foot = 520 + Math.floor(i / 2) * 150;
      const busy = !hit && m > 0;
      drawClawd(cx, foot, 6, { hat: f.n === 4 && i === 3 ? HATS.sonnet : HATS.opus, sleep: hit, bob: busy && Math.floor(t * 4 + i) % 2 ? -6 : 0, step: busy && Math.floor(t * 4 + i) % 2 === 0 });
      if (hit) zzz(cx + 30, foot - 70, t + i, 0.8);
    }
    if (hit) {
      const e = backOut((t - (FL.run[0] + (f.limit - f.work) / MIN / FL.span * (FL.run[1] - FL.run[0]))) / 0.4);
      X.save(); X.translate(f.cx - 150, 760); X.scale(e, e); X.translate(-(f.cx - 150), -760);
      pill(f.cx - 150, 742, `LIMIT AFTER ${durfmt((f.limit - f.work) / MIN)}`, 'bad', 20, 'center');
      X.restore();
      const rate = f.n === 1 ? 236 : 738; // the report's per-working-hour figures
      txt(`${rate}k output per working hour`, f.cx - 150, 820, { px: 22, mono: true, color: P.ink2, align: 'center' });
    }
  }
  if (t < 0.5) withAlpha(1 - t / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
  if (t > FL.dur - 0.5) withAlpha((t - (FL.dur - 0.5)) / 0.5, () => { X.fillStyle = P.bg; X.fillRect(0, 0, W, H); });
}
const SCENES = { main: { duration: TOTAL, draw: drawMain }, task: { duration: LT.dur, draw: drawLoopTask }, fanout: { duration: FL.dur, draw: drawLoopFanout }, tree: { duration: TREE_DUR, draw: t => drawTree(t, true) } };
window.SCENES = SCENES;
window.CHAPTERS = [
  ['The cast', 0], ['How it was wired', TITLE_END], ['Before the night', PRO_START], ['R1-01 and the relay problem', PRO_END], ['First limit', videoAt(T('10-06 23:49')) - 0.5],
  ['Contract and migration', videoAt(T('10-07 02:00'))], ['Fan-out', videoAt(T('10-07 05:04')) - 0.5], ['Reviews on another quota', videoAt(T('10-07 09:39')) - 0.5], ['What it shows', MAIN_END],
];
window.renderFrame = (scene, t) => SCENES[scene].draw(t);
window.ready = Promise.all([document.fonts.load('400 20px Geist'), document.fonts.load('600 20px Geist'), document.fonts.load('700 20px Geist'), document.fonts.load('20px FMono')]).then(() => true);
const qp = new URLSearchParams(location.search);
if (qp.has('t')) window.ready.then(() => window.renderFrame(qp.get('scene') || 'main', +qp.get('t')));
