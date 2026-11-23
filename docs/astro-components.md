# Astro 컴포넌트 가이드

> **Claude 작업 지침:** MDX 파일 작성 또는 컴포넌트 신규 제작 전 이 문서를 먼저 확인할 것.
> 기존 컴포넌트로 해결 가능한 경우 신규 제작 금지.

---

## 11ty 사용자를 위한 Astro 컴포넌트 개념

11ty shortcode ↔ Astro 컴포넌트는 거의 동일한 개념입니다.

| 11ty | Astro |
|------|-------|
| `{% youtube "id" %}` | `<YouTubeEmbed id="id" />` |
| `{% alert "info" %}내용{% endalert %}` | `<Alert type="info">내용</Alert>` |
| shortcode 파일 등록 | `.astro` 파일 생성 후 MDX에서 `import` |
| 전역 등록 가능 | MDX 파일 상단에서 개별 import |

**핵심 차이점:**

- Astro는 TypeScript `interface Props`로 타입 안전성 보장
- `<slot />`이 11ty의 `{% block content %}` 역할 (자식 콘텐츠 삽입)
- `.astro` 파일은 서버사이드 렌더링 — 빌드 타임에 정적 HTML로 변환

---

## MDX 파일에서 컴포넌트 사용법

```mdx
---
title: 포스트 제목
# ... frontmatter
---

import Alert from '@/components/Alert.astro';
import YouTubeEmbed from '@/components/YouTubeEmbed.astro';

일반 마크다운 내용...

<YouTubeEmbed id="dQw4w9WgXcQ" title="영상 제목" />

<Alert type="warning" title="주의">
  경고 내용을 여기에 씁니다. **마크다운**도 됩니다.
</Alert>
```

**규칙:**

- import는 frontmatter 바로 아래, 본문 시작 전에 작성
- `@/` 경로는 `src/` 디렉토리의 alias (`tsconfig.json`에 설정됨)
- `.md` 파일에서는 컴포넌트 import 불가 → 컴포넌트가 필요하면 `.mdx`로 변환

---

## 현재 구현된 컴포넌트 목록

> **`Callout.astro`는 폐기 예정입니다.** 새 포스트에서는 `Alert.astro`를 사용하세요.
> 기존 포스트에서 `Callout`을 발견하면 `Alert`로 교체 후 삭제.

### 콘텐츠용 (MDX에서 사용)

#### `Alert.astro`
배경색+테두리가 있는 강조 박스. 11ty의 `{% alert %}` shortcode에 해당.

```mdx
import Alert from '@/components/Alert.astro';

<Alert type="info">기본 안내 메시지</Alert>
<Alert type="warning" title="주의사항">제목이 있는 경고</Alert>
<Alert type="success" title="완료">성공 메시지</Alert>
<Alert type="danger">위험 경고</Alert>
<Alert type="tip">팁이나 힌트</Alert>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'info' \| 'warning' \| 'success' \| 'danger' \| 'tip'` | `'info'` | 색상 테마 |
| `title` | `string` | — | 굵은 제목 (생략 가능) |

---

#### `YouTubeEmbed.astro`
YouTube 영상을 반응형으로 삽입. 11ty의 `{% youtube %}` shortcode에 해당.

```mdx
import YouTubeEmbed from '@/components/YouTubeEmbed.astro';

<YouTubeEmbed id="dQw4w9WgXcQ" />
<YouTubeEmbed id="dQw4w9WgXcQ" title="영상 접근성 제목" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | `string` | — | YouTube 영상 ID (`watch?v=` 뒤의 값) |
| `title` | `string` | `'YouTube video'` | iframe 접근성 title |

> **ID 추출법:** `https://www.youtube.com/watch?v=dQw4w9WgXcQ` → `dQw4w9WgXcQ`
>
> **⚠️ 한국(`KR`) 지역 제한(Geo-block) 및 외부 임베드 허용 검증 필수:**
> HBO·Hulu·Peacock·Paramount+ 등 미국 방송사 본사 채널 영상은 `availableCountries`가 `["US"]`로 제한되어 한국 접속 시 `"The uploader has not made this video available in your country"` 오류가 자주 발생합니다(클라우드 기반 `search_web` 검색에서는 정상 노출되어 오판하기 쉬움).
> 영상을 삽입할 때는 반드시 `https://www.youtube.com/watch?v={id}&gl=KR`의 `ytInitialPlayerResponse`에서 ① `playabilityStatus.status === "OK"`, ② `playabilityStatus.playableInEmbed === true`, ③ `microformat.playerMicroformatRenderer.availableCountries`에 `"KR"` 포함(또는 필드 미지정) 여부를 확인하세요. 지역 제한 시 글로벌 배급사 공식 채널(예: Warner Bros. Entertainment, Sony Pictures, Universal Pictures, Apple TV)이나 국내 OTT 공식 채널 영상으로 교체합니다.

---

#### `AffiliateLink.astro`

제휴 링크 버튼. 카드/버튼 자체에는 면책 문구가 없다 — 공시는 포스트 상단 `AffiliateNotice`(frontmatter `affiliate: true`) 하나로 통일한다. 수익화 링크에 사용.

`provider`는 버튼 라벨(`text` 미지정 시)뿐 아니라 **버튼 배경색과 파비콘 아이콘**도 결정한다 — 한 포스트에 쿠팡·Amazon 링크가 섞여 있을 때 텍스트를 안 읽어도 어느 쇼핑몰로 가는지 한눈에 구분되도록 하기 위함이다. 배경색은 실제 브랜드 컬러(쿠팡 공식 가이드라인 `#E94B22`, 11번가 공식 디자인시스템 `#FF0038`, Amazon 공식 브랜드 컬러 `#FF9900`)를 쓰고, 텍스트는 세 색상 모두 흰 글씨가 WCAG AA(4.5:1) 대비 기준에 못 미쳐 진한 텍스트(`#171717`)로 통일했다. 파비콘은 Google 파비콘 서비스(`https://www.google.com/s2/favicons?domain=...`)에서 각 사이트 아이콘을 그대로 가져와 흰 배경 칩 안에 표시한다 — 실제 로고 이미지를 직접 호스팅하지 않아 상표 이슈를 피한다. `provider="other"`는 브랜드 색상/아이콘 없이 사이트 기본 `bg-primary` 스타일로 폴백.

