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

제휴 링크 버튼 + 자동 면책 문구. 수익화 링크에 사용.

```mdx
import AffiliateLink from '@/components/AffiliateLink.astro';

<AffiliateLink href="https://link.coupang.com/..." provider="coupang" />
<AffiliateLink href="https://amzn.to/..." provider="amazon" text="Amazon에서 확인" />
<AffiliateLink href="https://example.com" provider="other" text="구매 링크" />
```

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `href` | `string` | — | 제휴 링크 URL |
| `text` | `string` | 제공사별 자동 | 버튼 텍스트 |
| `provider` | `'coupang' \| 'amazon' \| 'other'` | `'other'` | 면책 문구 자동 결정 |

---

#### `AffiliateNotice.astro`

포스트 상단에 표시되는 제휴 공시 박스. Props 없음. `PostLayout`에서 `affiliate: true`일 때 자동 렌더링되므로 MDX에서 직접 import할 필요 없음.

```yaml
# frontmatter에서 활성화
affiliate: true
```

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
