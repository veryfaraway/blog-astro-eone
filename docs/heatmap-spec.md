# 주식 히트맵 기능 명세서 (Vault)

> 개인 보유 미국 주식을 시각화하는 히든 피처  
> 컨셉: 영화 "The Net"의 Mozart's Ghost — 탐험하는 사람만 찾을 수 있는 곳

---

## 현재 구현 상태 요약

| 항목 | 상태 |
|------|------|
| 페이지 경로 | `/vault` (`src/pages/vault/index.astro`) |
| 히트맵 컴포넌트 | `src/components/heatmap/HeatMap.tsx` (React island, monolith) |
| 포트폴리오 데이터 | `src/data/portfolio.json` — 수동 관리 |
| 주가 데이터 | `src/data/prices/YYYY-MM-DD.json` — GHA 일 1회 자동 수집 |
| 주가 API | Yahoo Finance Chart API v8 (API 키 불필요) |
| 자동화 | `.github/workflows/update-prices.yml` — UTC 00:00 (KST 09:00) 평일 실행 |
| 접근 제어 | `noindex=true` + robots.txt Disallow |
| 계좌 수 | 2개 — 자산증식형(~104종목) / 배당성장형(플레이스홀더, 추후 업데이트 예정) |

---

## 1. Easter Egg 진입 설계

### 컨셉
The Net(1995)에서 Sandra Bullock이 π 메뉴 아이콘으로 숨겨진 사이트에 진입하는 장면처럼,
블로그 어딘가에 눈에 띄지 않지만 발견 가능한 진입 방법을 숨겨둔다.

### 진입 방식 (결정)
1. 푸터 또는 헤더의 특정 요소에 **마우스 오버** → 숨겨진 아이콘 페이드인
2. 아이콘 **클릭** → `/vault` 진입
3. **진입 효과**: 화면 전환 트랜지션 (페이드 아웃 → 페이드 인)
4. **Vault 전용 테마**: 다크/터미널 무드 (global.css의 `[data-section="vault"]`)

### 접근 제어
- URL: `/vault`
- `robots.txt`: `Disallow: /vault`
- `<meta name="robots" content="noindex, nofollow">`
- Sitemap 제외 (`noindex=true` in BaseLayout)

---

## 2. 파일 구조 (실제)

```
src/
├── pages/
│   └── vault/
│       └── index.astro              # SSG 페이지 (noindex)
├── components/
│   └── heatmap/
│       └── HeatMap.tsx              # 메인 컴포넌트 (monolith — 셀/툴팁 내장)
├── data/
│   ├── portfolio.json               # 티커/수량/섹터 (수동 관리)
│   └── prices/
│       ├── YYYY-MM-DD.json          # 일별 주가 (최근 30일 보관)
│       └── monthly/
│           └── YYYY-MM.json         # 월별 통합 (30일 초과 아카이브)
scripts/
├── fetch-prices.mjs                 # Yahoo Finance 조회 → 일별 파일 저장
└── archive-prices.mjs               # 30일 초과 일별 파일 → 월별 통합
.github/workflows/
└── update-prices.yml                # GHA 자동화
```

---

## 3. 데이터 구조

### portfolio.json

```json
{
  "accounts": {
    "account_a": {
      "name": "자산증식형",
      "holdings": [
        { "ticker": "NVDA", "shares": 14, "sector": "Technology" },
        { "ticker": "SCHD", "shares": 43, "sector": "ETF" }
      ]
    },
    "account_b": {
      "name": "배당성장형",
      "holdings": [
        { "ticker": "SCHD", "shares": 50, "sector": "ETF" }
      ]
    }
  }
}
```

- `sector` 필드: 섹터별 그룹핑에 사용. 없으면 `'Other'`로 처리
- 사용 중인 섹터값: `Technology`, `Healthcare`, `Communication`, `Financial Services`, `Real Estate`, `Consumer Staples`, `Consumer Discretionary`, `Industrials`, `Defense`, `Utilities`, `Energy`, `Materials`, `Nuclear`, `ETF`

### 일별 주가 파일 (`YYYY-MM-DD.json`)

```json
{
  "date": "2026-05-16",
  "prices": {
    "AAPL": { "close": 213.50, "change": 1.23, "changePercent": 0.58 }
  }
}
```

### 월별 아카이브 파일 (`monthly/YYYY-MM.json`)