```mdx
import AffiliateLink from '@/components/AffiliateLink.astro';

<AffiliateLink href="https://link.coupang.com/..." provider="coupang" />
<AffiliateLink href="https://amzn.to/..." provider="amazon" text="Amazon에서 확인" />
<AffiliateLink href="https://11st.co.kr/..." provider="11st" />
<AffiliateLink href="https://example.com" provider="other" text="구매 링크" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `href` | `string` | — | 제휴 링크 URL |
| `text` | `string` | 제공사별 자동 | 버튼 텍스트 |
| `provider` | `'coupang' \| 'amazon' \| '11st' \| 'other'` | `'other'` | 버튼 라벨·배경색·파비콘을 함께 결정 |

> **`AffiliateLink`·`BookCard` 등 제휴 링크가 들어간 포스트는 frontmatter에 `affiliate: true`를 반드시 설정할 것** — 컴포넌트별 문구 대신 `AffiliateNotice`가 상단에 한 번 뜨는 방식으로 공시를 통일했다.

---

#### `AffiliateNotice.astro`

포스트 상단에 표시되는 제휴 공시 박스. Props 없음. `PostLayout`에서 `affiliate: true`일 때 자동 렌더링되므로 MDX에서 직접 import할 필요 없음. money 섹션 전용이 아니라 `affiliate` prop만 보고 동작하므로 어느 섹션에서든 쓸 수 있다.

```yaml
# frontmatter에서 활성화
affiliate: true
```

---

#### `CoupangProductCard.astro`

쿠팡 상품 카드.

> **⚠️ 권장 방법: `href`로 직접 링크 지정 (API 호출 0회)**
> 쿠팡파트너스(partners.coupang.com) 사이트에서 상품을 직접 검색해 "링크 생성"으로 변환된 URL(제휴 추적 포함)을 받아 `href`로 넘기는 방식을 **우선 사용한다.** 이 경우 `pnpm coupang` 실행도, 검색 API 호출도 전혀 발생하지 않는다. `href`를 쓸 때는 캐시에 상품명이 없으므로 `title`도 함께 지정할 것. 아래 `productId`+`itemId` / `keyword` 방식은 **API 호출이 필요한 경우에만(href로 해결이 안 될 때) 신중히 사용한다** — 한도가 극단적으로 낮고 초과 이력이 이미 있어(누적 3회 시 계정 제한) 반복 사용은 위험하다.

쿠팡파트너스 Open API에는 알라딘의 ISBN 조회 같은 공식 "상품 ID 직접 조회" 엔드포인트가 없고 `/products/search`(키워드 검색)만 제공하지만, **`productId`+`itemId`를 공백으로 이어붙여 키워드로 넘기면 검색 결과가 정확히 그 상품 1개로 좁혀지는 동작을 실제 API 호출로 확인**했다(쿠팡 사이트 자체 검색에서도 동일하게 동작 — 사용자 제보로 발견, 공식 문서화된 동작은 아니므로 향후 바뀔 수 있음). 그래서 `productId`+`itemId`를 주면 이 조합으로 정확 매칭을 시도하고, 응답의 `productId`가 실제로 요청한 값과 일치하는 항목만 신뢰한다(불일치 시 폴백). 이 방식은 캐시에 없으면 `pnpm coupang` 실행 시 API를 호출하므로, **href로 대체할 수 없을 때만** 사용할 것. 두 값이 없으면 기존처럼 `keyword` 텍스트 검색 + `pickIndex`로 동작한다 — 이 경우는 호출 시점마다 검색 순위가 흔들릴 수 있고 API 호출도 필요해 가장 권장하지 않는 방식이다. 쓰게 되면 **포스트 미리보기에서 실제로 맞는 상품이 나오는지 반드시 확인할 것**.

이미지·상품명·가격·트래킹 링크(`productUrl`, 이미 제휴 추적 포함)를 보여준다. 응답에 평점 정보는 없고 대신 `isRocket`(로켓배송)·`isFreeShipping`(무료배송) 뱃지를 보여준다.

##### ⚠️ 상품 정보는 캐시에서만 읽는다 — 렌더링 시 API를 호출하지 않는다

컴포넌트는 `src/data/coupang-products.json`(커밋 대상)만 읽는다. **빌드/렌더링 중 API 호출은 0회다.**

검색 API의 호출 한도가 극단적으로 낮기 때문이다. 실측 결과:

- 한도는 분당이 아니라 **시간당**이고, 초과하면 리셋까지 **약 24시간** 걸린다. 누적 44회에서 차단됐다.
- 초과 응답이 **HTTP 200 + `rCode: 403`**으로 온다. `res.ok`만 검사하면 조용히 통과해 **모든 카드가 빈 껍데기인 채로 빌드가 성공한다.**
- **한도 초과 3회가 누적되면 파트너스 계정 이용이 제한된다.** (응답 메시지에 명시)

렌더링마다 호출하던 이전 구조에서는 dev 서버 새로고침 3번(카드 17개 기준 51회)이면 한도가 날아갔다. 그래서 조회를 빌드에서 완전히 분리했다.

캐시 갱신은 수동 실행한다:

```bash
make coupang          # 캐시에 없는 상품만 조회 (평소 이것만)
make coupang-dry      # 조회 대상만 출력, API 호출 없음
make coupang-retry    # '검색 결과 없음'이었던 항목만 재시도
make coupang-refresh  # 전체 가격/정보 갱신 (확인 프롬프트 있음, 한도 주의)
```

`pnpm coupang [--dry-run|--retry-missing|--refresh]`로 직접 실행해도 동일하다. `make` 쪽은 `coupang-refresh`에 확인 프롬프트가 붙어 있어 실수로 한도를 태우는 걸 막아준다.

`scripts/fetch-coupang.mjs`가 `src/content`의 모든 `.mdx`를 스캔해 카드 사용처를 찾고, **캐시에 없는 것만** 순차 조회한다. 한도 초과를 감지하면 즉시 중단하고 그때까지 받은 결과를 저장한다(남은 개수를 로그로 알려준다). `href`를 직접 지정한 카드는 조회 대상에서 제외된다.

새 카드를 추가하면 `pnpm coupang`을 실행하고 **캐시 JSON을 반드시 함께 커밋**해야 한다. 안 하면 Netlify 빌드에서 그 카드가 렌더링되지 않는다.

캐시 키 규칙은 컴포넌트와 스크립트 양쪽에 있고 **서로 일치해야 한다**(한쪽만 바꾸면 전체 캐시 미스):
정확 매칭은 `"{productId}"`, 키워드 모드는 `"keyword:{keyword}:{pickIndex}"`.

##### 빈 카드 방지

캐시 미스이고 `title`·`href` 폴백도 없으면 **카드를 아예 렌더링하지 않고** 빌드 로그에 경고를 남긴다. 제목도 링크도 없는 빈 박스가 배포되는 것보다 낫다는 판단. 로그에 `[CoupangProductCard] 캐시 미스로 카드를 건너뜁니다: <키>`가 보이면 `pnpm coupang`을 실행하면 된다.

검색 인덱스에 없는 상품도 있다(판매중지·파트너스 노출 제외 등). 실제로 `productId=7386347444`(아그리콜라)는 조합 키워드로도, `아그리콜라` 검색으로도 결과에 나오지 않았다. 이 경우 조합 키워드가 매칭에 실패하면서 쿠팡이 **무관한 추천 상품 10개를 폴백으로 내려주기** 때문에, 응답이 비어 보이지 않는데도 원하는 상품은 없는 상태가 된다. 스크립트는 이런 항목을 `notFound`로 기록해 매번 재조회하지 않는다. 해결하려면 `keyword` 방식으로 바꾸거나 다른 상품으로 교체할 것.

인증 방식이 알라딘과 다르다: 단순 쿼리스트링 키가 아니라 **HMAC-SHA256 서명**(`CEA algorithm=HmacSHA256` 스킴)이 필요하다. Secret Key는 서명 계산에만 쓰이고 절대 클라이언트에 노출되면 안 되므로 `PUBLIC_` 접두사를 쓰지 않는다.

> **환경변수**: `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY` 필요 — 이제 `scripts/fetch-coupang.mjs`에서만 쓰이므로 **Netlify에는 설정하지 않아도 된다**(로컬 `.env`만 있으면 된다). 쿠팡파트너스(partners.coupang.com) Open API 메뉴에서 발급 — **누적 판매액이 일정 금액을 넘어야 API가 활성화**된다(파트너스 정책 확인 필요).

```mdx
import CoupangProductCard from '@/components/CoupangProductCard.astro';

