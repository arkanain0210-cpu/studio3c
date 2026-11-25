// 공통 스타일 + SVG 일러스트 부품
// 모든 그림은 코드로 그린 개념도입니다(실제 프로그램 화면 캡처가 아님).

let uid = 0;
const nid = (p = 'g') => `${p}${++uid}`;

export const C = {
  ink: '#1C2433',
  sub: '#5B6577',
  line: '#D9DEE6',
  paper: '#FFFFFF',
  tint: '#F4F6FA',
  blue: '#2F62D8',
  blueTint: '#E8EFFD',
  green: '#1E8E5A',
  greenTint: '#E3F4EB',
  red: '#D33F33',
  redTint: '#FCE9E7',
  amber: '#C98A0B',
  amberTint: '#FDF3DC',
  skin: '#F1CBAE',
  skinShade: '#D9A585',
  hair: '#2A2B33',
  jacket: '#34445E',
  lapel: '#2A3850',
  shirt: '#FFFFFF',
  lip: '#B8675C',
};

export function css(accent = C.blue, footerTitle = '') {
  return `
@font-face{font-family:'Pretendard';font-weight:400;src:url('../fonts/Pretendard-Regular.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:500;src:url('../fonts/Pretendard-Medium.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:600;src:url('../fonts/Pretendard-SemiBold.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:700;src:url('../fonts/Pretendard-Bold.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:800;src:url('../fonts/Pretendard-ExtraBold.woff2') format('woff2');}
:root{
  --ink:${C.ink};--sub:${C.sub};--line:${C.line};--tint:${C.tint};
  --accent:${accent};--blue:${C.blue};--blueTint:${C.blueTint};
  --green:${C.green};--greenTint:${C.greenTint};--red:${C.red};--redTint:${C.redTint};
  --amber:${C.amber};--amberTint:${C.amberTint};
}
@page{
  size:A4;margin:19mm 18mm 20mm 18mm;
  @bottom-left{content:"${footerTitle}";font-family:Pretendard;font-size:7.5pt;color:#9AA3B2;}
  @bottom-right{content:counter(page);font-family:Pretendard;font-size:8pt;font-weight:600;color:#7B8596;}
}
@page cover{margin:0;@bottom-left{content:none}@bottom-right{content:none}}
@page plain{@bottom-left{content:none}}
*{box-sizing:border-box;}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{margin:0;font-family:Pretendard,sans-serif;color:var(--ink);font-size:10pt;line-height:1.68;
  word-break:keep-all;overflow-wrap:break-word;background:#fff;font-feature-settings:"tnum" 0;}
p{margin:0 0 2.6mm;}
strong{font-weight:700;}
h1,h2,h3,h4{margin:0;line-height:1.3;font-weight:800;letter-spacing:-0.01em;}
.page{break-before:page;}
.nobreak{break-inside:avoid;}
.part{display:flex;align-items:flex-end;gap:5mm;border-bottom:2.2pt solid var(--ink);padding-bottom:3mm;margin-bottom:6mm;}
.part .num{font-size:30pt;font-weight:800;color:var(--accent);line-height:0.9;}
.part .t small{display:block;font-size:8.5pt;font-weight:700;color:var(--sub);letter-spacing:0.12em;margin-bottom:1mm;}
.part .t h1{font-size:19pt;}
h2{font-size:14pt;margin:6mm 0 3mm;}
h2 .tag{display:inline-block;font-size:8pt;font-weight:700;color:#fff;background:var(--accent);border-radius:2mm;padding:0.6mm 2.2mm;margin-right:2mm;vertical-align:3pt;}
h3{font-size:11pt;margin:4.5mm 0 2mm;}
.lead{font-size:10.6pt;color:#323C4E;}
.muted{color:var(--sub);}
.small{font-size:8.6pt;line-height:1.55;}
.xs{font-size:7.6pt;line-height:1.45;color:var(--sub);}
ul,ol{margin:0 0 3mm;padding-left:5mm;}
li{margin:0.6mm 0;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm;}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4mm;}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;}
.card{border:0.8pt solid var(--line);border-radius:3mm;padding:4mm 4.5mm;background:#fff;break-inside:avoid;}
.card.tint{background:var(--tint);border-color:transparent;}
.card h3{margin-top:0;}
.callout{border-left:3pt solid var(--accent);background:var(--blueTint);padding:3.5mm 4.5mm;border-radius:0 2.5mm 2.5mm 0;margin:3mm 0 4mm;break-inside:avoid;}
.callout.warn{border-color:var(--red);background:var(--redTint);}
.callout.ok{border-color:var(--green);background:var(--greenTint);}
.callout.tip{border-color:var(--amber);background:var(--amberTint);}
.callout .h{font-weight:800;margin-bottom:1mm;display:block;}
.callout p:last-child,.card p:last-child{margin-bottom:0;}
table{width:100%;border-collapse:collapse;margin:2mm 0 4mm;font-size:9pt;line-height:1.5;break-inside:auto;}
th,td{border-bottom:0.6pt solid var(--line);padding:2mm 2.2mm;text-align:left;vertical-align:top;}
th{background:var(--tint);font-weight:700;font-size:8.6pt;color:#3A4456;border-bottom:1pt solid #C5CCD8;}
tr{break-inside:avoid;}
td.c,th.c{text-align:center;}
.o{color:var(--green);font-weight:800;}
.x{color:var(--red);font-weight:800;}
.d{color:var(--amber);font-weight:800;}
.steps{counter-reset:s;list-style:none;padding:0;margin:0 0 3mm;}
.steps>li{counter-increment:s;position:relative;padding:0 0 2.6mm 9.5mm;margin:0;}
.steps>li::before{content:counter(s);position:absolute;left:0;top:0.3mm;width:6.4mm;height:6.4mm;border-radius:50%;
  background:var(--accent);color:#fff;font-weight:800;font-size:8.5pt;line-height:6.4mm;text-align:center;}
.steps>li b{font-weight:700;}
.path{display:inline-block;font-weight:600;background:#EEF1F6;border:0.5pt solid #D3D9E3;border-radius:1.4mm;padding:0 1.6mm;font-size:8.8pt;white-space:nowrap;}
.key{display:inline-block;font-weight:700;font-size:8pt;border:0.8pt solid #AEB6C3;border-bottom-width:1.6pt;border-radius:1.2mm;padding:0 1.4mm;background:#fff;min-width:5mm;text-align:center;white-space:nowrap;}
.prompt{font-size:9.2pt;background:#151C2A;color:#E9EEF7;border-radius:2.5mm;padding:3mm 4mm;margin:1.5mm 0 3mm;line-height:1.6;break-inside:avoid;}
.prompt .lbl{display:block;font-size:7.5pt;font-weight:700;color:#8FA4C8;letter-spacing:0.08em;margin-bottom:0.8mm;}
figure{margin:2mm 0 4mm;break-inside:avoid;}
figure svg{display:block;width:100%;height:auto;}
figcaption{font-size:8.2pt;color:var(--sub);margin-top:1.5mm;line-height:1.45;}
.check{list-style:none;padding:0;margin:0 0 3mm;}
.check li{position:relative;padding-left:7mm;margin:1.4mm 0;}
.check li::before{content:"";position:absolute;left:0;top:0.9mm;width:4.2mm;height:4.2mm;border:1.1pt solid #7D8798;border-radius:1mm;background:#fff;}
.write{border-bottom:0.7pt solid #AEB6C3;height:8mm;}
.box{border:0.8pt solid #AEB6C3;border-radius:2mm;}
.pill{display:inline-block;font-size:7.6pt;font-weight:700;border-radius:10mm;padding:0.3mm 2.2mm;background:var(--tint);color:#3A4456;margin-right:1mm;}
.pill.red{background:var(--redTint);color:var(--red);} .pill.green{background:var(--greenTint);color:var(--green);} .pill.blue{background:var(--blueTint);color:var(--blue);} .pill.amber{background:var(--amberTint);color:#8A5E00;}
.src{font-size:7.4pt;color:#8A93A3;line-height:1.45;margin-top:2mm;}
.hr{height:0;border-top:0.6pt solid var(--line);margin:5mm 0;}
.toc{list-style:none;padding:0;margin:0;}
.toc li{display:flex;align-items:baseline;gap:3mm;padding:2.3mm 0;border-bottom:0.6pt dashed var(--line);margin:0;}
.toc .n{font-weight:800;color:var(--accent);width:16mm;flex:none;}
.toc .tt{font-weight:700;flex:1;}
.toc .ds{color:var(--sub);font-size:8.6pt;}
.badge-day{display:inline-block;font-size:8pt;font-weight:800;color:var(--accent);border:1pt solid var(--accent);border-radius:1.5mm;padding:0 1.8mm;margin-right:1.5mm;vertical-align:1pt;}
`;
}

