# 포스트 작성 가이드

> **Claude 작업 지침:** 포스트 작성, frontmatter 수정, 파일 경로 결정 전 이 문서를 먼저 확인할 것.
> `/write-post` 스킬도 이 문서를 기준으로 동작한다.

---

## 섹션 구조

```
blog.eone.one/
├── /life/      # 일상/종교/육아/자동차/아쿠아리움
├── /money/     # 경제/투자/절약/제품리뷰 (제휴 수입)
├── /culture/   # 영화/드라마/게임/영어/여행
├── /tools/     # macOS/터미널/개발환경/앱
└── /dev/       # 개발/AI/Backend/Frontend/DevOps
```

### 카테고리 예시 (섹션별)

| 섹션 | 카테고리 예시 |
|------|--------------|
| `life` | `주절주절`, `생활의발견`, `마굿간`, `Christian` |
| `money` | `스노볼`, `자린고비`, `나만 당할 수 없지` |
| `culture` | `아는 척하기 딱 좋은`, `스포일러 지뢰찾기`, `비행기 값이 안 아까운`, `컨트롤이 안 되면 머리로` |
| `tools` | `macOS`, `Tools` |
| `dev` | `Backend`, `Frontend`, `DevOps`, `Trends`, `Data` |

카테고리는 짧고 재치 있는 한국어 문구 (10자 이내 권장). 기존 예시에 없으면 새로 만들어도 됨.

---

## 파일 경로 규칙

```
src/content/{섹션}/ko/{연도}/{slug}.mdx   # 기본 (컴포넌트 포함 또는 권장)
src/content/{섹션}/ko/{slug}.md           # 컴포넌트 불필요한 단순 포스트
src/content/{섹션}/en/{연도}/{slug}.mdx   # 영어 버전
```

- **slug**: kebab-case 영문, 2~5단어 (예: `claude-code-tips`, `japanese-spa-trip`)
- 컴포넌트 사용 시 반드시 `.mdx`
- 연도 폴더(`2026/`) 사용 권장

---

## Frontmatter 스키마

### 공통 (life / culture / tools / dev)

```yaml
---
title: "포스트 제목 (한국어, 60자 이내 권장)"
description: "검색엔진/카드에 표시될 요약 (120~160자 권장)"
date: YYYY-MM-DD
category: 카테고리명
tags:
  - "태그1"
  - "태그2"
draft: false              # 미완성이면 true
lang: ko                  # 'ko' | 'en', 기본값 ko
thumbnail: "https://..."  # 선택. Unsplash URL 또는 실제 이미지 URL
series: "시리즈 이름"     # 선택. 시리즈물일 때만
series_order: 1           # 선택. series와 함께 지정 (number)
---
```

### money 섹션 전용 추가 필드

```yaml
affiliate: true   # 기본값 false. true 시 포스트 상단에 제휴 공시 박스 자동 표시
```

---

## MDX 컴포넌트 사용법

> `.md` 파일에서는 컴포넌트 import 불가. 컴포넌트가 필요하면 `.mdx`로 작성.
> import는 frontmatter 바로 아래, 본문 시작 전에 작성. 사용하지 않는 컴포넌트 import 금지.

### Alert — 강조 박스

```mdx
import Alert from '@/components/Alert.astro';

<Alert type="info">기본 안내 메시지</Alert>
<Alert type="warning" title="주의사항">제목 있는 경고</Alert>
<Alert type="success" title="완료">성공 메시지</Alert>
<Alert type="danger">위험 경고</Alert>
<Alert type="tip">팁이나 힌트</Alert>
```

| Prop | 타입 | 기본값 |
|------|------|--------|
| `type` | `'info' \| 'warning' \| 'success' \| 'danger' \| 'tip'` | `'info'` |
| `title` | `string` | (생략 가능) |

> **`Callout.astro`는 폐기 예정** — 신규 포스트에서는 `Alert.astro` 사용.

---

### YouTubeEmbed — YouTube 삽입

```mdx
import YouTubeEmbed from '@/components/YouTubeEmbed.astro';

<YouTubeEmbed id="dQw4w9WgXcQ" title="영상 접근성 제목" />
```

ID는 `watch?v=` 뒤의 값. 예: `https://youtube.com/watch?v=abc123` → `id="abc123"`

---

### MovieCard — 영화 정보 카드 (culture 섹션)

```mdx
import MovieCard from '@/components/MovieCard.astro';

<MovieCard title="기생충" imdbId="tt6751668" />
<MovieCard title="기생충" imdbId="tt6751668" poster="https://..." />
```

빌드 타임에 OMDb API로 평점·장르·줄거리 자동 fetch. API 키 없어도 title+poster로 graceful 렌더링.

---

### PersonCard / PersonInline — 인물 카드 (culture 섹션)

```mdx
import PersonCard from '@/components/PersonCard.astro';
import PersonInline from '@/components/PersonInline.astro';

<!-- 카드: 감독·배우를 나란히 나열할 때 -->
<div class="flex flex-wrap gap-3">
  <PersonCard name="봉준호" role="감독" imdbId="nm0188744" />
  <PersonCard name="송강호" role="주연" imdbId="nm1817631" />
</div>

<!-- 인라인: 본문 텍스트 안에 자연스럽게 삽입 -->
<PersonInline name="봉준호" role="감독" imdbId="nm0188744" />가 연출한 작품.
```

IMDb 인물 ID는 `nm`으로 시작. 예: `imdb.com/name/nm0188744` → `nm0188744`

---

### CloudinaryImage — 반응형 이미지

```mdx
import CloudinaryImage from '@/components/CloudinaryImage.astro';

<CloudinaryImage publicId="v123/photo.jpg" alt="사진 설명" />
<CloudinaryImage publicId="v123/photo.jpg" alt="사진 설명" width={1200} height={800} />
```

`width` / `height` 모두 지정 시 레이아웃 시프트(CLS) 방지.

---

### ImageRow — 이미지 나란히 배치

```mdx
import ImageRow from '@/components/ImageRow.astro';

<ImageRow cols={3} caption="캡션 (선택)">
  ![사진1](https://example.com/a.jpg)
  ![사진2](https://example.com/b.jpg)
  ![사진3](https://example.com/c.jpg)
</ImageRow>
```

`cols`: `2`(기본) | `3` | `4`. 모바일에서 자동 1열 폴백. 자식으로 마크다운 이미지·`<img>`·`CloudinaryImage` 사용 가능 (카드 컴포넌트는 넣지 말 것).

---

### AffiliateLink — 제휴 링크 버튼 (money 섹션)

```mdx
import AffiliateLink from '@/components/AffiliateLink.astro';

<AffiliateLink href="https://link.coupang.com/..." provider="coupang" />
<AffiliateLink href="https://amzn.to/..." provider="amazon" text="Amazon에서 보기" />
<AffiliateLink href="https://example.com" provider="other" text="구매 링크" />
```

`affiliate: true` frontmatter 설정 시 포스트 상단 제휴 공시 박스(`AffiliateNotice`)는 자동 렌더링 — MDX에서 직접 import 불필요.

---

### AdSlot — 광고 슬롯

```mdx
import AdSlot from '@/components/AdSlot.astro';

<AdSlot slot="inArticle" />
```

---

## 주의사항

- `series` + `series_order` 함께 지정 시 시리즈 TOC·이전/다음 네비게이션 자동 생성
- `draft: true` 설정 시 빌드 결과에서 제외
- 컴포넌트 전체 목록 및 Props 상세: [`docs/astro-components.md`](astro-components.md)