<!-- 권장: 쿠팡파트너스 사이트에서 검색 → "링크 생성"으로 변환한 URL을 직접 지정 (API 호출 0회) -->
<CoupangProductCard href="https://link.coupang.com/a/파트너스사이트에서변환한링크" title="Seachem Tidal 55 걸이식 여과기" />

<!-- 정확 매칭: 쿠팡 상품 URL의 productId/itemId를 알고 있을 때. href로 안 될 때만 사용 (API 호출 발생) -->
<CoupangProductCard productId="7778899675" itemId="15996113423" />

<!-- 키워드 검색: 정확한 ID를 모를 때. 결과가 흔들릴 수 있어 미리보기 확인 필수 (API 호출 발생, 가장 비권장) -->
<CoupangProductCard keyword="Seachem Tidal 55 걸이식 여과기" />
<CoupangProductCard keyword="AquaClear 걸이식 여과기" pickIndex={1} title="AquaClear 50" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `href` | `string` | 캐시된 `productUrl` | **권장.** 쿠팡파트너스 사이트에서 변환한 링크를 직접 지정. API 조회 대상에서 제외되어 호출이 전혀 발생하지 않는다 |
| `title` | `string` | — | `href` 사용 시 상품명 표시용(캐시가 없어 자동으로 못 채움). 캐시 미스 시 폴백 표시로도 쓰이며, 없으면 `keyword`를 제목으로 대신 쓴다 |
| `productId` | `string \| number` | — | 쿠팡 상품 ID. `itemId`와 함께 줘야 정확 매칭 모드로 동작. `href`로 해결 안 될 때만 사용 — `pnpm coupang` 실행 시 API 호출 발생 |
| `itemId` | `string \| number` | — | 쿠팡 상품 옵션(itemId). `productId`와 세트로 사용 |
| `keyword` | `string` | — | `productId`+`itemId`가 없을 때 쓰는 검색 키워드. API 호출이 발생하고 결과도 흔들릴 수 있어 가장 비권장 |
| `pickIndex` | `number` | `0` | keyword 모드에서 검색 결과(최대 10개) 중 몇 번째를 쓸지. **캐시 키에 포함되므로** 바꾸면 재조회가 필요하다 |

> `subId`(파트너스 채널 ID) prop은 제거됐다. 검색 API 호출 파라미터였는데 렌더링 시 API를 호출하지 않게 되면서 의미가 없어졌다.

---

#### `ClockChart.astro`

24시간 원형 시계 형태의 시간대 시각화. 자정을 가로지르는 구간 자동 처리. JS 없이 빌드 타임 SVG 생성.

```mdx
import ClockChart from '@/components/ClockChart.astro';

<ClockChart
  caption="한국 시간 기준 미국 주식 거래 시간대"
  segments={[
    { start: 23.5, end: 6,    label: '본장',       color: '#22c55e' },
    { start: 6,    end: 7,    label: '애프터마켓', color: '#f97316' },
    { start: 7,    end: 10,   label: '휴장',       color: '#6b7280' },
    { start: 10,   end: 18,   label: '주간거래',   color: '#3b82f6' },
    { start: 18,   end: 23.5, label: '프리마켓',   color: '#eab308' },
  ]}
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `segments` | `Segment[]` | — | 시간대 배열 |
| `caption` | `string` | — | 하단 캡션 (생략 가능) |

`Segment`: `{ start: number, end: number, label: string, color: string }`  
`start`/`end`는 0–24 소수 허용 (예: `23.5` = 23:30). `end < start`이면 자정을 넘는 구간으로 자동 처리.

---

#### `Chart.astro`

Chart.js 기반 차트. 빌드 타임에 데이터를 `data-*` 속성으로 직렬화하고, 클라이언트에서 hydration하여 렌더링. 다크모드 색상 자동 대응. 직렬화 실패 또는 JS 미실행 시 **폴백 테이블**을 자동 표시(접근성·SEO).

```mdx
import Chart from '@/components/Chart.astro';

<Chart
  type="bar"
  caption="분기별 매출 (억 원)"
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: '매출', data: [10, 20, 15, 30] }],
  }}
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'bar' \| 'line' \| 'pie' \| 'doughnut' \| 'radar'` | — | 차트 종류 |
| `data` | `object` | — | Chart.js `data` 객체 (`labels` + `datasets`) |
| `options` | `object` | `{}` | Chart.js `options` (responsive·다크모드는 자동 적용됨) |
| `height` | `number` | `300` | 차트 높이(px) |
| `caption` | `string` | — | 하단 캡션 (생략 가능) |

> `data`는 JSON 직렬화 가능해야 함 — 함수(tick 콜백 등)는 넣지 말 것. 폴백 테이블은 `data.labels` / `datasets[].data`로 자동 생성된다.

---

#### `FearGreedCalculator.astro`

CNN 공포탐욕지수(0–100) 실시간 공식 페이지 바로가기와 점수 구간 판독·동적 분할 매수(Dynamic DCA) 금액 계산을 결합한 인터랙티브 시뮬레이터. 다크모드 자동 대응.

```mdx
import FearGreedCalculator from '@/components/FearGreedCalculator.astro';

<FearGreedCalculator defaultScore={22} defaultBudget={100} />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `defaultScore` | `number` | `22` | 초기 표시할 지수 점수 (`0`–`100`) |
| `defaultBudget` | `number` | `100` | 초기 월 기본 적립금 (단위: 만 원) |

