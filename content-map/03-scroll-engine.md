# 03 · 스크롤 엔진과 연출 레시피

이 페이지의 연출은 전부 한 가지 틀에서 나온다.
아래 코드는 원리를 설명하려고 새로 쓴 것이고, 동작하는 전체 구현은 [starter/index.html](starter/index.html)에 있다.

## 1. 뼈대

```html
<section class="scene" data-scene="ladder" style="height:1120vh">
  <div class="pin"> … 화면에 붙어 있을 내용 … </div>
</section>
```

```css
.scene { position: relative; }
.pin   { position: sticky; top: 0; height: 100svh; overflow: hidden; }
```

바깥 `section`의 높이가 스크롤 길이를 만들고, 안쪽 `.pin`은 그동안 화면에 붙어 있다.
**장면이 얼마나 오래 머무는지는 `height` 숫자 하나로 정해진다.**

## 2. 루프

```js
const scenes = $$('[data-scene]').map(el => ({ el, fn: RENDER[el.dataset.scene], t: 0, c: -1 }));

function measure() {                       // 리사이즈·폰트 로드 때 다시 호출
  scenes.forEach(s => {
    s.top = s.el.getBoundingClientRect().top + scrollY;
    s.len = Math.max(1, s.el.offsetHeight - innerHeight);
  });
}

function tick() {
  const y = scrollY, H = innerHeight;
  scenes.forEach(s => {
    s.t = clamp((y - s.top) / s.len);                     // 목표 진행도 0→1
    const near = y + H > s.top - H * .5 && y < s.top + s.el.offsetHeight + H * .5;
    if (s.c < 0 || !near) s.c = s.t;                      // 멀리 있으면 즉시 맞춤
    else s.c += (s.t - s.c) * .12;                        // 가까우면 12%씩 따라감
    if (Math.abs(s.t - s.c) < .0003) s.c = s.t;
    if (near && s.c !== s.last) { s.last = s.c; s.fn(s.c); }   // 바뀐 것만 그림
  });
  requestAnimationFrame(tick);
}
```

핵심 세 가지.

- **`t`와 `c`를 나눈다.** `t`는 스크롤의 실제 위치, `c`는 화면에 쓰는 값. `c`가 `t`를 매 프레임 12%씩 쫓아가서
  휠을 뚝뚝 굴려도 화면은 미끄러지듯 움직인다. 스크롤 이벤트를 듣지 않고 매 프레임 `scrollY`를 읽는다.
- **근처 장면만 그린다.** 화면에서 반 화면 이상 떨어진 장면은 건너뛴다.
- **값이 같으면 건너뛴다.** 멈춰 있을 때는 아무것도 하지 않는다.

## 3. 도구 다섯 개

```js
const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp  = (a, b, t) => a + (b - a) * t;
const ease  = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;   // 양쪽 완만
const eout  = t => 1 - Math.pow(1 - t, 3);                              // 끝만 완만
const span  = (v, a, b) => clamp((v - a) / (b - a));
```

**`span`이 전부다.** "진행도 `p`가 a에서 b를 지나는 동안 0→1"이라는 뜻이고, 장면의 타이밍표를 이것으로 쓴다.

```js
function renderHero(p) {
  const grow  = ease(span(p, .05, .75));     // 5%~75% 동안 프레임이 커진다
  const title = 1 - span(p, .35, .70);       // 35%~70% 동안 제목이 사라진다
  const after = span(p, .72, .92);           // 72%~92% 동안 다음 문장이 올라온다
  …
}
```

나타났다 사라지는 것은 두 `span`을 곱한다: `span(p, .14, .2) * (1 - span(p, .36, .42))`.
타임라인 도구 없이도 이 표현만으로 겹치는 연출을 다 만든다.

## 4. 연출 레시피

### ① 프레임 확대 (히어로)
작은 세로 영상의 `width/height`를 `lerp(초기, 화면 전체, g)`로 키우고 `border-radius`를 18→0으로.
다 커지면 `filter: brightness(.38) saturate(.5)`로 어둡게 해 배경으로 물러나게 하고 그 위에 문장을 올린다.
제목 두 줄은 반대 방향으로 `translateX(∓30vw)`.

### ② 단어 단위로 진해지기 (서론·분석·결론)
문장을 공백으로 쪼개 `<span>`으로 감싼다. `lit = span(p, a, b) * 단어수`.
단어 `i`의 불투명도 = `.14 + .86 * clamp(lit - i)` — 한 번에 한 단어씩 경계가 지나간다.
분석 장면은 여기에 `blur`와 `translateY`를 더하고, 아직 안 읽은 단어는 완전히 숨긴다.

### ③ 읽는 줄을 따라가는 카메라 (분석)
단어의 `offsetTop`으로 줄을 묶어 둔다. 지금 읽는 줄과 다음 줄 사이를 읽은 비율만큼 보간해 문단 전체를 `translateY`.
줄이 바뀔 때 툭 끊기지 않는다. 끝에서는 `scale`로 물러나 문단 전체를 보여준다.

### ④ 용어가 켜지면 옆 패널이 바뀐다 (분석)
용어는 `<b data-k="hook">`. 마지막으로 켜진 용어의 키로 `AN_SIDE[key]`를 찾아 패널을 교체한다.
패널 내용은 앞 장면의 축소판(미니 곡선, 구간 막대, 구간 반복 영상)이라 **복습 장치**로 작동한다.

