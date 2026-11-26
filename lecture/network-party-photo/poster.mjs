// 청년 네트워크파티 현장 프로필 촬영 포스터
// 사용법: node poster.mjs  →  dist/포스터_프로필촬영.pdf / .png
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { person, C } from '../ai-id-photo/scripts/common.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');
fs.mkdirSync(dist, { recursive: true });

const Y = '#FFD166';
const NAVY = '#121826';

// 뷰파인더 속 인물
function viewfinder() {
  const W = 600, H = 700;
  const s = 1.02, cx = 300, cy = 300;
  const corner = (x, y, dx, dy) => `<path d="M${x},${y + dy * 46} V${y} H${x + dx * 46}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgL" cx="0.5" cy="0.38" r="0.75">
      <stop offset="0" stop-color="#3B4A68"/><stop offset="1" stop-color="#1A2233"/>
    </radialGradient>
    <clipPath id="vf"><rect x="0" y="0" width="${W}" height="${H}" rx="34"/></clipPath>
  </defs>
  <g clip-path="url(#vf)">
    <rect width="${W}" height="${H}" fill="url(#bgL)"/>
    <ellipse cx="300" cy="250" rx="250" ry="230" fill="#fff" opacity="0.07"/>
    <g transform="translate(${cx},${cy}) scale(${s})">${person({ mouth: 'smile' })}</g>
  </g>
  ${corner(34, 34, 1, 1)}${corner(W - 34, 34, -1, 1)}${corner(34, H - 34, 1, -1)}${corner(W - 34, H - 34, -1, -1)}
  <rect x="${cx - 92}" y="${cy - 120}" width="184" height="190" fill="none" stroke="${Y}" stroke-width="5" rx="6"/>
  <g style="font-family:Pretendard,sans-serif;font-weight:700" fill="#fff" font-size="22">
    <circle cx="70" cy="80" r="9" fill="#FF5A5F"/><text x="88" y="88">REC</text>
    <text x="${W - 70}" y="88" text-anchor="end">PORTRAIT</text>
    <text x="70" y="${H - 66}">f/2.8</text><text x="190" y="${H - 66}">1/125</text><text x="310" y="${H - 66}">ISO 200</text>
  </g>
  <g transform="translate(${W - 110},${H - 92})">
    <rect width="54" height="30" rx="5" fill="none" stroke="#fff" stroke-width="3.5"/><rect x="54" y="9" width="6" height="12" rx="2" fill="#fff"/>
    <rect x="5" y="5" width="36" height="20" rx="2" fill="${Y}"/>
  </g>
</svg>`;
}

// 조명 스탠드 장식
const lamp = (flip = false) => `<svg viewBox="0 0 200 520" xmlns="http://www.w3.org/2000/svg" style="transform:scaleX(${flip ? -1 : 1})">
  <defs><linearGradient id="beam${flip ? 'r' : 'l'}" x1="0" y1="0" x2="1" y2="0.4">
    <stop offset="0" stop-color="${Y}" stop-opacity="0.55"/><stop offset="1" stop-color="${Y}" stop-opacity="0"/></linearGradient></defs>
  <path d="M120,70 L200,10 L200,260 Z" fill="url(#beam${flip ? 'r' : 'l'})"/>
  <rect x="62" y="40" width="70" height="82" rx="10" fill="#2A3550" stroke="#4A5878" stroke-width="3" transform="rotate(-18 97 81)"/>
  <rect x="112" y="48" width="14" height="64" rx="4" fill="${Y}" transform="rotate(-18 97 81)"/>
  <path d="M92,124 L92,470 M92,470 L30,515 M92,470 L154,515 M92,470 L92,515" stroke="#4A5878" stroke-width="7" stroke-linecap="round"/>
</svg>`;

const steps = [
  ['접수', '미디어실 앞에서<br>순서대로'],
  ['코칭·촬영', '표정·포즈 1:1 코칭<br>3~5컷 촬영'],
  ['AI 보정', '베스트 컷을 고르고<br>라이트룸 AI로 보정'],
  ['사진 받기', '당일 내 휴대폰으로<br>바로 전송'],
];

