/**
 * archive-prices.mjs
 *
 * src/data/prices/ 디렉토리의 일별 파일 중 30일 초과된 것들을
 * 월별 파일(src/data/prices/monthly/YYYY-MM.json)로 통합하고
 * 원본 일별 파일을 삭제합니다.
 */

import { readdir, readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PRICES_DIR = join(ROOT, 'src/data/prices');
const MONTHLY_DIR = join(PRICES_DIR, 'monthly');

// ── 1. 30일 초과 일별 파일 목록 ───────────────────────────────────────────

const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - 30);
const cutoffStr = cutoff.toISOString().slice(0, 10); // YYYY-MM-DD

let files;
try {
  files = await readdir(PRICES_DIR);
} catch {
  console.log('[archive-prices] prices 디렉토리가 없습니다. 종료합니다.');
  process.exit(0);
}

const dailyFiles = files.filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
const toArchive = dailyFiles.filter((f) => f.replace('.json', '') < cutoffStr);

if (toArchive.length === 0) {
  console.log('[archive-prices] 아카이브 대상 파일 없음.');
  process.exit(0);
}

console.log(`[archive-prices] 아카이브 대상: ${toArchive.length}개 파일`);

// ── 2. 월별 그룹핑 ────────────────────────────────────────────────────────

/** @type {Map<string, Array<{ date: string; prices: Record<string, unknown> }>>} */
const monthlyMap = new Map();

for (const file of toArchive) {
  const dateStr = file.replace('.json', '');
  const monthKey = dateStr.slice(0, 7); // YYYY-MM

  const raw = await readFile(join(PRICES_DIR, file), 'utf-8');
  const data = JSON.parse(raw);

  if (!monthlyMap.has(monthKey)) {
    monthlyMap.set(monthKey, []);
  }
  monthlyMap.get(monthKey).push(data);
}

// ── 3. 월별 파일 생성/병합 ────────────────────────────────────────────────

await mkdir(MONTHLY_DIR, { recursive: true });

for (const [month, dailyRecords] of monthlyMap.entries()) {
  const outPath = join(MONTHLY_DIR, `${month}.json`);

  // 기존 월별 파일이 있으면 읽어서 병합
  let existing = { month, days: [] };
  try {
    const raw = await readFile(outPath, 'utf-8');
    existing = JSON.parse(raw);
    if (!Array.isArray(existing.days)) existing.days = [];
  } catch {
    // 새 파일
  }

  // 날짜 중복 방지: 기존 날짜 집합
  const existingDates = new Set(existing.days.map((d) => d.date));

  for (const record of dailyRecords) {
    if (!existingDates.has(record.date)) {
      existing.days.push(record);
    }
  }

  // 날짜 순으로 정렬
  existing.days.sort((a, b) => a.date.localeCompare(b.date));

  await writeFile(outPath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
  console.log(`[archive-prices] 월별 파일 업데이트: ${outPath} (${existing.days.length}일치)`);
}

// ── 4. 아카이브된 일별 파일 삭제 ─────────────────────────────────────────

for (const file of toArchive) {
  await unlink(join(PRICES_DIR, file));
  console.log(`[archive-prices] 삭제: ${file}`);
}

console.log('[archive-prices] 완료.');