### ⑤ 개념 사다리 (트리 + 카메라)
- 노드는 `{id, s(등장 단계), x(%), y(vh)}`. 화면보다 훨씬 큰 캔버스(640vh)에 절대 배치한다.
- 연결선은 SVG `path`에 `pathLength="1"`을 주고 `stroke-dasharray: 1 1; stroke-dashoffset: 1-d`로 그린다.
  경로 길이를 계산할 필요가 없다.
- 선이 먼저 닿고 노드가 나중에 뜬다: 선은 `span(s, 단계-.95, 단계-.3)`, 노드는 `span(s, 단계-.45, 단계+.05)`.
- 카메라는 단계별 초점(vh) 사이를 `ease`로 옮긴다. 마지막 단계는 전체가 들어오도록 `scale`로 물러난다.
- 지나간 노드는 불투명도 0.34로 낮추고, 지금 단계의 노드만 강조색. 전체 보기에서는 다시 전부 선명해진다.
- 모바일: 1000px 폭으로 그린 뒤 통째로 `scale(innerWidth/1000)` — 글자가 꺾이지 않는다.

### ⑥ 가로 트랙
`translateX(-x * 100vw)`. `x = i + ease(span(s - i, .28, .72))` — 각 패널의 앞뒤 28%는 멈춰서 읽는 구간이다.
패널의 큰 제목만 `(k - x) * 7vw`만큼 늦게 따라오게 해서 깊이감을 준다. 아래 진행 막대는 `scaleX`.

### ⑦ 곡선 그리기 + 따라가는 카메라
점 배열에서 3차 베지어 선분을 만든다(제어점은 가로 46% 지점, 세로는 양 끝과 같게 → 봉우리·골이 수평으로 눕는다).
선분마다 `dashoffset`으로 그리고, 선이 점에 닿는 순간 점·라벨이 튀어나온다.
선 끝의 점은 `getPointAtLength()`로 위치를 구한다.
원본은 SVG **자체 크기**를 키워 확대하고(벡터가 다시 그려져 선명), 선 끝을 화면 중앙에 오게 `translate`한다.

### ⑧ 편집 타임라인 + 구간 반복 모니터
- 모든 위치는 `시간 / 전체길이 * 100%`. 눈금·구간 괄호·클립이 같은 식을 쓴다.
- 재생선 시간은 스크롤에 정비례하지 않는다. 0.5초짜리 클립이 몰린 구간이 휙 지나가지 않게
  **클립마다 최소 1.6초어치 스크롤**을 주도록 시간을 다시 배분한다.
- 재생선 아래의 클립이 바뀌면 모니터 영상의 `currentTime`을 그 구간 시작으로 옮기고,
  `timeupdate`에서 구간 끝에 닿으면 되감는다 — 편집 프로그램의 뷰어처럼 보인다.
- 훅 구간(6.2초)은 타임라인 폭 자체를 늘려 화면의 75%를 차지하게 확대했다가 되돌린다.
- 파형은 실제 오디오가 아니라 **시드 고정 난수**로 그린 그림이다.

### ⑨ 층 분해 (3D)
```css
.stack-wrap { perspective: 1300px; }
.stack, .layer { transform-style: preserve-3d; }
```
스택을 `rotateX(54deg) rotateZ(-30…-40deg)`로 눕히고 층마다 `translateZ(i * gap)`.
이름표는 반대 회전을 줘서 보는 사람 쪽으로 다시 세운다. 층 테두리·그림자는 CSS 변수 `--o`(열린 정도)에 묶어 닫히면 사라진다.

### ⑩ 줄 마스크 제목
`<br>`로 줄을 나눠 각 줄을 `overflow: hidden` 상자에 넣고 안쪽을 아래에서 밀어 올린다. 스크롤 장면이 아닌 일반 섹션용.

### ⑪ 닦아내듯 채우기
`clip-path: inset(0 100% 0 0)` → `inset(0)`. 빈칸 위에 정답 띠가 왼쪽에서 오른쪽으로 덮인다.

### ⑫ 끝 장면
아래 42% 높이의 검은 띠를 `height: 42% → 100%`. 다 올라오면 상단 진행선도 숨긴다.

## 5. 안정성 장치

| 상황 | 처리 |
|---|---|
| 폰트가 늦게 로드됨 | `document.fonts.ready` 뒤 레이아웃·측정 다시 |
| 창 크기 변경 | 선 다시 그리기 + `measure()` + 모든 장면 강제 재렌더 |
| 내용 교체가 겹침 | 셀렉터별 타이머를 지우고 새로 건다 |
| 영상 자동재생 거부 | `play().catch(() => {})` |
| 문자 삽입 | 데이터는 `esc()`를 거쳐 `innerHTML`에 넣는다 |

## 6. 새 장면 추가하는 법

1. `<section class="scene" data-scene="이름" style="height:400vh"><div class="pin">…</div></section>`
2. `function render이름(p) { … }` — `span`으로 타이밍표를 쓴다
3. `RENDER`에 등록

장면 길이의 감: 단순 전환 200–250vh, 읽을 것이 있으면 400–500vh, 단계가 여럿이면 **단계당 100–110vh**.
