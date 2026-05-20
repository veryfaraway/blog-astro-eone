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

#### `AdSlot.astro`
Google AdSense 광고 슬롯. 포스트 본문 내 광고 삽입 위치에 사용.

```mdx
import AdSlot from '@/components/AdSlot.astro';

<AdSlot slot="inArticle" />
<AdSlot slot="display" adSlot="1234567890" />
```

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