// ───────────────────────── 인물 일러스트 ─────────────────────────
// 머리 중심(0,0) 기준 좌표. 얼굴(정수리~턱, 머리카락 제외) 길이 = 280 단위.
export function person(o = {}) {
  const {
    tilt = 0, mouth = 'neutral', bangs = false, cheekHair = false, glasses = false, glare = false,
    look = 'front', turn = false, earphone = false, collarMessy = false, jacket = C.jacket,
    lapel = C.lapel, hair = C.hair, skin = C.skin, shade = C.skinShade, bodyOnly = false, noBody = false,
  } = o;
  const sx = turn ? 0.78 : 1;
  const body = noBody ? '' : `
  <g transform="scale(${sx},1) translate(${turn ? 30 : 0},0)">
    <path d="M-44,90 L-42,200 L42,200 L44,90 Z" fill="${shade}"/>
    <path d="M-310,560 L-300,310 Q-290,222 -175,204 L-58,180 L0,250 L58,180 L175,204 Q290,222 300,310 L310,560 Z" fill="${jacket}"/>
    <path d="M-58,182 L0,300 L58,182 Z" fill="${C.shirt}"/>
    <path d="M-58,180 L-6,300 L-26,360 L-112,214 Z" fill="${lapel}"/>
    <path d="M58,180 L6,300 L26,360 L112,214 Z" fill="${lapel}"/>
    ${collarMessy
      ? `<path d="M-50,176 L-4,226 L-74,234 Z" fill="#fff" stroke="#C9CED6" stroke-width="3"/>
         <path d="M48,170 L96,140 L74,206 Z" fill="#fff" stroke="#C9CED6" stroke-width="3"/>`
      : `<path d="M-50,176 L-4,226 L-66,214 Z" fill="#fff" stroke="#C9CED6" stroke-width="3"/>
         <path d="M50,176 L4,226 L66,214 Z" fill="#fff" stroke="#C9CED6" stroke-width="3"/>`}
    <path d="M-10,226 L10,226 L14,300 L0,318 L-14,300 Z" fill="#41608F"/>
  </g>`;
  if (bodyOnly) return body;
  const ey = look === 'down' ? -3 : -8;
  const mouthSvg = {
    neutral: `<path d="M-25,84 Q0,88 25,84" stroke="${C.lip}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`,
    smile: `<path d="M-32,76 Q0,102 32,76" stroke="${C.lip}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`,
    teeth: `<path d="M-34,74 Q0,112 34,74 Q0,82 -34,74 Z" fill="#fff" stroke="${C.lip}" stroke-width="4.5" stroke-linejoin="round"/>`,
  }[mouth];
  const eye = (x) => `
    <ellipse cx="${x}" cy="-8" rx="17" ry="8.5" fill="#fff"/>
    <circle cx="${x}" cy="${ey}" r="7.6" fill="#2B2420"/>
    <circle cx="${x + 2.6}" cy="${ey - 2.6}" r="2.1" fill="#fff"/>`;
  const head = `
  <g transform="rotate(${tilt},0,120)">
    <path d="M-110,30 C-122,-96 -74,-162 0,-162 C74,-162 122,-96 110,30 Z" fill="${hair}"/>
    <ellipse cx="-94" cy="10" rx="15" ry="29" fill="${skin}"/>
    <ellipse cx="94" cy="10" rx="15" ry="29" fill="${skin}"/>
    <path d="M0,-140 C58,-140 95,-104 95,-34 C95,46 70,112 0,140 C-70,112 -95,46 -95,-34 C-95,-104 -58,-140 0,-140 Z" fill="${skin}"/>
    <path d="M-102,-26 C-108,-120 -62,-160 0,-160 C62,-160 108,-120 102,-26 C92,-80 52,-104 0,-104 C-52,-104 -92,-80 -102,-26 Z" fill="${hair}"/>
    <path d="M-62,-40 Q-42,-51 -21,-42" stroke="${hair}" stroke-width="7.5" fill="none" stroke-linecap="round"/>
    <path d="M62,-40 Q42,-51 21,-42" stroke="${hair}" stroke-width="7.5" fill="none" stroke-linecap="round"/>
    ${eye(-42)}${eye(42)}
    <path d="M-3,8 Q-13,40 -10,49 Q0,55 11,49" stroke="${shade}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    ${mouthSvg}
    ${bangs ? `<path d="M-100,-74 Q0,-132 100,-74 L96,-22 Q40,-30 0,-28 Q-50,-28 -96,-20 Z" fill="${hair}"/>` : ''}
    ${cheekHair ? `<path d="M-106,-50 Q-116,40 -84,118 L-58,104 Q-78,30 -70,-60 Z" fill="${hair}"/><path d="M106,-50 Q116,40 84,118 L58,104 Q78,30 70,-60 Z" fill="${hair}"/>` : ''}
    ${glasses ? `<g fill="#DCEBFF" fill-opacity="0.35" stroke="#1B1B1F" stroke-width="4.5"><rect x="-74" y="-30" width="62" height="42" rx="13"/><rect x="12" y="-30" width="62" height="42" rx="13"/><path d="M-12,-14 Q0,-20 12,-14"/></g>` : ''}
    ${glare ? `<path d="M-72,-28 L-26,-28 L-48,10 L-72,10 Z" fill="#fff" opacity="0.96"/><path d="M-22,-28 L-14,-28 L-30,10 L-38,10 Z" fill="#fff" opacity="0.9"/><path d="M14,-28 L40,-28 L22,10 L14,10 Z" fill="#fff" opacity="0.8"/>` : ''}
    ${earphone ? `<circle cx="100" cy="22" r="11" fill="#fff" stroke="#9AA3B2" stroke-width="3"/><rect x="94" y="30" width="10" height="34" rx="5" fill="#fff" stroke="#9AA3B2" stroke-width="3"/>` : ''}
  </g>`;
  return body + head;
}

