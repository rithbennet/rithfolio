// Stand-in "photos" for the gallery and the polaroid until real photographs are added.
// Fixed colours on purpose: real photos don't change with the site palette.
const SKYLINE = `<path d="M0 200 V158 H18 V146 H30 V158 H44 V132 H60 V152 H72 V140 H86 V158 H100 V128 H112 V200 Z M186 200 V150 H198 V122 H210 V150 H226 V136 H240 V154 H256 V142 H270 V160 H300 V200 Z"/>
  <path d="M116 200 V78 L119 70 L121 52 L123 34 L125 52 L127 70 L130 78 V200 Z M150 200 V78 L153 70 L155 52 L157 34 L159 52 L161 70 L164 78 V200 Z"/>
  <rect x="130" y="118" width="20" height="4"/>
  <path d="M232 200 V112 H236 V96 H232 Q240 86 248 96 H244 V112 H248 V200 Z M239 86 V64 H241 V86 Z"/>`;

const frame = (body: string) =>
  `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${body}</svg>`;

export const scenes = {
  dusk: (u: string) =>
    frame(`<defs><linearGradient id="sD${u}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f6b36a"/><stop offset=".45" stop-color="#d9787a"/><stop offset="1" stop-color="#4a3c70"/></linearGradient></defs>
    <rect width="300" height="200" fill="url(#sD${u})"/><circle cx="210" cy="150" r="22" fill="#ffe0aa" opacity=".9"/>
    <g fill="#2a2238">${SKYLINE}</g>`),
  hills: (u: string) =>
    frame(`<defs><linearGradient id="sH${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe9e2"/><stop offset="1" stop-color="#f3efe2"/></linearGradient></defs>
    <rect width="300" height="200" fill="url(#sH${u})"/>
    <path d="M0 110 Q60 70 120 98 T240 84 T300 96 V200 H0 Z" fill="#9dbaa3"/>
    <path d="M0 132 Q70 100 140 126 T300 118 V200 H0 Z" fill="#6b9278"/>
    <rect y="118" width="300" height="24" fill="#fff" opacity=".28"/>
    <path d="M0 158 Q80 128 170 156 T300 150 V200 H0 Z" fill="#3c6550"/>
    <path d="M0 182 Q90 160 190 184 T300 178 V200 H0 Z" fill="#244333"/>`),
  night: (u: string) =>
    frame(`<defs><linearGradient id="sN${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1628"/><stop offset="1" stop-color="#26324f"/></linearGradient>
    <radialGradient id="sL${u}"><stop offset="0" stop-color="#ffc56b"/><stop offset="1" stop-color="#ffc56b" stop-opacity="0"/></radialGradient></defs>
    <rect width="300" height="200" fill="url(#sN${u})"/>
    <path d="M110 200 L146 110 L154 110 L190 200 Z" fill="#121418"/>
    <g fill="url(#sL${u})"><circle cx="70" cy="70" r="34"/><circle cx="232" cy="58" r="40"/><circle cx="150" cy="96" r="18"/></g>
    <g opacity=".55"><circle cx="40" cy="150" r="10" fill="#e55b4d"/><circle cx="262" cy="140" r="13" fill="#4db3c9"/><circle cx="200" cy="160" r="8" fill="#f2c14e"/><circle cx="96" cy="128" r="6" fill="#f2c14e"/></g>
    <g fill="#0a0c10"><rect x="0" y="40" width="40" height="160"/><rect x="262" y="30" width="38" height="170"/></g>`),
  studio: (u: string) =>
    frame(`<defs><radialGradient id="sT${u}" cx=".55" cy=".42" r=".65"><stop offset="0" stop-color="#5d5f65"/><stop offset="1" stop-color="#18191c"/></radialGradient>
    <radialGradient id="sK${u}"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="300" height="200" fill="url(#sT${u})"/>
    <path d="M0 152 Q150 130 300 152 V200 H0 Z" fill="#2a2b2f"/>
    <circle cx="62" cy="62" r="54" fill="url(#sK${u})"/>
    <rect x="38" y="38" width="48" height="48" rx="3" fill="#f4f4f2" transform="rotate(-12 62 62)"/>
    <path d="M62 86 V176 M62 176 L44 198 M62 176 L80 198" stroke="#0e0e10" stroke-width="2.5" fill="none"/>
    <circle cx="182" cy="86" r="14" fill="#0c0c0d"/>
    <path d="M156 200 Q158 120 182 106 Q206 120 208 200 Z" fill="#0c0c0d"/>
    <path d="M170 82 Q181 66 194 80" fill="none" stroke="#f0f0f0" stroke-width="1.3" opacity=".55"/>`),
  sea: (u: string) =>
    frame(`<defs><linearGradient id="sS${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6d6e1"/><stop offset="1" stop-color="#eaf4f1"/></linearGradient>
    <linearGradient id="sW${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f93a1"/><stop offset="1" stop-color="#1d6676"/></linearGradient></defs>
    <rect width="300" height="200" fill="url(#sS${u})"/><circle cx="72" cy="56" r="16" fill="#fff6dc"/>
    <rect y="96" width="300" height="60" fill="url(#sW${u})"/>
    <path d="M0 150 Q80 138 160 152 T300 146 V200 H0 Z" fill="#ead4a8"/>
    <path d="M0 152 Q80 140 160 154 T300 148" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`),
} satisfies Record<string, (u: string) => string>;

export type SceneName = keyof typeof scenes;
