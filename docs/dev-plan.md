# blog-astro-eone 개발 계획서

> 목표: 3개 블로그(Hugo/Eleventy) → Astro 단일 블로그 통합  
> 도메인: blog.eone.one  
> 배포: Netlify + GitHub

---

## 단계 요약

| Phase | 단계명 | 내용 | 선행 조건 |
|-------|--------|------|-----------|
| 1 | 프로젝트 기반 세팅 | Astro 초기화, 스택 설치 | - |
| 2 | 디자인 시스템 | 섹션별 색상 토큰, 공통 컴포넌트 | Phase 1 |
| 3 | 콘텐츠 아키텍처 | 스키마, i18n, 라우팅 | Phase 2 |
| 4 | 블로그 핵심 기능 | 섹션 페이지, 검색, 댓글, 태그 | Phase 3 |
| 5 | 수익화 & SEO | AdSense, 제휴링크, 사이트맵, 분석 | Phase 4 |
| 6 | 콘텐츠 마이그레이션 | 기존 포스트 이전, 301 리다이렉트 | Phase 5 |
| 7 | 주식 히트맵 | 히든 피처 구현, GHA 자동화 | Phase 4 |
| 8 | 론칭 & Retire | DNS 전환, 기존 블로그 종료 | Phase 6, 7 |

---

## Phase 1 — 프로젝트 기반 세팅

### 목표

빈 디렉토리를 실행 가능한 Astro 프로젝트로 만든다.

### 작업 목록

- [ ] `pnpm create astro@latest` 초기화 (strict TypeScript 템플릿)
- [ ] Tailwind CSS 통합 (`@astrojs/tailwind`)
- [ ] React 통합 (`@astrojs/react`)
- [ ] shadcn/ui 설치 및 기본 설정
- [ ] Radix UI 의존성 설치
- [ ] `.env` 파일 구조 정의
- [ ] GitHub 레포지토리 생성 & Netlify 연결
- [ ] `netlify.toml` 기본 설정 (빌드 명령어, publish 디렉토리)
- [ ] 기본 폴더 구조 생성 (`src/components`, `src/layouts`, `src/content`, `src/pages`)

### 완료 기준

`pnpm dev` 실행 시 Astro 기본 페이지 로컬 확인 가능

---

## Phase 2 — 디자인 시스템

### 목표

3개 섹션을 시각적으로 구분하면서도 통일감 있는 디자인 언어를 만든다.

### 작업 목록

#### 색상 & 토큰

- [ ] 글로벌 CSS 변수 정의 (light/dark 모드)
- [ ] 섹션별 accent color 정의
  - `general`: 따뜻한 계열 (생활감)
  - `culture`: 무드 있는 계열 (엔터테인먼트)
  - `tech`: 차가운 계열 (기술)
- [ ] Tailwind config에 커스텀 색상 등록

#### 타이포그래피

- [ ] 한국어/영어 폰트 선정 및 적용
- [ ] 제목/본문/캡션 스케일 정의

#### 공통 레이아웃 컴포넌트

- [ ] `BaseLayout.astro` (HTML 뼈대, meta, GA 스크립트)
- [ ] `Header.astro` (로고 + 섹션 네비게이션 + 다크모드 토글 + 언어 전환)
- [ ] `Footer.astro`
- [ ] `SectionLayout.astro` (섹션별 accent 주입)

#### UI 컴포넌트

- [ ] `PostCard.astro` (썸네일, 제목, 날짜, 섹션 뱃지, 태그)
- [ ] `TagBadge.astro`
- [ ] `DarkModeToggle.tsx` (React island)
- [ ] `LanguageSwitcher.tsx` (React island)

### 완료 기준

3개 섹션 accent color가 적용된 포스트 카드 UI 로컬 확인 가능

---

## Phase 3 — 콘텐츠 아키텍처

### 목표

Astro Content Collections로 타입 안전한 콘텐츠 구조를 만들고 i18n 라우팅을 구성한다.

### 작업 목록

#### 콘텐츠 스키마

- [ ] `src/content/config.ts` 작성
- [ ] `general` 컬렉션 스키마 정의 (title, date, tags, category, lang, draft, affiliate 등)
- [ ] `culture` 컬렉션 스키마 정의
- [ ] `tech` 컬렉션 스키마 정의
- [ ] 샘플 포스트 3개 작성 (각 섹션 1개씩)

#### i18n 라우팅

- [ ] Astro i18n 설정 (`astro.config.ts`)
- [ ] 기본 언어 `ko`, 보조 언어 `en`
- [ ] URL 구조: `/ko/general/slug` / `/en/general/slug`
- [ ] 언어 fallback 전략 결정 (미번역 포스트 처리)

#### 동적 라우팅

- [ ] `[...slug].astro` 포스트 상세 페이지
- [ ] 섹션별 목록 페이지 (`/general`, `/culture`, `/tech`)
- [ ] 페이지네이션 구현

### 완료 기준

샘플 포스트가 올바른 URL로 렌더링되고 한/영 전환 동작 확인

---

## Phase 4 — 블로그 핵심 기능

### 목표

독자가 실제로 사용하는 기능들을 구현한다.

### 작업 목록

#### 섹션 홈

- [ ] 메인 홈 (`/`) — 3개 섹션 진입 허브
- [ ] 섹션별 랜딩 페이지 (최신 포스트 목록 + 섹션 소개)

#### 태그 시스템