// 인물 실루엣(배경 경계 표시용)
function silhouette(stroke, w) {
  return `<g fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round">
    <path d="M-110,30 C-122,-96 -74,-162 0,-162 C74,-162 122,-96 110,30"/>
    <path d="M-300,560 L-300,310 Q-290,222 -175,204 L-44,180 L44,180 L175,204 Q290,222 300,310 L300,560"/></g>`;
}

// 사진 프레임 안에 인물 배치. W,H: 프레임 크기(0.1mm 단위 권장). s: 배율, cy: 머리 중심 y
export function photo({ W = 350, H = 450, s = 1.214, cx, cy, bg = '#FFFFFF', shadow = false, cutout = false, border = true, person: po = {}, extra = '' } = {}) {
  const id = nid('clip');
  const fid = nid('blur');
  cx = cx ?? W / 2;
  cy = cy ?? 40 + 140 * s;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="${id}"><rect width="${W}" height="${H}"/></clipPath>
  <filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${14 * s}"/></filter></defs>
  <g clip-path="url(#${id})">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    ${shadow ? `<g transform="translate(${cx + 62 * s},${cy + 26 * s}) scale(${s})" filter="url(#${fid})" opacity="0.55"><path d="M-112,60 C-124,-96 -76,-166 0,-166 C76,-166 124,-96 112,60 Z" fill="#8E97A4"/><path d="M-300,560 L-300,310 Q-290,222 -175,204 L175,204 Q290,222 300,310 L300,560 Z" fill="#8E97A4"/></g>` : ''}
    ${cutout ? `<g transform="translate(${cx},${cy}) scale(${s})">${silhouette('#B9C0CA', 16)}</g>` : ''}
    <g transform="translate(${cx},${cy}) scale(${s})">${person(po)}</g>
    ${extra}
  </g>
  ${border ? `<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="#B7BFCB" stroke-width="1.5"/>` : ''}
</svg>`;
}

const T = (x, y, t, o = {}) => {
  const { size = 13, w = 600, fill = C.ink, anchor = 'start', extra = '' } = o;
  return `<text x="${x}" y="${y}" font-family="Pretendard" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" ${extra}>${t}</text>`;
};
export { T as svgText };

const badge = (x, y, ok, r = 22) => ok
  ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.green}"/><path d="M${x - r * 0.45},${y} L${x - r * 0.1},${y + r * 0.38} L${x + r * 0.5},${y - r * 0.35}" stroke="#fff" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  : `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.red}"/><path d="M${x - r * 0.38},${y - r * 0.38} L${x + r * 0.38},${y + r * 0.38} M${x + r * 0.38},${y - r * 0.38} L${x - r * 0.38},${y + r * 0.38}" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round"/>`;

// ───────────────────────── 그림 모음 ─────────────────────────

