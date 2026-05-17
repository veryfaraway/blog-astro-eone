/**
 * fetch-prices.mjs
 *
 * GHA에서 실행. portfolio.json의 모든 ticker를 FMP API로 조회하여
 * src/data/prices/YYYY-MM-DD.json으로 저장합니다.
 *
 * 환경변수: FMP_API_KEY
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const FMP_API_KEY = process.env.FMP_API_KEY;
if (!FMP_API_KEY) {
  console.error('[fetch-prices] ERROR: FMP_API_KEY 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

// ── 1. portfolio.json에서 모든 ticker 추출 ────────────────────────────────

const portfolioPath = join(ROOT, 'src/data/portfolio.json');
const portfolioRaw = await readFile(portfolioPath, 'utf-8');
const portfolio = JSON.parse(portfolioRaw);

/** @type {Set<string>} */
const tickerSet = new Set();
for (const account of Object.values(portfolio.accounts)) {
  for (const holding of account.holdings) {
    tickerSet.add(holding.ticker);
  }
}
const tickers = [...tickerSet];
console.log(`[fetch-prices] 조회 ticker (${tickers.length}개): ${tickers.join(', ')}`);

// ── 2. FMP API 배치 조회 ──────────────────────────────────────────────────

const tickerStr = tickers.join(',');
const url = `https://financialmodelingprep.com/api/v3/quote/${tickerStr}?apikey=${FMP_API_KEY}`;

let rawData;
try {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  rawData = await res.json();
} catch (err) {
  console.error('[fetch-prices] API 요청 실패:', err.message);
  process.exit(1);
}

if (!Array.isArray(rawData) || rawData.length === 0) {
  console.error('[fetch-prices] 빈 응답을 받았습니다. API 키 또는 ticker를 확인하세요.');
  process.exit(1);
}

// ── 3. 오늘 날짜 파일로 저장 ──────────────────────────────────────────────

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

/** @type {Record<string, { close: number; change: number; changePercent: number }>} */
const prices = {};

for (const item of rawData) {
  if (!item.symbol) continue;
  prices[item.symbol] = {
    close: item.price ?? item.previousClose ?? 0,
    change: item.change ?? 0,
    changePercent: item.changesPercentage ?? 0,
  };
}

const output = { date: today, prices };

const pricesDir = join(ROOT, 'src/data/prices');
await mkdir(pricesDir, { recursive: true });

const outPath = join(pricesDir, `${today}.json`);
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf-8');

console.log(`[fetch-prices] 저장 완료: ${outPath}`);
console.log(`[fetch-prices] 수집 종목: ${Object.keys(prices).join(', ')}`);

const missing = tickers.filter((t) => !prices[t]);
if (missing.length > 0) {
  console.warn(`[fetch-prices] 주가 없음: ${missing.join(', ')}`);
}
