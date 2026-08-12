/**
 * fetch-coupang.mjs
 *
 * src/content의 모든 .mdx에서 <CoupangProductCard ... /> 사용처를 스캔하여
 * 쿠팡 파트너스 검색 API로 상품 정보를 조회하고 src/data/coupang-products.json에
 * 캐시합니다. 캐시된 상품은 다시 호출하지 않습니다.
 *
 * 이 캐시 파일은 반드시 커밋해야 합니다. CoupangProductCard.astro는 빌드 시
 * 이 JSON만 읽고 API를 호출하지 않습니다 (Netlify 빌드 = API 호출 0회).
 *
 * 검색 API는 호출 한도가 매우 낮습니다(시간당 수십 회 수준, 초과 시 약 24시간 봉인).
 * 그래서 캐시 미스인 항목만 순차 조회하고, 한도 초과를 감지하면 즉시 중단하고
 * 그때까지 받은 결과를 저장합니다.
 *
 * 사용법:
 *   pnpm coupang                  # 캐시에 없는 상품만 조회
 *   pnpm coupang --refresh        # 전체 상품 가격/정보 갱신 (한도 주의)
 *   pnpm coupang --retry-missing  # 이전에 '검색 결과 없음'이었던 항목 재시도
 *   pnpm coupang --dry-run        # 조회 대상만 출력하고 API 호출 안 함
 *
 * 환경변수: COUPANG_ACCESS_KEY, COUPANG_SECRET_KEY (.env)
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_PATH = join(ROOT, 'src/data/coupang-products.json');
const CONTENT_DIR = join(ROOT, 'src/content');

const args = process.argv.slice(2);
const REFRESH = args.includes('--refresh');
const RETRY_MISSING = args.includes('--retry-missing');
const DRY_RUN = args.includes('--dry-run');

// ── 0. .env 로드 (astro 없이 단독 실행되므로 직접 파싱) ────────────────────

async function loadEnv() {
  try {
    const raw = await readFile(join(ROOT, '.env'), 'utf-8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env 없음 → 실제 환경변수에 의존
  }
}

await loadEnv();

const accessKey = process.env.COUPANG_ACCESS_KEY;
const secretKey = process.env.COUPANG_SECRET_KEY;

// ── 1. mdx 스캔 → 카드 사용처 추출 ────────────────────────────────────────

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.mdx')) files.push(full);
  }
  return files;
}

const CARD_RE = /<CoupangProductCard\s+([^>]*?)\/>/g;
const ATTR_RE = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*([^}]*?)\s*\})/g;

function parseAttrs(attrString) {
  const attrs = {};
  for (const m of attrString.matchAll(ATTR_RE)) {
    const [, name, dq, sq, expr] = m;
    attrs[name] = (dq ?? sq ?? expr ?? '').replace(/^["']|["']$/g, '');
  }
  return attrs;
}

/**
 * 캐시 키 규칙 — CoupangProductCard.astro의 cacheKey()와 반드시 동일해야 합니다.
 * 한쪽만 바꾸면 전체 캐시가 미스가 됩니다.
 */
function cacheKey({ productId, itemId, keyword, pickIndex }) {
  if (productId && itemId) return String(productId);
  if (keyword) return `keyword:${keyword}:${pickIndex ?? 0}`;
  return null;
}

const mdxFiles = await walk(CONTENT_DIR);
const targets = new Map(); // cacheKey → { productId, itemId, keyword, pickIndex, sources[] }

for (const file of mdxFiles) {
  const src = await readFile(file, 'utf-8');
  for (const m of src.matchAll(CARD_RE)) {
    const attrs = parseAttrs(m[1]);
    // href가 직접 지정된 카드는 API 조회가 필요 없습니다.
    if (attrs.href) continue;
    const key = cacheKey(attrs);
    if (!key) continue;
    const rel = file.replace(ROOT + '/', '');
    if (targets.has(key)) targets.get(key).sources.push(rel);
    else targets.set(key, { ...attrs, sources: [rel] });
  }
}

console.log(`[coupang] mdx ${mdxFiles.length}개 스캔 → 카드 ${targets.size}종 발견`);

// ── 2. 캐시 로드 → 조회 대상 결정 ─────────────────────────────────────────

let cache;
try {
  cache = JSON.parse(await readFile(CACHE_PATH, 'utf-8'));
} catch {
  cache = { products: {} };
}
cache.products ??= {};

const pending = [];
for (const [key, target] of targets) {
  const cached = cache.products[key];
  if (!cached) pending.push([key, target]);
  else if (REFRESH) pending.push([key, target]);
  else if (cached.notFound && RETRY_MISSING) pending.push([key, target]);
}

const cachedCount = targets.size - pending.filter(([k]) => !cache.products[k]).length;
console.log(`[coupang] 캐시 보유 ${cachedCount}종 / 조회 대상 ${pending.length}종`);