// 표지 일러스트
export function coverArt() {
  const p = photo({ W: 350, H: 450, bg: '#FFFFFF', border: false });
  const inner = p.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<svg viewBox="0 0 560 620" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="cvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.18"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0.02"/></linearGradient></defs>
  <rect x="150" y="40" width="380" height="490" rx="10" fill="url(#cvg)" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2" transform="rotate(6 340 285)"/>
  <g transform="translate(70,70)">
    <rect x="-12" y="-12" width="374" height="474" rx="6" fill="#fff" />
    ${inner}
    <g stroke="#FFD166" stroke-width="3" fill="none">
      <path d="M-30,0 H-14 M0,-30 V-14"/><path d="M380,0 H364 M350,-30 V-14"/>
      <path d="M-30,450 H-14 M0,480 V464"/><path d="M380,450 H364 M350,480 V464"/>
    </g>
    <g stroke="#FFD166" stroke-width="2.4" stroke-dasharray="7 6" fill="none">
      <line x1="-6" y1="40" x2="356" y2="40"/><line x1="-6" y1="380" x2="356" y2="380"/>
    </g>
    ${T(362, 44, '정수리', { size: 15, w: 700, fill: '#FFD166' })}
    ${T(362, 384, '턱', { size: 15, w: 700, fill: '#FFD166' })}
    ${T(362, 214, '32~36mm', { size: 17, w: 800, fill: '#FFFFFF' })}
    <path d="M384,52 V180 M384,226 V368" stroke="#fff" stroke-width="2"/>
    <path d="M378,60 L384,50 L390,60 M378,360 L384,370 L390,360" stroke="#fff" stroke-width="2" fill="none"/>
  </g>
  <g transform="translate(470,540)" fill="#FFD166">
    <path d="M0,-34 C4,-8 8,-4 34,0 C8,4 4,8 0,34 C-4,8 -8,4 -34,0 C-8,-4 -4,-8 0,-34 Z"/>
    <path transform="translate(44,52) scale(0.45)" d="M0,-34 C4,-8 8,-4 34,0 C8,4 4,8 0,34 C-4,8 -8,4 -34,0 C-8,-4 -4,-8 0,-34 Z"/>
  </g>
</svg>`;
}

// 여권 규격 도해
export function passportSpec() {
  const p = photo({ W: 350, H: 450 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const ox = 150, oy = 60;
  return `<svg viewBox="0 0 700 600" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${ox},${oy})">${p}
    <line x1="175" y1="0" x2="175" y2="450" stroke="${C.blue}" stroke-width="1.6" stroke-dasharray="6 6" opacity="0.8"/>
    <line x1="-14" y1="40" x2="364" y2="40" stroke="${C.red}" stroke-width="2" stroke-dasharray="7 5"/>
    <line x1="-14" y1="380" x2="364" y2="380" stroke="${C.red}" stroke-width="2" stroke-dasharray="7 5"/>
  </g>
  <!-- 가로 -->
  <g stroke="${C.ink}" stroke-width="1.6" fill="none">
    <path d="M${ox},${oy - 26} H${ox + 350}"/><path d="M${ox},${oy - 34} V${oy - 18} M${ox + 350},${oy - 34} V${oy - 18}"/>
  </g>
  ${T(ox + 175, oy - 34, '가로 3.5cm', { anchor: 'middle', size: 17, w: 800 })}
  <!-- 세로 -->
  <g stroke="${C.ink}" stroke-width="1.6" fill="none">
    <path d="M${ox + 380},${oy} V${oy + 450}"/><path d="M${ox + 372},${oy} H${ox + 388} M${ox + 372},${oy + 450} H${ox + 388}"/>
  </g>
  ${T(ox + 396, oy + 232, '세로 4.5cm', { size: 17, w: 800 })}
  <!-- 머리 길이 -->
  <g stroke="${C.red}" stroke-width="2" fill="none">
    <path d="M${ox - 40},${oy + 40} V${oy + 380}"/><path d="M${ox - 48},${oy + 40} H${ox - 32} M${ox - 48},${oy + 380} H${ox - 32}"/>
  </g>
  ${T(ox - 56, oy + 200, '머리 길이', { anchor: 'end', size: 15, w: 800, fill: C.red })}
  ${T(ox - 56, oy + 222, '3.2~3.6cm', { anchor: 'end', size: 17, w: 800, fill: C.red })}
  ${T(ox - 56, oy + 244, '(정수리~턱)', { anchor: 'end', size: 12, w: 600, fill: C.sub })}
  ${T(ox - 56, oy + 46, '정수리', { anchor: 'end', size: 12, w: 700, fill: C.red })}
  ${T(ox - 56, oy + 60, '머리카락 제외', { anchor: 'end', size: 10.5, w: 500, fill: C.sub })}
  ${T(ox - 56, oy + 386, '턱 끝', { anchor: 'end', size: 12, w: 700, fill: C.red })}
  <!-- 하단 라벨 -->
  ${T(ox + 175, oy + 488, '온라인 신청용 파일 권장: 413 × 531 픽셀', { anchor: 'middle', size: 15, w: 700, fill: C.blue })}
  ${T(ox + 175, oy + 512, '얼굴 중앙 정렬 · 균일한 흰색 배경 · 테두리 없음', { anchor: 'middle', size: 13, w: 500, fill: C.sub })}