---

#### `VixCalculator.astro`

CBOE VIX 지수(`^VIX`) 실시간 확인 바로가기와 5단계 구간 판독, '16의 법칙'(`VIX ÷ √252`·`VIX ÷ √12`) 기반 일간·30일 예상 변동폭(원화 환산 포함), 시간차 분할 매수(Tranche DCA) 계산을 결합한 인터랙티브 시뮬레이터. 다크모드 자동 대응.

```mdx
import VixCalculator from '@/components/VixCalculator.astro';

<VixCalculator defaultVix={32} defaultPortfolio={3000} defaultBudget={100} />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `defaultVix` | `number` | `32` | 초기 표시할 VIX 지수 (`9`–`90`) |
| `defaultPortfolio` | `number` | `3000` | 초기 미국주식 보유 평가금액 (단위: 만 원) |
| `defaultBudget` | `number` | `100` | 초기 월 기본 적립금 (단위: 만 원) |

---

#### `EvHybridCalculator.astro`

2026 대한민국 세법(취득세 감면·차령별 자동차세 경감)·국고/지자체 전기차 보조금·내연기관 전환지원금·공공 충전요금 5단계 개편 단가를 반영해 가솔린 vs 하이브리드 vs 전기차의 0～10년 누적 총소유비용(TCO)과 손익분기 주행거리를 실시간 시뮬레이션하는 인터랙티브 계산기. 차급 프리셋 3종(준중형·중형 SUV·준대형)과 테슬라 모델 Y RWD 스왑, 내 견적 직접 입력, 반응형 SVG 라인 차트를 포함하며 다크모드에 자동 대응한다.

```mdx
import EvHybridCalculator from '@/components/EvHybridCalculator.astro';

<EvHybridCalculator />
<EvHybridCalculator defaultPreset="compact" defaultAnnualKm={12000} defaultYears={5} />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `defaultPreset` | `'compact' \| 'midsize-suv' \| 'fullsize'` | `'midsize-suv'` | 초기 표시할 비교 차급 프리셋 |
| `defaultAnnualKm` | `number` | `15000` | 초기 연간 주행거리 (`5000`–`40000`, 단위: km) |
| `defaultYears` | `number` | `5` | 초기 목표 보유 기간 (`1`–`10`, 단위: 년) |

---

#### `TmuxThemePreview.astro`

tmux 대중 테마 TOP 5(`Catppuccin` v2 · `Tokyo Night` · `Dracula` · `Nord` · `Gruvbox`)와 플러그인 없는 순정 `.tmux.conf` 커스텀까지 총 6종의 터미널·상태바 색감과 설정 스니펫을 실시간 비교하는 인터랙티브 시뮬레이터. 한/영(`lang="ko" | "en"`) 다국어 라벨, 서브 플레이버 전환, 상태바 상·하단/구분자 모양 토글, Prefix 키 점등 시뮬레이션, 공식 Hex 스와치 복사 및 `.tmux.conf` 원클릭 복사를 지원한다 (`tmux-theme-top5.mdx`).

```mdx
import TmuxThemePreview from '@/components/TmuxThemePreview.astro';

<TmuxThemePreview lang="ko" />
<TmuxThemePreview lang="en" defaultTheme="tokyo-night" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `lang` | `'ko' \| 'en'` | `'ko'` | UI 라벨 및 생성 주석 언어 |
| `defaultTheme` | `'catppuccin' \| 'tokyo-night' \| 'dracula' \| 'nord' \| 'gruvbox' \| 'minimal'` | `'catppuccin'` | 초기 선택 테마 |

---

#### `ScreenXSeatMap.astro` / `Yongsan4dxSeatMap.astro` / `DolbyCinemaSeatMap.astro` / `MetroLaserImaxSeatMap.astro`

특별관 좌석 판별 포스트 전용 인터랙티브 좌석 배치도 컴포넌트 (Props 없음).
- `ScreenXSeatMap.astro`: CGV 용산아이파크몰 4관(4면 SCREENX, A–I열 × 21석) 위치별 추천 등급 호버 지도 (`cgv-yongsan-screenx-seat-guide.mdx`)
- `Yongsan4dxSeatMap.astro`: CGV 용산아이파크몰 3관(ULTRA 4DX · 용포디, A–I열 × 16석 = 144석) 3가지 뷰 모드(`종합 추천 티어` / `프라임 vs 스탠다드` / `4연석 모션 강도`), 프라임 40석(`E–I열 5–12번`) 프레임, 데스크톱 호버 및 모바일 탭 고정 상세 판독 패널 (`cgv-yongsan-4dx-seat-guide.mdx`)
- `DolbyCinemaSeatMap.astro`: 메가박스 코엑스(`코돌비` 1관 · 378석 · A–R열 · 2.39:1 커브드)와 남양주현대아울렛 스페이스원(`남돌비` 5관 · 290석 · A–M열 · 1.85:1 플랫) 듀얼 상영관 전환 및 2가지 뷰 모드(`종합 추천 티어` / `시야·단차 & 음향존`), 영사기 광축·안전 난간 표시, 데스크톱 호버 및 모바일 탭 고정 상세 판독 패널 (`coex-namyangju-dolby-seat-guide.mdx`)
- `MetroLaserImaxSeatMap.astro`: 수도권 4대 4K 레이저 IMAX(`왕아맥` 왕십리 9관 268석 · 중앙 계단 통로 & 홀수열 `15·17번` 와이드석 / `천아맥` 천호 6관 323석 · 좌블 `A–C열` 철거 반영 / `광아맥` 광교 6관 282석 / `영아맥` 영등포 12관 387석 · 상단 거치) 4탭 전환 및 2가지 뷰 모드, 데스크톱 호버 및 모바일 탭 고정 상세 판독 패널 (`metro-laser-imax-seat-guide.mdx`)

```mdx
import Yongsan4dxSeatMap from '@/components/Yongsan4dxSeatMap.astro';
import DolbyCinemaSeatMap from '@/components/DolbyCinemaSeatMap.astro';
import MetroLaserImaxSeatMap from '@/components/MetroLaserImaxSeatMap.astro';

<Yongsan4dxSeatMap />
<DolbyCinemaSeatMap />
<MetroLaserImaxSeatMap />
```

---

#### `AdSlot.astro`

Google AdSense 광고 슬롯. 포스트 본문 내 광고 삽입 위치에 사용.

```mdx
import AdSlot from '@/components/AdSlot.astro';

<AdSlot slot="inArticle" />
<AdSlot slot="display" adSlot="1234567890" />
```

---

#### `MovieCard.astro`
영화 정보 카드. OMDb API로 평점·개봉년도·장르·줄거리를 빌드 타임에 fetch. API 키 없거나 fetch 실패 시 title+poster만 표시.

> **환경변수**: `PUBLIC_OMDB_API_KEY` 필요. [OMDb API](https://www.omdbapi.com/apikey.aspx)에서 무료 발급.

```mdx
import MovieCard from '@/components/MovieCard.astro';

