# AI로 완성하는 나의 증명사진 & 이력서 사진

광주시 청년지원센터 강의(2026.12.14–15) 자료.

| 파일 | 용도 |
|---|---|
| `dist/수강생_워크북.pdf` | 수강생 배포용 A4 워크북 (26쪽, 인쇄·전자책 겸용, PDF 목차 포함) |
| `dist/강사용_강의안.pdf` | 강사용 진행안·대본·리허설 체크리스트 (12쪽, 배포 금지) |
| `dist/*.html` | 같은 내용의 HTML (브라우저에서 열람·수정 확인용) |

## 다시 만들기

```bash
node scripts/build.mjs          # 둘 다
node scripts/build.mjs workbook # 워크북만
```

- Playwright(Chromium)가 필요합니다.
- 본문은 `scripts/workbook.mjs`, `scripts/instructor.mjs`에 있습니다.
- 그림(SVG)과 공통 스타일은 `scripts/common.mjs`에 있습니다.
- 글꼴: Pretendard (SIL Open Font License 1.1), `fonts/`.
- 규정·서비스 정보는 2026년 11월 기준입니다. 강의 전에 외교부 여권 사진 규정과 무료 AI 한도를 다시 확인하세요.
