# eone blog

> 흩어진 세 개의 블로그를 하나로. 일상·경제·문화·개발·도구에 관한 이야기.

**[blog.eone.one](https://blog.eone.one)** · Hugo + Eleventy × 2 → Astro 통합

---

## 소개

mustardseed · burn · popcorn — 각기 다른 스택(Hugo, Eleventy)으로 운영하던 블로그 3개를 Astro 단일 프로젝트로 통합한 개인 블로그입니다.

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
Framework   Astro 6 (SSG)
UI          React (island) + shadcn/ui + Tailwind CSS v4
Font        Pretendard Variable + JetBrains Mono
Search      Pagefind
Comments    Giscus (GitHub Discussions)
Analytics   Google Analytics 4
Deploy      Netlify
```

---

## 주요 기능

- **5섹션 구조** — 섹션별 accent color, 독립 카테고리 탭
- **전문 검색** — Pagefind, Cmd+K 단축키
- **다크모드** — 시스템 설정 연동 + 수동 토글
- **TOC** — 포스트 내 목차 (lg 화면 우측 sticky)
- **읽기 시간** · **이전/다음 포스트** 네비게이션
- **태그 워드 클라우드** — 빈도수 기반 크기 조절
- **Giscus 댓글** — 다크모드 자동 연동
- **JSON-LD** — Article + BreadcrumbList 구조화 데이터
- **◈ Vault** — 숨겨진 포트폴리오 히트맵 (Easter egg 진입)

---

## 프로젝트 구조

```
src/
├── components/
│   ├── heatmap/        # Vault 히트맵 (React)
│   ├── layout/         # Header, Footer
│   └── ...             # PostCard, TOC, Alert 등
├── content/
│   ├── life/ko/        # 섹션별 마크다운 포스트
│   ├── money/ko/
│   ├── culture/ko/
│   ├── tools/ko/
│   └── dev/ko/
├── data/
│   ├── portfolio.json  # 보유 종목 (수동 관리)
│   └── prices/         # 주가 데이터 (GHA 자동 갱신)
├── layouts/
│   ├── BaseLayout.astro
│   └── PostLayout.astro
└── pages/
    ├── index.astro     # 홈
    ├── blog/           # 전체 포스트 (페이지네이션)
    ├── sections.astro  # 섹션 허브
    ├── [section]/      # 섹션별 포스트
    ├── tags/           # 태그 목록 + 태그별 포스트
    ├── about.astro
    └── vault/          # 히트맵 (noindex)

scripts/
├── migrate.mjs         # Hugo/Eleventy → Astro 마이그레이션
├── fetch-prices.mjs    # FMP API 주가 조회 (GHA)
└── archive-prices.mjs  # 30일 초과 일별 → 월별 통합
```

---

## 개발

```bash
pnpm dev        # 개발 서버 (localhost:4321)
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기 (검색 포함)
```

### 환경변수

`.env.example`을 참고해 `.env` 파일 생성:

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

### 콘텐츠 마이그레이션

기존 Hugo/Eleventy 포스트 → Astro 변환:

```bash
node scripts/migrate.mjs --source=all       # 전체 실행
node scripts/migrate.mjs --source=hugo      # Hugo만
node scripts/migrate.mjs --source=popcorn   # Eleventy popcorn만
node scripts/migrate.mjs --source=techai    # Eleventy tech-ai만
node scripts/migrate.mjs --source=all --dry-run  # 미리보기
node scripts/migrate.mjs --source=all --force    # 덮어쓰기
```

---

## 배포

```
GitHub main push → Netlify 자동 빌드 & 배포

GitHub Actions (평일 KST 09:00)
  → FMP API 주가 조회 → prices/*.json 저장 → commit → Netlify 재빌드
```

Netlify 환경변수에 `.env`의 `PUBLIC_*` 변수 전체 등록 필요.  
Vault 자동화를 위해 GitHub Secrets에 `FMP_API_KEY` 등록 필요.

---

## 라이선스

개인 블로그 프로젝트입니다. 코드는 참고 자유, 콘텐츠(포스트) 무단 복제 금지.