<MovieCard title="기생충" imdbId="tt6751668" />
<MovieCard title="기생충" imdbId="tt6751668" poster="https://..." />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | — | 영화 제목 (API 실패 시 폴백으로 사용) |
| `imdbId` | `string` | — | IMDb ID (예: `tt6751668`) |
| `poster` | `string` | — | 포스터 이미지 URL (지정 시 API 포스터보다 우선) |

---

#### `PersonCard.astro` / `PersonInline.astro`
인물 프로필 카드. `imdbId` 또는 `profileUrl`이 있으면 링크로 렌더링.
`PersonCard`는 `imdbId`가 주어지고 `image` prop이 생략된 경우 빌드 타임에 TMDb API(`TMDB_API_KEY` 환경변수)로 프로필 사진을 자동 조회하며, 이미지가 없거나 조회 실패 시 이름에서 자동 생성한 이니셜 + 색상 플레이스홀더를 표시한다.

`PersonInline`은 본문 텍스트 중간에 삽입하는 인라인 버전으로, 별도 API 호출 없이 `image` prop 또는 1글자 이니셜 아바타 + 이름을 표시한다.

```mdx
import PersonCard from '@/components/PersonCard.astro';
import PersonInline from '@/components/PersonInline.astro';

<!-- 카드 (flex/grid 안에서 나란히 배치) -->
<PersonCard name="봉준호" role="감독" imdbId="nm0188744" />
<PersonCard name="톰 행크스" role="주연" imdbId="nm0000158" image="https://..." />

<!-- 인라인 (문장 중간 삽입) -->
봉준호 감독과 <PersonInline name="송강호" role="주연" imdbId="nm1817631" />가 함께한 작품.
```

**PersonCard Props**

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `string` | — | 이름 |
| `role` | `string` | — | 역할 (예: `"감독"`, `"주연"`) |
| `image` | `string` | — | 프로필 이미지 URL |
| `imdbId` | `string` | — | IMDb 인물 ID (예: `nm0000158`) |
| `profileUrl` | `string` | — | 외부 링크 (imdbId보다 우선) |

**PersonInline Props** — PersonCard와 동일, `role`이 선택(optional)으로만 다름.

---

#### `BookCard.astro`

도서 정보 카드 (**3단 하이브리드 구조**: ① 카카오 책 검색 REST API → ② Google Books 무인증 API 폴백 → ③ 수동 Props 오버라이드).

