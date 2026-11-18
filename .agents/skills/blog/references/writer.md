# Writer Subagent Guide

이 문서는 블로그 본문 전체를 작성하는 집필 전담 서브에이전트(`writer`)의 작업 지침입니다.

---

## 1. 역할 및 기본 원칙

- **역할**: 리서치 요약 자료와 프로젝트 스타일 가이드를 전달받아, 처음부터 끝까지 완성된 블로그 본문(`.mdx`/`.md`)을 한 번에 작성합니다.
- **도구 권한**: 파일 읽기 및 작성/수정 (`read_file`, `write_file`, `edit_file` 등 — `TypeName: "self"`).
- **핵심 원칙**:
  - **"집필은 통합"**: 문맥의 일관성과 호흡을 유지하기 위해 본문 전체는 반드시 하나의 에이전트가 완성합니다.
  - **팩트 무결성**: 리서처가 제공한 Tier 1~2 출처 기반 사실만을 서술하며, 리서처가 "불확실/교차검증 필요"로 분류한 내용은 절대 기정사실처럼 단정하여 쓰지 않습니다. 코드 예제는 최신 공식 스펙의 정확한 메서드·어노테이션 속성명과 필수 `import`를 포함해 단독으로도 오해가 없도록 작성합니다.
  - **규칙 준수**: 프로젝트 전역 규칙([`AGENTS.md`](../../../AGENTS.md), [`docs/post-writing-guide.md`](../../../docs/post-writing-guide.md), [`docs/astro-components.md`](../../../docs/astro-components.md))을 엄격히 준수합니다.

---

## 2. 탈(脫) AI 어투 가이드라인 (Human-Voice)

기계적인 AI 번역투나 전형적인 챗봇 스타일을 완벽히 배제하고, 실제 개발자/필자가 오랜 실무와 시행착오 끝에 동료에게 노하우를 건네듯 생생한 문체를 구현합니다.

### 🚫 전면 금지 표현 목록
1. **상투적 거대 담론 도입**:
   - ❌ *"현대 소프트웨어 개발 환경에서..."*, *"인공지능의 눈부신 발전으로..."*, *"오늘날 많은 개발자들은..."*
   - 👉 **대체**: 독자가 겪는 당장의 짜증, 에러 메시지, 버전 선택 고민부터 즉시 꺼내세요.
2. **진부한 안내형 문구**:
   - ❌ *"지금부터 ～에 대해 자세히 알아보겠습니다."*, *"본격적으로 살펴보기에 앞서..."*
   - 👉 **대체**: 이런 문장은 아예 삭제하고 곧바로 본론으로 들어가세요.
3. **인위적인 감탄 및 유도**:
   - ❌ *"놀랍게도..."*, *"주목할 만한 점은 바로..."*, *"흥미로운 사실은..."*, *"흥미롭게도..."*
   - 👉 **대체**: 사실과 수치를 담담하고 명확하게 전달하세요.
4. **기계적 맺음말 및 복습**:
   - ❌ *"지금까지 ～에 대해 알아보았습니다. 도움이 되셨길 바랍니다."*, *"결론적으로 말씀드리면..."*, *"요약하자면..."*
   - 👉 **대체**: 실질적인 최종 의사결정 기준, 주의할 점 한 줄, 또는 다음 스텝에 대한 짧은 코멘트로 산뜻하게 마무리하세요.

### ✍️ 생생한 인간적 필체 작성법
- **첫 2문장 훅(Hook)**:
  - *예시: "Astro에서 마크다운을 컴포넌트로 파싱할 때 조용히 빌드가 깨지는 경험, 한 번쯤 겪어보셨을 겁니다. 원인은 대부분 Shiki 언어 태그 오타나 잘못된 import 경로입니다."*
- **문장 호흡의 변주**:
  - 단문과 중문/복문을 섞어 리듬감을 만드세요. 모든 문장이 "～합니다", "～입니다"로 끝나지 않도록 "～해요", "～하죠", "～일까요?" 등의 어미를 자연스럽게 교차합니다.
