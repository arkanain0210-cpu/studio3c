# 05 · 데이터 구조

페이지에는 배열 두 개가 통째로 들어 있다. 화면의 라이브러리·팝업·타임라인·대본 목록은 전부 이 둘에서 그려진다.

| 배열 | 건수 | 크기 | 쓰이는 곳 |
|---|---|---|---|
| `videos` | 26 | 754KB (그중 base64 썸네일 482KB) | 라이브러리, 팝업, 타임라인, 참조 버튼 |
| `S100` | 100 | 316KB | 대본 100 목록 |

빈 틀: [data/video.example.json](data/video.example.json), [data/script.example.json](data/script.example.json)

## 1. `videos[]` — 레퍼런스 한 편

| 필드 | 형 | 설명 |
|---|---|---|
| `n` | number | 화면에 쓰는 번호(1–26). 본문 버튼의 `data-video` 값 |
| `id` | string | 인스타그램 릴스 ID. 원본 영상 주소의 키 |
| `title` | string | 붙인 제목 |
| `tags` | string[] | 포맷 분류. 필터에 쓴다 |
| `summary` | string | 이 영상이 던지는 질문 한 줄 |
| `pattern` | string | 전개를 `A → B → C`로 요약한 한 줄 |
| `stats` | object | `likes`, `views`(없으면 `null`), `collected`(수집 시각), `source`(메타데이터 파일 경로) |
| `original` | string | 원본 URL |
| `src` | string | 재생할 영상 주소 |
| `poster` | string | 썸네일(data URI) |
| `duration` | number | 초 |
| `probe` | object | 영상 분석 결과(코덱, 해상도 1080×1920 등) |
| `cues` | `{t, end, text, ko}[]` | 자막용 축약본 |
| `speech` | object[] | 음성 전사. 아래 표 |
| `screenText` | object[] | 화면에 나온 글자의 전사. 음성과 별도 |
| `chapters` | `{t, label}[]` | 전개 시점(아래 `context.beats`의 축약) |
| `context` | object | `expectation`(기대 질문), `reuse`(가져올 것), `beats: {t, label, detail}[]` |
| `classificationNote` | string | A롤·B롤 분류 메모 |
| `rollSegments` | object[] | 구간별 A롤·B롤 분류: `start`, `end`, `label`, `reason` — 26편 중 1편만 채워져 있다 |
| `review` | object | 검수 기록. 아래 표 |

### 전사 한 줄 (`speech[]`, `screenText[]`)

| 필드 | 설명 |
|---|---|
| `start`, `end` | 초 |
| `text` | 원문 |
| `ko` | 한국어 번역 |
| `segment_id` | `{번호}_{릴스ID}_speech_001` 형식 |
| `source_type` | `audio_asr_candidate`(음성 인식 후보) 또는 `screen_text` |
| `listening_verified` | 사람이 들어 확인했는가. 전부 `false` |
| `uncertainty` | 불확실한 부분 메모 |
| `time_accuracy` | (화면 문구) 시각이 대략값이라는 표시 |

### 검수 기록 (`review`)

`listeningVerified`, `fullAudioVerified`, `issues[]`, `changes[]`, `untranscribed[]`(전사가 비어 있는 구간과 "무음으로 확정한 것은 아님" 표시), `sourceDuration`, `renderDuration`.

**배울 점**: 자동 처리 결과의 신뢰도를 데이터에 같이 싣고 화면에도 내보낸다.
"발화 미검출은 무음을 확정하지 않습니다" 같은 문구가 그 결과다. 분석 자료를 남에게 보여줄 때 이 필드들이 신뢰를 만든다.

## 2. `S100[]` — 대본 한 편

| 필드 | 형 | 설명 |
|---|---|---|
| `id` | string | 수집 번호(`H0572` 등). 번호 범위로 보아 전체 수집분은 수백 편이고 그중 좋아요 상위 100편을 골랐다 |
| `st` | string | `reviewed`(문맥 분석 73) · `limited`(부분 분석 22) · `hold`(판단 보류 5, 화면에서 제외) |
| `sum` | string | 한 줄 요약 |
| `notes` | string[] | 분석 메모 |
| `h` | string | 계정 |
| `likes` | number | 좋아요 |
| `url` | string | 원본 URL |
| `dur` | number | 초 |
| `cat` | string | 분류 — 전부 "분류 대기"(미완) |
| `th` | string | 썸네일 경로 |
| `beats` | 배열의 배열 | `[종류, 표시이름, 시작초, 끝초, 해당 원문, 판단 이유]` |
| `tx` | string | 전체 전사 |