- [ ] `/tags` 페이지 — 워드 클라우드 (빈도수 기반 크기 조절)
- [ ] `/tags/[tag]` 페이지 — 해당 태그 포스트 목록
- [ ] 사이드바 태그 목록 없음 — 태그 클릭 시 `/tags/[tag]`로 이동하는 구조

#### 검색

- [ ] Pagefind 설치 및 빌드 통합 (`pnpm build` 후 인덱싱)
- [ ] `SearchModal.tsx` 컴포넌트 (React island)
- [ ] 단축키 지원 (`Cmd+K` / `Ctrl+K`)
- [ ] 헤더 검색 버튼 자리 확보 완료 (플레이스홀더 상태)

#### 댓글

- [ ] Giscus 설정 (GitHub Discussions 레포 연결)
- [ ] `Comments.tsx` 컴포넌트 (React island)
- [ ] 다크모드 연동

#### 기타

- [ ] 포스트 내 목차(TOC) 컴포넌트
- [ ] 이전/다음 포스트 네비게이션
- [ ] 읽기 시간 표시
- [ ] OG 이미지 자동 생성

### 완료 기준

검색, 댓글, 태그 클라우드가 로컬에서 동작 확인

---

## Phase 5 — 수익화 & SEO

### 목표

수익 기반을 만들고 검색 엔진 유입을 최적화한다.

### 작업 목록

#### 수익화

- [ ] Google AdSense 스크립트 삽입 (BaseLayout)
- [ ] 광고 배치 컴포넌트 설계 (포스트 내 자연스러운 위치)
- [ ] `AffiliateLink.astro` 컴포넌트 (쿠팡/Amazon 공용)
- [ ] 제품 리뷰용 `ProductCard.astro` (제휴 링크 포함)

#### SEO

- [ ] `<head>` 메타태그 자동화 (title, description, OG, Twitter Card)
- [ ] `@astrojs/sitemap` 설정 (히트맵 경로 제외)
- [ ] `robots.txt` 생성 (히트맵 경로 `Disallow`)
- [ ] Google Analytics 4 연동
- [ ] Google Search Console 인증 파일 추가
- [ ] 네이버 서치어드바이저 인증 파일 추가
- [ ] 구조화 데이터 (JSON-LD: Article, BreadcrumbList)
- [ ] Canonical URL 설정

### 완료 기준

Lighthouse SEO 점수 95+ 확인

---

## Phase 6 — 콘텐츠 마이그레이션

### 목표

기존 3개 블로그의 모든 포스트를 이전하고 기존 URL을 새 URL로 연결한다.

> 상세 체크리스트는 별도 문서 `migration-checklist.md` 참조

### 작업 순서

1. `general` 섹션 — blog-general-hugo-mainroad 포스트 이전
2. `tech` 섹션 — blog-eleventy-tech-ai 포스트 이전
3. `culture` 섹션 — blog-eleventy-popcorn 포스트 이전

### 공통 작업

- [ ] Frontmatter 형식 변환 스크립트 작성 (Hugo/Eleventy → Astro)
- [ ] 이미지 경로 일괄 수정
- [ ] `netlify.toml` 301 리다이렉트 규칙 추가
- [ ] 마이그레이션 후 각 섹션 전체 포스트 링크 검증

### 완료 기준

전체 포스트 이전 완료 & 기존 도메인에서 301 리다이렉트 동작 확인

---

## Phase 7 — 주식 히트맵 (히든 피처)

### 목표

지인 공유 및 탐험하는 독자를 위한 숨겨진 주식 히트맵 페이지를 만든다.

> 상세 기능 명세는 별도 문서 `heatmap-spec.md` 참조

### 작업 목록

#### 데이터 레이어

- [ ] 보유 주식 티커/수량 데이터 파일 설계 (`src/data/portfolio.ts`)
- [ ] 계좌 A / 계좌 B 구조 정의
- [ ] GitHub Actions 워크플로우 작성 (매일 오전 9시 KST, 주가 fetch → JSON 저장 → commit)
- [ ] 사용할 주가 API 결정 및 연동 (Yahoo Finance / Alpha Vantage 등)

#### 히트맵 UI

- [ ] `HeatMap.tsx` 핵심 컴포넌트 (React island)
- [ ] 계좌 탭 전환 UI
- [ ] 날짜 네비게이션 (일별 / 월별 전환)
- [ ] 30일 기준 일별↔월별 자동 통합 로직
- [ ] 색상 스케일 (상승/하락 강도)

#### 히든 진입

- [ ] Easter egg 진입 방법 설계 (The Net / Mozart's Ghost 컨셉)
- [ ] 히트맵 경로 `robots.txt` Disallow
- [ ] 히트맵 페이지 `<meta name="robots" content="noindex, nofollow">`

### 완료 기준

히든 진입 경로로 히트맵 접근 가능, GHA 자동 업데이트 동작 확인

---

## Phase 8 — 론칭 & Retire

### 목표

새 블로그로 완전 전환하고 기존 블로그를 종료한다.

### 작업 목록

- [ ] 스테이징 환경 최종 QA (전체 링크, 리다이렉트, 다크모드, 검색, 댓글)
- [ ] Lighthouse 전 항목 90+ 확인
- [ ] DNS: `blog.eone.one` Netlify 연결
- [ ] DNS: 기존 3개 서브도메인 → Netlify redirect로 전환
- [ ] Google Search Console에 새 사이트맵 제출
- [ ] 네이버 서치어드바이저 사이트맵 제출
- [ ] 기존 블로그 빌드 중단 (Netlify 배포 비활성화)
- [ ] 기존 GitHub 레포 archive 처리

### 완료 기준

blog.eone.one 실서비스 정상 운영 확인