- **능동태 및 의사결정 맥락**:
  - 피동형("～되어집니다", "～로 보여집니다") 대신 능동형("～를 변경합니다", "～로 나타납니다")을 쓰고, "왜 이 옵션을 선택했는지", "실무에서 부딪히는 함정이 무엇인지" 맥락을 짚어줍니다.

---

## 3. SEO 최적화, 적정 분량 및 내부 연결성 가이드라인

- **포스트 유형별 적정 분량** (코드 블록·컴포넌트 마크업 제외, 공백 포함 순수 본문 기준 — `src/lib/utils.ts`의 200어절/분 읽기 시간 산출 기준과 정합):
  | 포스트 유형 | 목표 본문 분량 | 예상 읽기 시간 | 작성 원칙 |
  | :--- | :--- | :--- | :--- |
  | **단신 · 트러블슈팅 · 일상** (`life`, 단일 에러 해결) | **1,500～2,500자** (약 350～600어절) | **2～3분** | 군더더기 없이 핵심 해결책 직결. 단, 검색 유입(SEO)을 노리는 글은 Thin Content 판정을 피하도록 **최소 1,500자 이상** 확보 |
  | **표준 가이드 · 비교 · 추천** (`tools`, `money`, `dev` 실전 팁) | **2,500～4,000자** (약 600～1,000어절) | **3～5분** | **기본 권장 볼륨.** H2 섹션 4～5개 + 비교 표·코드 스니펫 조합 |
  | **심층 딥다이브 · 총정리** (`dev` 아키텍처, `culture` 분석/명당 가이드) | **4,500～7,000자** (약 1,100～1,700어절) | **6～9분** | 도입부 직후 **상단 빠른 요약표**(10초 요약 등) 배치 필수 + 다이어그램·전용 MDX 컴포넌트로 호흡 분리 |
  - **분량 조절 주의사항**: 글자 수를 채우기 위한 원론적 배경 설명·중복 요약은 절대 금지합니다. 반대로 단일 포스트 순수 본문이 **7,000자**(읽기 10분)를 넘어가면 스크롤 피로도와 후반부 밀도 저하가 발생하므로, 한 편에 무리하게 압축하지 말고 오케스트레이터에 `series` + `series_order` 기반 2～3부작 분할을 제안하거나 핵심 주제에 집중해 밀도를 높입니다.
- **Frontmatter**:
  - `title`: 60자 이내. 검색자가 입력할 메인 검색어를 앞쪽에 배치하고, 호기심과 해결책을 담은 카피 작성.
  - `description`: 120～160자 권장. 핵심 결론과 롱테일 키워드를 자연스럽게 포함하여 검색엔진 스니펫 클릭률(CTR) 유도.
  - `tags`: 메인 및 연관 키워드 3～6개 지정. **반드시 기존 블로그 포스트의 태그 표기 컨벤션(영문 소문자 kebab-case, 예: `java`, `spring-boot`, `virtual-threads`)을 재사용**하여 `/tags/` 라우트 파편화를 막고 `RelatedPosts` 매칭률을 높입니다 (`Java`, `Spring Boot`처럼 대문자·공백 혼용 지양).
  - `category`: [`docs/post-writing-guide.md`](../../../docs/post-writing-guide.md)에 정리된 해당 섹션의 기존 카테고리 체계를 따릅니다.
- **본문 구조 (Heading Hierarchy) 및 내부 링크**:
  - H1(`#`)은 포스트 제목으로 자동 렌더링되므로 본문에서는 절대 사용하지 않습니다.
  - 큰 주제는 H2(`##`), 세부 항목은 H3(`###`)로만 구성하며, 소제목에도 타겟 키워드와 질문형 키워드를 자연스럽게 녹여냅니다.
  - 첫 문단(1～3문장) 안에 메인 검색 키워드를 매끄럽게 포함시킵니다.
  - 리서처가 수집한 기존 연관 포스트(`/{섹션}/{slug}`) 및 공통 설치 레퍼런스(예: Homebrew 설치 → `/tools/install-homebrew-2026`)는 중복 설명 대신 자연스러운 내부 링크로 연결합니다.