```json
{
  "month": "2026-03",
  "days": [
    { "date": "2026-03-01", "prices": { "AAPL": { "close": 185.30, "change": 0.50, "changePercent": 0.27 } } }
  ]
}
```

> 월별 파일은 해당 월의 **모든 일별 데이터**를 배열로 포함한다.  
> 평균값이 아니라 원본 일별 스냅샷의 집합.

---

## 4. 데이터 보관 정책

```
최근 30일  → 일별 파일 (YYYY-MM-DD.json) — 빌드 타임에 직접 import
30일 초과  → 월별 파일로 통합 (monthly/YYYY-MM.json), 일별 파일 삭제
```

---

## 5. 주가 API — Yahoo Finance Chart API v8

```
GET https://query2.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=1d
```

- **API 키 불필요** — User-Agent 헤더 필요
- 응답에서 추출: `meta.regularMarketPrice`, `meta.previousClose`, `meta.regularMarketChangePercent`
- 요청 간 300ms 딜레이 (rate limit 회피)
- 실패한 티커는 경고 출력 후 스킵 (파일 저장은 진행)

> **이력**: 최초 설계는 Financial Modeling Prep(FMP) API였으나, 무료 한도 제약(배치 조회 제한 등)으로 Yahoo Finance API로 전환.

### 알려진 API 파싱 이슈

`2026-05-18.json`에서 `change = close`, `changePercent = 0`인 버그 데이터가 존재.
원인: Yahoo Finance API가 `previousClose`를 `undefined`로 반환 → fallback `?? 0`이 동작해 `change = close - 0 = close`.
→ **해당 파일은 재수집 필요** (GHA manual trigger 또는 직접 수정).

---

## 6. GitHub Actions 자동화

**파일**: `.github/workflows/update-prices.yml`

```yaml
on:
  schedule:
    - cron: '30 22 * * 1-5'  # UTC 22:30 = KST 07:30(다음날 아침), 평일
  workflow_dispatch:

steps:
  1. checkout
  2. node scripts/fetch-prices.mjs   # → public/data/prices/YYYY-MM-DD.json
  3. node scripts/archive-prices.mjs # → public/data/prices/monthly/YYYY-MM.json
  4. git add public/data/prices/
  5. git commit & push               # → Netlify 재빌드 트리거
```

**타이밍 근거**

| 시간대 | 장 마감 (UTC) | GHA 실행 (UTC) | 여유 |
|--------|--------------|---------------|------|
| EDT (여름, 3~11월) | 20:00 | 22:30 | +2.5h ✓ |
| EST (겨울, 11~3월) | 21:00 | 22:30 | +1.5h ✓ |

- 이전 `0 0 * * 1-5`는 월요일 파일에 금요일 데이터가 들어가는 날짜 불일치 문제가 있었음
- API 키 설정 불필요 (Yahoo Finance 사용)
- `permissions: contents: write` 설정됨

---

## 7. HeatMap 컴포넌트 (`HeatMap.tsx`)

### 구조
- `HeatMap.tsx`: 메인 컴포넌트 (계좌 탭, 날짜 네비게이션, 셀 렌더링, 툴팁)
- `DateCalendar.tsx`: 캘린더 오버레이 (월별 히스토리 탐색)
- `HeatMapCell`: HeatMap.tsx 내부 컴포넌트

### 데이터 흐름
```
vault/index.astro (빌드 타임)
  → portfolio.json import
  → readFile(public/data/prices/{latestDate}.json)  ← 초기 렌더 플래시 방지
  → readdir(public/data/prices/monthly/)            ← availableMonths 탐색
  → <HeatMap portfolio priceData availableDates availableMonths latestDate />

클라이언트 사이드 (날짜 변경 시)
  → fetch(/data/prices/{date}.json)           ← 일별 파일
  → fetch(/data/prices/monthly/{YYYY-MM}.json) ← 아카이브 (캘린더에서)
```

### 셀 크기 계산
```
totalValue = Σ(close × shares) for all holdings with price data
weightPercent = (close × shares) / totalValue × 100
flexBasis = weightPercent%  (min 80px)
```

### 색상 스케일
| 등락률 | 색상 | hex |
|--------|------|-----|
| +3% 이상 | 진한 초록 | `#1a7a4a` |
| +1% ~ +3% | 연한 초록 | `#2ea855` |
| -1% ~ +1% | 중립 회색 | `#4a5060` |
| -1% ~ -3% | 연한 빨강 | `#c0392b` |
| -3% 이하 | 진한 빨강 | `#8b0000` |

