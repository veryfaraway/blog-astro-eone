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

쿠팡 상품 카드. 쿠팡파트너스 Open API에는 알라딘의 ISBN 조회 같은 공식 "상품 ID 직접 조회" 엔드포인트가 없고 `/products/search`(키워드 검색)만 제공하지만, **`productId`+`itemId`를 공백으로 이어붙여 키워드로 넘기면 검색 결과가 정확히 그 상품 1개로 좁혀지는 동작을 실제 API 호출로 확인**했다(쿠팡 사이트 자체 검색에서도 동일하게 동작 — 사용자 제보로 발견, 공식 문서화된 동작은 아니므로 향후 바뀔 수 있음). 그래서 `productId`+`itemId`를 주면 이 조합으로 정확 매칭을 시도하고, 응답의 `productId`가 실제로 요청한 값과 일치하는 항목만 신뢰한다(불일치 시 폴백). 두 값이 없으면 기존처럼 `keyword` 텍스트 검색 + `pickIndex`로 동작한다 — 이 경우는 호출 시점마다 검색 순위가 흔들릴 수 있으므로 **포스트 미리보기에서 실제로 맞는 상품이 나오는지 반드시 확인할 것**.

이미지·상품명·가격·트래킹 링크(`productUrl`, 이미 제휴 추적 포함)를 빌드 타임에 가져온다. 응답에 평점 정보는 없고 대신 `isRocket`(로켓배송)·`isFreeShipping`(무료배송) 뱃지를 보여준다.

인증 방식이 알라딘과 다르다: 단순 쿼리스트링 키가 아니라 **HMAC-SHA256 서명**(`CEA algorithm=HmacSHA256` 스킴)이 필요하다. Secret Key는 서명 계산에만 쓰이고 절대 클라이언트에 노출되면 안 되므로 `PUBLIC_` 접두사를 쓰지 않는다.

> **환경변수**: `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY` 필요. 쿠팡파트너스(partners.coupang.com) Open API 메뉴에서 발급 — **누적 판매액이 일정 금액을 넘어야 API가 활성화**된다(파트너스 정책 확인 필요).

```mdx
import CoupangProductCard from '@/components/CoupangProductCard.astro';

<!-- 정확 매칭: 쿠팡 상품 URL의 productId/itemId를 알고 있을 때 (권장) -->
<CoupangProductCard productId="7778899675" itemId="15996113423" />

<!-- 키워드 검색: 정확한 ID를 모를 때. 결과가 흔들릴 수 있어 미리보기 확인 필수 -->
<CoupangProductCard keyword="Seachem Tidal 55 걸이식 여과기" />
<CoupangProductCard keyword="AquaClear 걸이식 여과기" pickIndex={1} title="AquaClear 50" />
<CoupangProductCard keyword="..." href="https://link.coupang.com/a/직접만든링크로강제지정" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `productId` | `string \| number` | — | 쿠팡 상품 ID. `itemId`와 함께 줘야 정확 매칭 모드로 동작 |
| `itemId` | `string \| number` | — | 쿠팡 상품 옵션(itemId). `productId`와 세트로 사용 |
| `keyword` | `string` | — | `productId`+`itemId`가 없을 때 쓰는 검색 키워드 (구체적일수록 원하는 상품이 상위에 나올 확률이 높음) |
| `title` | `string` | — | API 실패 시 폴백 표시용 |
| `pickIndex` | `number` | `0` | keyword 모드에서 검색 결과(최대 10개) 중 몇 번째를 쓸지 |
| `href` | `string` | 검색 결과의 `productUrl` | 특정 링크로 강제 지정하고 싶을 때만 사용 |
| `subId` | `string` | — | 파트너스 채널 ID (정산 트래킹용, 파트너스 계정에 등록된 값이어야 정산에 반영됨) |

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
인물 프로필 카드. imdbId 또는 profileUrl이 있으면 링크로 렌더링.
이미지 없으면 이름에서 자동 생성한 이니셜 + 색상 플레이스홀더 표시.

`PersonInline`은 본문 텍스트 중간에 삽입하는 인라인 버전 (아바타 + 이름).

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

도서 정보 카드. 알라딘 Open API로 표지·저자·출판사·가격·평점을 빌드 타임에 fetch. API 요청에 `includeKey=1`을 붙여 응답 `link`에 TTBKey가 자동 포함된 제휴 링크를 그대로 받아오므로, 대시보드에서 책마다 수동으로 "링크 만들기"를 할 필요가 없다. API 키 없거나 fetch 실패 시 title만 표시(폴백).

레이아웃은 **2행 구성**이다. 1행은 표지(왼쪽) · 제목/평점/저자/가격(가운데, 가변폭) · 구매 버튼(오른쪽, 폭 고정 컬럼에 세로 스택), 2행은 `comment`가 카드 전체 폭을 가로지른다(1행의 모든 컬럼을 span하는 효과). 버튼이 최대 2개뿐이라 하단에 별도 행으로 두면 여백이 휑해서 오른쪽 고정폭 컬럼으로 옮겼고, `comment`는 좁은 가운데 컬럼에 두면 3줄로 접히며 잘리는 반면 버튼 컬럼 아래는 비어 보여서 아예 행을 분리했다. `comment`가 없으면 1행만 렌더링되므로 기존과 동일한 한 줄짜리 카드다. 알라딘/쿠팡 버튼은 동일한 아웃라인 스타일로 대등하게 배치하고, 배지 색상만 각사 실제 브랜드 컬러(알라딘 `#2F9DDC`, 쿠팡 `#E94B22`)로 구분해 어느 한쪽이 "주" 버튼처럼 보이지 않게 했다 — 두 링크를 나란히 두면 독자가 이미 쓰던 플랫폼으로 갈 수 있어 전환율에 유리하다 (도서정가제로 가격은 어느 쪽이든 동일). 카드 자체에는 면책 문구가 없으므로, 구매 링크를 실제로 넣는 포스트는 frontmatter에 `affiliate: true`를 설정해 상단 `AffiliateNotice`로 공시할 것 (money 섹션이 아니어도 동작함).

