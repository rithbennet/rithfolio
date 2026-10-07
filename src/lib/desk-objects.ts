// Drawn stand-ins for Harith's photo cut-outs. Each returns an inline SVG string.
// When a real transparent PNG exists, pass `src` to <DeskObject> instead and this drawing is skipped.
// `u` makes gradient ids unique when the same object appears twice on a page.
import { scenes } from "./scenes";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const deskObjects = {
  camera: (u: string) => `<svg viewBox="0 0 300 210">
    <defs>
      <linearGradient id="sB${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b3c3f"/><stop offset=".5" stop-color="#232426"/><stop offset="1" stop-color="#151617"/></linearGradient>
      <pattern id="sR${u}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#1b1c1d"/><circle cx="1.5" cy="1.5" r=".6" fill="#28292a"/></pattern>
      <radialGradient id="sG${u}" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#7d6aa8"/><stop offset=".35" stop-color="#26344a"/><stop offset="1" stop-color="#04060a"/></radialGradient>
    </defs>
    <path d="M112 66 L124 26 Q127 18 136 18 L172 18 Q181 18 184 26 L196 66 Z" fill="url(#sB${u})"/>
    <rect x="138" y="12" width="32" height="7" rx="2" fill="#2a2b2d"/>
    <rect x="222" y="40" width="40" height="20" rx="4" fill="#2b2c2e"/>
    <g stroke="#18191a" stroke-width="1.2">${range(9).map((i) => `<line x1="${226 + i * 4}" y1="43" x2="${226 + i * 4}" y2="58"/>`).join("")}</g>
    <ellipse cx="242" cy="40" rx="20" ry="5" fill="#4a4c4f"/>
    <rect x="30" y="44" width="34" height="16" rx="3" fill="#2b2c2e"/>
    <ellipse cx="47" cy="44" rx="17" ry="4.5" fill="#4a4c4f"/>
    <ellipse cx="47" cy="41" rx="8" ry="3" fill="#9a9c9f"/>
    <path d="M20 74 Q20 60 34 60 L274 60 Q288 60 288 74 L288 186 Q288 198 276 198 L32 198 Q20 198 20 186 Z" fill="url(#sB${u})"/>
    <path d="M16 70 Q16 56 32 56 L74 56 Q84 56 86 66 L90 190 Q90 202 78 202 L30 202 Q16 202 16 188 Z" fill="url(#sR${u})"/>
    <rect x="82" y="66" width="3" height="128" rx="1.5" fill="#000" opacity=".25"/>
    <circle cx="168" cy="132" r="64" fill="#0d0e0f"/>
    <circle cx="168" cy="132" r="58" fill="none" stroke="#9a9c9f" stroke-width="3"/>
    <circle cx="168" cy="132" r="53" fill="#1b1c1e"/>
    <circle cx="168" cy="132" r="45" fill="#121314" stroke="#2a2b2d" stroke-width="7" stroke-dasharray="2 2.6"/>
    <circle cx="168" cy="132" r="33" fill="url(#sG${u})"/>
    <circle cx="168" cy="132" r="12" fill="#05070a"/>
    <ellipse cx="156" cy="117" rx="12" ry="6" fill="#fff" opacity=".3" transform="rotate(-32 156 117)"/>
    <circle cx="183" cy="146" r="3.5" fill="#c9a6ff" opacity=".25"/>
    <circle cx="246" cy="164" r="8" fill="#1d1e20" stroke="#3a3b3e"/>
    <circle cx="104" cy="80" r="4" fill="#e07a3a" opacity=".85"/>
  </svg>`,

  plate: (u: string) => `<svg viewBox="0 0 260 260">
    <defs>
      <radialGradient id="pB${u}" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#3f70d6"/><stop offset="1" stop-color="#1b3c8e"/></radialGradient>
      <radialGradient id="pH${u}" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="#f6f6f4"/><stop offset=".6" stop-color="#b9bab7"/><stop offset="1" stop-color="#7c7d79"/></radialGradient>
    </defs>
    <circle cx="130" cy="130" r="127" fill="#152f6d"/>
    <circle cx="130" cy="130" r="121" fill="url(#pB${u})"/>
    <circle cx="130" cy="130" r="94" fill="none" stroke="#173b88" stroke-width="3" opacity=".8"/>
    <circle cx="130" cy="130" r="62" fill="#2551b0" stroke="#15357a" stroke-width="2"/>
    <circle cx="130" cy="130" r="41" fill="url(#pH${u})"/>
    <circle cx="130" cy="130" r="25" fill="none" stroke="#8e8f8b" stroke-width="1.5"/>
    <circle cx="130" cy="130" r="16" fill="#161616"/>
    <text x="130" y="64" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="800" font-size="25" fill="#fff" letter-spacing="2">20 KG</text>
    <text x="130" y="212" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="700" font-size="11" fill="#cdd8f3" letter-spacing="5">COMPETITION</text>
    <ellipse cx="92" cy="74" rx="64" ry="22" fill="#fff" opacity=".08" transform="rotate(-32 92 74)"/>
  </svg>`,

  gpu: (u: string) => {
    const fan = (cx: number, cy: number, r: number) =>
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#101113" stroke="#2c2f34" stroke-width="3"/>` +
      range(9).map((i) => `<path d="M0 -13 C 10 -20, 20 -30, 22 -42 L 12 -45 C 10 -32, 4 -22, -4 -14 Z" fill="#2a2d32" transform="translate(${cx} ${cy}) rotate(${i * 40})"/>`).join("") +
      `<circle cx="${cx}" cy="${cy}" r="13" fill="#32353b"/><circle cx="${cx}" cy="${cy}" r="5" fill="#5a5e66"/>`;
    return `<svg viewBox="0 0 330 165">
    <defs>
      <linearGradient id="gS${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4046"/><stop offset="1" stop-color="#1f2125"/></linearGradient>
      <linearGradient id="gM${u}" x1="0" x2="1"><stop offset="0" stop-color="#8f9094"/><stop offset=".5" stop-color="#e2e3e5"/><stop offset="1" stop-color="#9c9da1"/></linearGradient>
    </defs>
    <rect x="44" y="128" width="276" height="11" rx="2" fill="#1f4a32"/>
    <g fill="#d1a640">${range(24).map((i) => `<rect x="${112 + i * 7 + (i > 5 ? 7 : 0)}" y="138" width="4.5" height="14" rx="1"/>`).join("")}</g>
    <rect x="44" y="8" width="276" height="124" rx="12" fill="url(#gS${u})"/>
    <rect x="52" y="12" width="260" height="6" rx="3" fill="#fff" opacity=".07"/>
    <path d="M58 122 H306" stroke="#7a7f88" stroke-width="2" stroke-linecap="round"/>
    ${fan(128, 68, 50)}${fan(240, 68, 50)}
    <rect x="6" y="2" width="40" height="160" rx="3" fill="url(#gM${u})"/>
    <g fill="#55575b">${range(6).map((i) => `<rect x="15" y="${12 + i * 11}" width="22" height="5" rx="2.5"/>`).join("")}</g>
    <g fill="#1a1b1d"><rect x="16" y="94" width="20" height="11" rx="2"/><rect x="16" y="112" width="20" height="11" rx="2"/><rect x="16" y="130" width="20" height="11" rx="2"/></g>
  </svg>`;
  },

  mic: (u: string) => `<svg viewBox="0 0 150 330">
    <defs>
      <pattern id="mM${u}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#c2c3bf"/><circle cx="2.5" cy="2.5" r="1.25" fill="#6f706c"/></pattern>
      <linearGradient id="mS${u}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
      <linearGradient id="mB${u}" x1="0" x2="1"><stop offset="0" stop-color="#141415"/><stop offset=".45" stop-color="#3b3c3f"/><stop offset="1" stop-color="#111112"/></linearGradient>
    </defs>
    <rect x="28" y="8" width="94" height="156" rx="47" fill="url(#mM${u})"/>
    <rect x="28" y="8" width="94" height="156" rx="47" fill="url(#mS${u})"/>
    <rect x="26" y="80" width="98" height="6" rx="3" fill="#8e8f8b"/>
    <rect x="24" y="158" width="102" height="16" rx="4" fill="#9a9b97"/>
    <rect x="24" y="158" width="102" height="16" rx="4" fill="url(#mS${u})"/>
    <path d="M32 172 L118 172 L108 300 Q75 312 42 300 Z" fill="url(#mB${u})"/>
    <circle cx="75" cy="200" r="4.5" fill="#d4a637"/>
    <rect x="56" y="300" width="38" height="24" rx="5" fill="#77787b"/>
  </svg>`,

  badge: () => `<svg viewBox="0 0 160 280">
    <path d="M52 0 L74 104 M108 0 L86 104" stroke="#2b3550" stroke-width="13" stroke-linecap="round"/>
    <path d="M52 0 L74 104 M108 0 L86 104" stroke="#fff" stroke-width="2" stroke-dasharray="1 9" opacity=".35"/>
    <rect x="64" y="98" width="32" height="18" rx="4" fill="#b8b9bc"/>
    <rect x="72" y="112" width="16" height="12" rx="2" fill="#8d8e91"/>
    <rect x="16" y="122" width="128" height="152" rx="9" fill="#fbfaf7" stroke="#d9d6cf"/>
    <rect x="66" y="130" width="28" height="6" rx="3" fill="#d9d6cf"/>
    <rect x="16" y="146" width="128" height="30" fill="#d23b2f"/>
    <text x="80" y="166" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="800" font-size="13" fill="#fff" letter-spacing="2">HACKATHON</text>
    <text x="80" y="198" text-anchor="middle" font-family="Fragment Mono, monospace" font-size="8" fill="#6c6f75" letter-spacing="2">PARTICIPANT</text>
    <text x="80" y="232" text-anchor="middle" font-family="Caveat Variable, cursive" font-weight="700" font-size="32" fill="#1e2f8a">Harith</text>
    <text x="80" y="258" text-anchor="middle" font-family="Fragment Mono, monospace" font-size="7" fill="#9a9a96" letter-spacing="1">TEAM · 404 NOT FOUND</text>
  </svg>`,

  cd: (u: string) => `<svg viewBox="0 0 220 220">
    <defs>
      <mask id="cM${u}"><rect width="220" height="220" fill="#fff"/><circle cx="110" cy="110" r="11" fill="#000"/></mask>
      <radialGradient id="cB${u}" cx=".5" cy=".5" r=".5"><stop offset=".25" stop-color="#f1f3f5"/><stop offset=".9" stop-color="#d4d8de"/><stop offset="1" stop-color="#b9bec6"/></radialGradient>
      <linearGradient id="cR${u}" x1="0" y1="0" x2="1" y2="1"><stop offset=".15" stop-color="#ff9ec7" stop-opacity="0"/><stop offset=".35" stop-color="#9fd8ff" stop-opacity=".55"/><stop offset=".5" stop-color="#c8ffb0" stop-opacity=".45"/><stop offset=".62" stop-color="#ffe08a" stop-opacity=".5"/><stop offset=".8" stop-color="#ff9ec7" stop-opacity="0"/></linearGradient>
    </defs>
    <g mask="url(#cM${u})">
      <circle cx="110" cy="110" r="106" fill="url(#cB${u})"/>
      <circle cx="110" cy="110" r="106" fill="url(#cR${u})"/>
      <circle cx="110" cy="110" r="38" fill="#f7f8f9" opacity=".85"/>
      <circle cx="110" cy="110" r="38" fill="none" stroke="#c3c8cf"/>
      <circle cx="110" cy="110" r="25" fill="#e3e6ea" opacity=".7"/>
    </g>
    <circle cx="110" cy="110" r="106" fill="none" stroke="#aeb3ba" stroke-width="1.5"/>
    <g font-family="Caveat Variable, cursive" font-weight="700" fill="#1e2f8a">
      <text x="110" y="58" text-anchor="middle" font-size="27" transform="rotate(-7 110 58)">linux (try #3)</text>
      <text x="114" y="176" text-anchor="middle" font-size="19" transform="rotate(5 114 176)">don't scratch!!</text>
    </g>
    <path d="M60 66 C 92 61, 130 59, 160 55" fill="none" stroke="#1e2f8a" stroke-width="2.5" stroke-linecap="round" transform="rotate(-7 110 58)"/>
  </svg>`,

  laptop: (u: string) => `<svg viewBox="0 0 340 250">
    <defs><linearGradient id="lB${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b4c50"/><stop offset="1" stop-color="#2a2b2e"/></linearGradient></defs>
    <rect x="38" y="4" width="264" height="174" rx="10" fill="#2a2b2e"/>
    <rect x="52" y="18" width="236" height="146" rx="3" fill="#07110a"/>
    <g font-family="Fragment Mono, monospace" font-size="8.5" fill="#8ee28e">
      <text x="62" y="38">live-cd login: harith</text>
      <text x="62" y="54">$ free -m</text>
      <text x="62" y="70">Mem:    500    487     13</text>
      <text x="62" y="86">$ sudo apt-get install firefox</text>
      <text x="62" y="102">Reading package lists... Done</text>
      <text x="62" y="118">0% [Connecting to archive...]</text>
      <text x="62" y="134">$ youtube please work</text>
    </g>
    <rect x="62" y="142" width="6" height="11" fill="#8ee28e"/>
    <path d="M52 18 L150 18 L80 164 L52 164 Z" fill="#fff" opacity=".04"/>
    <path d="M10 180 L330 180 L340 236 Q340 246 330 246 L10 246 Q0 246 0 236 Z" fill="url(#lB${u})"/>
    <rect x="30" y="176" width="280" height="6" rx="3" fill="#1d1e20"/>
    <g fill="#1c1d1f">${range(4).map((r) => range(14).map((c) => `<rect x="${44 + c * 18.4 + r * 2}" y="${189 + r * 9}" width="15.6" height="6.8" rx="1.2"/>`).join("")).join("")}</g>
    <rect x="140" y="226" width="60" height="16" rx="2" fill="#3c3d41" stroke="#26272a"/>
    <rect x="262" y="226" width="34" height="13" rx="2" fill="#ebe5d4"/>
    <text x="279" y="236" text-anchor="middle" font-family="Caveat Variable, cursive" font-weight="700" font-size="10" fill="#333">500MB</text>
  </svg>`,

  phone: () => `<svg viewBox="0 0 150 300">
    <rect x="3" y="3" width="144" height="294" rx="24" fill="#1c1c1e" stroke="#3a3a3c" stroke-width="2"/>
    <rect x="10" y="10" width="130" height="280" rx="18" fill="#f8f7f5"/>
    <rect x="58" y="16" width="34" height="9" rx="4.5" fill="#1c1c1e"/>
    <g transform="translate(18 31) scale(.3)">
      <rect x="7" y="7" width="50" height="50" rx="14" transform="rotate(-12 32 32)" fill="#635BFF"/>
      <path fill-rule="evenodd" d="M20.5 17H34.25C43.11 17 49.5 23.23 49.5 32C49.5 40.77 43.11 47 34.25 47H20.5V17ZM29 24V40H33.75C38.45 40 41.5 36.92 41.5 32C41.5 27.08 38.45 24 33.75 24H29Z" fill="#fff"/>
    </g>
    <text x="40" y="45" font-family="Geist Variable, sans-serif" font-weight="800" font-size="10.5" fill="#0A2540">DagangNow</text>
    <rect x="22" y="56" width="106" height="44" rx="6" fill="#e9b949"/>
    <text x="30" y="74" font-family="Geist Variable, sans-serif" font-weight="800" font-size="9" fill="#3a2a00">Kedai Kak Ros</text>
    <text x="30" y="88" font-family="Geist Variable, sans-serif" font-weight="600" font-size="6.5" fill="#5a4400">Kuih, kek &amp; biskut raya</text>
    <rect x="22" y="108" width="50" height="50" rx="5" fill="#d97b5c"/><rect x="78" y="108" width="50" height="50" rx="5" fill="#7aa37a"/>
    <rect x="22" y="162" width="40" height="4" rx="2" fill="#d6d2ca"/><rect x="78" y="162" width="34" height="4" rx="2" fill="#d6d2ca"/>
    <rect x="22" y="174" width="50" height="50" rx="5" fill="#6c8fb8"/><rect x="78" y="174" width="50" height="50" rx="5" fill="#c9a3c4"/>
    <rect x="22" y="228" width="36" height="4" rx="2" fill="#d6d2ca"/><rect x="78" y="228" width="42" height="4" rx="2" fill="#d6d2ca"/>
    <rect x="22" y="254" width="106" height="24" rx="12" fill="#635BFF"/>
    <text x="75" y="269" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="700" font-size="8" fill="#fff">Checkout · RM 48.00</text>
  </svg>`,

  polaroid: (u: string) => `<svg viewBox="0 0 200 240">
    <rect x="2" y="2" width="196" height="236" rx="3" fill="#f7f5f0"/>
    <svg x="14" y="14" width="172" height="172">${scenes.dusk(u)}</svg>
    <text x="100" y="218" text-anchor="middle" font-family="Caveat Variable, cursive" font-weight="600" font-size="23" fill="#3a3630">KL, after rain</text>
  </svg>`,

  tag: (u: string) => `<svg viewBox="0 0 260 180">
    <defs><linearGradient id="tF${u}" x1="1" y1="0" x2=".7" y2=".3"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
    <rect x="4" y="4" width="252" height="172" rx="14" style="fill:var(--accent)"/>
    <rect x="14" y="62" width="232" height="92" rx="4" fill="#fbf8f1"/>
    <text x="130" y="40" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="800" font-size="31" fill="#fff" letter-spacing="1">HELLO</text>
    <text x="130" y="56" text-anchor="middle" font-family="Geist Variable, sans-serif" font-weight="700" font-size="11.5" fill="#fff" opacity=".92">my name is</text>
    <text x="130" y="124" text-anchor="middle" font-family="Caveat Variable, cursive" font-weight="700" font-size="56" style="fill:var(--accent)">Harith</text>
    <path d="M70 138 C110 131 160 142 196 133" fill="none" style="stroke:var(--accent)" stroke-width="3" stroke-linecap="round"/>
    <rect x="4" y="4" width="252" height="172" rx="14" fill="url(#tF${u})"/>
  </svg>`,

  diary: (u: string) => `<svg viewBox="0 0 220 292">
    <defs><linearGradient id="dC${u}" x1="0" x2="1"><stop offset="0" stop-color="#1c2620"/><stop offset=".09" stop-color="#36463c"/><stop offset="1" stop-color="#2a372f"/></linearGradient></defs>
    <rect x="16" y="9" width="196" height="273" rx="10" fill="#eee5d0"/>
    <g stroke="#d6cbb2" stroke-width=".8">${range(5).map((i) => `<line x1="${206 - i}" y1="16" x2="${206 - i}" y2="276"/>`).join("")}</g>
    <rect x="8" y="4" width="196" height="276" rx="10" fill="url(#dC${u})"/>
    <rect x="8" y="4" width="15" height="276" rx="6" fill="#141b17" opacity=".55"/>
    <rect x="168" y="4" width="9" height="276" fill="#121212"/>
    <path d="M118 276 L118 292 L125 285 L132 292 L132 276 Z" fill="#b5402f"/>
    <text x="94" y="140" text-anchor="middle" font-family="Caveat Variable, cursive" font-weight="600" font-size="34" fill="#dcd2b9" transform="rotate(-4 94 140)">diary</text>
    <text x="94" y="164" text-anchor="middle" font-family="Fragment Mono, monospace" font-size="8" fill="#9fab9f" letter-spacing="2">2026 · VOL. 3</text>
    <rect x="23" y="4" width="145" height="276" fill="#fff" opacity=".035"/>
  </svg>`,
} satisfies Record<string, (u: string) => string>;

export type DeskObjectName = keyof typeof deskObjects;