const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>청년 네트워크파티 프로필 촬영 포스터</title>
<style>
@font-face{font-family:'Pretendard';font-weight:400;src:url('../ai-id-photo/fonts/Pretendard-Regular.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:500;src:url('../ai-id-photo/fonts/Pretendard-Medium.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:600;src:url('../ai-id-photo/fonts/Pretendard-SemiBold.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:700;src:url('../ai-id-photo/fonts/Pretendard-Bold.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:800;src:url('../ai-id-photo/fonts/Pretendard-ExtraBold.woff2') format('woff2');}
@page{size:A4;margin:0;}
*{box-sizing:border-box;margin:0;padding:0;}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
body{font-family:Pretendard,sans-serif;word-break:keep-all;background:${NAVY};}
.poster{width:210mm;height:297mm;position:relative;overflow:hidden;color:#fff;
  background:radial-gradient(120mm 120mm at 50% 52%, #26324B 0%, ${NAVY} 70%);padding:14mm 15mm 11mm;display:flex;flex-direction:column;}
.top{display:flex;justify-content:space-between;align-items:center;font-size:8.6pt;font-weight:600;color:#A9B6CF;letter-spacing:0.04em;}
.top .tag{background:${Y};color:${NAVY};font-weight:800;border-radius:10mm;padding:1.2mm 3.6mm;letter-spacing:0;}
h1{margin-top:7mm;font-size:36pt;line-height:1.16;font-weight:800;letter-spacing:-0.03em;}
h1 em{font-style:normal;color:${Y};}
.sub{margin-top:4mm;font-size:12pt;line-height:1.6;color:#D3DBEA;}
.hero{position:relative;height:90mm;margin-top:5mm;display:flex;justify-content:center;}
.hero .vf{width:77mm;filter:drop-shadow(0 6mm 10mm rgba(0,0,0,0.45));}
.hero .lamp{position:absolute;top:6mm;width:32mm;}
.hero .lamp.l{left:2mm;} .hero .lamp.r{right:2mm;}
.chips{display:flex;justify-content:center;gap:3mm;margin-top:4mm;}
.chip{border:0.9pt solid #4A5878;border-radius:10mm;padding:1.8mm 4.2mm;font-size:10pt;font-weight:700;background:rgba(255,255,255,0.04);}
.chip b{color:${Y};margin-right:1.4mm;}
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:2.5mm;margin-top:5mm;}
.st{background:#1E2840;border-radius:3mm;padding:3.2mm 3mm;text-align:center;position:relative;}
.st .n{display:inline-block;width:6.5mm;height:6.5mm;line-height:6.5mm;border-radius:50%;background:${Y};color:${NAVY};font-weight:800;font-size:9pt;}
.st h3{font-size:11pt;margin-top:1.6mm;font-weight:800;}
.st p{font-size:8pt;color:#AEB9CE;line-height:1.45;margin-top:1mm;}
.info{margin-top:5mm;background:#fff;color:${NAVY};border-radius:4mm;padding:4.5mm 6mm;display:grid;grid-template-columns:17mm 1fr;row-gap:2.2mm;column-gap:3mm;font-size:10.5pt;line-height:1.45;}
.info dt{font-weight:800;color:#2F62D8;}
.info dd{font-weight:600;}
.info dd small{font-weight:500;color:#5B6577;font-size:8.8pt;}
.tip{margin-top:3.5mm;font-size:9pt;color:#D3DBEA;text-align:center;}
.tip b{color:${Y};}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end;border-top:0.8pt solid #34405A;padding-top:3.5mm;font-size:8pt;color:#8E9BB5;}
.foot .org{font-size:10pt;font-weight:800;color:#fff;}
</style></head><body>
<div class="poster">
  <div class="top"><span>광주시 청년지원센터 · 청년 네트워크파티 특별 프로그램</span><span class="tag">12.16 WED</span></div>
  <h1>오늘, 나를 소개할<br><em>프로필 사진</em> 한 장</h1>
  <p class="sub">네트워크파티 현장에서 전문 조명으로 찍고, 1:1 코칭과 AI 보정까지.<br>완성한 사진은 그날 바로 받아 가세요.</p>
  <div class="hero">
    <div class="lamp l">${lamp(false)}</div>
    <div class="vf">${viewfinder()}</div>
    <div class="lamp r">${lamp(true)}</div>
  </div>
  <div class="chips">
    <span class="chip"><b>01</b>1:1 표정·포즈 코칭</span>
    <span class="chip"><b>02</b>전문 조명 촬영</span>
    <span class="chip"><b>03</b>AI 보정 · 당일 전달</span>
  </div>
  <div class="flow">
    ${steps.map(([t, d], i) => `<div class="st"><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  <dl class="info">
    <dt>일시</dt><dd>2026. 12. 16(수) 18:00 – 21:00</dd>
    <dt>장소</dt><dd>광주시 청년지원센터 5층 미디어실 <small>(경기도 광주시 중앙로 199)</small></dd>
    <dt>대상</dt><dd>청년 네트워크파티 참여 청년</dd>
    <dt>참여</dt><dd>현장 접수, 도착 순서대로 <small>· 1인 약 5분</small></dd>
    <dt>진행</dt><dd>유지환 <small>· 라이트룸·포토샵 사진 보정 강사</small></dd>
  </dl>
  <p class="tip"><b>TIP</b> &nbsp;면접·비즈니스 프로필이 필요하다면 단색 셔츠나 재킷을 입고 오세요.</p>
  <div class="foot">
    <div><span class="org">광주시 청년지원센터</span></div>
    <div>촬영한 사진은 본인에게만 개별 전송합니다.</div>
  </div>
</div>
</body></html>`;

const htmlPath = path.join(dist, '포스터_프로필촬영.html');
fs.writeFileSync(htmlPath, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3 });
await page.goto('file://' + htmlPath, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
await page.pdf({ path: path.join(dist, '포스터_프로필촬영.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await page.locator('.poster').screenshot({ path: path.join(dist, '포스터_프로필촬영.png') });
await browser.close();
console.log('done');