> **환경변수 (선택 권장)**: `KAKAO_REST_API_KEY` ([Kakao Developers](https://developers.kakao.com)에서 심사 없이 즉시 발급, 일 30,000건 무료).
> - 키가 설정되어 있으면 국내 신간·번역서·전문서의 고화질 표지·저자·역자·출판사·판매가를 빌드 타임에 자동 완성하며, 기존 포스트들의 `isbn13` 기반 카드도 코드 수정 없이 동작한다.
> - 키가 없거나 해외 원서 ISBN인 경우 자동으로 **Google Books API**로 폴백하며, 모든 API 조회가 실패하거나 `isbn13`을 비워둔 경우에도 `title`·`author`·`cover` 등 수동 Props와 `📖` 아이콘으로 안전하게 렌더링된다.
> - *(이력: 기존 알라딘 OpenAPI가 2026.10.30 전면 종료됨에 따라 카카오 + Google Books + 수동 폴백 하이브리드 구조로 리뉴얼됨)*

레이아웃은 **2행 구성**이다(`@container` 반응형 대응). 1행은 표지(왼쪽) · 제목/저자/출판사/가격(가운데) · 서점/구매 버튼(오른쪽 세로 스택, 좁은 폭에서는 하단 가로열), 2행은 `comment`가 카드 전체 폭을 가로지른다. 서점·제휴 링크(`coupangHref`·`amazonHref`·`aladinHref`·`kyoboHref`·`yes24Href`)를 하나도 넘기지 않아도 유효한 `isbn13`이 있으면 한국어 포스트(`lang="ko"`)는 국내 도서 알라딘 / 해외 도서 교보문고 링크를, 영문 포스트(`lang="en"`)는 Google Books / Amazon 검색 링크를 기본 폴백으로 제공한다. 쿠팡 파트너스(`coupangHref`)나 Amazon(`amazonHref`) 등 제휴 링크를 넣는 포스트는 frontmatter에 `affiliate: true`를 설정해 상단 `AffiliateNotice`로 공시할 것.

```mdx
import BookCard from '@/components/BookCard.astro';

<BookCard title="나미야 잡화점의 기적" isbn13="9788901194492" />
<BookCard
  title="돈의 심리학"
  isbn13="9791157844685"
  comment="투자 수익률은 지능지수보다 시간과 복리를 대하는 태도에서 갈린다는 점을 담백하게 짚어준다."
  coupangHref="https://link.coupang.com/..."
/>
<BookCard
  title="The Three-Body Problem"
  isbn13="9780765382030"
  lang="en"
  amazonHref="https://amzn.to/..."
  comment="Cixin Liu's Hugo Award-winning sci-fi novel that inspired the Netflix series."
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | — | 도서 제목 (필수) |
| `isbn13` | `string` | `''` | ISBN13 또는 ISBN10 (하이픈 유무 무관). 비워두면 API 조회를 건너뛰고 수동 Props만 표시 |
| `author` | `string` | API 자동 | 저자 수동 오버라이드 |
| `publisher` | `string` | API 자동 | 출판사 수동 오버라이드 |
| `cover` | `string` | API 자동 | 표지 이미지 URL 수동 오버라이드 |
| `price` | `number \| string` | API 자동 | 판매가/정가 수동 지정 |
| `comment` | `string` | — | 카드 하단 전체 폭으로 표시할 짧은 추천 코멘트 (2～3문장 이내 권장) |
| `coupangHref` | `string` | — | 쿠팡 파트너스 링크 (사용 시 frontmatter `affiliate: true` 권장) |
| `amazonHref` | `string` | — | Amazon 제휴/상품 링크 (사용 시 frontmatter `affiliate: true` 권장) |
| `aladinHref` | `string` | ISBN 상세링크(`ko`) | 알라딘 상품 링크 |
| `kyoboHref` | `string` | — | 교보문고 상품 링크 |
| `yes24Href` | `string` | — | YES24 상품 링크 |
| `lang` | `'ko' \| 'en'` | `'ko'` | 표시 언어 (`'en'` 지정 시 버튼·alt·폴백 문구 영문 전환) |

---

#### `StockCard.astro` / `StockInline.astro`

주식·ETF·지수 종목 정보 카드 (`money` 섹션 등). 별도 API 키 없이 **Yahoo Finance Chart API v8**로 빌드 타임에 종목명·거래소·종가·일간 등락률·52주 고저 위치 바·최근 1개월 순수 SVG 스파크라인을 자동 생성한다(동일 티커 인메모리 캐시 및 오프라인 시 `/vault` 로컬 주가 데이터 폴백 지원).

- 정적 빌드(SSG) 특성상 독자가 작성 시점과 현재가를 혼동하지 않도록 우측 하단에 **`YYYY.MM.DD 종가`** 기준일을 함께 표시한다.
- 국내 6자리 종목코드(`005930` 등)를 넘기면 자동으로 `.KS`/`.KQ` 시세를 조회하고, 외부 클릭 링크는 한국 독자에게 익숙한 **네이버 증권**으로 연결한다(해외 종목은 Yahoo Finance 연결).
- `StockInline`은 본문 문장 중간에 삽입하는 인라인 티커 칩(`$SCHD`, `삼성전자 005930`)으로 API 호출 없이 즉시 렌더링된다.

```mdx
import StockCard from '@/components/StockCard.astro';
import StockInline from '@/components/StockInline.astro';

<StockCard
  ticker="NVDA"
  sector="반도체 · AI"
  website="nvidia.com"
  comment="데이터센터 GPU 생태계 독점력을 바탕으로 실적 성장을 이어가는 핵심 AI 인프라 종목."
/>
<StockCard ticker="005930" name="삼성전자" market="KOSPI" sector="반도체" />

<!-- 인라인 -->
배당 성장 포트폴리오의 코어로 <StockInline ticker="SCHD" name="슈드" />와 <StockInline ticker="005930" name="삼성전자" />를 담았다.
```

| Prop (`StockCard`) | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `ticker` | `string` | — | 종목 티커 (예: `"NVDA"`, `"SCHD"`, `"005930"`, `"^GSPC"`) |
| `name` | `string` | API 종목명 | 표시할 종목명 오버라이드 및 폴백 |
| `market` | `string` | API 거래소명 | `"KOSPI"`, `"KOSDAQ"`, `"NASDAQ"`, `"ETF"` 등 시장 배지 및 조회 힌트 |
| `sector` | `string` | — | 섹터·테마 라벨 (예: `"반도체"`, `"배당성장"`) |
| `website` | `string` | — | 기업 공식 도메인 지정 시 파비콘 표시 (예: `"nvidia.com"`) |
| `href` | `string` | 네이버/Yahoo | 외부 시세 페이지 URL 직접 지정 |
| `comment` | `string` | — | 카드 하단 전체 폭 투자 메모 |
| `price` / `changePercent` / `asOf` | `number \| string` | API 자동 | 수동 가격·등락률·기준일 지정 시 API 호출 생략 |

---

#### `BaseballPlayerCard.astro` / `PlayerInline.astro`

프로야구(MLB · KBO · NPB) 선수 프로필 및 시즌 성적 카드.
- **MLB 선수**: 무료·무인증 공식 MLB Stats API(`mlbId`)를 통해 소속 구단·등번호·포지션·투타(`우투좌타` 등 한글 자동 변환)·시즌 핵심 성적과 공식 헤드샷을 빌드 타임에 자동 조회한다.
- **KBO 선수**: 공개 Open API 부재 및 선수 사진 초상권/구단 엠블럼 저작권 이슈를 피하기 위해, 구단 코드(`team="KIA" | "삼성" | "LG" | "두산" | "KT" | "SSG" | "롯데" | "한화" | "NC" | "키움"`) 지정 시 **구단 고유 컬러 좌측 포인트 보더(다크모드 명도 자동 보정) + 등번호 유니폼 타일(`#5`, `#18`)**을 렌더링하며, `kboId` 지정 시 KBO 공식 기록실로 연결한다.
- `PlayerInline`은 문장 중간에 삽입하는 등번호 배지 + 선수명 인라인 컴포넌트다.

```mdx
import BaseballPlayerCard from '@/components/BaseballPlayerCard.astro';
import PlayerInline from '@/components/PlayerInline.astro';

<!-- MLB 자동 조회 -->
<BaseballPlayerCard name="이정후" mlbId="808982" />

<!-- KBO 구단 프리셋 + 시즌 성적 -->
<BaseballPlayerCard
  name="김도영"
  team="KIA"
  number={5}
  position="3B"
  batsThrows="우투우타"
  season="2024 KBO"
  kboId="52605"
  stats={{ avg: '.347', hr: 38, rbi: 109, sb: 40, ops: '1.067' }}
  comment="KBO 역대 최연소 30홈런–30도루를 달성한 내야 핵심."
/>

<!-- 인라인 -->
타석에는 <PlayerInline name="김도영" team="KIA" number={5} position="3B" kboId="52605" />이 들어섰다.
```

| Prop (`BaseballPlayerCard`) | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `string` | — | 선수 이름 |
| `team` | `string` | MLB 자동 | 구단 코드 또는 한글명 (`"KIA"`, `"삼성"`, `"LG"`, `"SF"`, `"LAD"` 등) |
| `number` | `number \| string` | MLB 자동 | 등번호 (예: `5`, `"51"`) |
| `position` | `string` | MLB 자동 | 포지션 약칭 (`"3B"`, `"CF"`, `"SP"`, `"RP"`, `"C"`, `"DH"` 등) |
| `batsThrows` | `string` | MLB 자동 | 투타 표기 (예: `"우투우타"`, `"우투좌타"`) |
| `role` | `'hitter' \| 'pitcher' \| 'twp'` | 포지션 추론 | 투타겸업 선수 스탯 선택 및 KBO 기록실 타자/투수 링크 분기 |
| `season` | `string \| number` | 최신 시즌 | 성적 기준 연도/라벨 (예: `2025`, `"2024 KBO"`) |
| `stats` | `PlayerStatsObject \| { label, value }[]` | MLB 자동 | 타자(`avg`, `hr`, `rbi`, `sb`, `ops`, `war` 등) 또는 투수(`era`, `wins`, `losses`, `record`, `saves`, `ip`, `so`, `whip`) 주요 지표 |
| `mlbId` / `kboId` / `profileUrl` | `string \| number` | — | MLB 공식 ID / KBO 기록실 ID / 커스텀 프로필 링크 |
| `showHeadshot` | `boolean` | `true` | `false` 지정 시 MLB 선수도 등번호 유니폼 타일로 표시 |
| `comment` | `string` | — | 카드 하단 전체 폭 스카우팅 메모 |

---

#### `GitHubRepoCard.astro`

GitHub 오픈소스 저장소 소개 카드 (`dev` · `tools` 섹션). 빌드 타임에 GitHub REST API로 설명·주 사용 언어(공식 컬러 도트)·Star/Fork 수·SPDX 라이선스를 조회해 렌더링하며, API 한도 초과나 오프라인 시에도 `owner / repo` 링크 카드로 안전하게 폴백한다(`GITHUB_TOKEN` 환경변수 설정 시 시간당 5,000회 조회 가능).

```mdx
import GitHubRepoCard from '@/components/GitHubRepoCard.astro';

<GitHubRepoCard repo="withastro/astro" />
<GitHubRepoCard repo="catppuccin/tmux" comment="tmux 상태바 색감을 깔끔하게 잡아주는 대표 테마 플러그인." />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `repo` | `string` | — | `"owner/repo"` 또는 GitHub 저장소 전체 URL |
| `description` | `string` | API 자동 | 저장소 설명 오버라이드 |
| `language` | `string` | API 자동 | 주 언어 오버라이드 |
| `comment` | `string` | — | 카드 하단 코멘트 |

---

#### `AppCard.astro`

macOS · iOS · CLI 애플리케이션 및 유틸리티 소개 카드 (`tools` 섹션).
- `appStoreId`를 지정하면 별도 키 없이 Apple 공식 iTunes Lookup API로 **고해상도 앱 아이콘·평점·카테고리·가격·스토어 링크**를 빌드 타임에 자동 완성한다.
- `brew` prop을 넘기면 카드 하단에 **`$ brew install ...` 원클릭 복사 바**와 `/tools/install-homebrew-2026` 안내 링크가 함께 렌더링된다.

```mdx
import AppCard from '@/components/AppCard.astro';

<AppCard
  name="Ghostty"
  platform={["macOS", "Linux"]}
  category="터미널 에뮬레이터"
  price="무료 · 오픈소스"
  href="https://ghostty.org"
  brew="--cask ghostty"
  description="네이티브 UI와 GPU 가속 렌더링을 결합한 고속 터미널 에뮬레이터."
/>
<AppCard name="Magnet" appStoreId="441258766" platform="macOS" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `string` | — | 앱·도구 이름 |
| `description` | `string` | 스토어 첫 줄 | 한줄 요약 설명 |
| `category` | `string` | 스토어 장르 | 분류 라벨 |
| `platform` | `string \| string[]` | — | 지원 플랫폼 배지 (`"macOS"`, `["macOS", "iOS"]` 등) |
| `price` | `string` | 스토어 가격 | 가격 정책 표기 (`"무료"`, `"무료 · 오픈소스"` 등) |
| `brew` | `string` | — | Homebrew 패키지명 또는 전체 설치 명령어 (원클릭 복사 바 생성) |
| `appStoreId` | `string \| number` | — | Apple App Store ID (`"441258766"` 등) |
| `href` / `icon` | `string` | 자동 추론 | 공식 사이트 URL(파비콘 자동 활용) / 커스텀 아이콘 URL |
| `comment` | `string` | — | 카드 하단 추천 코멘트 |

---

#### `PlaceCard.astro`

상영관·여행지·전시·맛집 등 오프라인 장소 안내 카드 (`culture` · `life` 섹션). 별도 유료 지도 API 키 없이 **네이버 지도 · 카카오맵 · Google 지도** 검색/공유 딥링크 버튼을 깔끔하게 묶어 제공한다(`abroad={true}` 설정 시 해외 여행지용으로 Google 지도 버튼만 노출).

```mdx
import PlaceCard from '@/components/PlaceCard.astro';

<PlaceCard
  name="CGV 용산아이파크몰 IMAX"
  category="특별관 · 영화관"
  address="서울 용산구 한강대로23길 55 아이파크몰 6층"
  info="용산역 1번 출구 직결 · 티켓 인증 시 주차 3시간 할인"
/>
<PlaceCard name="도쿄 타워" category="전망대" query="Tokyo Tower" abroad={true} />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | `string` | — | 장소명 |
| `category` | `string` | — | 장소 분류 배지 |
| `address` | `string` | — | 주소 표기 |
| `info` | `string` | — | 교통·주차·영업시간 등 실용 팁 한줄 |
| `query` | `string` | `name` | 지도 검색 키워드 오버라이드 |
| `naverUrl` / `kakaoUrl` / `googleUrl` | `string` | 검색 링크 | 각 지도 서비스의 특정 장소 공유 URL 직접 지정 |
| `abroad` | `boolean` | `false` | `true` 시 네이버·카카오 버튼을 생략하고 Google 지도만 표시 |
| `image` / `comment` | `string` | — | 장소 썸네일 이미지 URL / 하단 방문 코멘트 |

---

#### `LinkPreviewCard.astro`

참고 아티클·공식 문서·외부 웹페이지를 노션 북마크 블록 형태로 보여주는 범용 링크 카드 (전 섹션 공통). 빌드 타임에 대상 페이지 `<head>`의 Open Graph(`og:title`, `og:description`, `og:image`, `og:site_name`) 메타태그를 파싱하며, 봇 차단 사이트나 오프라인 시에도 도메인 파비콘 + 제목/호스트명 카드로 깔끔하게 폴백한다.

```mdx
import LinkPreviewCard from '@/components/LinkPreviewCard.astro';

<LinkPreviewCard url="https://docs.astro.build/en/getting-started/" />
<LinkPreviewCard url="https://example.com/post" title="수동 지정 제목" comment="핵심 레퍼런스 아티클." />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `url` | `string` | — | 대상 URL |
| `title` / `description` / `siteName` | `string` | OG 자동 | 제목·요약·사이트명 수동 오버라이드 및 차단 대비 폴백 |
| `image` | `string \| false` | OG 자동 | 썸네일 URL 직접 지정 (`false` 전달 시 썸네일 숨김) |
| `comment` | `string` | — | 카드 하단 코멘트 |

---

#### `CloudinaryImage.astro`

Cloudinary 기반 반응형 이미지. srcset(400/800/1200/1600w) + LQIP 블러 플레이스홀더 자동 생성 + 선택적 하단 캡션(`caption`) 및 출처 표기(`credit`/`creditUrl`) 지원.

> **환경변수**: `PUBLIC_CLOUDINARY_CLOUD_NAME` 필요.

```mdx
import CloudinaryImage from '@/components/CloudinaryImage.astro';

<CloudinaryImage
  publicId="v123/photo.jpg"
  alt="사진 설명"
  width={1200}
  height={800}
  caption="본문 이해를 돕는 이미지 핵심 읽는 포인트 설명"
/>
<CloudinaryImage
  publicId="posts/life/2026/advent/fig-01-wichern-wreath"
  alt="1839년 독일 함부르크 라우에 하우스의 수레바퀴 대림환"
  width={1200}
  height={800}
  caption="비헤른 목사가 마차 바퀴로 만든 초기 대림환 구조"
  credit="Wikimedia Commons, Public Domain"
  creditUrl="https://commons.wikimedia.org/wiki/..."
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `publicId` | `string` | — | Cloudinary public ID |
| `alt` | `string` | — | 접근성 및 SEO용 구체적 alt 텍스트 |
| `sizes` | `string` | `(max-width: 1200px) 100vw, 1200px` | 반응형 sizes 힌트 |
| `width` | `number` | — | 원본 너비 (지정 시 aspect-ratio로 CLS 방지) |
| `height` | `number` | — | 원본 높이 (width와 함께 지정) |
| `caption` | `string` | — | 이미지 하단 `<figcaption>` 설명 문구 (독자가 주목할 포인트 안내) |
| `credit` | `string` | — | 외부 사료·퍼블릭 도메인·공식 자료 인용 시 출처/라이선스 표기 |
| `creditUrl` | `string` | — | `credit`에 연결할 원본 출처 URL (`target="_blank"` 자동 적용) |

> `width` / `height`를 모두 지정하면 이미지 로드 전에도 공간이 확보되어 레이아웃 시프트(CLS)가 방지됩니다. 본문 내 단독 삽입 시 독자의 이해를 돕는 `caption` 지정을 권장합니다.

---

#### `ImageRow.astro`

이미지 2~4개를 한 줄(그리드)로 나란히 배치. 모바일에서는 자동으로 1열(4열 지정 시 2열)로 접힘.

```mdx
import ImageRow from '@/components/ImageRow.astro';
import CloudinaryImage from '@/components/CloudinaryImage.astro';

<ImageRow>
  ![왼쪽 사진](https://example.com/a.jpg)
  ![오른쪽 사진](https://example.com/b.jpg)
</ImageRow>

<ImageRow cols={3} caption="제주도 여행 3일차">
  <CloudinaryImage publicId="v123/a.jpg" alt="아침" />
  <CloudinaryImage publicId="v123/b.jpg" alt="점심" />
  <CloudinaryImage publicId="v123/c.jpg" alt="저녁" />
</ImageRow>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `cols` | `2 \| 3 \| 4` | `2` | 데스크톱 기준 열 수 |
| `caption` | `string` | — | 그리드 아래 중앙 정렬 캡션 |

> 마크다운 이미지(`![]()`), `<img>`, `CloudinaryImage` 모두 자식으로 사용 가능.
> 내부 이미지는 `w-full` + `rounded-lg`가 자동 적용되므로 `MovieCard` 같은 카드 컴포넌트는 넣지 말 것 (카드 배치는 `<div class="grid gap-4 md:grid-cols-2">` 직접 사용).

---

#### `Logo.astro`

원형 틀 안에 e 스피너 형태의 SVG 로고. 헤더 및 브랜딩 용도.

```astro
import Logo from '@/components/Logo.astro';

<Logo />                          <!-- 정적, 24px -->
<Logo animated={true} />          <!-- 볼(bowl) 호가 8s 주기로 회전, hover 시 1.2s로 가속 -->
<Logo size={32} animated={true} /> <!-- 크기 조절 -->
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `size` | `number` | `24` | 렌더링 크기 (px) |
| `animated` | `boolean` | `false` | e 볼 호 회전 애니메이션 |
| `class` | `string` | — | 추가 CSS 클래스 |

> `prefers-reduced-motion` 감지 시 애니메이션 자동 비활성화.
> `public/favicon.svg`는 동일 디자인의 정적 버전 (다크모드 미디어쿼리 포함).
> 헤더에서는 `size={48}` + `translateY(14px)`로 헤더 아래 10px 돌출되어 사용됨.

---

### 레이아웃/구조용 (PostLayout 등에서 사용, MDX에서 직접 쓰지 않음)

| 컴포넌트 | 역할 |
|---------|------|
| `PostCard.astro` | 포스트 목록의 카드 UI |
| `TagBadge.astro` | 태그 뱃지 표시 |
| `TOC.astro` | 목차 (Table of Contents) |
| `SeriesTOC.astro` | 시리즈 전체 목차 |
| `SeriesNav.astro` | 이전/다음 시리즈 포스트 이동 |
| `Header.astro` | 사이트 헤더 (레이아웃에서 자동 포함) |
| `Footer.astro` | 사이트 푸터 (레이아웃에서 자동 포함) |

---

### React Island 컴포넌트 (`.tsx`, 인터랙션 필요한 경우)

| 컴포넌트 | 역할 | 사용 위치 |
|---------|------|---------|
| `DarkModeToggle.tsx` | 다크모드 토글 버튼 | Header |
| `LanguageSwitcher.tsx` | 언어(ko/en) 전환 | Header |
| `SearchButton.tsx` | 검색 모달 열기 버튼 | Header |
| `SearchModal.tsx` | Pagefind 검색 UI | Header |
| `Comments.tsx` | Giscus 댓글 | PostLayout |
| `HomeTabs.tsx` | 홈 섹션 탭 | 홈 페이지 |
| `SectionTabs.tsx` | 섹션 내 탭 필터 | 섹션 페이지 |
| `heatmap/HeatMap.tsx` | 주식 히트맵 본체 (계좌 탭·날짜 네비·셀 렌더링·툴팁) | vault 페이지 |
| `heatmap/DateCalendar.tsx` | 히트맵 날짜 캘린더 오버레이 | HeatMap 내부 |

> React island는 `client:load` / `client:visible` directive로 hydration 제어.
> 정적 콘텐츠라면 `.astro`를 사용하고, 클릭/상태 관리가 필요할 때만 `.tsx`로 작성.

---

## 새 컴포넌트 작성 템플릿

```astro
---
// 1. Props 타입 정의
interface Props {
  required: string;
  optional?: 'a' | 'b';
}

// 2. Props 구조분해
const { required, optional = 'a' } = Astro.props;
---

<!-- 3. HTML 템플릿 -->
<div class="not-prose my-6 ...">
  <slot />  <!-- 자식 콘텐츠가 필요할 때 -->
</div>
```

**체크리스트:**
- [ ] prose 영역 안에서 쓰는 컴포넌트라면 최상위 요소에 `not-prose` 클래스 추가 (Tailwind Typography 리셋)
- [ ] 마진은 `my-6` 기준으로 통일 (다른 컴포넌트와 간격 일관성)
- [ ] 다크모드 지원: `dark:` prefix로 색상 쌍 지정
- [ ] 자식 콘텐츠를 받는 컴포넌트는 `<slot />` 사용

---

## 폐기 예정 컴포넌트

| 컴포넌트 | 대체 | 비고 |
|---------|------|------|
| `Callout.astro` | `Alert.astro` | `global.css`의 `.alert-*` 클래스 의존, 아이콘 없음. 기존 포스트 호환용으로만 존재 — 신규 사용 금지 |
