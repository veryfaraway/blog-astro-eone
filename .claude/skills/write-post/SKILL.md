---
name: write-post
description: blog-astro-eone에 새 블로그 포스트(.md/.mdx)를 작성한다. 섹션·카테고리 선택, frontmatter 작성, 파일 경로 결정, Alert·YouTubeEmbed·MovieCard·Chart 등 MDX 컴포넌트 사용을 안내한다. 사용자가 "포스트 써줘", "블로그 글 작성", "글 초안" 등을 요청할 때 사용.
---

# 블로그 포스트 작성 (write-post)

`blog-astro-eone`에 새 포스트를 작성하는 스킬. 섹션 선택 → 파일 경로 결정 → frontmatter 작성 → 본문/컴포넌트 작성 순서로 진행한다.

> **상세 레퍼런스 (작성 전 반드시 확인):**
> - frontmatter 스키마·파일 경로·섹션 구조: `docs/post-writing-guide.md`
> - 컴포넌트 전체 목록·Props·MDX 사용법: `docs/astro-components.md`
>
> 이 스킬은 두 문서의 핵심 요약 + 작성 절차다. 세부 사항이 모호하면 위 문서를 직접 읽을 것.

---

## 작성 절차

1. **섹션 결정** — 글의 성격에 맞는 섹션 하나 선택 (아래 표). 모호하면 사용자에게 확인.
2. **파일 경로 결정** — `src/content/{섹션}/{lang}/{연도}/{slug}.{ext}`
   - 컴포넌트를 쓰면 **`.mdx`**, 순수 텍스트면 `.md`
   - `slug`: kebab-case 영문 2~5단어 (예: `claude-code-tips`)
   - 연도 폴더(`2026/`) 사용 권장
3. **frontmatter 작성** — 아래 스키마. `title`/`description`/`date`/`category`는 필수.
4. **본문 작성** — `.mdx`면 frontmatter 바로 아래 컴포넌트 import, 그 다음 본문.
5. **검증 체크리스트** 확인 후 마무리.

---

## 섹션 / 카테고리

| 섹션 | 용도 | 카테고리 예시 |
|------|------|--------------|
| `life` | 일상/종교/육아/자동차/아쿠아리움 | `주절주절`, `생활의발견`, `마굿간`, `Christian` |
| `money` | 경제/투자/절약/제품리뷰 (제휴) | `스노볼`, `자린고비`, `나만 당할 수 없지` |
| `culture` | 영화/드라마/게임/영어/여행 | `아는 척하기 딱 좋은`, `스포일러 지뢰찾기`, `비행기 값이 안 아까운` |
| `tools` | macOS/터미널/개발환경/앱 | `macOS`, `Tools` |
| `dev` | 개발/AI/Backend/Frontend/DevOps | `Backend`, `Frontend`, `DevOps`, `Trends`, `Data` |

카테고리는 짧고 재치 있는 한국어 (10자 이내 권장). 기존 예시에 없으면 새로 만들어도 됨.

---

## Frontmatter 스키마

```yaml
---
title: "포스트 제목 (한국어, 60자 이내 권장)"
description: "검색엔진/카드 요약 (120~160자 권장)"
date: YYYY-MM-DD
category: 카테고리명
tags:
  - "태그1"
  - "태그2"
draft: false              # 미완성이면 true (빌드에서 제외)
lang: ko                  # 'ko' | 'en', 기본 ko
thumbnail: "https://..."  # 선택. Cloudinary/Unsplash URL
series: "시리즈 이름"     # 선택. series + series_order 함께 지정 시 TOC·네비 자동 생성
series_order: 1           # 선택 (number)
affiliate: false          # money 섹션 전용. true 시 상단 제휴 공시 박스 자동 표시
---
```

(스키마 출처: `src/content.config.ts` — 모든 섹션 공통)

---

## 시작 템플릿

매번 같은 골격으로 시작하려면 아래 템플릿을 복사해 사용한다.

