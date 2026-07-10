# eone blog

> 일상 · 경제 · 문화 · 개발 · 도구에 관한 이야기

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/veryfaraway)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-ff5e5b?style=flat-square&logo=kofi&logoColor=white)](https://ko-fi.com/eoneone)

**[blog.eone.one](https://blog.eone.one)**

---

## 섹션

| 섹션 | 주제 |
|------|------|
| **Life** | 일상 · 종교 · 육아 · 자동차 · 아쿠아리움 |
| **Money** | 경제 · 투자 · 절약 · 제품 리뷰 |
| **Culture** | 영화 · 영어 · 여행 |
| **Tools** | macOS · 터미널 · 개발 환경 |
| **Dev** | 개발 · AI · Backend · Frontend · DevOps |

---

## 기술 스택

```
Framework   Astro (SSG)
UI          React island + shadcn/ui + Tailwind CSS v4
Typography  @tailwindcss/typography
Font        Pretendard Variable · Yeongwol · SchoolSafeAdventurer · JetBrains Mono
Search      Pagefind
Comments    Giscus (GitHub Discussions)
Analytics   Google Analytics 4
Deploy      Netlify
```

---

## 기능

### 콘텐츠
- **시리즈** — `series` / `series_order` front matter로 연작 포스트 자동 연결 (TOC + 이전/다음 편 네비게이션)
- **다국어(i18n)** — 한국어(기본) + 영어, 같은 slug 파일을 `ko/` · `en/` 폴더에 배치하면 언어 스위처 자동 활성화
- **Callout** — MDX 포스트에서 `<Callout type="info|warning|success|danger|tip">` 컴포넌트 사용

### 포스트 뷰
- **TOC** — `h2` · `h3` 기반 목차, lg 화면 우측 sticky
- **읽기 시간** · **이전/다음 포스트** 네비게이션
- **태그 시스템** — 태그 워드 클라우드 (빈도수 기반 크기)
- **Giscus 댓글** — GitHub Discussions 기반, 다크모드 자동 연동

### SEO
- **JSON-LD** — Article + BreadcrumbList 구조화 데이터
- **hreflang** — 다국어 페이지 간 alternate 링크 + `x-default`
- **사이트맵** — `@astrojs/sitemap` 자동 생성 (Vault 제외)

### 기타
- **전체 검색** — Pagefind, `Cmd+K` 단축키
- **다크모드** — 시스템 설정 연동 + 수동 토글
- **컬러 테마** — 4가지 테마 제공 (`sage` · `ocean` · `sand` · `slate`), `src/config/theme.ts` 한 줄 수정 후 배포로 전환
- **◈ Vault** — 숨겨진 주식 히트맵 (Easter egg 진입, `noindex`), 셀 크기는 섹터 내 상대 비중 기준

---

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/         # Header, Footer
│   ├── Callout.astro   # MDX 알림 박스
│   ├── SeriesTOC.astro # 시리즈 목차
│   ├── SeriesNav.astro # 시리즈 이전/다음 편
│   ├── TOC.astro       # 포스트 내 목차
│   └── ...
├── content/
│   ├── {section}/
│   │   ├── ko/         # 한국어 포스트 (.md / .mdx)
│   │   │   └── YYYY/   # (선택) 연도별 서브디렉토리 — slug는 파일명 기준
│   │   └── en/         # 영어 포스트 (.md / .mdx)
│   └── content.config.ts
├── layouts/
│   ├── BaseLayout.astro
│   └── PostLayout.astro
├── pages/
│   ├── [section]/[slug].astro   # 한국어 포스트
│   ├── en/[section]/[slug].astro # 영어 포스트
│   ├── blog/                    # 전체 목록 (페이지네이션)
│   ├── tags/
│   ├── about.astro
│   └── vault/                   # 히트맵 (noindex)
└── styles/
    └── global.css
```

---

## 콘텐츠 작성

### 기본 포스트 (`.md`)

```yaml
---
title: "제목"
description: "설명"
date: 2026-05-19
category: 카테고리명
tags: [태그1, 태그2]
thumbnail: "https://..."
lang: ko          # ko | en
draft: false
---
```

### 시리즈 포스트

```yaml
series: "시리즈 제목"
series_order: 1
```

같은 섹션 내 `series` 값이 같은 포스트가 2개 이상이면 SeriesTOC · SeriesNav가 자동 렌더링됩니다.

### 강조 박스가 필요한 포스트 (`.mdx`)

```mdx
import Alert from '@/components/Alert.astro';

<Alert type="info" title="제목">내용</Alert>
<Alert type="warning">경고</Alert>
<Alert type="success">성공</Alert>
<Alert type="danger">위험</Alert>
<Alert type="tip">팁</Alert>
```

`type`: `info` · `warning` · `success` · `danger` · `tip`

> `Callout.astro`는 동일 역할의 레거시 컴포넌트로 폐기 예정. 새 포스트에서는 `Alert.astro` 사용.

### 파일 정리 — 연도/월 서브디렉토리

`ko/` 아래에 연도·월 폴더를 만들어 파일을 분산해도 **URL(slug)은 파일명 기준**으로 결정되어 변경되지 않습니다.

```
content/culture/ko/2026/05/band-of-brothers-casts.md
  →  /culture/band-of-brothers-casts  (폴더 깊이 무관)
```

> 같은 파일명이 다른 폴더에 중복되면 빌드 에러로 잡힙니다.

### 영어 포스트

한국어 파일과 **동일한 파일명**을 `en/` 폴더에 배치하면 언어 스위처가 자동 연결됩니다.

```
content/dev/ko/git-merge-vs-rebase.md  →  /dev/git-merge-vs-rebase
content/dev/en/git-merge-vs-rebase.md  →  /en/dev/git-merge-vs-rebase
```

---

## 개발

```bash
pnpm dev        # 개발 서버 (localhost:4321)
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기
```

### 환경변수

`.env.example` 복사 후 편집:

```bash
cp .env.example .env
```

| 변수 | 설명 |
|------|------|
| `PUBLIC_SITE_URL` | 배포 URL |
| `PUBLIC_GA_ID` | Google Analytics 4 측정 ID |
| `PUBLIC_GISCUS_*` | Giscus 댓글 설정 |
| `PUBLIC_ADSENSE_CLIENT` | AdSense 게시자 ID |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console 인증 |
| `PUBLIC_NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 인증 |

---

## 배포

```
GitHub main push → Netlify 자동 빌드 & 배포

GitHub Actions (평일 KST 07:30)
  → Yahoo Finance API 주가 조회 → prices/*.json 저장 → commit → Netlify 재빌드
```

Netlify 환경변수에 `.env`의 `PUBLIC_*` 변수 전체 등록 필요.
Vault 자동화는 API 키 불필요 (Yahoo Finance 무료 API 사용).

---

## 컬러 테마 변경

`src/config/theme.ts`에서 `colorTheme` 값을 수정 후 커밋 & 배포합니다.

| 값 | 무드 |
|----|------|
| `sage` | 올리브 그린 — 자연스럽고 차분한 |
| `ocean` | 네이비 블루 — 집중과 깊이 (기본값) |
| `sand` | 웜 앰버 — 따뜻하고 아늑한 |
| `slate` | 차콜 그레이 — 클린하고 미니멀한 |

```ts
// src/config/theme.ts
export const colorTheme: ColorTheme = 'ocean'; // 👈 여기만 수정
```

라이트/다크 모드는 각 테마에 독립적으로 정의되어 있습니다.

---

## 문서

- [마이그레이션](./docs/migration.md)
- [개발 계획서](./docs/dev-plan.md)
- [디자인 시스템](./docs/design-system.md)
- [히트맵 스펙](./docs/heatmap-spec.md)

---

## 라이선스

개인 블로그 프로젝트입니다. 코드는 참고 자유, 콘텐츠(포스트) 무단 복제 금지.
