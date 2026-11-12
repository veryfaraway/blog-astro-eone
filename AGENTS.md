# blog-astro-eone — Antigravity Agent Guidelines

`blog-astro-eone` 프로젝트에서 활동하는 모든 Antigravity 에이전트와 서브에이전트가 준수해야 할 전역 규칙 및 가이드라인입니다.

---

## 1. 프로젝트 개요 및 기본 명령

3개 블로그를 Astro로 통합한 멀티섹션 블로그 (`blog.eone.one`, Netlify 자동 배포).

- **기술 스택**: Astro, React (island), Tailwind CSS, shadcn/ui, TypeScript, pnpm, Pagefind, Giscus
- **콘텐츠 구조**:
  ```
  src/content/
  ├── life/      # 일상/종교/육아/자동차/아쿠아리움
  ├── money/     # 경제/투자/절약/제품리뷰 (리퍼럴 제휴)
  ├── culture/   # 영화/영어학습/여행
  ├── tools/     # macOS/터미널/개발환경/앱
  └── dev/       # 개발/AI/Backend/Frontend/DevOps/트렌드
  ```
- **언어 및 라우팅**: 한국어(`ko`, 기본 `/{섹션}/{slug}`) 및 영어(`en`, 보조 `/en/{섹션}/{slug}`, ko/en `slug` 완전 일치 필수)
- **파일 경로 규칙**: `src/content/{섹션}/{lang}/{연도}/{slug}.mdx` (순수 텍스트는 `.md` 가능하나 컴포넌트 사용 시 반드시 `.mdx`)
- **주요 명령어**: `pnpm dev` (개발 서버) · `pnpm build` (정적 빌드 + Pagefind 검증) · `pnpm check` (`astro check` 타입/스키마 검사) · `make seo` / `make ga` (검색·유입 분석)

---

## 2. 블로그 글 작성 3대 핵심 원칙

### ① SEO 최적화 (Search Engine Optimization)
- **제목 (`title`)**: 60자 이내 권장. 검색 의도에 맞는 주요 키워드를 가급적 앞쪽에 배치.
- **요약문 (`description`)**: 120～160자 권장. 포스트의 핵심 결론과 메인 키워드를 자연스럽게 포함하여 검색 결과 스니펫 클릭률(CTR) 극대화.
- **헤딩 구조**: H1(`#`)은 포스트 제목으로 자동 렌더링되므로 본문 내 사용 금지. 대주제는 H2(`##`), 세부 항목은 H3(`###`)로 엄격히 계층화.
- **첫 단락 훅 & 이미지 Alt**: 첫 단락(3줄 이내)에서 핵심 키워드와 함께 독자의 검색 목적을 즉시 해소하고, 모든 이미지에 구체적인 `alt` 속성 부여.
- **내부 링크 & 레퍼런스 재사용**: 연관된 기존 포스트로의 자연스러운 내부 링크를 권장하며, 이미 별도 가이드로 정리된 설치 절차(예: Homebrew 설치 → `/tools/install-homebrew-2026`)는 중복 설명하지 말고 해당 글을 링크로 안내 (`docs/post-writing-guide.md` 참조).

### ② 탈(脫) AI 어투 (Authentic Human Voice)
기계적이거나 뻔한 AI 클리셰를 철저히 배제하고, 실제 개발자/블로거가 동료에게 노하우를 전달하듯 생생하게 작성합니다.

- **절대 금지 표현**:
  - ❌ *"현대 사회에서...", "눈부신 기술 발전에 힘입어..."* (장황한 배경 깔기 금지)
  - ❌ *"지금부터 ～에 대해 자세히 알아보겠습니다."* (전형적인 AI 안내 멘트 금지)
  - ❌ *"주목할 만한 점은...", "흥미롭게도..."* (작위적인 감탄/유도 표현 금지)
  - ❌ *"지금까지 ～에 대해 살펴보았습니다."* / *"결론적으로 말씀드리면...", "요약하자면..."* (상투적 결론·기계적 요약 금지)
- **권장 문체**:
  - **첫 두 문장 직격**: 독자가 마주한 현실적인 문제 상황이나 의문점부터 바로 언급하며 시작.
  - **문장 호흡과 어미 변주**: 단문과 복문을 리듬감 있게 교차하고, `～해요`와 `～합니다`를 담백하게 섞어 서술.
  - **실제 경험/의사결정 맥락**: "왜 이 방식을 골랐는지", "직접 겪은 삽질 포인트가 무엇인지" 등 구체적 맥락 제공.

### ③ 자료 조사 시 출처 신뢰도 검증 (Tiered Credibility)
- **Tier 1 (9～10점, 핵심 팩트로 최우선 채택)**: 공식 기술 문서·릴리스 노트(Astro, MDN, GitHub 등), 정부/공공 통계, 학술 논문, RFC/W3C 표준.
- **Tier 2 (7～8점, 실무 모범 사례로 활용)**: 글로벌 빅테크 엔지니어링 블로그, 저명 오픈소스 메인테이너, 공신력 있는 주요 언론.
- **Tier 3～4 (6점 이하, 주의)**: 커뮤니티 토론(SO, Reddit, HN — Tier 3)은 반드시 타 출처와 교차 검증하고, 출처 불명 개인 블로그·제휴 홍보글(Tier 4)은 단독 팩트로 절대 사용 금지.

