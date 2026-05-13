# 콘텐츠 마이그레이션 체크리스트

> 기존 3개 블로그 포스트를 blog-astro-eone으로 이전하는 작업 추적 문서  
> 총 예상 포스트: **general 72개 + tech ~93개 + culture ~47개 ≒ 212개**

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
section: general | tech | culture        # 섹션 구분
category: ""                              # 섹션 내 카테고리
tags: []
lang: ko | en
thumbnail: ""                             # 선택 사항
draft: false
affiliate: false                          # 제휴 링크 포함 여부 (general)
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

## Section 1 — general (Hugo → Astro)

**원본**: `blog-general-hugo-mainroad/content/post/`  
**목적지**: `blog-astro-eone/src/content/general/ko/`  
**URL 변경**: `mustardseed.eone.one/post/[slug]` → `blog.eone.one/general/[slug]`

### 카테고리별 현황

| 카테고리 (Hugo) | 포스트 수 | 이전 상태 | 비고 |
|----------------|----------|----------|------|
| `frugal` (절약/경제/투자) | 26 | ⬜ 미이전 | |
| `christian` (종교) | 20 | ⬜ 미이전 | |
| `ev` (전기차/자동차) | 10 | ⬜ 미이전 | |
| `gosip` (일상/잡담) | 7 | ⬜ 미이전 | |
| `tmi` (TMI/리뷰) | 3 | ⬜ 미이전 | |
| `aqualife` (아쿠아리움) | 2 | ⬜ 미이전 | |
| `baby` (육아) | 2 | ⬜ 미이전 | |
| `examples` (예제) | 2 | ⬜ 건너뜀 | draft, 실제 포스트 아님 |
| **합계** | **72** | | |

### 공통 체크사항
- [ ] Hugo shortcode (`{{< affiliate >}}` 등) → Astro 컴포넌트로 변환
- [ ] 이미지 `/static/` → `/public/` 이동
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## Section 2 — tech (Eleventy → Astro)

**원본**: `eleventy/blog-eleventy-tech-ai/src/posts/`  
**목적지**: `blog-astro-eone/src/content/tech/ko/`  
**URL 변경**: `burn.eone.one/posts/[slug]` → `blog.eone.one/tech/[slug]`

### 연도별 현황

| 연도 | 포스트 수 | 이전 상태 |
|------|----------|----------|
| 2022 | 13 | ⬜ 미이전 |
| 2023 | 7 | ⬜ 미이전 |
| 2024 | 13 | ⬜ 미이전 |
| 2025 | 13 | ⬜ 미이전 |
| 2026 | 47 | ⬜ 미이전 |
| **합계** | **93** | |

### 공통 체크사항
- [ ] `layout` 필드 제거
- [ ] `slug` 필드 → 파일명으로 변환
- [ ] 썸네일 Unsplash URL 유지 여부 결정 (외부 링크 vs 로컬 저장)
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
| 2024 | 0 | - |
| 2025 | 0 | - |
| 2026 | 36 | ⬜ 미이전 |
| **합계** | **47** | |

### 공통 체크사항
- [ ] `layout` 필드 제거
- [ ] `slug` 필드 → 파일명으로 변환
- [ ] 영화 카드 등 특수 컴포넌트 → Astro 컴포넌트로 재구현 필요 여부 검토
- [ ] 301 리다이렉트 규칙 추가 (`netlify.toml`)

---

## 이미지 마이그레이션

| 원본 위치 | 이전 위치 | 상태 |
|----------|----------|------|
| `blog-general-hugo-mainroad/static/` | `blog-astro-eone/public/images/general/` | ⬜ |
| `blog-eleventy-tech-ai/src/assets/` | `blog-astro-eone/public/images/tech/` | ⬜ |
| `blog-eleventy-popcorn/src/assets/` | `blog-astro-eone/public/images/culture/` | ⬜ |

---

## 301 리다이렉트 규칙 (`netlify.toml`)

```toml
# general (Hugo)
[[redirects]]
  from = "https://mustardseed.eone.one/*"
  to = "https://blog.eone.one/general/:splat"
  status = 301
  force = true

# tech (Eleventy)
[[redirects]]
  from = "https://burn.eone.one/*"
  to = "https://blog.eone.one/tech/:splat"
  status = 301
  force = true

# culture (Eleventy)
[[redirects]]
  from = "https://popcorn.eone.one/*"
  to = "https://blog.eone.one/culture/:splat"
  status = 301
  force = true
```

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