### 섹터 그룹핑
- `holdings.some(h => h.sector)` → true이면 섹터별 그룹 렌더링
- 섹터 헤더: `border-left: 2px solid #2ea855`, 소문자 회색 텍스트
- 섹터 내 종목: 비중 내림차순 정렬
- 섹터 자체 정렬: 현재 **미정렬** (Object.entries 삽입 순서)

### 날짜 네비게이션
```typescript
function navigateToDate(date: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('date', date);
  window.location.href = url.toString();  // 전체 페이지 리로드
}
```

---

## 8. 알려진 버그 및 기술 부채

### [버그 1] 날짜 네비게이션 미동작 — 중요도: 高

**문제**: `vault/index.astro`는 SSG 정적 빌드. `Astro.url.searchParams.get('date')`는 빌드 타임에만 평가되어 항상 `latestDate`의 priceData가 HTML에 포함됨.
사용자가 `?date=2026-05-16`으로 이동해도 동일한 HTML이 반환되고, 이전 날짜 데이터는 보이지 않음.

**수정 방법 (권장)**: priceData를 Astro prop으로 넘기는 대신, React 컴포넌트가 직접 fetch하도록 변경.
- `src/data/prices/` → `public/data/prices/`로 이동 (정적 파일 서빙)
- GHA도 `public/data/prices/`에 저장하도록 경로 수정
- HeatMap에서 날짜 변경 시 `fetch('/data/prices/${date}.json')` 호출
- URL 갱신은 `history.pushState` 사용 (페이지 리로드 없이)

### [버그 2] 월별 아카이브 날짜 목록 누락 — 중요도: 中

**문제**: `readdir(pricesDir)`이 루트의 `YYYY-MM-DD.json`만 탐지. `monthly/` 서브디렉토리의 날짜들은 `availableDates`에 포함되지 않아 30일 이후 데이터를 UI에서 접근 불가.

**현재 영향**: 버그 1로 인해 날짜 네비게이션 자체가 동작 안 하므로 실질적 영향은 없음.

### [부채 1] 섹터 정렬 없음

섹터 그룹이 `sectorMap` 객체 삽입 순서대로 표시됨. 비중 합계 기준 내림차순 정렬 필요.

### [부채 2] 104종목 셀 레이아웃 밀도

자산증식형 104종목의 경우 소량 보유 종목(1주)이 80px 최소 폭 셀로 많아져 시각적으로 혼잡.
섹터 기본 보기 + 클릭 시 섹터 내 종목 펼치기 방식 검토 필요.

---

## 9. UX 개선 옵션 (미결정)

### 날짜 네비게이션 수정 난이도

| 옵션 | 방식 | 난이도 | 효과 |
|------|------|--------|------|
| A | 날짜 네비 완전 제거, 최신만 표시 | 10분 | 기능 축소 |
| B | client-side fetch (`public/data/prices/`) | 반나절 | ← → 정상 동작, 페이지 리로드 없음 |
| C | Astro SSR 전환 | 1일+ | B와 효과 동일, 복잡도 높음 |

→ **B 권장**: 코드 변경 범위가 명확하고 UX 개선 효과가 큼.

### 월별 히스토리 접근 방법

monthly 파일(`{ month, days: [...] }`)에는 해당 월 전체 일별 데이터가 포함되어 있어, 월 선택 후 일별 탐색도 가능.

| 옵션 | 설명 | 추천 |
|------|------|------|
| 단일 타임라인 | 일별 ← → + 월별 드롭다운으로 연속 탐색 | ✓ |
| 별도 탭 | "최근" / "히스토리" 탭 분리 | - |
| 모달/드로어 | 히스토리 버튼 클릭 → 월 선택 팝업 | - |

→ 단일 타임라인 + 월 드롭다운 조합이 인터랙션이 가장 직관적.  
(단, 버그 1 수정 이후에 구현 의미 있음)

---

## 결정 사항 이력

| 항목 | 결정 |
|------|------|
| Easter egg 방식 | hover → 아이콘 노출 → 클릭 + 전환 효과 + Vault 테마 |
| 히트맵 URL 경로 | `/vault` |
| 주가 API | Yahoo Finance Chart API v8 (무료, API 키 불필요) |
| 계좌명 표기 | 자산증식형 / 배당성장형 |
| 금액 노출 | 비율(%)만 표시, 금액 숨김 |
| 섹터 분류 | portfolio.json의 `sector` 필드로 관리 |
