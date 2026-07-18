# blog-astro-eone — CLAUDE.md

## 프로젝트 개요

3개 블로그를 Astro로 통합한 멀티섹션 블로그.

- **URL**: https://blog.eone.one
- **통합 대상**: mustardseed.eone.one / burn.eone.one / popcorn.eone.one
- **배포**: Netlify (소스: GitHub)

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Astro |
| UI 컴포넌트 | React (island 방식) |
| 스타일 | Tailwind CSS + shadcn/ui + Radix UI |
| 언어 | TypeScript |
| 패키지 매니저 | pnpm |
| 콘텐츠 | Markdown (.md) |
| 검색 | Pagefind |
| 댓글 | Giscus (GitHub Discussions) |
| 분석 | Google Analytics |
| 다크모드 | 지원 (Tailwind `dark:` + CSS 변수) |

---

## 콘텐츠 구조 (섹션 분리)

```
blog.eone.one/
├── /life/      # 일상/종교/육아/자동차/아쿠아리움
├── /money/     # 경제/투자/절약/제품리뷰 (리퍼럴 수입)
├── /culture/   # 영화/영어학습/여행
├── /tools/     # macOS/터미널/개발환경 도구
└── /dev/       # 개발/AI/Backend/Frontend/DevOps/트렌드
```

### 다국어

- 기본 언어: 한국어 (`ko`)
- 보조 언어: 영어 (`en`)
- 구조: `/ko/life/...` 또는 `/en/life/...` (i18n 라우팅)

### 콘텐츠 파일 위치 (예시)

```
src/content/
├── life/
│   ├── ko/
│   └── en/
├── money/
│   ├── ko/
│   └── en/
├── culture/
│   ├── ko/
│   └── en/
├── tools/
│   ├── ko/
│   └── en/
└── dev/
    ├── ko/
    └── en/
```

---

## 주요 기능 목록

### 블로그 공통

- [ ] 섹션별 랜딩 페이지 (color-coded 디자인)
- [ ] 태그 시스템 (Top 100 태그 목록, 태그 클라우드)
- [ ] 전체 검색 (Pagefind)
- [ ] 댓글 (Giscus)
- [ ] 다크모드 토글
- [ ] 사이트맵 자동 생성 (`@astrojs/sitemap`)
- [ ] robots.txt (히트맵 섹션 크롤링 차단 포함)
- [ ] 301 리다이렉트 (기존 3개 도메인 → blog.eone.one)
- [ ] Google Analytics 연동
- [ ] Google Search Console 최적화
- [ ] 네이버 서치어드바이저 최적화

### 수익화

- [ ] Google AdSense (디자인에 자연스럽게 녹인 배치)
- [ ] 쿠팡 파트너스 링크 컴포넌트
- [ ] Amazon Affiliate 링크 컴포넌트

### 주식 히트맵 (히든 피처)

- [ ] 진입 방법: 숨겨진 Easter egg 방식 (영화 The Net의 Mozart's Ghost 컨셉)
- [ ] robots.txt에서 크롤링 차단, noindex 처리
- [ ] 보유 미국 주식 80여 종 히트맵 (티커/수량 수동 입력)
- [ ] 계좌 2개 → 하나의 페이지에 탭/토글로 전환
- [ ] 주가 데이터: 공개 API + GitHub Actions 스케줄 빌드로 일 1회 갱신
- [ ] 30일 이내: 일별 히트맵 보관
- [ ] 30일 초과: 월별 통합 히트맵으로 압축

---

## 설계 원칙

### 멀티섹션 디자인 전략

3개 섹션을 하나의 사이트에서 구분하는 핵심 챌린지.

- 각 섹션은 **고유 accent color**를 가진다 (general/culture/tech)
- 공통 헤더 네비게이션에서 섹션 전환 가능
- 섹션 랜딩 페이지는 해당 섹션의 톤앤매너로 구성
- 포스트 카드에 섹션 뱃지 표시

### 컴포넌트 원칙

- shadcn/ui 컴포넌트를 기반으로 커스터마이징 (override 방식, 원본 수정 금지)
- React island는 인터랙션이 필요한 곳에만 사용 (히트맵, 검색, 댓글, 다크모드 토글)
- 나머지는 Astro 컴포넌트로 처리 (빌드 타임 렌더링)

### 코드 규칙

- TypeScript strict 모드 사용
- 컴포넌트 파일: PascalCase (`PostCard.astro`, `HeatMap.tsx`)
- 콘텐츠 slug: kebab-case
- 환경변수: `.env` 파일, 접두사 `PUBLIC_` (클라이언트 노출용)

---

## 배포 구성

```
GitHub main 브랜치 push
  → Netlify 자동 빌드 & 배포 (blog.eone.one)

GitHub Actions (cron: 매일 오전 9시 KST)
  → 주가 데이터 fetch → JSON 업데이트 → commit → Netlify 재빌드 트리거
```

### Netlify 리다이렉트 (`netlify.toml`)

```toml
[[redirects]]
  from = "https://mustardseed.eone.one/*"
  to = "https://blog.eone.one/general/:splat"
  status = 301

[[redirects]]
  from = "https://burn.eone.one/*"
  to = "https://blog.eone.one/tech/:splat"
  status = 301

[[redirects]]
  from = "https://popcorn.eone.one/*"
  to = "https://blog.eone.one/culture/:splat"
  status = 301
```

---

## 기능별 문서 참조

코드를 직접 분석하기 전에 아래 문서를 먼저 읽을 것.

| 기능 | 문서 |
|------|------|
| **포스트 작성 / frontmatter / 파일 경로** | [`docs/post-writing-guide.md`](docs/post-writing-guide.md) — frontmatter 스키마, 파일 경로 규칙, 섹션·카테고리 구조, 컴포넌트 사용법 요약. **포스트 신규 작성 또는 frontmatter 수정 전 반드시 확인** |
| **Astro 컴포넌트 / MDX 작성** | [`docs/astro-components.md`](docs/astro-components.md) — 전체 컴포넌트 목록, Props, MDX 사용법. **컴포넌트 신규 제작 또는 MDX 파일 작성 전 반드시 확인** |
| **영문(en) 버전 포스트 작성** | [`docs/bilingual-post-guide.md`](docs/bilingual-post-guide.md) — ko/en slug 일치 규칙, hreflang/canonical 연결 원리, frontmatter·본문 링크 번역 규칙. **포스트에 en 버전을 함께 작성할 때 반드시 확인** |
| Vault / 주식 히트맵 | [`docs/heatmap-spec.md`](docs/heatmap-spec.md) — 파일 구조, 데이터 스키마, 알려진 버그, UX 개선 옵션 포함 |
| 마이그레이션 배경 | [`docs/migration.md`](docs/migration.md) — 기존 블로그 통합 이력, 슬러그 정책, 리다이렉트 |
| 디자인 시스템 | [`docs/design-system.md`](docs/design-system.md) |

---

## 마이그레이션 순서 (권장)

1. Astro 프로젝트 초기 세팅 (스택, 레이아웃, 디자인 시스템)
2. 섹션 라우팅 & 공통 레이아웃 구현
3. 콘텐츠 스키마 정의 & 샘플 포스트 작성
4. 기존 포스트 마이그레이션 (general → culture → tech 순)
5. 수익화 컴포넌트 통합
6. 히트맵 구현
7. SEO 최적화 & 리다이렉트 설정
8. 기존 블로그 retire