</svg>`;
}

// 반려 사례 그리드
export function rejectGrid() {
  const items = [
    { t: '고개가 기울어짐', o: { person: { tilt: 9 } } },
    { t: '치아가 보이는 미소', o: { person: { mouth: 'teeth' } } },
    { t: '앞머리가 눈썹을 가림', o: { person: { bangs: true } } },
    { t: '배경에 그림자', o: { shadow: true } },
    { t: '근접 촬영 (머리 길이 초과)', o: { s: 1.5, cy: 30 + 140 * 1.5 } },
    { t: '안경 빛 반사', o: { person: { glasses: true, glare: true } } },
    { t: '배경을 지우고 흰색 합성', o: { cutout: true } },
    { t: '규정에 맞는 사진', ok: true, o: {} },
  ];
  const cw = 160, ch = 206, gap = 22;
  let out = '';
  items.forEach((it, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = col * (cw + gap), y = row * (ch + 70);
    const svg = photo({ W: 350, H: 450, ...it.o }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    out += `<g transform="translate(${x},${y})"><g transform="scale(${cw / 350})">${svg}</g>
      ${badge(cw - 14, 16, !!it.ok, 15)}
      ${T(cw / 2, ch + 26, `${it.ok ? '' : (i + 1) + '. '}${it.t}`, { anchor: 'middle', size: 13.5, w: 700, fill: it.ok ? C.green : C.ink })}
    </g>`;
  });
  return `<svg viewBox="-4 -4 ${4 * cw + 3 * gap + 8} ${2 * ch + 70 + 40}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

// 조명 배치(위에서 본 모습)
export function lightingTop() {
  return `<svg viewBox="0 0 700 470" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.amber}"/></marker>
    <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.sub}"/></marker>
  </defs>
  <rect x="0" y="0" width="700" height="470" rx="14" fill="${C.tint}"/>
  <!-- 흰 벽 / 배경지 -->
  <rect x="190" y="30" width="320" height="18" rx="3" fill="#fff" stroke="#AEB6C3" stroke-width="2"/>
  ${T(350, 24, '흰 벽 또는 흰 배경지', { anchor: 'middle', size: 14, w: 700 })}
  <!-- 창문 -->
  <rect x="22" y="110" width="16" height="190" fill="#CFE2FF" stroke="${C.blue}" stroke-width="2"/>
  ${T(30, 96, '창문', { anchor: 'middle', size: 14, w: 700, fill: C.blue })}
  ${T(30, 324, '얇은 커튼으로', { anchor: 'middle', size: 11.5, w: 500, fill: C.sub })}
  ${T(30, 340, '빛 부드럽게', { anchor: 'middle', size: 11.5, w: 500, fill: C.sub })}
  <g stroke="${C.amber}" stroke-width="3" marker-end="url(#arr)">
    <line x1="50" y1="140" x2="285" y2="170"/><line x1="50" y1="205" x2="285" y2="200"/><line x1="50" y1="270" x2="285" y2="230"/>
  </g>
  <!-- 인물 -->
  <ellipse cx="350" cy="200" rx="70" ry="28" fill="${C.jacket}"/>
  <circle cx="350" cy="196" r="30" fill="${C.skin}" stroke="${C.hair}" stroke-width="7"/>
  <path d="M340,226 L350,240 L360,226" fill="${C.skinShade}"/>
  ${T(350, 140, '나', { anchor: 'middle', size: 15, w: 800 })}
  <!-- 벽과 거리 -->
  <g stroke="${C.sub}" stroke-width="1.6" marker-start="url(#arr2)" marker-end="url(#arr2)"><line x1="455" y1="54" x2="455" y2="166"/></g>
  ${T(466, 106, '벽에서 1m 이상', { size: 13, w: 700 })}
  ${T(466, 124, '→ 배경 그림자 방지', { size: 11.5, w: 500, fill: C.sub })}
  <!-- 반사판 -->
  <rect x="470" y="200" width="80" height="12" rx="3" fill="#fff" stroke="#AEB6C3" stroke-width="2" transform="rotate(-35 510 206)"/>
  ${T(560, 236, '반사판', { size: 14, w: 700 })}
  ${T(560, 254, '흰 폼보드·A3 종이', { size: 11.5, w: 500, fill: C.sub })}
  ${T(560, 270, '어두운 쪽 얼굴을 밝혀 줌', { size: 11.5, w: 500, fill: C.sub })}
  <g stroke="${C.amber}" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#arr)"><line x1="478" y1="216" x2="392" y2="206"/></g>
  <!-- 카메라 -->
  <path d="M350,398 L268,262 M350,398 L432,262" stroke="${C.blue}" stroke-width="1.6" stroke-dasharray="4 5"/>
  <rect x="326" y="392" width="48" height="30" rx="6" fill="${C.ink}"/>
  <circle cx="350" cy="407" r="8" fill="#5D79B5"/>
  ${T(350, 446, '스마트폰 + 삼각대 (눈높이)', { anchor: 'middle', size: 14, w: 700 })}
  <g stroke="${C.sub}" stroke-width="1.6" marker-start="url(#arr2)" marker-end="url(#arr2)"><line x1="230" y1="236" x2="230" y2="398"/></g>
  ${T(220, 316, '1.5~2m', { anchor: 'end', size: 14, w: 800 })}
  ${T(220, 334, '2배 줌으로 촬영', { anchor: 'end', size: 11.5, w: 500, fill: C.sub })}
</svg>`;
}

// 카메라 거리 비교 (옆에서 본 모습)
export function cameraSide() {
  const mini = (x, close) => `
  <g transform="translate(${x},0)">
    <rect x="0" y="0" width="330" height="230" rx="12" fill="${close ? C.redTint : C.greenTint}"/>
    <!-- 사람 옆모습 -->
    <circle cx="70" cy="86" r="30" fill="${C.skin}"/><path d="M40,80 Q44,50 72,52 Q100,54 98,82 Q90,64 70,64 Q52,64 40,80 Z" fill="${C.hair}"/>
    <path d="M99,88 L106,96 L98,100" fill="${C.skin}"/>
    <path d="M42,118 Q70,108 98,118 L104,200 L36,200 Z" fill="${C.jacket}"/>
    ${close
      ? `<rect x="148" y="70" width="14" height="30" rx="3" fill="${C.ink}"/><path d="M148,85 L104,86" stroke="${C.red}" stroke-width="1.6" stroke-dasharray="4 4"/>
         ${T(126, 132, '30cm', { anchor: 'middle', size: 15, w: 800, fill: C.red })}
         <path d="M162,85 L240,60" stroke="${C.skin}" stroke-width="12" stroke-linecap="round"/>`
      : `<rect x="284" y="70" width="14" height="30" rx="3" fill="${C.ink}"/><path d="M284,85 L106,86" stroke="${C.green}" stroke-width="1.6" stroke-dasharray="4 4"/>
         <path d="M291,100 L280,200 M291,100 L302,200 M291,100 V200" stroke="${C.sub}" stroke-width="2.4"/>
         ${T(195, 74, '1.5~2m · 2배 줌', { anchor: 'middle', size: 15, w: 800, fill: C.green })}`}
    ${badge(306, 24, !close, 15)}
    ${T(165, 222, close ? '팔 뻗은 셀카: 코·이마가 커 보임' : '거리를 두고 줌: 실물과 같은 비율', { anchor: 'middle', size: 13, w: 700 })}
  </g>`;
  return `<svg viewBox="0 0 690 236" xmlns="http://www.w3.org/2000/svg">${mini(0, true)}${mini(360, false)}</svg>`;
}

