/**
 * fetch-prices.mjs
 *
 * GHA에서 실행. portfolio.json의 모든 ticker를 Yahoo Finance chart API로 조회하여
 * src/data/prices/YYYY-MM-DD.json으로 저장합니다.
 *
 * API 키 불필요 (Yahoo Finance v8 chart API 사용)
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'application/json',
};

// ── 1. portfolio.json에서 모든 ticker 추출 ────────────────────────────────

const portfolioRaw = await readFile(join(ROOT, 'src/data/portfolio.json'), 'utf-8');
const portfolio = JSON.parse(portfolioRaw);

const tickerSet = new Set();
for (const account of Object.values(portfolio.accounts)) {
  for (const { ticker } of account.holdings) tickerSet.add(ticker);
}
const tickers = [...tickerSet];
console.log(`[fetch-prices] 조회 ticker (${tickers.length}개): ${tickers.join(', ')}`);

// ── 2. 단일 ticker 조회 함수 ──────────────────────────────────────────────

async function fetchQuote(ticker) {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('응답 형식 오류');
  return {
    close:         meta.regularMarketPrice         ?? meta.previousClose ?? 0,
    change:        (meta.regularMarketPrice ?? 0) - (meta.previousClose ?? 0),
    changePercent: meta.regularMarketChangePercent ?? 0,
  };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── 3. 순차 조회 (rate limit 회피) ────────────────────────────────────────

const prices = {};
for (const ticker of tickers) {
  try {
    prices[ticker] = await fetchQuote(ticker);
    console.log(`[fetch-prices] ✓ ${ticker}: $${prices[ticker].close.toFixed(2)} (${prices[ticker].changePercent.toFixed(2)}%)`);
  } catch (err) {
    console.warn(`[fetch-prices] ✗ ${ticker}: ${err.message}`);
  }
  await sleep(300); // 0.3초 간격
}

if (Object.keys(prices).length === 0) {
  console.error('[fetch-prices] 수집된 데이터가 없습니다.');
  process.exit(1);
}

// ── 4. 오늘 날짜 파일로 저장 ──────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10);
const output = { date: today, prices };

const pricesDir = join(ROOT, 'src/data/prices');
await mkdir(pricesDir, { recursive: true });

const outPath = join(pricesDir, `${today}.json`);
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');

console.log(`\n[fetch-prices] 저장 완료: src/data/prices/${today}.json`);
console.log(`[fetch-prices] 수집 ${Object.keys(prices).length}개 / 전체 ${tickers.length}개`);

const missing = tickers.filter(t => !prices[t]);
if (missing.length > 0) console.warn(`[fetch-prices] 누락: ${missing.join(', ')}`);
