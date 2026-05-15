# 콘텐츠 마이그레이션 체크리스트

> 기존 3개 블로그 포스트를 blog-astro-eone으로 이전하는 작업 추적 문서  
> 총 예상 포스트: **life ~44개 + money ~26개 + culture ~47개 + tools ~45개 + dev ~48개 ≒ 210개**

---

## Frontmatter 변환 매핑

### Hugo (general) → Astro

| Hugo 필드 | Astro 필드 | 비고 |
|-----------|-----------|------|
| `title` | `title` | 그대로 |
| `description` | `description` | 그대로 |
| `date` | `date` | 형식 확인 (YYYY-MM-DD) |
| `categories` | `section` | `general` 고정 + 서브카테고리로 매핑 |
| `tags` | `tags` | 그대로 |
| `draft` | `draft` | 그대로 |
| _(없음)_ | `lang` | `ko` 기본값 |
| _(없음)_ | `thumbnail` | 이미지 경로 수동 확인 필요 |

### Eleventy → Astro

| Eleventy 필드 | Astro 필드 | 비고 |
|--------------|-----------|------|
| `title` | `title` | 그대로 |
| `description` | `description` | 그대로 |
| `date` | `date` | 그대로 |
| `slug` | 파일명으로 대체 | Astro는 파일명이 slug |
| `category` | `category` | 그대로 |
| `tags` | `tags` | 그대로 |
| `draft` | `draft` | 그대로 |
| `lang` | `lang` | 그대로 |
| `thumbnail` | `thumbnail` | 경로 변환 필요 (절대→상대 또는 public/) |
| `layout` | _(제거)_ | Astro에서 불필요 |

### Astro 목표 Frontmatter 스키마

```yaml
---
title: ""
description: ""
date: YYYY-MM-DD
section: life | money | culture | tools | dev   # 섹션 구분
category: ""                                     # 섹션 내 카테고리
tags: []
lang: ko | en
thumbnail: ""                                    # 선택 사항
draft: false
affiliate: false                                 # 제휴 링크 포함 여부 (money)
---
```

---

## 변환 스크립트 작업

- [ ] Hugo frontmatter → Astro frontmatter 변환 스크립트 작성 (`scripts/migrate-hugo.ts`)
- [ ] Eleventy frontmatter → Astro frontmatter 변환 스크립트 작성 (`scripts/migrate-eleventy.ts`)
- [ ] 이미지 경로 일괄 수정 스크립트 (`scripts/fix-image-paths.ts`)
- [ ] Hugo shortcode 변환 처리 (affiliate, mermaid, chart 등 → Astro 컴포넌트)
- [ ] 변환 후 전체 frontmatter 유효성 검사 스크립트

---

## Section 1 — life (Hugo → Astro)

**원본**: `blog-general-hugo-mainroad/content/post/` 중 christian, gosip, tmi, baby, aqualife, ev  
**목적지**: `blog-astro-eone/src/content/life/ko/`  
**URL 변경**: `mustardseed.eone.one/post/[slug]` → `blog.eone.one/life/[slug]`

### 카테고리별 현황

| 카테고리 (Hugo) | 포스트 수 | 이전 상태 | 비고 |
|----------------|----------|----------|------|
| `christian` (종교/신앙) | 20 | ⬜ 미이전 | |
| `ev` (전기차/자동차) | 10 | ⬜ 미이전 | |
| `gosip` (일상/잡담) | 7 | ⬜ 미이전 | |
| `tmi` (TMI) | 3 | ⬜ 미이전 | |
| `baby` (육아) | 2 | ⬜ 미이전 | |
| `aqualife` (아쿠아리움) | 2 | ⬜ 미이전 | |
| `examples` (예제) | 2 | ⏭️ 건너뜀 | draft, 실제 포스트 아님 |
| **합계** | **~44** | | |

### 공통 체크사항
- [ ] Hugo shortcode 변환 처리
- [ ] 이미지 `/static/` → `/public/images/life/` 이동
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## Section 2 — money (Hugo → Astro)

**원본**: `blog-general-hugo-mainroad/content/post/frugal/`  
**목적지**: `blog-astro-eone/src/content/money/ko/`  
**URL 변경**: `mustardseed.eone.one/post/[slug]` → `blog.eone.one/money/[slug]`

### 카테고리별 현황

| 카테고리 (Hugo) | 포스트 수 | 이전 상태 | 비고 |
|----------------|----------|----------|------|
| `frugal` (경제/투자/절약/제품리뷰) | 26 | ⬜ 미이전 | 제휴링크 포함 포스트 |
| **합계** | **26** | | |

### 공통 체크사항
- [ ] Hugo `{{< affiliate >}}` shortcode → `AffiliateLink.astro` 컴포넌트 변환
- [ ] 이미지 `/static/` → `/public/images/money/` 이동
- [ ] frontmatter에 `affiliate: true` 플래그 추가 (제휴 링크 포함 포스트)
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## Section 3 — culture (Eleventy → Astro)

**원본**: `eleventy/blog-eleventy-popcorn/src/posts/`  
**목적지**: `blog-astro-eone/src/content/culture/ko/`  
**URL 변경**: `popcorn.eone.one/posts/[slug]` → `blog.eone.one/culture/[slug]`

### 연도별 현황

