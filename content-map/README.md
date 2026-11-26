# content-map — 「콘텐츠의 설계도」 분해·분석

대상: `https://answer-kr-production.up.railway.app/content-map`
(제목 "콘텐츠의 설계도 — 큰 개념에서 한 장면까지", 2026-11-11 수집)

숏폼 콘텐츠를 **개념 → 포맷 → 구조 → 표현 → 사례** 순서로 설명하는 한 장짜리 스크롤 문서다.
프레임워크·라이브러리 없이 HTML 한 파일 안에 스타일·스크립트·데이터를 모두 넣어 만들었다.

## 한눈에

| 항목 | 내용 |
|---|---|
| 형태 | 단일 페이지, 의존성 0 (바닐라 JS + CSS + 인라인 SVG) |
| 크기 | 렌더된 문서 약 1.9MB — 그중 데이터가 1.07MB, 로직은 80KB(748줄), CSS 78KB |
| 구성 | 스크롤 고정 장면 9개(합계 5,910vh) + 일반 섹션 8개 + 영상 팝업 1개 |
| 핵심 기법 | `position: sticky` 장면 + rAF 루프 + 진행도 보간 하나로 모든 연출을 만든다 |
| 데이터 | 레퍼런스 릴스 26편(전사·번역·전개 분석), 대본 100편(문장별 구간 분류) |
| 디자인 | 색 9개, 서체 1종(Pretendard), 강조색 1개(주황), 둥근 모서리 거의 없음 |

## 폴더 안내

| 파일 | 내용 |
|---|---|
| [01-teardown.md](01-teardown.md) | 사이트 구조 지도 — 섹션 17개, 자산·엔드포인트, 인터랙션 목록, 강점·약점 |
| [02-design-system.md](02-design-system.md) | 색·타이포·레이아웃·컴포넌트·모션 규칙 |
| [03-scroll-engine.md](03-scroll-engine.md) | 스크롤 장면 엔진과 장면별 연출 레시피 12가지 |
| [04-content-framework.md](04-content-framework.md) | 페이지가 가르치는 개념 체계, 서사 설계, 대본 100편 통계 |
| [05-data-schema.md](05-data-schema.md) | 데이터 구조 2종과 추정 제작 파이프라인 |
| [06-make-it-yours.md](06-make-it-yours.md) | 내 것으로 만드는 순서 — 그대로 써도 되는 것 / 바꿔야 하는 것 |
| [starter/index.html](starter/index.html) | **바로 쓸 수 있는 스타터.** 같은 기법을 새로 구현한 단일 파일(자리표시자 내용) |
| [data/references-26.csv](data/references-26.csv) | 레퍼런스 26편 색인 (원본 URL · 분류 · 좋아요 · 길이) |
| [data/scripts-100.csv](data/scripts-100.csv) | 대본 100편 색인 (계정 · 좋아요 · 길이 · 구간 순서와 시간) |
| [data/video.example.json](data/video.example.json) · [data/script.example.json](data/script.example.json) | 내 데이터를 채울 빈 틀 |

## 원본 페이지 (사이트에서 열기)

팀 내부 교육자료라 원본을 그대로 이 사이트에 올렸다.

- 주소: `/content-map` (파일은 `public/content-map/index.html`, 연결은 `next.config.ts`의 rewrite)
- 문서·데이터(레퍼런스 26편, 대본 100편 전사·분석)는 그 HTML 한 파일 안에 들어 있다
- 폰트(Pretendard, SIL OFL)는 `public/content-map/fonts/`에 직접 둔다
- **영상·구간 카드 이미지·대본 썸네일은 아직 원래 Railway 서버에서 불러온다.** 그 서버가 내려가면 이 부분만 빈칸이 된다
- `noindex`라 검색에는 안 나오지만, 주소를 아는 사람은 로그인 없이 볼 수 있다

원본 HTML은 받아 온 시점의 화면 상태(스크립트 실행 뒤)라서, 다시 실행돼도 겹치지 않게
스크립트가 한 번 만든 흔적(제목 줄 마스크, 층 기둥, 상태 클래스)을 걷어내고 링크·폰트 경로만 바꿨다. 내용은 고치지 않았다.

## 수집 방법과 한계

- 컨테이너에서 해당 호스트로 직접 접속이 막혀 있어 페이지는 스크래핑 서비스로 1회 받아왔다.
  받은 것은 **스크립트 실행 뒤의 DOM**이라, 원본의 `<link>`/`<style>` 구분 같은 파일 단위 구성은 확인하지 못했다.
- 영상(`/api/content-media/*`), 썸네일, 폰트 파일은 내려받지 않았고 응답 여부도 확인하지 않았다.
- 모바일 레이아웃은 CSS와 코드로만 확인했다(원본을 실제 기기 폭으로 띄워 보지는 않았다).
