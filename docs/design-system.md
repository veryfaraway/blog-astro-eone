# 디자인 시스템

> 기반: shadcn/ui + Radix UI + Tailwind CSS  
> 원칙: 5개 섹션이 시각적으로 구분되면서도 하나의 블로그처럼 통일감을 가진다

### 디자인 방향 (확정)

- **톤**: modern, calm, clean, premium, understated
- **금지**: flashy, 과도한 색상, startup-marketing 스타일, AI 그라디언트, 과대형 카드
- **아티클 페이지**: editorial, 읽기 집중형 (시즌 테마 활성 시에도 본문 내 장식·배경 이펙트 침범 금지)
- **유틸리티 페이지** (검색, 아카이브, 태그, `/vault`): shadcn/ui 컴포넌트 그대로 (`/vault`는 고유 그린 터미널 다크 테마 독립 유지)
- **Accent color 사용 원칙**: 섹션 뱃지, 좌측 border-line, hover 상태 등 **서브 포인트로만** 사용. 대형 색상 블록 금지
- **시즌 연출 허용 범위**: 헤더 로고 마이크로 모티프 및 홈 화면 Hero 영역(시즌 배지·은은한 앰비언트)에 한해 절제된 계절감 허용 (`prefers-reduced-motion` 필수 준수)

---

## 1. 색상 시스템

### 글로벌 토큰 (CSS 변수)

```css
:root {
  /* 배경 */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* 카드 */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* 경계선 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;

  /* 링 */
  --ring: 222.2 84% 4.9%;

  /* Muted */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}
```

### 섹션별 Accent Color

각 섹션은 고유한 accent color를 가진다. CSS 변수로 주입되어 `SectionLayout`이 적용.

#### life (일상/종교/육아/자동차)
```css
/* 따뜻하고 자연스러운 green 계열 */
--accent: 142 71% 45%;          /* green-500 */
--accent-foreground: 0 0% 100%;
--accent-light: 141 84% 93%;    /* green-100 */
--accent-dark: 142 76% 36%;     /* green-600 */
```

#### money (경제/투자/절약/제품리뷰)
```css
/* 신뢰감 있는 amber/gold 계열 */
--accent: 45 93% 47%;           /* amber-500 */
--accent-foreground: 26 83% 14%;
--accent-light: 48 96% 89%;     /* amber-100 */
--accent-dark: 32 95% 44%;      /* amber-600 */
```

#### culture (영화/영어학습/여행)
```css
/* 감성적이고 무드 있는 violet 계열 */
--accent: 262 83% 58%;          /* violet-500 */
--accent-foreground: 0 0% 100%;
--accent-light: 263 70% 94%;    /* violet-100 */
--accent-dark: 263 70% 50%;     /* violet-600 */
```

#### tools (macOS/터미널/개발환경)
```css
/* 실용적인 slate 계열 */
--accent: 215 25% 47%;          /* slate-500 */
--accent-foreground: 0 0% 100%;
--accent-light: 210 40% 93%;    /* slate-100 */
--accent-dark: 215 28% 37%;     /* slate-600 */
```

#### dev (개발/AI/Backend/Frontend)
```css
/* 차갑고 기술적인 cyan 계열 */
--accent: 199 89% 48%;          /* cyan-500 */
--accent-foreground: 0 0% 100%;
--accent-light: 204 100% 94%;   /* cyan-100 */
--accent-dark: 200 98% 39%;     /* cyan-600 */
```

> **초안**: 실제 렌더링 확인 후 조정 가능.

---

## 2. 타이포그래피

### 폰트 스택

| 용도 | 폰트 | 비고 |
|------|------|------|
| 한국어 + 영어 본문 & 헤드라인 | **Pretendard Variable** ✅ | jsDelivr CDN (variable font) |
| 코드 | JetBrains Mono | Google Fonts CDN |

### 타입 스케일 (Tailwind 기준)

| 용도 | 클래스 | 크기 |
|------|--------|------|
| 포스트 대제목 (h1) | `text-4xl font-bold` | 36px |
| 섹션 제목 (h2) | `text-2xl font-semibold` | 24px |
| 카드 제목 | `text-lg font-semibold` | 18px |
| 본문 | `text-base` | 16px |
| 캡션/메타 | `text-sm text-muted-foreground` | 14px |
| 코드 인라인 | `text-sm font-mono` | 14px |

---

## 3. 공간 & 레이아웃

### 컨테이너 너비

```
최대 너비: max-w-4xl (896px) — 포스트 본문
사이드바 포함: max-w-6xl (1152px) — 목록 페이지
전체 너비: max-w-7xl (1280px) — 홈/랜딩
```

### 그리드 시스템
- 포스트 목록: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 포스트 + 사이드바: `grid grid-cols-1 lg:grid-cols-[1fr_280px]`

---

## 4. 컴포넌트 인벤토리

### 레이아웃 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| `BaseLayout` | `layouts/BaseLayout.astro` | HTML 뼈대, head, GA 스크립트 |
| `SectionLayout` | `layouts/SectionLayout.astro` | 섹션 accent color 주입 |
| `PostLayout` | `layouts/PostLayout.astro` | 포스트 상세 레이아웃 (TOC, 댓글) |
| `Header` | `components/Header.astro` | 로고, 섹션 네비, 다크모드, 언어 전환 |
| `Footer` | `components/Footer.astro` | 링크, Easter egg 진입 요소 포함 |