- `templates/post.ko.md` — 순수 텍스트 한국어 포스트 (컴포넌트 없음)
- `templates/post.ko.mdx` — 컴포넌트 포함 한국어 포스트
- `templates/post.en.mdx` — 영어 포스트

복사 후 frontmatter와 본문을 채우고, 미사용 컴포넌트 import는 지운다.

---

## 다국어(en) 작성 규칙

영어 포스트는 한국어판과 **동일 slug를 공유**한다 (i18n 라우팅이 slug로 짝을 맞춤).

- 경로만 `ko` → `en`으로 바뀐다: `src/content/dev/ko/2025/git-merge-vs-rebase.md` ↔ `src/content/dev/en/2025/git-merge-vs-rebase.md`
- **slug·섹션·연도 폴더·파일 확장자(.md/.mdx)를 한국어판과 동일하게 맞춘다.**
- frontmatter에서 바뀌는 것: `lang: en`, 그리고 `title`/`description`/`category`/`tags`를 영어로 번역.
  - `date`·`series`·`series_order`·`affiliate`는 한국어판과 동일하게 유지.
- 영어 단독 포스트(번역본 없음)도 가능 — 이때도 경로·확장자 규칙은 동일.
- 본문 컴포넌트(`MovieCard`, `Chart` 등)는 그대로 재사용하되, `caption`·`title` 등 표시 텍스트는 영어로.

---

## 코드 블록 언어 태그 (Shiki)