// 작업 흐름도
export function workflow() {
  const box = (x, y, w, h, t1, t2, fill, stroke, tc = C.ink) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    ${T(x + w / 2, y + h / 2 - (t2 ? 4 : -5), t1, { anchor: 'middle', size: 14.5, w: 800, fill: tc })}
    ${t2 ? T(x + w / 2, y + h / 2 + 16, t2, { anchor: 'middle', size: 11.5, w: 500, fill: C.sub }) : ''}`;
  const ar = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="#8C96A8" stroke-width="2.4" marker-end="url(#wa)"/>`;
  return `<svg viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="wa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8C96A8"/></marker></defs>
  ${box(0, 125, 120, 76, '촬영 원본', '흰 배경에서', '#fff', '#AEB6C3')}
  ${ar(122, 150, 170, 72)}${ar(122, 176, 170, 252)}
  <rect x="172" y="18" width="528" height="112" rx="14" fill="${C.redTint}"/>
  ${T(186, 40, '여권·신분증용  |  보정 금지 · 자르기와 크기 조정만', { size: 12.5, w: 800, fill: C.red })}
  ${box(186, 52, 150, 66, '라이트룸 자르기', '35:45 비율', '#fff', '#E3A39D')}
  ${ar(338, 85, 362, 85)}
  ${box(364, 52, 150, 66, '규격 확인', '외교부 온라인 검증', '#fff', '#E3A39D')}
  ${ar(516, 85, 540, 85)}
  ${box(542, 52, 146, 66, '413×531 JPG', '인화는 3.5×4.5cm', '#fff', '#E3A39D')}
  <rect x="172" y="196" width="528" height="126" rx="14" fill="${C.greenTint}"/>
  ${T(186, 218, '이력서·프로필용  |  실물 범위의 자연스러운 AI 보정', { size: 12.5, w: 800, fill: C.green })}
  ${box(186, 232, 116, 78, '라이트룸', '밝기·색·피부결', '#fff', '#8FCBAE')}
  ${ar(304, 271, 322, 271)}
  ${box(324, 232, 116, 78, '포토샵', '배경·옷 정리', '#fff', '#8FCBAE')}
  ${ar(442, 271, 460, 271)}
  ${box(462, 232, 104, 78, '무료 AI', '비교 실습', '#fff', '#8FCBAE')}
  ${ar(568, 271, 586, 271)}
  ${box(588, 232, 100, 78, '3×4cm', 'JPG · 인화', '#fff', '#8FCBAE')}
  ${T(60, 230, '복사본을', { anchor: 'middle', size: 11.5, w: 600, fill: C.sub })}
  ${T(60, 246, '두 개 만들어', { anchor: 'middle', size: 11.5, w: 600, fill: C.sub })}
  ${T(60, 262, '용도별로 작업', { anchor: 'middle', size: 11.5, w: 600, fill: C.sub })}
</svg>`;
}

// 사람 마스크 부위 지도
export function faceMap() {
  const s = 1.25, cx = 350, cy = 250;
  const svg = `<g transform="translate(${cx},${cy}) scale(${s})">${person({ mouth: 'smile' })}</g>`;
  const L = (x1, y1, x2, y2, t, side, n) => `
    <circle cx="${x1}" cy="${y1}" r="5" fill="${C.blue}" stroke="#fff" stroke-width="2"/>
    <path d="M${x1},${y1} L${x2},${y2} H${side === 'l' ? x2 - 26 : x2 + 26}" stroke="${C.blue}" stroke-width="1.8" fill="none"/>
    <circle cx="${side === 'l' ? x2 - 40 : x2 + 40}" cy="${y2}" r="12" fill="${C.blue}"/>
    ${T(side === 'l' ? x2 - 40 : x2 + 40, y2 + 5, n, { anchor: 'middle', size: 13, w: 800, fill: '#fff' })}
    ${T(side === 'l' ? x2 - 58 : x2 + 58, y2 + 5, t, { anchor: side === 'l' ? 'end' : 'start', size: 15, w: 700 })}`;
  const P = (x, y) => [cx + x * s, cy + y * s];
  const pts = {
    hair: P(-60, -130), brow: P(-42, -46), sclera: P(-56, -8), iris: P(42, -8), skin: P(60, 40),
    lip: P(20, 84), teeth: P(-6, 88), body: P(30, 150), cloth: P(-170, 260),
  };
  return `<svg viewBox="-110 0 920 600" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fmc"><rect x="150" y="10" width="400" height="580" rx="16"/></clipPath></defs>
  <rect x="150" y="10" width="400" height="580" rx="16" fill="${C.tint}"/>
  <g clip-path="url(#fmc)">${svg}</g>
  ${L(...pts.hair, 120, 70, '머리카락', 'l', '1')}
  ${L(...pts.brow, 120, 168, '눈썹', 'l', '2')}
  ${L(...pts.sclera, 120, 246, '공막(흰자위)', 'l', '3')}
  ${L(...pts.teeth, 120, 360, '치아', 'l', '4')}
  ${L(...pts.cloth, 120, 520, '의상', 'l', '5')}
  ${L(...pts.iris, 580, 200, '홍채 및 동공', 'r', '6')}
  ${L(...pts.skin, 580, 290, '얼굴 피부', 'r', '7')}
  ${L(...pts.lip, 580, 380, '입술', 'r', '8')}
  ${L(...pts.body, 580, 470, '신체 피부', 'r', '9')}
</svg>`;
}