if (pending.length === 0) {
  console.log('[coupang] 조회할 항목이 없습니다. (--refresh로 전체 갱신 가능)');
  process.exit(0);
}

if (DRY_RUN) {
  for (const [key, t] of pending) {
    console.log(`  - ${key}  ${t.keyword ? `keyword="${t.keyword}"` : `productId=${t.productId}`}  ← ${t.sources.join(', ')}`);
  }
  console.log('[coupang] --dry-run: API를 호출하지 않았습니다.');
  process.exit(0);
}

if (!accessKey || !secretKey) {
  console.error('[coupang] COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY가 없습니다.');
  process.exit(1);
}

// ── 3. 검색 API 호출 ──────────────────────────────────────────────────────

const API_PATH = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/search';

function authHeader(query) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const datetime =
    `${String(now.getUTCFullYear()).slice(-2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(`${datetime}GET${API_PATH}${query}`)
    .digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

class RateLimitError extends Error {}

async function search(keyword, limit) {
  const query = new URLSearchParams({ keyword, limit: String(limit) }).toString();
  const res = await fetch(`https://api-gateway.coupang.com${API_PATH}?${query}`, {
    headers: { Authorization: authHeader(query) },
  });
  const body = await res.json();

  // 한도 초과는 HTTP 200 + rCode 403으로 옵니다. res.ok만 보면 조용히 통과하므로
  // rCode를 반드시 확인해야 합니다.
  if (String(body?.rCode) === '403' || res.status === 429) {
    throw new RateLimitError(body?.rMessage ?? `HTTP ${res.status}`);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return body?.data?.productData ?? [];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let fetched = 0;
let notFound = 0;
let aborted = null;

for (const [key, target] of pending) {
  const exact = target.productId && target.itemId;
  // productId+itemId 조합 문자열을 검색어로 쓰면 해당 상품 1건만 매칭되는
  // 쿠팡 검색엔진의 경험적 동작을 이용합니다. 공식 문서에는 없는 동작이라,
  // 매칭 실패 시 notFound로 기록하고 keyword 폴백을 안내합니다.
  const keyword = exact ? `${target.productId} ${target.itemId}` : target.keyword;
  const pickIndex = exact ? 0 : Number(target.pickIndex ?? 0);

  try {
    const list = await search(keyword, Math.max(pickIndex + 1, 5));
    const found = exact
      ? list.find((p) => String(p.productId) === String(target.productId))
      : list[pickIndex];

    if (found) {
      cache.products[key] = {
        productId: found.productId,
        productName: found.productName,
        productImage: found.productImage,
        productPrice: found.productPrice,
        productUrl: found.productUrl,
        isRocket: !!found.isRocket,
        isFreeShipping: !!found.isFreeShipping,
        fetchedAt: new Date().toISOString(),
      };
      fetched++;
      console.log(`[coupang] ✓ ${key}: ${found.productName.slice(0, 40)} (${found.productPrice.toLocaleString()}원)`);
    } else {
      cache.products[key] = { notFound: true, checkedAt: new Date().toISOString() };
      notFound++;
      console.warn(`[coupang] ✗ ${key}: 검색 결과에 없음 — 파트너스 노출 제외 상품일 수 있습니다.`);
      console.warn(`           사용처: ${target.sources.join(', ')}`);
    }
  } catch (err) {
    if (err instanceof RateLimitError) {
      aborted = err.message;
      break;
    }
    console.warn(`[coupang] ✗ ${key}: ${err.message}`);
  }

  await sleep(500);
}

// ── 4. 저장 ───────────────────────────────────────────────────────────────

const sorted = Object.fromEntries(Object.entries(cache.products).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(CACHE_PATH, JSON.stringify({ products: sorted }, null, 2) + '\n', 'utf-8');

console.log(`\n[coupang] 저장 완료: src/data/coupang-products.json`);
console.log(`[coupang] 신규/갱신 ${fetched}종, 검색 결과 없음 ${notFound}종, 캐시 총 ${Object.keys(sorted).length}종`);

if (aborted) {
  const remaining = pending.length - fetched - notFound;
  console.error(`\n[coupang] ⚠ API 호출 한도 초과로 중단했습니다: ${aborted}`);
  console.error(`[coupang] 미조회 ${remaining}종이 남았습니다. 한도 리셋 후 다시 실행하세요.`);
  console.error(`[coupang] (여기까지 받은 결과는 저장되었습니다)`);
  process.exit(1);
}

if (notFound > 0) {
  console.warn(`\n[coupang] 검색 결과가 없던 상품은 카드가 렌더링되지 않습니다.`);
  console.warn(`[coupang] keyword="상품명" 방식으로 바꾸거나 다른 상품으로 교체하세요.`);
}