코드펜스(` ``` `) 언어 태그는 Shiki가 인식하는 소문자 표준 식별자를 써야 한다. 틀린 표기를 쓰면 문법 강조 없이 plaintext로 조용히 폴백되고, `pnpm dev`/`pnpm build` 시 `[Shiki] The language "X" doesn't exist` 경고가 뜬다.

**틀리기 쉬운 것들 (실제로 반복 발생):**

| 쓰기 쉬운 잘못된 태그 | 올바른 태그 | 비고 |
|---|---|---|
| ` ```Dockerfile ` | ` ```dockerfile ` | 대소문자 구분함 — 반드시 소문자 |
| ` ```ApacheConf ` | ` ```apache ` | |
| ` ```gradle ` | ` ```groovy ` | gradle 전용 문법이 없음. Gradle 기본 DSL은 Groovy 기반이라 groovy로 대체 |
| ` ```gitignore ` | (대안 없음, 그대로 두거나 태그 생략) | gitignore 전용 문법 자체가 Shiki에 없어 경고는 피할 수 없음 |

일반 규칙: 언어 태그는 **소문자**로 쓰고, 확신이 없으면 실제 언어 정체성(예: Gradle 빌드 파일 → groovy/kotlin)으로 태그를 단다. plaintext로 폴백돼도 빌드는 깨지지 않지만, 강조가 필요한 코드는 정확한 태그를 쓸 것.

---

## MDX 컴포넌트 빠른 참조

> `.md`에서는 컴포넌트 import 불가 → 컴포넌트가 필요하면 `.mdx`로 작성.
> import는 frontmatter 바로 아래, 본문 전에. **사용하지 않는 컴포넌트는 import 금지.**
> `@/`는 `src/`의 alias. 모든 컴포넌트는 `@/components/...`.

### 전 섹션 공통

```mdx
import Alert from '@/components/Alert.astro';
<Alert type="info">기본 안내</Alert>
<Alert type="warning" title="주의">제목 있는 경고</Alert>
<!-- type: info | warning | success | danger | tip -->

import YouTubeEmbed from '@/components/YouTubeEmbed.astro';
<YouTubeEmbed id="dQw4w9WgXcQ" title="영상 제목" />
<!-- id = watch?v= 뒤의 값 -->

import CloudinaryImage from '@/components/CloudinaryImage.astro';
<CloudinaryImage publicId="v123/photo.jpg" alt="설명" width={1200} height={800} />
<!-- width+height 함께 지정 시 CLS 방지. PUBLIC_CLOUDINARY_CLOUD_NAME 필요 -->

import ImageRow from '@/components/ImageRow.astro';
<ImageRow cols={3} caption="캡션(선택)">
  ![사진1](https://example.com/a.jpg)
  ![사진2](https://example.com/b.jpg)
  ![사진3](https://example.com/c.jpg)
</ImageRow>
<!-- cols: 2(기본)|3|4, 모바일 자동 1열. 이미지 전용 — MovieCard 등 카드는 넣지 말 것 -->

import Chart from '@/components/Chart.astro';
<Chart
  type="bar"  /* bar | line | pie | doughnut | radar */
  caption="분기별 매출"
  data={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{ label: '매출', data: [10, 20, 15, 30] }],
  }}
/>
<!-- Chart.js 형식 data. 직렬화 실패 시 폴백 테이블 자동 표시 -->
```

### culture 섹션 (영화/인물)

```mdx
import MovieCard from '@/components/MovieCard.astro';
<MovieCard title="기생충" imdbId="tt6751668" />
<!-- imdbId는 tt로 시작. 빌드 타임 OMDb fetch (PUBLIC_OMDB_API_KEY) -->

import PersonCard from '@/components/PersonCard.astro';
import PersonInline from '@/components/PersonInline.astro';
<PersonCard name="봉준호" role="감독" imdbId="nm0188744" />
<PersonInline name="송강호" role="주연" imdbId="nm1817631" />가 출연한 작품.
<!-- 인물 imdbId는 nm으로 시작 -->

import BookCard from '@/components/BookCard.astro';
<BookCard title="나미야 잡화점의 기적" isbn13="9788901194492" comment="추천 이유 한두 줄" coupangHref="https://link.coupang.com/..." />
<!-- isbn13은 하이픈 없이 13자리. 빌드 타임 알라딘 Open API fetch (PUBLIC_ALADIN_TTB_KEY, includeKey=1로 제휴 링크 자동 생성 — 따로 링크 안 만들어도 됨). 도서 소개 글에서 사용.
     comment는 카드 안에 들어가는 짧은 추천 코멘트 — 목록에서 "1. 『제목』 — 설명"처럼 따로 서술하지 말고 comment로 통일할 것 (중복 방지).
     정확한 ISBN13을 모르면 isbn13=""로 비워둘 것 — 알라딘 API가 없는 ISBN에도 엉뚱한 책을 반환하는 경우가 있어, 비워야 title만 표시하는 안전한 폴백으로 동작함.
     알라딘/쿠팡 버튼은 오른쪽 고정폭 컬럼에 세로로 쌓이고, 동일한 스타일 + 브랜드 컬러 배지로 대등하게 표시됨(어느 한쪽이 우선순위처럼 보이지 않게).
     레이아웃은 2행 — 1행(표지 | 정보 | 버튼) + 2행(comment가 카드 전체 폭). comment가 없으면 1행만 나오므로 카드 높이가 그대로다. comment는 잘리지 않고 전부 노출되니 2~3문장 이내로 쓸 것.
     카드 자체엔 면책 문구 없음 → 구매 링크를 실제로 쓰는 포스트는 frontmatter에 affiliate: true 설정할 것.
     상/하, 1권/2권처럼 분권된 책은 <div class="grid gap-3 md:grid-cols-2 items-start">로 감싸 BookCard 두 개를 나란히 배치 (comment는 대표 권에만).
     items-start를 빼면 comment 있는 카드 높이에 맞춰 옆 카드가 늘어나 빈 공간이 생김 -->
```

### money 섹션 (수익화)

```mdx
import AffiliateLink from '@/components/AffiliateLink.astro';
<AffiliateLink href="https://link.coupang.com/..." provider="coupang" />
<!-- provider: coupang | amazon | 11st | other. 제휴 글은 frontmatter에 affiliate: true.
     provider별로 버튼 배경색(실제 브랜드 컬러)과 파비콘이 자동으로 붙어서, 한 글에 쿠팡/Amazon이 섞여도 색으로 구분됨. other는 색상 없이 사이트 기본 스타일 -->

import CoupangProductCard from '@/components/CoupangProductCard.astro';
<CoupangProductCard href="https://link.coupang.com/a/파트너스사이트에서변환한링크" title="상품명" />
<!-- 권장: 쿠팡파트너스(partners.coupang.com) 사이트에서 상품을 직접 검색해 "링크 생성"으로
     변환한 URL을 href로 지정. API 호출이 전혀 발생하지 않아 가장 안전함. title도 함께 지정할 것(캐시가 없어 자동 표시 불가).
     productId+itemId(쿠팡 상품 URL에서 확인 가능)나 keyword 검색은 pnpm coupang 실행 시 API를 호출하므로
     href로 해결이 안 될 때만 예외적으로 사용 — 검색 API 호출 한도가 시간당 수십 회로 매우 낮고 초과 3회 누적 시 파트너스 계정이 제한됨.
     인증에 COUPANG_ACCESS_KEY/COUPANG_SECRET_KEY 필요(HMAC 서명, PUBLIC_ 접두사 금지, pnpm coupang 스크립트 전용) -->

import AdSlot from '@/components/AdSlot.astro';
<AdSlot slot="inArticle" />
```

### 특수

```mdx
import ClockChart from '@/components/ClockChart.astro';
<ClockChart caption="거래 시간대" segments={[
  { start: 23.5, end: 6, label: '본장', color: '#22c55e' },
]} />
<!-- start/end: 0~24 소수. end<start면 자정 넘는 구간 자동 처리 -->
```

> `Callout.astro`는 폐기 예정 — **신규 포스트에서 사용 금지**, `Alert.astro`로 대체.
> 컴포넌트 전체 목록·Props 상세는 `docs/astro-components.md` 참조.

---

## 설치/설정 가이드 재사용

특정 도구의 설치 절차가 이미 레퍼런스 포스트로 정리되어 있으면, 본문에 설치 과정을 다시 쓰지 말고 링크로 참조한다 (`docs/post-writing-guide.md`의 "설치/설정 가이드 재사용" 표 참고).

- **Homebrew 설치**가 필요한 포스트(예: `brew install ...`로 패키지를 설치하는 글)를 쓸 때는 설치 절차를 설명하지 말고 [`/tools/install-homebrew-2026`](../../src/content/tools/ko/2026/install-homebrew-2026.md)를 링크로 안내할 것.

---

## 검증 체크리스트

- [ ] 파일 경로가 `src/content/{섹션}/{lang}/{연도}/{slug}.{md|mdx}` 규칙에 맞는가
- [ ] 컴포넌트를 사용하면 확장자가 `.mdx`인가
- [ ] frontmatter 필수 필드(`title`, `description`, `date`, `category`) 모두 있는가
- [ ] `description`이 120~160자 권장 범위인가 (SEO)
- [ ] import한 컴포넌트를 본문에서 실제로 사용하는가 (미사용 import 금지)
- [ ] `Callout` 대신 `Alert`를 사용했는가
- [ ] 완성 전이면 `draft: true`로 두었는가
- [ ] money 제휴 글이면 `affiliate: true`인가
- [ ] `series` 사용 시 `series_order`도 함께 지정했는가
- [ ] 코드 블록 언어 태그가 Shiki 표준 소문자 식별자인가 (`Dockerfile`→`dockerfile`, `ApacheConf`→`apache`, `gradle`→`groovy` 등)
- [ ] `CoupangProductCard`를 썼다면 `href`(파트너스 사이트에서 변환한 링크)+`title` 방식을 우선 사용했는가 — `productId`/`itemId`/`keyword`는 API 호출이 필요해 href로 안 될 때만
- [ ] Homebrew 설치가 필요한 글이면 설치 절차를 다시 쓰지 않고 `/tools/install-homebrew-2026`을 링크했는가