// 포토샵 레이어 구조
export function layerStack() {
  const layers = [
    ['생성형 레이어', '옷깃·어깨선을 AI가 새로 그린 부분 (프롬프트 기록이 남음)', C.amber, '#FFF7E6'],
    ['인물 레이어 + 레이어 마스크', '“배경 제거”가 만든 마스크. 흰색=보임, 검정=숨김', C.blue, '#EAF0FD'],
    ['단색 칠 레이어 (새 배경)', '연회색·연하늘·흰색 중 선택. 더블클릭으로 색 변경', C.green, '#E6F5EC'],
    ['원본 배경 (눈 아이콘 끔)', '항상 남겨 두기. 잘못되면 여기서 다시 시작', '#8C96A8', '#F1F3F7'],
  ];
  let out = '';
  layers.forEach(([t, d, st, f], i) => {
    const y = 20 + i * 78, x = 40 + i * 0;
    out += `<g>
      <path d="M${x + 30},${y} L${x + 300},${y} L${x + 270},${y + 56} L${x},${y + 56} Z" fill="${f}" stroke="${st}" stroke-width="2.2"/>
      ${T(x + 150, y + 34, `${4 - i}`, { anchor: 'middle', size: 20, w: 800, fill: st })}
      ${T(x + 330, y + 24, t, { size: 15, w: 800 })}
      ${T(x + 330, y + 44, d, { size: 12, w: 500, fill: C.sub })}
    </g>`;
  });
  return `<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg">${out}
    ${T(40, 334, '레이어 패널에서는 위에 있는 레이어가 앞에 보입니다.', { size: 12, w: 600, fill: C.sub })}</svg>`;
}