`beats`의 종류: `hook` · `build` · `twist` · `payoff` · `cta` · `outro` · `unresolved`.
한 영상 안에 같은 종류가 여러 번 나올 수 있다(빌드 → 보상 → 빌드 → 보상).

화면의 구간 막대는 이 배열만으로 그린다: `left = 시작/길이`, `width = (끝-시작)/길이`.

## 3. 추정 제작 과정

데이터에 남은 흔적으로 거꾸로 짚은 것이다. 확인된 사실이 아니라 추정이다.

| 단계 | 근거 | 추정 |
|---|---|---|
| ① 수집 | `stats.source: references/{id}/{id}_source.info.json`, `collected` 시각 | 릴스 영상과 메타데이터(좋아요 등)를 내려받아 ID별 폴더에 저장 |
| ② 분석 | `probe.streams[].codec_name` | 영상 정보 추출(길이·해상도) |
| ③ 전사 | `source_type: audio_asr_candidate`, `review.changes`의 "medium re-ASR" | 음성 인식 모델로 전사. 결과가 이상하면 다른 설정으로 재전사 |
| ④ 번역 | `ko` | 문장 단위 한국어 번역 |
| ⑤ 화면 문구 | `screenText`, `time_accuracy: approximate sample span` | 일정 간격으로 프레임을 뽑아 화면 글자를 읽음 |
| ⑥ 전개 분석 | `context`, `pattern`, `beats[…, 판단 이유]` | 전사를 읽고 구간과 이유를 작성(언어 모델 보조로 보임) |
| ⑦ A롤·B롤 분류 | 주석 "다빈치에서 직접 분류한 rollSegments" | 편집 프로그램에서 사람이 직접 컷을 나눔 — 1편만 |
| ⑧ 렌더 | `src: library-NN`, 주석 "분류 라벨이 박힌" | 분류 라벨을 화면에 입힌 분석용 영상을 따로 출력 |
| ⑨ 조립 | 한 줄짜리 JSON이 스크립트에 박혀 있음 | 스크립트가 JSON을 HTML 틀에 끼워 넣어 한 파일로 출력 |

## 4. 내 자료로 채우기

**최소 필드**만으로도 화면은 다 돈다.

- 라이브러리 카드: `n`, `title`, `tags`, `duration`, `poster`
- 팝업: 위 + `summary`, `pattern`, `context.beats`, `src`
- 구간 목록: `sum`, `h`, `dur`, `beats`

**순서 제안**

1. 표 하나(스프레드시트)로 시작한다: 번호, 제목, URL, 태그, 한 줄 질문, 패턴 한 줄.
2. 편당 전개 시점 3–5개(`t`, `label`, `detail`)를 직접 쓴다. 여기까지가 가장 값어치 있는 부분이다.
3. 전사·번역은 필요한 편만. 자동 전사를 쓰면 `listening_verified` 같은 표시를 같이 남긴다.
4. A롤·B롤 구간 분류는 **끝까지 끌고 갈 대표 1편**만 한다.

**영상 파일**: 남의 영상을 내려받아 자기 서버에서 다시 내보내는 방식은 권리 문제가 생긴다.
자기 영상이 아니면 원본 링크나 플랫폼의 공식 임베드를 쓰고, 썸네일도 직접 캡처해 넣기보다 링크 카드로 처리하는 편이 안전하다.
스타터의 팝업은 `src`가 비어 있으면 영상 없이 분석만 보여준다.

**저장 위치**: 이 저장소에는 이미 Supabase가 붙어 있으므로 표 두 개(`references`, `scripts`)로 옮기는 것도 방법이다.
다만 26–100건 규모면 JSON 파일로 충분하고, 페이지 로딩 뒤 `fetch`로 불러오면 원본처럼 HTML이 1MB를 넘는 문제도 없다.
