// 비포/애프터 레퍼런스 보드
// 사용법: node board.mjs  →  reference/보드_남성.png, reference/보드_여성.png
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const ref = path.join(here, 'reference');

const boards = [
  { key: 'm', out: '보드_남성', before: '거리에서 친구가 찍어 준 사진', after: [
    ['A', '클래식 네이비 수트'], ['B', '그레이 수트 · 노타이'], ['C', '화이트 셔츠'], ['D', '오피스 창가'] ] },
  { key: 'f', out: '보드_여성', before: '카페에서 찍은 일상 사진', after: [
    ['A', '블랙 블레이저'], ['B', '스카이블루 재킷'], ['C', '보우 블라우스'], ['D', '오피스 서재'] ] },
];

const html = (b) => `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<style>
@font-face{font-family:'Pretendard';font-weight:500;src:url('../ai-id-photo/fonts/Pretendard-Medium.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:700;src:url('../ai-id-photo/fonts/Pretendard-Bold.woff2') format('woff2');}
@font-face{font-family:'Pretendard';font-weight:800;src:url('../ai-id-photo/fonts/Pretendard-ExtraBold.woff2') format('woff2');}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Pretendard,sans-serif;background:#fff;word-break:keep-all;}
.board{width:1600px;padding:56px 56px 40px;background:#fff;}
.head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;}
.head h1{font-size:50px;font-weight:800;letter-spacing:-0.02em;color:#121826;line-height:1.2;}
.head h1 em{font-style:normal;color:#2F62D8;}
.head .r{text-align:right;font-size:19px;font-weight:700;color:#7B8596;line-height:1.5;}
.head .r b{display:inline-block;background:#121826;color:#FFD166;border-radius:30px;padding:6px 16px;font-size:17px;margin-bottom:8px;}
.main{display:grid;grid-template-columns:600px 92px 1fr;align-items:stretch;}
.before,.cell{position:relative;overflow:hidden;border-radius:14px;background:#eee;}
.before{height:938px;}
.before img,.cell img{width:100%;height:100%;object-fit:cover;object-position:center 22%;display:block;}
.tag{position:absolute;left:16px;top:16px;font-size:20px;font-weight:800;letter-spacing:0.08em;color:#fff;background:rgba(18,24,38,0.78);border-radius:8px;padding:6px 14px;}
.before .cap{position:absolute;left:0;right:0;bottom:0;padding:60px 22px 20px;background:linear-gradient(transparent,rgba(0,0,0,0.65));color:#fff;font-size:22px;font-weight:700;}
.before .cap small{display:block;font-size:16px;font-weight:500;opacity:0.85;margin-top:4px;}
.arrow{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#2F62D8;}
.arrow svg{width:56px;}
.arrow span{font-size:18px;font-weight:800;writing-mode:vertical-rl;letter-spacing:0.15em;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.cell{height:461px;}
.cell .tag{background:#2F62D8;}
.cell .nm{position:absolute;left:0;right:0;bottom:0;padding:44px 18px 14px;background:linear-gradient(transparent,rgba(0,0,0,0.6));color:#fff;font-size:20px;font-weight:700;}
.foot{display:flex;justify-content:space-between;margin-top:26px;font-size:16px;color:#8E97A6;font-weight:500;}
.foot b{color:#121826;font-weight:800;}
</style></head><body>
<div class="board">
  <div class="head">
    <h1>휴대폰 사진 한 장으로<br><em>AI 프로필 4가지</em>, 골라 보세요</h1>
    <div class="r"><b>BEFORE → AFTER</b><br>얼굴은 그대로, 옷·배경·조명만 바꿉니다</div>
  </div>
  <div class="main">
    <div class="before"><img src="src/${b.key}_before.jpg"><span class="tag">BEFORE</span>
      <div class="cap">휴대폰 일상 사진<small>${b.before}</small></div></div>
    <div class="arrow">
      <svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="27" fill="#2F62D8"/><path d="M20,28 H36 M30,21 L37,28 L30,35" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>AI 프로필</span>
    </div>
    <div class="grid">
      ${b.after.map(([k, n], i) => `<div class="cell"><img src="src/${b.key}_${k.toLowerCase()}.jpg"><span class="tag">AFTER ${k}</span><div class="nm">${n}</div></div>`).join('')}
    </div>
  </div>
  <div class="foot"><span>* 이해를 돕기 위해 AI로 생성한 가상 인물 예시 이미지입니다.</span><span><b>광주시 청년지원센터</b> · 청년 네트워크파티 프로필 촬영</span></div>
</div></body></html>`;

const browser = await chromium.launch();
for (const b of boards) {
  const p = path.join(ref, `${b.out}.html`);
  fs.writeFileSync(p, html(b));
  const page = await browser.newPage({ viewport: { width: 1600, height: 1400 }, deviceScaleFactor: 1 });
  await page.goto('file://' + p, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.locator('.board').screenshot({ path: path.join(ref, `${b.out}.png`) });
  await page.close();
  fs.unlinkSync(p);
}
await browser.close();
console.log('done');