// 생성형 확장 전후
export function expandBeforeAfter() {
  const before = photo({ W: 300, H: 300, s: 1.05, cy: 150, bg: '#E9ECF1', person: { collarMessy: false } }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const after = photo({ W: 300, H: 400, s: 0.74, cy: 160, bg: '#E9ECF1' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<svg viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="ea" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.blue}"/></marker></defs>
    <g transform="translate(20,60)">${before}</g>
    ${T(170, 40, '어깨가 잘린 원본', { anchor: 'middle', size: 24, w: 800 })}
    <path d="M338,210 L392,210" stroke="${C.blue}" stroke-width="3" marker-end="url(#ea)"/>
    ${T(372, 190, '생성형', { anchor: 'middle', size: 18, w: 800, fill: C.blue })}${T(372, 244, '확장', { anchor: 'middle', size: 18, w: 800, fill: C.blue })}
    <g transform="translate(410,20)">${after}
      <rect x="2" y="2" width="296" height="396" fill="none" stroke="${C.amber}" stroke-width="3" stroke-dasharray="9 7"/>
      <rect x="45" y="25" width="210" height="210" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="5 5"/>
    </g>
    ${T(560, 448, '점선 바깥 = AI가 채운 영역', { anchor: 'middle', size: 22, w: 800, fill: C.amber })}
  </svg>`;
}

// 규격 크롭 가이드 비교
export function cropGuides() {
  const pass = photo({ W: 350, H: 450 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const resume = photo({ W: 300, H: 400, s: 0.72, cy: 30 + 140 * 0.72 + 14, bg: '#E7ECF2' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const g = (W, H, lines) => lines.map(([y, t, col]) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${col}" stroke-width="2.2" stroke-dasharray="7 5"/>${T(W + 10, y + 5, t, { size: 13, w: 700, fill: col })}`).join('');
  const crownR = 30 + 14, chinR = crownR + 280 * 0.72;
  return `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10,40)">${pass}${g(350, 450, [[40, '정수리', C.red], [380, '턱', C.red]])}</g>
    ${T(185, 26, '여권·신분증 3.5×4.5cm', { anchor: 'middle', size: 15.5, w: 800 })}
    ${T(185, 514, '머리가 사진 세로의 약 75%', { anchor: 'middle', size: 13, w: 600, fill: C.sub })}
    <g transform="translate(450,65)">${resume}${g(300, 400, [[crownR, '정수리 위 여백 약 10%', C.blue], [chinR, '턱', C.blue]])}
      <line x1="150" y1="0" x2="150" y2="400" stroke="${C.blue}" stroke-width="1.4" stroke-dasharray="4 6" opacity="0.7"/></g>
    ${T(600, 50, '이력서(반명함) 3×4cm', { anchor: 'middle', size: 15.5, w: 800 })}
    ${T(600, 494, '머리는 세로의 50~60%, 어깨선까지 포함', { anchor: 'middle', size: 13, w: 600, fill: C.sub })}
  </svg>`;
}

// 얼굴 동일성 체크
export function identityCheck() {
  const s = 1.05, cx = 200, cy = 220;
  const P = (x, y) => [cx + x * s, cy + y * s];
  const pts = [[P(0, -118), '헤어라인'], [P(-42, 20), '눈 모양·쌍꺼풀'], [P(30, 34), '코 모양·크기'], [P(48, 90), '입·입꼬리'], [P(86, 86), '얼굴형·턱선'], [P(-62, 62), '점·흉터 등 고유 특징']];
  let marks = '';
  pts.forEach(([[x, y], t], i) => {
    marks += `<circle cx="${x}" cy="${y}" r="12" fill="${C.amber}" stroke="#fff" stroke-width="2.5"/>${T(x, y + 4.5, i + 1, { anchor: 'middle', size: 13, w: 800, fill: '#fff' })}`;
  });
  const list = pts.map(([, t], i) => `${T(440, 90 + i * 52, `${i + 1}`, { size: 17, w: 800, fill: C.amber })}${T(466, 90 + i * 52, t, { size: 16, w: 700 })}`).join('');
  return `<svg viewBox="0 0 760 430" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="icc"><rect x="20" y="10" width="360" height="410" rx="16"/></clipPath></defs>
    <rect x="20" y="10" width="360" height="410" rx="16" fill="${C.tint}"/>
    <g clip-path="url(#icc)"><g transform="translate(${cx},${cy}) scale(${s})">${person()}</g></g>
    <circle cx="${P(-56, 40)[0]}" cy="${P(-56, 40)[1]}" r="3.4" fill="#6B4A3A"/>
    ${marks}${list}
    ${T(440, 412, '원본과 나란히 놓고 하나라도 달라졌으면 그 결과는 버립니다.', { size: 12.5, w: 700, fill: C.red })}
  </svg>`;
}

// 인화판 레이아웃 (4×6인치 = 152×102mm)
export function printSheet() {
  const sheet = (ox, cols, rows, w, h, label) => {
    const W = 1520, H = 1016; // 0.1mm
    const gx = (W - cols * w) / (cols + 1), gy = (H - rows * h) / (rows + 1);
    let cells = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = gx + c * (w + gx), y = gy + r * (h + gy);
      const ps = w === 350 ? 1.214 : 0.72;
      const cyv = w === 350 ? 40 + 140 * 1.214 : 44 + 140 * 0.72;
      const inner = photo({ W: w, H: h, s: ps, cy: cyv, bg: w === 350 ? '#fff' : '#E7ECF2' }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      cells += `<g transform="translate(${x},${y})">${inner}</g>`;
    }
    return `<g transform="translate(${ox},40) scale(0.21)">
      <rect width="${W}" height="${H}" fill="#fff" stroke="#8C96A8" stroke-width="6"/>${cells}</g>
      ${T(ox + W * 0.21 / 2, 28, label, { anchor: 'middle', size: 14.5, w: 800 })}`;
  };
  return `<svg viewBox="0 0 700 290" xmlns="http://www.w3.org/2000/svg">
    ${sheet(10, 4, 2, 350, 450, '여권·신분증용 8장 (3.5×4.5cm)')}
    ${sheet(370, 5, 2, 300, 400, '이력서용 10장 (3×4cm)')}
    ${T(350, 282, '4×6인치(약 10.2×15.2cm) 인화지 1장 기준 · 300ppi 문서로 만든 뒤 사진관·온라인 인화 서비스에 맡깁니다', { anchor: 'middle', size: 12, w: 600, fill: C.sub })}
  </svg>`;
}

// 용도 결정 흐름도
export function decisionFlow() {
  const node = (x, y, w, h, t, d, fill, st) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${st}" stroke-width="2.2"/>
    ${T(x + w / 2, y + 30, t, { anchor: 'middle', size: 16, w: 800 })}
    ${d.map((l, i) => T(x + w / 2, y + 54 + i * 19, l, { anchor: 'middle', size: 12.5, w: 500, fill: C.sub })).join('')}`;
  return `<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="da" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8C96A8"/></marker></defs>
    <rect x="220" y="6" width="280" height="56" rx="28" fill="${C.ink}"/>
    ${T(360, 41, '이 사진, 어디에 쓰나요?', { anchor: 'middle', size: 17, w: 800, fill: '#fff' })}
    <g stroke="#8C96A8" stroke-width="2.4" fill="none" marker-end="url(#da)">
      <path d="M300,62 Q120,80 120,128"/><path d="M360,62 V128"/><path d="M420,62 Q600,80 600,128"/>
    </g>
    ${node(10, 132, 220, 150, '여권·신분증', ['AI·필터 보정 불가', '배경 합성 불가', '자르기·크기 조정만', '→ 촬영으로 해결'], C.redTint, '#E3A39D')}
    ${node(250, 132, 220, 150, '이력서·지원서', ['밝기·색·잡티: 가능', '배경 교체·옷 정리: 가능', '얼굴형·눈 크기 변형: 불가', '→ “실물 범위” 원칙'], C.amberTint, '#E5C27A')}
    ${node(490, 132, 220, 150, 'SNS·메신저 프로필', ['자유롭게 표현 가능', '다른 사람 얼굴 합성 X', '공식 서류로 재사용 X', '→ AI 사용 사실 밝히기'], C.greenTint, '#8FCBAE')}
  </svg>`;
}

// 강의 타임라인 (강사용)
export function timeline(blocks, title) {
  // blocks: [{t:'19:00', m:5, label:'', color}]
  const total = blocks.reduce((a, b) => a + b.m, 0);
  const W = 700, x0 = 0;
  let x = x0, out = '';
  blocks.forEach((b, i) => {
    const w = (b.m / total) * W;
    const prevShort = i > 0 && blocks[i - 1].m < 8;
    const lastShort = i === blocks.length - 1 && b.m < 12;
    out += `<rect x="${x}" y="30" width="${w - 2}" height="44" rx="5" fill="${b.color}"/>
      ${w > 36 ? T(x + w / 2, 57, b.short || '', { anchor: 'middle', size: 11.5, w: 800, fill: '#fff' }) : ''}
      ${prevShort || lastShort ? '' : T(x, 92, b.t, { size: 10.5, w: 600, fill: C.sub })}`;
    x += w;
  });
  out += T(W - 2, 92, '21:00', { anchor: 'end', size: 10.5, w: 600, fill: C.sub });
  return `<svg viewBox="0 -4 ${W} 100" xmlns="http://www.w3.org/2000/svg">${T(0, 18, title, { size: 14, w: 800 })}${out}</svg>`;
}
