# 시즌 & 스페셜 테마 운영 가이드

> **에이전트·운영자 지침:** 블로그 전체 컬러 테마 변경, 시즌 스케줄 조정, 미리보기 점검, 또는 신규 스페셜 테마 추가 시 이 문서를 단일 원본(SSOT)으로 참고한다.  
> 전역 디자인 원칙 및 컬러 토큰 체계는 [`docs/design-system.md`](design-system.md) 참고.

---

## 1. 전체 테마 목록 및 자동 스케줄

현재 총 **9종**(일반 테마 4종 + 시즌·스페셜 테마 5종)의 테마가 등록되어 있으며, 모든 설정은 `src/config/theme.ts`에서 단일 관리된다.

### 일반 테마 (4종)

| 테마 ID | 설명 | 비고 |
| :--- | :--- | :--- |
| `ocean` | 차분한 네이비 블루 | **현재 평상시 기본값 (`defaultTheme`)** |
| `sage` | 자연스러운 올리브 그린 | 수동 전환 또는 기본값 변경용 예비 테마 |
| `sand` | 따뜻하고 아늑한 웜 앰버 | 수동 전환 또는 기본값 변경용 예비 테마 |
| `slate` | 클린하고 미니멀한 차콜 그레이 | 수동 전환 또는 기본값 변경용 예비 테마 |

### 시즌·스페셜 테마 (5종)

| 테마 ID | 테마명 | 자동 활성화 기간 (방문자 로컬 시간) | 홈 Hero 배지 문구 (KO) | 시각 연출 모티프 (로고 / 홈 Hero) |
| :--- | :--- | :--- | :--- | :--- |
| `new-year` | 새해·설날 | 양력 `01-01 ～ 01-07` **및** 음력 설 연휴(`음력 12.29 ～ 01.03`) | `새해 복 많이 받으세요` | 떠오르는 일출 해 / 한지 일출 광채와 전통 구름문 |
| `sakura` | 벚꽃 | `03-25 ～ 04-15` | `봄, 벚꽃이 피는 계절` | 벚꽃잎 한 조각 / 살랑이며 흩날리는 벚꽃잎 |
| `resort` | 여름 휴양지 | `07-15 ～ 08-20` | `여름 휴양지의 바람` | 태양과 작은 물결 / 라군 윤슬 보케와 수평선 물결 |
| `thanksgiving` | 추수감사절·만추 | `11-14 ～ 11-30` | `추수감사절 · 깊어가는 만추` | 따뜻한 단풍잎 / 천천히 내려앉는 만추 낙엽 |
| `christmas` | 성탄 (Nativity) | `12-15 ～ 12-31` | `성탄 · 구유에 오신 빛` | 베들레헴의 별 / 별빛 원뿔 아래 마구간 구유에 누운 아기 예수 |

> **음력 설날 자동 감지 원리**: 별도 연도별 날짜 테이블을 관리할 필요 없이, 브라우저 표준 `Intl.DateTimeFormat('en-US-u-ca-chinese')`로 매년 음력 12월 29～30일(설 전날)과 음력 1월 1～3일(윤달 제외)을 자동 판별한다.

---

## 2. 일상 운영 치트시트

### ① 브라우저에서 즉시 미리보기 (`?theme=` 쿼리)

헤더 UI를 심플하게 유지하기 위해 방문자용 테마 드롭다운을 두지 않는 대신, URL 쿼리 파라미터로 언제든(로컬 개발 서버·운영 배포 환경 모두) 모든 테마를 즉시 확인할 수 있다.

- **미리보기 켜기**:
  - `https://blog.eone.one/?theme=christmas` (또는 로컬 `http://localhost:4321/?theme=christmas`)
  - 사용 가능한 값: `ocean`, `sage`, `sand`, `slate`, `new-year`, `sakura`, `resort`, `thanksgiving`, `christmas`
- **세션 유지 특징**:
  - 한 번 `?theme=sakura` 등으로 접속하면 현재 브라우저 탭의 `sessionStorage`에 저장되어, **블로그 목록이나 개별 포스트 상세 페이지로 클릭해 이동해도 미리보기 테마가 계속 유지**된다 (본문 가독성 점검에 유용).
  - 다른 방문자나 새 탭에는 영향을 주지 않는다.
- **미리보기 해제 (자동 스케줄 복귀)**:
  - 주소 뒤에 `?theme=auto` 또는 `?theme=reset`을 붙여 접속하거나, 현재 탭을 닫으면 해제된다.

### ② 특정 테마로 전 방문자에게 수동 고정하기

이벤트나 분위기 전환을 위해 날짜와 무관하게 특정 테마를 강제로 켜두고 싶다면 `src/config/theme.ts`의 `overrideTheme` 값만 수정해 배포한다.

```ts
// src/config/theme.ts
export const THEME_CONFIG = {
  defaultTheme: 'ocean' as ColorTheme,

  // null이면 날짜별 자동 전환, 문자열 지정 시 날짜 무시하고 해당 테마 고정
  overrideTheme: 'christmas' as ColorTheme | null,
  // ...
};
```

다시 자동 스케줄 모드로 되돌릴 때는 `overrideTheme: null`로 변경하면 된다.

### ③ 비시즌 평상시 기본 테마 바꾸기

특별 시즌 기간이 아닐 때 보여줄 기본 테마를 `ocean` 대신 다른 테마로 바꾸려면 `defaultTheme`만 변경한다.