### 콘텐츠 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| `PostCard` | `components/PostCard.astro` | 썸네일, 제목, 날짜, 섹션 뱃지, 태그 |
| `PostMeta` | `components/PostMeta.astro` | 날짜, 읽기 시간, 카테고리 |
| `TagBadge` | `components/TagBadge.astro` | 태그 표시 |
| `TagCloud` | `components/TagCloud.astro` | 빈도수 기반 크기 조절 태그 클라우드 |
| `TableOfContents` | `components/TOC.astro` | 포스트 목차 |
| `Pagination` | `components/Pagination.astro` | 이전/다음 페이지 |

### 인터랙티브 컴포넌트 (React Island)

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| `DarkModeToggle` | `components/DarkModeToggle.tsx` | 라이트/다크 전환 |
| `LanguageSwitcher` | `components/LanguageSwitcher.tsx` | 한/영 전환 |
| `SearchModal` | `components/SearchModal.tsx` | Pagefind 검색 모달 (Cmd+K) |
| `Comments` | `components/Comments.tsx` | Giscus 댓글 |

### 수익화 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| `AffiliateLink` | `components/AffiliateLink.astro` | 쿠팡/Amazon 제휴 링크 |
| `ProductCard` | `components/ProductCard.astro` | 제품 리뷰용 카드 (제휴 링크 포함) |
| `AdSlot` | `components/AdSlot.astro` | AdSense 광고 슬롯 (디자인 통합형) |

---

## 5. 다크모드 전략

shadcn/ui + Tailwind `dark:` 클래스 조합으로 구현.  
시스템 설정 감지 + 수동 토글 지원.

```ts
// 다크모드 상태 관리 (localStorage 기반)
const theme = localStorage.getItem('theme') ?? 'system'
// 'light' | 'dark' | 'system'
```

HTML `class` 토글 방식:
```html
<html class="dark"> ... </html>
```

---

## 6. 반응형 브레이크포인트 (Tailwind 기본)

| 이름 | 최소 너비 | 주요 변화 |
|------|----------|----------|
| `sm` | 640px | 1열 → 2열 카드 그리드 |
| `md` | 768px | 모바일 메뉴 → 데스크톱 네비 |
| `lg` | 1024px | 사이드바 등장 |
| `xl` | 1280px | 여백 확대 |

---

## 7. 시즌 & 스페셜 테마 시스템

`<html data-color-theme="...">` 속성과 OKLCH CSS 변수를 통해 기본 4종(`sage`, `ocean`, `sand`, `slate`) 외에 기간별 스페셜 테마 5종을 운영한다 (`src/config/theme.ts` 단일 관리, 상세 운영·확장 방법은 [`docs/seasonal-theme-guide.md`](seasonal-theme-guide.md) 참고).

### 테마 목록 및 자동 스케줄

| 테마 ID | 구분 | 기간 (로컬 시간) | 컬러 무드 & 모티프 |
|---------|------|-----------------|-------------------|
| `ocean` | 기본 (`defaultTheme`) | 비시즌 평상시 | 차분한 네이비 블루 |
| `sage` / `sand` / `slate` | 일반 예비 | 수동 지정 시 | 올리브 그린 / 웜 앰버 / 차콜 그레이 |
| `new-year` | 시즌 | 양력 `01-01 ～ 01-07` + 음력 설 연휴 | 한지 미색 · 청자 옥색 · 단청 주홍 일출 |
| `sakura` | 시즌 | `03-25 ～ 04-15` | 페일 로즈(Light) · 밤벚꽃 플럼(Dark) · 벚꽃잎 |
| `resort` | 시즌 | `07-15 ～ 08-20` | 화이트 샌드 · 터콰이즈 · 선셋 코랄 윤슬 |
| `thanksgiving` | 시즌 | `11-14 ～ 11-30` | 오트밀 크림 · 메이플 테라코타 · 하베스트 골드 단풍 |
| `christmas` | 시즌 | `12-15 ～ 12-31` | 성탄(Nativity) 린넨 아이보리 · 유대 밤하늘 인디고 · 베들레헴의 별과 구유 |

### 운영 및 디자인 가드레일
1. **초기화 무깜빡임(Zero-FOUC)**: `<head>` 인라인 스크립트에서 `?theme=` 미리보기(`sessionStorage`) → `overrideTheme` → 로컬 날짜/음력 설 스케줄 → `defaultTheme` 순으로 첫 페인트 전에 확정한다.
2. **방문자 UI 비노출**: 헤더의 미니멀함을 유지하기 위해 별도 테마 드롭다운을 두지 않으며, 운영자 점검 시 `?theme=<id>`(해제 시 `?theme=auto`) 쿼리를 사용한다.
3. **가독성 및 접근성**:
   - 모든 시즌 팔레트는 Light(`L ≈ 0.96～0.98`, 저채도)와 Dark(`L ≈ 0.11～0.14`) 쌍으로 구성해 본문 대비를 확보한다.
   - 시즌 장식은 `Logo.astro`(헤더 로고 모티프)와 `SeasonalHeroAccent.astro`(홈 Hero 한정)에만 적용하며, 아티클 본문과 `/vault` 섹션에는 노출하지 않는다.
   - `@media (prefers-reduced-motion: reduce)` 설정 시 모든 시즌 모션 애니메이션을 정지한다.

---

## 미결 결정 사항

모든 항목 결정 완료 ✅

| 항목 | 결정 |
|------|------|
| 섹션 accent color | 초안 유지 (amber/violet/cyan) — 실제 렌더링 확인 후 조정 |
| 헤드라인 폰트 | Noto Sans KR |
| 포스트 카드 스타일 | A — 썸네일 상단 |
| 헤더 스타일 | B — 스크롤 다운 시 숨김, 스크롤 업 시 노출 |