`comment` prop으로 "왜 이 책을 추천하는지" 짧은 코멘트를 카드 안에 넣을 수 있다 — 목록에서 책 소개를 반복 서술하지 않고 카드 하나로 정보를 통일할 때 유용하다 (예: "1. 『제목』" + 그 아래 `comment`로 추천 이유가 담긴 `BookCard`).

**분권(상/하, 1권/2권) 도서**는 BookCard 하나로 표현할 수 없으므로, `<div class="grid gap-3 md:grid-cols-2 items-start">`로 감싸 두 개를 나란히 배치한다. `comment`는 대표(1권) 카드에만 넣고 나머지는 짧게 안내만 하면 중복을 피할 수 있다. 이때 `items-start`가 없으면 comment가 있는 카드의 높이에 맞춰 옆 카드가 늘어나면서 아래쪽에 빈 공간이 생기므로 반드시 함께 붙일 것.

> **주의**: 알라딘 API는 존재하지 않는 ISBN13을 넣어도 검증 없이 관련 없는 상품을 반환하는 경우가 있다(예: `0000000000000` → 전혀 다른 중고책). 아직 정확한 ISBN13을 모를 때는 값을 넣지 말고 **비워둘 것**(`isbn13=""`) — 컴포넌트가 fetch 자체를 건너뛰고 `title`만 표시하는 안전한 폴백으로 동작한다.

> **환경변수**: `PUBLIC_ALADIN_TTB_KEY` 필요. 알라딘 회원가입 후 '나의 계정 > TTB/API > TTB 사이트/블로그 등록관리'에서 발급 (승인 1~2일 소요).

```mdx
import BookCard from '@/components/BookCard.astro';

<BookCard title="나미야 잡화점의 기적" isbn13="9788901194492" />
<BookCard
  title="나미야 잡화점의 기적"
  isbn13="9788901194492"
  comment="추리물이라기보다 따뜻한 판타지에 가까워 입문용으로 좋다."
  aladinHref="https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=...&partner=TTBKey"
  coupangHref="https://link.coupang.com/..."
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | — | 도서 제목 (API 실패 시 폴백으로 사용) |
| `isbn13` | `string` | — | ISBN13 (하이픈 없이 13자리). 모르면 빈 문자열로 두면 fetch를 건너뛰고 title만 표시(안전한 폴백) |
| `comment` | `string` | — | 카드 하단 행에 카드 전체 폭으로 표시할 짧은 추천 코멘트 (말줄임 없이 전부 노출되므로 2~3문장 이내로) |
| `aladinHref` | `string` | API의 `link`(TTBKey 자동 포함) | 특정 링크로 강제 지정하고 싶을 때만 사용. 보통 비워두면 API가 반환하는 제휴 링크가 그대로 쓰임 |
| `coupangHref` | `string` | — | 쿠팡 파트너스 링크 (선택) |

---

#### `CloudinaryImage.astro`

Cloudinary 기반 반응형 이미지. srcset(400/800/1200/1600w) + LQIP 블러 플레이스홀더 자동 생성.

> **환경변수**: `PUBLIC_CLOUDINARY_CLOUD_NAME` 필요.

```mdx
import CloudinaryImage from '@/components/CloudinaryImage.astro';

<CloudinaryImage publicId="v123/photo.jpg" alt="사진 설명" />
<CloudinaryImage
  publicId="v123/photo.jpg"
  alt="사진 설명"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `publicId` | `string` | — | Cloudinary public ID |
| `alt` | `string` | — | 접근성 alt 텍스트 |
| `sizes` | `string` | `(max-width:1200px) 100vw, 1200px` | 반응형 sizes 힌트 |
| `width` | `number` | — | 원본 너비 (지정 시 aspect-ratio로 CLS 방지) |
| `height` | `number` | — | 원본 높이 (width와 함께 지정) |

> `width` / `height`를 모두 지정하면 이미지 로드 전에도 공간이 확보되어 레이아웃 시프트(CLS)가 방지됩니다.

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