```ts
// src/config/theme.ts
export const THEME_CONFIG = {
  defaultTheme: 'sage' as ColorTheme, // 'ocean' | 'sage' | 'sand' | 'slate'
  overrideTheme: null as ColorTheme | null,
  // ...
};
```

### ④ 시즌 기간(날짜) 또는 배지 문구 조정하기

개화 시기 변화 등으로 활성화 구간이나 문구를 바꾸고 싶을 때는 `src/config/theme.ts`의 `schedules` 배열을 수정한다 (`MM-DD` 양력 포맷, 시작일·종료일 모두 포함).

```ts
{
  theme: 'sakura',
  start: '03-28', // 시작일 조정 예시
  end: '04-12',   // 종료일 조정 예시
  badge: { ko: '봄, 벚꽃이 피는 계절', en: 'Spring Blossom' },
},
```

> 해를 넘기는 구간(예: `start: '12-20'`, `end: '01-05'`)도 인라인 스케줄러의 `inSolarRange()`가 자동으로 처리한다.

---

## 3. 동작 아키텍처 및 파일 구조

Astro 정적 빌드(SSG) 특성상 빌드 시점에 테마를 고정하면 자정이 지나도 재배포 전까지 테마가 바뀌지 않는다. 이를 해결하기 위해 `<head>` 최상단 블로킹 인라인 스크립트에서 첫 페인트 전에 `<html data-color-theme="...">`를 즉시 확정하며, 화면 깜빡임(FOUC)이나 레이아웃 밀림(CLS)이 발생하지 않는다.

### 테마 결정 우선순위

1. **URL 쿼리 / 탭 세션 미리보기** (`?theme=<id>` → `sessionStorage['theme-preview']`)
2. **운영자 수동 강제 고정** (`THEME_CONFIG.overrideTheme`)
3. **시즌 자동 스케줄 매칭** (`THEME_CONFIG.schedules` — 로컬 양력 `MM-DD` 구간 및 음력 설 연휴)
4. **평상시 기본 테마** (`THEME_CONFIG.defaultTheme`)

### 관련 파일 맵

```
src/
├── config/
│   └── theme.ts                        # [SSOT] 테마 타입, 기본값, overrideTheme, 시즌 스케줄·배지 문구
├── layouts/
│   └── BaseLayout.astro                # <head> 인라인 스크립트 (다크모드 + 시즌 테마 Zero-FOUC 확정)
├── styles/
│   └── global.css                      # html[data-color-theme="..."] 별 Light / .dark OKLCH 변수 세트
├── components/
│   ├── Logo.astro                      # 헤더 로고 우상단 시즌 마이크로 모티프 (showSeasonalMotif prop)
│   ├── SeasonalHeroAccent.astro        # 홈 Hero 전용 시즌 캡슐 배지 + 우측 배경 앰비언트 레이어
│   └── layout/
│       └── Header.astro                # 시즌 활성 시 헤더 하단 보더 미세 틴트 적용
└── pages/
    └── index.astro                     # 홈 Hero 영역에 SeasonalHeroAccent 연결
```

---

## 4. 신규 시즌 테마 추가 레시피 (5단계)

추석(`chuseok`) 등 새로운 시즌 테마를 추가할 때는 아래 5단계를 순서대로 적용한다.

1. **`src/config/theme.ts` 등록**
   - `SeasonalColorTheme` 유니온 타입 및 `VALID_COLOR_THEMES`, `SEASONAL_COLOR_THEMES` 배열에 새 테마 ID를 추가한다.
   - `THEME_CONFIG.schedules` 배열에 `{ theme, start, end, badge }` 항목을 추가한다 (기간이 겹칠 경우 배열 상단 항목이 우선 매칭됨).
2. **`src/styles/global.css` 팔레트 추가**
   - `html[data-color-theme="<새테마>"]`와 `html[data-color-theme="<새테마>"].dark` 두 블록을 모두 정의한다.
   - 가독성 기준: Light 배경 `L ≈ 0.96～0.98`(저채도 `C ≤ 0.022`), Dark 배경 `L ≈ 0.11～0.13`, 보조 포인트 변수 `--season-accent` 및 `--season-accent-soft` 지정.
3. **`src/components/Logo.astro` 로고 모티프 추가**
   - `.seasonal-logo-motifs` 내부에 `<g class="motif motif-<새테마>">` 벡터 요소를 추가하고, 하단 `<style>`의 `:global(html[data-color-theme="<새테마>"] body:not([data-section="vault"]))` 셀렉터에 연결한다.
4. **`src/components/SeasonalHeroAccent.astro` 홈 Hero 연출 추가**
   - `.seasonal-hero-backdrop` 내 `<div class="ambient ambient-<새테마>">` 배경 연출과 `.seasonal-badges` 내 `<span class="seasonal-badge badge-<새테마>">` 캡슐 배지를 추가한다.
   - 움직이는 요소가 있다면 반드시 `@media (prefers-reduced-motion: reduce)` 블록에 애니메이션 정지 규칙을 함께 등록한다.
5. **검증**
   - `pnpm build`로 정적 빌드 통과를 확인한다.
   - 로컬 프리뷰에서 `/?theme=<새테마>`로 접속해 **라이트·다크 모드 전환**, **아티클 상세 본문 가독성**, **`/vault` 페이지 격리 유지** 여부를 점검한다.
