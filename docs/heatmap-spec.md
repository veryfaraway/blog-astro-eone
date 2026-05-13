# 주식 히트맵 기능 명세서

> 개인 보유 미국 주식을 시각화하는 히든 피처  
> 컨셉: 영화 "The Net"의 Mozart's Ghost — 탐험하는 사람만 찾을 수 있는 곳

---

## 개요

| 항목 | 내용 |
|------|------|
| 접근 방식 | Easter egg (숨겨진 진입) |
| 검색 엔진 | 차단 (noindex + robots.txt Disallow) |
| 데이터 갱신 | GitHub Actions 매일 1회 자동 빌드 |
| 대상 종목 | 보유 미국 주식 약 80종 |
| 계좌 | 2개 → 탭 전환 방식 (자산증식형 / 배당성장형) |

---

## 1. Easter Egg 진입 방법 설계

### 컨셉
The Net(1995)에서 Sandra Bullock이 π 메뉴 아이콘을 클릭해 숨겨진 사이트로 진입하는 장면처럼,  
블로그 어딘가에 눈에 띄지 않지만 발견 가능한 진입 방법을 숨겨둔다.

### 진입 방식 (확정)
1. 푸터 또는 헤더의 특정 요소에 **마우스 오버** → 숨겨진 아이콘 페이드인
2. 아이콘 **클릭** → `/vault` 진입
3. **진입 효과**: 화면 전환 트랜지션 애니메이션 (예: 페이드 아웃 → 페이드 인)
4. **Vault 전용 테마**: 블로그와 다른 다크/터미널 무드 — 비밀 공간 느낌

### 접근 제어
- 히트맵 경로: `/vault`
- `robots.txt`: `Disallow: /portfolio`
- 페이지 `<head>`: `<meta name="robots" content="noindex, nofollow">`
- Vault 전용 CSS 테마 클래스 (`theme-vault`) — 다크/터미널 무드
- Sitemap에서 제외

---

## 2. 데이터 구조

### 포트폴리오 데이터 파일 (`src/data/portfolio.json`)

```json
{
  "accounts": {
    "account_a": {
      "name": "자산증식형",
      "holdings": [
        { "ticker": "AAPL", "shares": 10 },
        { "ticker": "NVDA", "shares": 5 },
        ...
      ]
    },
    "account_b": {
      "name": "배당성장형",
      "holdings": [
        { "ticker": "MSFT", "shares": 8 },
        ...
      ]
    }
  }
}
```

> 티커/수량은 **수동 관리** — 매수/매도 시 직접 업데이트

### 주가 데이터 파일 (`src/data/prices/YYYY-MM-DD.json`)

```json
{
  "date": "2026-05-13",
  "prices": {
    "AAPL": { "close": 189.50, "change": 1.23, "changePercent": 0.65 },
    "NVDA": { "close": 875.20, "change": -5.10, "changePercent": -0.58 },
    ...
  }
}
```

### 월별 통합 데이터 파일 (`src/data/prices/monthly/YYYY-MM.json`)

```json
{
  "month": "2026-03",
  "prices": {
    "AAPL": { "avgClose": 185.30, "monthChange": 2.10, "monthChangePercent": 1.15 },
    ...
  }
}
```

---

## 3. 데이터 보관 정책

```
30일 이내  → 일별 파일 보관 (YYYY-MM-DD.json)
30일 초과  → 월별 통합 파일로 압축 (YYYY-MM.json), 일별 파일 삭제
```

### 날짜 네비게이션 UI
- 최근 30일: 달력 또는 좌우 화살표로 일별 탐색
- 30일 이전: 월 단위 드롭다운

---

## 4. GitHub Actions 자동화

### 워크플로우: `.github/workflows/update-prices.yml`

```yaml
name: Update Stock Prices

on:
  schedule:
    - cron: '0 0 * * 1-5'   # UTC 00:00 = KST 09:00, 평일만
  workflow_dispatch:          # 수동 트리거 가능

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Fetch stock prices
        run: node scripts/fetch-prices.js
        env:
          STOCK_API_KEY: ${{ secrets.STOCK_API_KEY }}

      - name: Archive old daily files (30일 초과 → 월별 통합)
        run: node scripts/archive-prices.js

      - name: Commit & push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/data/prices/
          git diff --staged --quiet || git commit -m "chore: update stock prices $(date +%Y-%m-%d)"
          git push

      # Netlify는 main 브랜치 push 감지 → 자동 재빌드
```

---

## 5. 주가 API — **Financial Modeling Prep (FMP)** ✅

- 무료 한도: 250 req/day (80종목 일 1회 조회 충분)
- 배치 조회 지원
- `FMP_API_KEY` secret을 GitHub Repository Secrets에 등록 필요

---

## 6. 히트맵 UI 컴포넌트

### 레이아웃

```
┌─────────────────────────────────────────┐
│  📊 포트폴리오 히트맵   [자산증식형] [배당성장형] │
│                                         │
│  ◀  2026-05-13  ▶    [일별 ▼]          │
│                                         │
│  ┌────┬────┬────┬────┬────┐            │
│  │AAPL│NVDA│MSFT│GOOG│META│            │
│  │+1.2│-0.5│+2.1│+0.8│-1.3│           │
│  └────┴────┴────┴────┴────┘            │
│  (박스 크기 = 보유 비중, 색 = 등락률)     │
│                                         │
│  총 평가액: $XXX,XXX  |  당일 수익: +$X,XXX │
└─────────────────────────────────────────┘
```

### 색상 스케일
| 등락률 | 색상 |
|--------|------|
| +3% 이상 | 진한 초록 |
| +1% ~ +3% | 연한 초록 |
| -1% ~ +1% | 회색 (중립) |
| -1% ~ -3% | 연한 빨강 |
| -3% 이하 | 진한 빨강 |

### 인터랙션
- 박스 hover → 종목명, 현재가, 등락률, 보유 수량, 평가금액 툴팁 표시
- 박스 크기 = 보유 금액 비중 (treemap 방식)

---

## 7. 컴포넌트 파일 구조

```
src/
├── pages/
│   └── portfolio/
│       └── index.astro          # 히트맵 페이지 (noindex)
├── components/
│   └── heatmap/
│       ├── HeatMap.tsx           # 메인 히트맵 (React island)
│       ├── HeatMapCell.tsx       # 개별 종목 셀
│       ├── AccountTabs.tsx       # 계좌 전환 탭
│       ├── DateNavigator.tsx     # 날짜 탐색
│       └── Tooltip.tsx           # hover 툴팁
├── data/
│   ├── portfolio.json            # 티커/수량 (수동 관리)
│   └── prices/
│       ├── 2026-05-13.json       # 일별 주가
│       └── monthly/
│           └── 2026-04.json      # 월별 통합 주가
└── scripts/
    ├── fetch-prices.js           # GHA 주가 fetch
    └── archive-prices.js         # 30일 초과 파일 월별 통합
```

---

## 미결 결정 사항

모든 항목 결정 완료 ✅

| 항목 | 결정 |
|------|------|
| Easter egg 방식 | hover → 아이콘 노출 → 클릭 진입 + 전환 효과 + Vault 전용 다크 테마 |
| 히트맵 URL 경로 | `/vault` |
| 주가 API | Financial Modeling Prep (FMP) |
| 계좌명 표기 | 자산증식형 / 배당성장형 |
| 총 평가액 노출 여부 | 비율만 표시 (금액 숨김) |