| 연도 | 포스트 수 | 이전 상태 |
|------|----------|----------|
| 2021 | 5 | ⬜ 미이전 |
| 2022 | 6 | ⬜ 미이전 |
| 2026 | 36 | ⬜ 미이전 |
| **합계** | **47** | |

### 카테고리 매핑

| Eleventy 카테고리 | Astro category |
|-----------------|---------------|
| 나만 당할 수 없지 | movie-review |
| 스포일러 지뢰찾기 | spoiler |
| 여기도 한국이었어? | travel |
| Tutorial | tutorial |

### 공통 체크사항
- [ ] `layout` 필드 제거
- [ ] `slug` 필드 → 파일명으로 변환
- [ ] 영어 학습 포스트(태그: 영어, 73개) 별도 카테고리 `english` 로 분류 검토
- [ ] 영화 카드 등 특수 컴포넌트 → Astro 컴포넌트 재구현 여부 검토
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## Section 4 — tools (Eleventy → Astro)

**원본**: `eleventy/blog-eleventy-tech-ai/src/posts/` 중 category: Tools  
**목적지**: `blog-astro-eone/src/content/tools/ko/`  
**URL 변경**: `burn.eone.one/posts/[slug]` → `blog.eone.one/tools/[slug]`

### 현황

| 카테고리 | 포스트 수 | 이전 상태 | 주요 태그 |
|---------|----------|----------|---------|
| Tools | 45 | ⬜ 미이전 | macOS, tmux, iterm2, karabiner, git |
| **합계** | **45** | | |

### 공통 체크사항
- [ ] `layout` 필드 제거
- [ ] `slug` 필드 → 파일명으로 변환
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## Section 5 — dev (Eleventy → Astro)

**원본**: `eleventy/blog-eleventy-tech-ai/src/posts/` 중 category: Backend, Frontend, DevOps, Data, Trends  
**목적지**: `blog-astro-eone/src/content/dev/ko/`  
**URL 변경**: `burn.eone.one/posts/[slug]` → `blog.eone.one/dev/[slug]`

### 카테고리별 현황

| 카테고리 | 포스트 수 | 이전 상태 |
|---------|----------|----------|
| Trends (AI/빅테크 뉴스) | 13 | ⬜ 미이전 |
| Backend | 15 | ⬜ 미이전 |
| Frontend | 10 | ⬜ 미이전 |
| DevOps | 6 | ⬜ 미이전 |
| Data | 4 | ⬜ 미이전 |
| **합계** | **~48** | |

### 공통 체크사항
- [ ] `layout` 필드 제거
- [ ] `slug` 필드 → 파일명으로 변환
- [ ] 썸네일 Unsplash URL 유지 여부 결정
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## 이미지 마이그레이션

| 원본 위치 | 이전 위치 | 상태 |
|----------|----------|------|
| `blog-general-hugo-mainroad/static/` (christian/gosip 등) | `public/images/life/` | ⬜ |
| `blog-general-hugo-mainroad/static/` (frugal) | `public/images/money/` | ⬜ |
| `blog-eleventy-popcorn/src/assets/` | `public/images/culture/` | ⬜ |
| `blog-eleventy-tech-ai/src/assets/` (Tools) | `public/images/tools/` | ⬜ |
| `blog-eleventy-tech-ai/src/assets/` (dev) | `public/images/dev/` | ⬜ |

---

## 301 리다이렉트 규칙 (`netlify.toml`)

```toml
# mustardseed → life / money (카테고리별 분기 불가, 와일드카드로 처리)
# frugal 카테고리는 /money, 나머지는 /life 로 분기가 필요하므로 개별 규칙 필요
[[redirects]]
  from = "https://mustardseed.eone.one/post/frugal/*"
  to = "https://blog.eone.one/money/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://mustardseed.eone.one/*"
  to = "https://blog.eone.one/life/:splat"
  status = 301
  force = true

# burn → tools / dev (카테고리별 분기 불가, 와일드카드로 처리)
# Tools 카테고리는 /tools, 나머지는 /dev 로 분기가 필요하므로 개별 규칙 필요
[[redirects]]
  from = "https://burn.eone.one/*"
  to = "https://blog.eone.one/dev/:splat"
  status = 301
  force = true

# popcorn → culture
[[redirects]]
  from = "https://popcorn.eone.one/*"
  to = "https://blog.eone.one/culture/:splat"
  status = 301
  force = true
```

> **주의**: burn.eone.one의 Tools vs dev 분기는 와일드카드로 처리 불가 → Phase 6에서 포스트별 slug 매핑 작업 필요

> **주의**: URL slug가 달라지는 경우 위 와일드카드 리다이렉트로 커버 안 됨 → 해당 포스트는 개별 규칙 추가 필요

---

## 최종 검증 체크리스트

- [ ] 전체 포스트 렌더링 오류 없음 확인
- [ ] 기존 도메인 → 새 도메인 301 리다이렉트 동작 확인
- [ ] Google Search Console에서 크롤링 오류 없음 확인
- [ ] 이미지 깨짐 없음 확인
- [ ] 제휴 링크 정상 동작 확인
- [ ] draft 포스트가 실서버에 노출되지 않음 확인

---

## 이전 상태 범례
- ⬜ 미이전
- 🔄 진행 중
- ✅ 완료
- ⏭️ 건너뜀 (불필요)