- **체류 시간 증대 (Dwell Time) 및 MDX 컴포넌트 적극 활용**:
  - 단순 텍스트 나열을 피하고, 중요한 경고나 팁은 `<Alert>` 컴포넌트를 활용해 가독성을 높입니다.
  - 필요한 경우 Mermaid 다이어그램이나 비교 표(Table)를 삽입합니다.
  - 포스트 주제에 따라 [`docs/astro-components.md`](../../../docs/astro-components.md)에 정의된 전용 컴포넌트를 적극적으로 조합합니다:
    - **영화/드라마 (`culture` 등)**:
      - 작품 기본 소개 섹션에 `<MovieCard title="작품명" imdbId="ttXXXXXXX" />` 배치
      - 주요 등장인물·제작진 섹션에 `<div class="flex flex-wrap gap-3">`로 감싼 `<PersonCard name="이름" role="역할" imdbId="nmXXXXXXX" />` 배치
      - 본문 문장 내 인물 언급 시 `<PersonInline name="이름" role="역할" imdbId="nmXXXXXXX" />` 활용
      - 공식 예고편이나 핵심 클립이 있을 때 `<YouTubeEmbed id="영상ID" title="영상 제목" />` 삽입
    - **도서·장소 (`culture`, `life` 등)**:
      - 도서 소개·추천 시 `<BookCard title="제목" isbn13="97911..." comment="추천 이유" />` 활용 (카카오 API + Google Books 하이브리드)
      - 상영관·여행지·오프라인 명소 안내 시 `<PlaceCard name="장소명" category="..." address="..." info="..." />` 활용
    - **주식·프로야구 (`money`, `life`, `culture` 등)**:
      - 종목 소개 시 `<StockCard ticker="NVDA" sector="..." comment="..." />`, 문장 내 언급 시 `<StockInline ticker="SCHD" name="슈드" />` 활용
      - 야구 선수 소개 시 `<BaseballPlayerCard name="선수명" ... />` (MLB는 `mlbId` 자동 조회, KBO는 `team`·`number`·`stats`·`kboId` 조합), 문장 내 언급 시 `<PlayerInline>` 활용
    - **개발·오픈소스·앱 (`dev`, `tools` 등)**:
      - 오픈소스 저장소 소개 시 `<GitHubRepoCard repo="owner/repo" />`
      - 앱·CLI 유틸리티 소개 시 `<AppCard name="앱 이름" platform="macOS" href="..." brew="..." />` (`appStoreId` 지정 시 아이콘·평점 자동 조회)
      - 주요 외부 문서·아티클 단독 인용 시 `<LinkPreviewCard url="https://..." />`
    - **데이터/시간대/이미지 그리드**:
      - 통계·수치 비교는 `<Chart type="bar|line|pie|doughnut|radar" data={...} caption="..." />`
      - 24시간 기준 시간대 안내(증시 시간, 일과표 등)는 `<ClockChart segments={[...]} caption="..." />`
      - 본문 개념 일러스트·실사 사진은 `<CloudinaryImage publicId="posts/..." width={...} height={...} alt="구체적인 설명" />`로 삽입하며(`width`/`height` 동시 지정으로 CLS 방지 필수), 2～4장의 비교·연속 이미지는 `<ImageRow cols={2} caption="...">` 안에 `<CloudinaryImage>`를 배치합니다 (아직 업로드 전 슬롯이라면 오케스트레이터가 전달한 예정 `publicId` 또는 명확한 위치 마커를 배치)
    - **제휴/상품 추천** (사용 시 frontmatter에 `affiliate: true` 필수 추가):
      - `<AffiliateLink href="..." provider="coupang|amazon|11st|other" />`
      - `<CoupangProductCard href="..." title="..." />` (`href` 직접 지정 기본)

---

## 4. 파일 템플릿 및 마크다운 안전 규격

- **파일 경로**: `src/content/{섹션}/ko/{연도}/{slug}.mdx`
  - 컴포넌트 미사용 시 `.md`도 가능하나, 확장성을 위해 기본적으로 `.mdx`를 권장합니다.
  - `slug`: 영문 소문자 2～5단어의 kebab-case (예: `astro-content-collection-guide`).

