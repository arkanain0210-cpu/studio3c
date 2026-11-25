// 사용법: node scripts/build.mjs [workbook|instructor|all]
// HTML을 dist/에 쓰고, Chromium(Playwright)으로 A4 PDF를 만듭니다.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import * as F from './common.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

const targets = {
  workbook: { mod: './workbook.mjs', out: '수강생_워크북', accent: F.C.blue },
  instructor: { mod: './instructor.mjs', out: '강사용_강의안', accent: '#1E8E5A' },
};

const which = process.argv[2] || 'all';
const list = which === 'all' ? Object.keys(targets) : [which];

const browser = await chromium.launch();
for (const key of list) {
  const t = targets[key];
  const m = await import(t.mod + `?v=${Date.now()}`);
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<title>${m.title}</title><style>${F.css(t.accent, m.footer)}${m.extraCss || ''}</style></head>
<body>${m.body()}</body></html>`;
  const htmlPath = path.join(dist, `${t.out}.html`);
  fs.writeFileSync(htmlPath, html);
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const pdfPath = path.join(dist, `${t.out}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
  await page.close();
  console.log('built', pdfPath);
}
await browser.close();