---

## 3. 마크다운·MDX 및 컴포넌트 규칙

- **컴포넌트 import 및 폐기 목록**: MDX import는 frontmatter 바로 아래, 본문 시작 전에 배치(미사용 import 금지). 강조 박스는 `Alert.astro`를 사용하며, **폐기 예정인 `Callout.astro`와 알라딘 OpenAPI 종료(2026.10.30)로 동작하지 않는 `BookCard.astro`는 절대 사용 금지**.
- **주제별 MDX 컴포넌트 적극 활용** (기존 컴포넌트로 해결 가능하면 신규 제작 금지, 상세 Props는 [`docs/astro-components.md`](docs/astro-components.md) 참조):
  - **영화·인물·영상**: `MovieCard`(`imdbId="tt..."`), `PersonCard` / `PersonInline`(`imdbId="nm..."`), `YouTubeEmbed`(`id="영상ID"`)
  - **데이터·시간대·이미지**: `Chart`(`bar | line | pie | doughnut | radar`), `ClockChart`(24시간 원형 시간대), `ImageRow`(2～4열 그리드), `CloudinaryImage`
  - **제휴·상품 추천** (사용 시 frontmatter에 `affiliate: true` 필수): `AffiliateLink`, `CoupangProductCard`(`href` + `title` 직접 지정 권장)
- **코드 블록 언어 태그**: Shiki가 인식하는 소문자 표준 태그 필수 사용 (`bash`, `javascript`, `typescript`, `tsx`, `astro`, `json`, `yaml`, `html`, `css`, `mermaid` 등).
- **물결표(`~`) 취소선 오인 주의**: 마크다운(GFM) 파서가 문단 내 연속된 ASCII 물결표(`~`)를 취소선(`<del>`)으로 오인 렌더링하지 않도록, 기간·범위 표기 시 반드시 **전각 물결표(`～`)** 또는 대시(`–`)를 사용합니다(코드 블록/인라인 코드 제외).
- **볼드(`**`) 내 괄호(`()`) 사용 금지**: 닫는 괄호 뒤에 한글 조사(는/가/를/에 등)가 바로 붙는 경우(예: `**단어(설명)**는`), CommonMark 구두점 단어 경계 인식 오류로 볼드가 풀리고 `**`가 그대로 노출됩니다. **괄호는 반드시 볼드 마커 바깥으로 분리**(예: `**단어**(설명)는`)하거나 볼드를 적용하지 않습니다.

---

## 4. 개발·아키텍처 및 운영 안전수칙

- **Astro vs React Island**: 정적 UI는 `.astro` 컴포넌트로 빌드 타임 렌더링하고(`prose` 내부용 컴포넌트는 최상위에 `not-prose` 및 `dark:` 다크모드 클래스 필수), 클라이언트 상태·이벤트가 꼭 필요한 곳에만 React island(`.tsx`)를 사용합니다.
- **디자인 시스템**: `shadcn/ui` 원본 파일은 직접 수정하지 않고 override 방식으로 확장합니다. 과도한 그라디언트나 대형 원색 블록을 지양하고 섹션별 accent color는 뱃지·보더·호버 등 서브 포인트로만 절제해 사용합니다 ([`docs/design-system.md`](docs/design-system.md)).
- **⚠️ 쿠팡 파트너스 API 한도 주의**: 쿠팡 검색 API는 시간당 호출 한도가 매우 낮으며 **초과 3회 누적 시 파트너스 계정이 제한됩니다**(이미 1회 초과 이력 있음). 상품 카드는 API 호출이 없는 `href` 직접 지정을 기본으로 쓰고, 캐시 갱신이 필요할 때는 미캐시 항목만 조회하는 `pnpm coupang`을 실행한 뒤 `src/data/coupang-products.json`을 함께 커밋하세요. **전체 재조회(`pnpm coupang --refresh`)는 사용자의 명시적 지시 없이 절대 실행하지 않습니다.**

---

## 5. 참조 가이드 문서 (SSOT)

상세 스키마나 기능별 명세가 필요할 경우 코드 분석·작업 전에 아래 문서를 먼저 확인합니다:
- [`docs/post-writing-guide.md`](docs/post-writing-guide.md): Frontmatter 전체 스키마, 섹션별 카테고리 예시, 설치 가이드 재사용 링크 목록
- [`docs/astro-components.md`](docs/astro-components.md): 전체 Astro/MDX 컴포넌트 Props 및 사용법 단일 원본
- [`docs/bilingual-post-guide.md`](docs/bilingual-post-guide.md): 영문(`en`) 포스트 `slug` 동기화, `hreflang` 및 번역 원칙
- [`docs/design-system.md`](docs/design-system.md): 컬러 토큰, 타이포그래피, 섹션별 테마 디자인 원칙
- [`docs/heatmap-spec.md`](docs/heatmap-spec.md): `/vault` 미국 주식 히트맵(히든 피처) 구조 및 데이터 스키마
- [`docs/content-follow-up-plan.md`](docs/content-follow-up-plan.md): GSC/GA4 유입 데이터 기반 후속 포스트 기획 백로그