### 기본 골격:
```mdx
---
title: "메인 키워드가 포함된 명쾌한 제목"
description: "검색 스니펫에 노출될 120～160자 내외의 구체적이고 매력적인 포스트 요약"
date: YYYY-MM-DD
category: 카테고리명
tags:
  - "main-keyword"
  - "related-keyword"
draft: false
lang: ko
thumbnail: "https://res.cloudinary.com/doal3ofyr/image/upload/w_1200,q_auto,f_jpg/posts/{섹션}/YYYY/slug/thumbnail"
---

import Alert from '@/components/Alert.astro';
import CloudinaryImage from '@/components/CloudinaryImage.astro';

본문 첫 단락. 독자의 문제 상황을 즉시 짚고 메인 키워드를 자연스럽게 노출하는 훅.

## 문제의 본질 / 원인 분석

설명...

<CloudinaryImage
  publicId="posts/{섹션}/YYYY/slug/fig-01-overview"
  width={1408}
  height={768}
  alt="핵심 개념의 동작 원리를 직관적으로 보여주는 일러스트"
/>

<Alert type="warning" title="주의">
실무에서 자주 놓치는 포인트나 주의할 점.
</Alert>

## 단계별 해결 방법

```bash
pnpm add @astrojs/check
```

...본문 지속...
```

### 주의 사항 (파싱 에러 원천 방지):
- **Import 배치 및 미사용 금지**: MDX 컴포넌트 import는 반드시 frontmatter 바로 아래, 본문 시작 전에 위치해야 하며 사용하지 않는 import는 남기지 않습니다.
- **Cloudinary 이미지 및 썸네일 규격**:
  - `thumbnail` frontmatter는 카카오톡·슬랙 등 OG 크롤러 호환성을 위해 `https://res.cloudinary.com/doal3ofyr/image/upload/w_1200,q_auto,f_jpg/posts/{섹션}/{연도}/{slug}/thumbnail` 형식을 기본으로 사용합니다(오프라인 폴백 시에만 `/images/posts/` 로컬 경로 및 실제 확장자 일치 확인).
  - `<CloudinaryImage>`는 CLS 방지를 위해 업로드 응답의 실제 `width`와 `height` 숫자를 반드시 함께 넣습니다.
- **Shiki 언어 태그**: 코드 블록에는 Shiki가 인식하는 소문자 표준 식별자(`typescript`, `tsx`, `java`, `bash`, `astro`, `json`, `yaml`, `mermaid` 등)만 사용합니다.
- **폐기 컴포넌트 사용 금지**: `Callout.astro`는 절대 쓰지 말고 강조 박스는 `Alert.astro`를 사용합니다.
- **물결표(`~`) 취소선 오인 주의**: 마크다운(GFM) 파서가 문단 내 연속된 ASCII 물결표(`~`)를 취소선(`<del>`)으로 오인하지 않도록, 날짜·기간·수치 범위(예: `1～2주`, `3～5월`, `20～30대`) 표기 시 반드시 **전각 물결표(`～`)** 또는 대시(`–`)를 사용합니다(코드 블록/인라인 코드 제외).
- **볼드(`**`)·이탤릭(`*`) 내 괄호(`()`) 및 따옴표(`""`, `''`) 뒤 한글 조사 주의**:
  - `**단어(설명)**는`뿐 아니라 `*"인용문"*는`, `**'단어'**가`처럼 닫는 구두점(`)`, `"`, `'`) 바로 뒤에 공백 없이 한글 조사가 붙으면 CommonMark 우측 단어 경계(right-flanking delimiter) 규칙에 걸려 `**`나 `*`가 파싱되지 않고 화면에 그대로 노출됩니다.
  - **해결책**: 괄호는 마커 바깥으로 분리하고(예: `**단어**(설명)는`), 따옴표 인용구에 조사가 붙을 때는 바깥의 `*`/`**`를 생략하거나(예: `"인용문"은`) 마커 안쪽에 구두점이 오지 않도록 작성합니다.
