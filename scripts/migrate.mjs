#!/usr/bin/env node
/**
 * 마이그레이션 스크립트 — Hugo/Eleventy → Astro
 *
 * 사용법:
 *   node scripts/migrate.mjs --source=hugo    [--dry-run] [--force]
 *   node scripts/migrate.mjs --source=popcorn [--dry-run] [--force]
 *   node scripts/migrate.mjs --source=techai  [--dry-run] [--force]
 *   node scripts/migrate.mjs --source=all     [--dry-run] [--force]
 *
 * 옵션:
 *   --dry-run  파일을 실제로 쓰지 않고 변환 결과만 출력
 *   --force    이미 존재하는 파일도 덮어씀
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ASTRO_ROOT = path.resolve(__dirname, '..');
const WORKSPACE  = path.resolve(ASTRO_ROOT, '..');

// ── 경로 ──────────────────────────────────────────────────────────────

const SRC = {
  hugo:    path.join(WORKSPACE, 'blog-general-hugo-mainroad/content/post'),
  popcorn: path.join(WORKSPACE, 'eleventy/blog-eleventy-popcorn/src/posts'),
  techai:  path.join(WORKSPACE, 'eleventy/blog-eleventy-tech-ai/src/posts'),
};
const POPCORN_IMG_SRC = path.join(WORKSPACE, 'eleventy/blog-eleventy-popcorn/src/assets/images');
const CONTENT_OUT     = path.join(ASTRO_ROOT, 'src/content');
const PUBLIC_IMG      = path.join(ASTRO_ROOT, 'public/images');

// ── 섹션 매핑 ─────────────────────────────────────────────────────────

const HUGO_SECTION = {
  frugal:    'money',
  aqualife:  'life',
  baby:      'life',
  christian: 'life',
  ev:        'life',
  gosip:     'life',
  tmi:       'life',
  examples:  null,   // 제외 (draft 전용)
};

const techaiSection = (cat) => cat === 'Tools' ? 'tools' : 'dev';

// ── CLI ───────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const SOURCE  = args.find(a => a.startsWith('--source='))?.split('=')[1] ?? 'all';
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');

const stats = { converted: 0, skipped: 0, error: 0 };

// ── 파일 유틸 ─────────────────────────────────────────────────────────

function mkdirp(dir) {
  if (!DRY_RUN) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  if (!DRY_RUN) { mkdirp(path.dirname(filePath)); fs.writeFileSync(filePath, content, 'utf-8'); }
}

function copyFile(src, dest) {
  if (!DRY_RUN && fs.existsSync(src)) { mkdirp(path.dirname(dest)); fs.copyFileSync(src, dest); }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDirRecursive(s, d);
    else if (!DRY_RUN) fs.copyFileSync(s, d);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkDir(full));
    else if (e.name.endsWith('.md')) files.push(full);
  }
  return files;
}

// ── YAML 파서 (외부 의존성 없음) ──────────────────────────────────────

function parseSimpleYaml(str) {
  const result = {};
  let currentKey = null, currentArr = null;
  for (const line of str.split('\n')) {
    if (/^\s+-\s/.test(line)) {
      currentArr?.push(line.replace(/^\s+-\s+/, '').replace(/^['"]|['"]$/g, '').trim());
      continue;
    }
    const m = line.match(/^([\w-]+):\s*(.*)/);
    if (!m) continue;
    [, currentKey] = m;
    const raw = m[2].trim();
    currentArr = null;
    if (raw === '')           { currentArr = []; result[currentKey] = currentArr; }
    else if (raw === 'true')  result[currentKey] = true;
    else if (raw === 'false') result[currentKey] = false;
    else if (/^\d{4}-\d{2}-\d{2}/.test(raw)) result[currentKey] = new Date(raw.split('T')[0]);
    else result[currentKey] = raw.replace(/^['"]|['"]$/g, '');
  }
  return result;
}

// ── TOML 파서 (Hugo flat 구조 전용) ──────────────────────────────────

function parseSimpleToml(str) {
  const result = {};
  for (const line of str.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([\w-]+)\s*=\s*([\s\S]+)/);
    if (!m) continue;
    const [, key, raw] = m;
    const v = raw.trim();
    if (v.startsWith('[')) {
      result[key] = v.slice(1, v.lastIndexOf(']'))
        .split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    } else if (/^['"]/.test(v)) {
      const q = v[0]; const end = v.lastIndexOf(q);
      result[key] = end > 0 ? v.slice(1, end) : v.slice(1);
    } else if (v === 'true')  result[key] = true;
    else if (v === 'false') result[key] = false;
    else if (/^\d{4}-\d{2}-\d{2}/.test(v)) result[key] = new Date(v.split('T')[0]);
    else if (/^\d+$/.test(v)) result[key] = parseInt(v);
    else result[key] = v;
  }
  return result;
}

// ── Markdown 파일 읽기 ────────────────────────────────────────────────

function readMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  // TOML frontmatter
  if (raw.startsWith('+++')) {
    const end = raw.indexOf('\n+++', 3);
    if (end === -1) return { data: {}, content: raw };
    return { data: parseSimpleToml(raw.slice(3, end)), content: raw.slice(end + 4).trim() };
  }
  // YAML frontmatter
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end === -1) return { data: {}, content: raw };
    return { data: parseSimpleYaml(raw.slice(3, end)), content: raw.slice(end + 4).trim() };
  }
  return { data: {}, content: raw };
}

// ── Frontmatter 변환 ─────────────────────────────────────────────────

function transformFm(data) {
  const fm = {};
  fm.title       = String(data.title || '').trim();
  fm.description = String(data.description || '').trim();

  const d = data.date;
  fm.date = d instanceof Date
    ? d.toISOString().split('T')[0]
    : String(d || '').slice(0, 10);

  fm.category = Array.isArray(data.categories)
    ? String(data.categories[0] || '')
    : String(data.category || '');

  fm.tags  = (Array.isArray(data.tags) ? data.tags : []).map(String);
  fm.draft = Boolean(data.draft ?? false);
  fm.lang  = 'ko';
  if (data.thumbnail) fm.thumbnail = String(data.thumbnail);
  return fm;
}

function fmToYaml(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) lines.push(`${k}: []`);
      else { lines.push(`${k}:`); v.forEach(i => lines.push(`  - ${JSON.stringify(String(i))}`)); }
    } else if (typeof v === 'boolean') {
      lines.push(`${k}: ${v}`);
    } else {
      const s = String(v);
      const needsQuote = /[:[\]{}&*!|>'"%@`,]/.test(s) || s.startsWith(' ') || s === '' || s.startsWith('#');
      lines.push(`${k}: ${needsQuote ? JSON.stringify(s) : s}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// ── YouTube ID 추출 ───────────────────────────────────────────────────

function ytId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

const ytEmbed = (id) =>
  `<iframe src="https://www.youtube.com/embed/${id}" class="w-full aspect-video rounded-lg my-6" allowfullscreen loading="lazy" title="YouTube video"></iframe>`;

// ── Alert HTML 변환 헬퍼 ──────────────────────────────────────────────

const ALERT_ICONS = { info: '💡', warning: '⚠️', success: '✅', danger: '🚨', tip: '💡' };

function alertDiv(type, title, body) {
  const icon = ALERT_ICONS[type] ?? '💡';
  const titleHtml = title ? `<p class="alert-title">${icon} ${title}</p>\n` : '';
  return `<div class="alert alert-${type}">\n${titleHtml}\n${body.trim()}\n\n</div>`;
}

// ── 코드 블록 보호 헬퍼 ───────────────────────────────────────────────

function withCodeProtection(content, fn) {
  const blocks = [];
  let s = content;
  // script/style 블록 보호
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, m => { blocks.push(m); return `\x00CODE${blocks.length - 1}\x00`; });
  // 펜스 코드 블록 보호
  s = s.replace(/```[\s\S]*?```/g, m => { blocks.push(m); return `\x00CODE${blocks.length - 1}\x00`; });
  // 인라인 코드 보호
  s = s.replace(/`[^`\n]+`/g, m => { blocks.push(m); return `\x00CODE${blocks.length - 1}\x00`; });
  s = fn(s);
  // 복원
  return s.replace(/\x00CODE(\d+)\x00/g, (_, i) => blocks[parseInt(i)]);
}

// ── Shortcode 변환 ────────────────────────────────────────────────────

function transformShortcodes(content) {
  let s = content;

  // {% raw %} / {% endraw %} 제거
  s = s.replace(/\{%-?\s*raw\s*-?%\}/g, '').replace(/\{%-?\s*endraw\s*-?%\}/g, '');

  // Eleventy: {% alert "type", "title" %} ... {% endalert %} → HTML div
  s = s.replace(
    /\{%-?\s*alert\s+"([^"]+)"(?:\s*,\s*"([^"]*)")?\s*-?%\}([\s\S]*?)\{%-?\s*endalert\s*-?%\}/g,
    (_, type, title, body) => alertDiv(type, title, body)
  );

  // Hugo: {{< alert type="..." title="..." >}} ... {{< /alert >}} → HTML div
  s = s.replace(
    /\{\{<\s*alert(?:\s+([^>]*?))?\s*>\}\}([\s\S]*?)\{\{<\s*\/alert\s*>\}\}/g,
    (_, attrs = '', body) => {
      const type  = attrs.match(/type="([^"]+)"/)?.[1] ?? 'info';
      const title = attrs.match(/title="([^"]+)"/)?.[1];
      return alertDiv(type, title, body);
    }
  );

  // Eleventy: {% youtube "URL" %}
  s = s.replace(/\{%-?\s*youtube\s+"([^"]+)"\s*-?%\}/g, (_, u) => {
    const id = ytId(u);
    return id ? ytEmbed(id) : `<!-- youtube: ${u} -->`;
  });

  // Hugo: {{< youtube ID >}} or {{< youtube "ID" >}}
  s = s.replace(
    /\{\{<\s*youtube(?:\s+id=)?\s*"?([A-Za-z0-9_-]{11})"?[^>]*>\}\}/g,
    (_, id) => ytEmbed(id)
  );

  // Hugo: {{< mermaid >}} ... {{< /mermaid >}}
  s = s.replace(
    /\{\{<\s*mermaid\s*>\}\}([\s\S]*?)\{\{<\s*\/mermaid\s*>\}\}/g,
    (_, body) => '```mermaid\n' + body.trim() + '\n```'
  );

  // Hugo: {{< chartjs >}} — TODO 주석으로 보존
  s = s.replace(
    /\{\{<\s*chartjs[^>]*>\}\}([\s\S]*?)\{\{<\s*\/chartjs\s*>\}\}/g,
    (_, body) => `<!-- TODO:chartjs\n${body.trim()}\n-->`
  );

  // Hugo: {{< clock24 >}} — TODO 주석으로 보존
  s = s.replace(
    /\{\{<\s*clock24[^>]*>\}\}([\s\S]*?)\{\{<\s*\/clock24\s*>\}\}/g,
    (_, body) => `<!-- TODO:clock24\n${body.trim()}\n-->`
  );

  // Hugo: {{< ref "/post/category/year/slug" >}} → /section/slug
  s = s.replace(/\{\{<\s*ref\s+"([^"]+)"\s*>\}\}/g, (_, refPath) => {
    const parts  = refPath.replace(/^\/post\//, '').split('/');
    const cat    = parts[0];
    const slug   = parts[parts.length - 1].replace(/\.(md|mdx)$/, '');
    const sec    = HUGO_SECTION[cat] ?? 'life';
    return `/${sec}/${slug}`;
  });

  // Eleventy: {% personInline "이름", ... %} → 이름만
  s = s.replace(/\{%-?\s*personInline\s+"([^"]+)"[^%]*-?%\}/g, (_, name) => name);

  // Eleventy: {% person "이름", "역할", "이미지URL", ... %} → 이름만
  s = s.replace(/\{%-?\s*person\s+"([^"]+)"[^%]*-?%\}/g, (_, name) => name);

  // Eleventy: {% movie "제목", ... %} → 제목만
  s = s.replace(/\{%-?\s*movie\s+"([^"]+)"[^%]*-?%\}/g, (_, title) => title);

  // Eleventy: {% cloudinary "URL", "alt" %} → 마크다운 이미지
  s = s.replace(/\{%-?\s*cloudinary\s+"([^"]+)"(?:\s*,\s*"([^"]*)")?\s*-?%\}/g, (_, url, alt = '') => {
    return `![${alt}](${url})`;
  });

  // Eleventy: {% button "텍스트", "URL" %} → 마크다운 링크
  s = s.replace(/\{%-?\s*button\s+"([^"]+)"\s*,\s*"([^"]+)"\s*-?%\}/g, (_, text, url) => `[${text}](${url})`);

  // Eleventy: {% adsense "..." %} → 제거
  s = s.replace(/\{%-?\s*adsense\s*"[^"]*"\s*-?%\}/g, '');

  // 나머지 Hugo shortcode → 주석
  s = s.replace(/\{\{<[^>]+>\}\}/g, m => `<!-- hugo: ${m.trim()} -->`);

  // MDX 파싱 오류 방지: 코드 블록 밖의 <한글...> → 《...》
  s = withCodeProtection(s, t =>
    t.replace(/<([가-힣][^>\n]{0,60})>/g, (_, inner) => `《${inner}》`)
  );

  // void 태그 self-closing 처리: <br> → <br />, <hr> → <hr />
  s = withCodeProtection(s, t =>
    t.replace(/<(br|hr|img|input|meta|link)(\s[^>]*)?>(?!\/)/gi, (_, tag, attrs = '') => `<${tag}${attrs} />`)
  );

  // HTML 주석 → MDX 주석 (코드/script/style 블록 밖만)
  s = withCodeProtection(s, t =>
    t.replace(/<!--([\s\S]*?)-->/g, (_, inner) => `{/*${inner}*/}`)
  );

  return s;
}

// ── 이미지 경로 치환 ─────────────────────────────────────────────────

function transformImages(content, srcFilePath, hasLocalImages) {
  let s = content;

  if (hasLocalImages) {
    const srcDir = path.dirname(srcFilePath);
    const IMG_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
    // ./img.png, img.png 형태 모두 처리 (title 포함 형태도)
    s = s.replace(/!\[([^\]]*)\]\(\.?\/?([^)"'\s][^)"'\s]*)[^)]*\)/g, (match, alt, imgName) => {
      if (!IMG_EXT.test(imgName)) return match;
      if (imgName.startsWith('http')) return match;
      const cleanName = imgName.replace(/^\.\//, '');
      const imgSrc  = path.join(srcDir, cleanName);
      const baseName = path.basename(cleanName);
      const imgDest = path.join(PUBLIC_IMG, baseName);
      copyFile(imgSrc, imgDest);
      return `![${alt}](/images/${baseName})`;
    });
  }

  // Eleventy: /assets/images/ → /images/
  s = s.replace(/\/assets\/images\//g, '/images/');

  return s;
}

// ── 단일 파일 변환 ────────────────────────────────────────────────────

function convertFile(srcPath, section, { hasLocalImages = false } = {}) {
  let data, content;
  try {
    ({ data, content } = readMarkdown(srcPath));
  } catch (e) {
    console.error(`  ✗ 읽기 오류: ${path.basename(srcPath)} — ${e.message}`);
    stats.error++;
    return;
  }

  if (data.draft) return; // draft 건너뜀 (조용히)
  if (!data.title) return;

  const fm   = transformFm(data);
  const slug = String(data.slug || path.basename(srcPath, '.md'));

  // 모든 파일을 .md로 출력 (Alert은 HTML div로 변환됨)
  const destPath = path.join(CONTENT_OUT, section, 'ko', `${slug}.md`);

  // 이전에 .mdx로 만들어진 파일이 있으면 제거
  const oldMdx = path.join(CONTENT_OUT, section, 'ko', `${slug}.mdx`);
  if (fs.existsSync(oldMdx) && !DRY_RUN) fs.unlinkSync(oldMdx);

  if (fs.existsSync(destPath) && !FORCE) {
    process.stdout.write(`  → 건너뜀: ${slug}.mdx\n`);
    stats.skipped++;
    return;
  }

  let body = transformShortcodes(content);
  body = transformImages(body, srcPath, hasLocalImages);

  const output = `${fmToYaml(fm)}\n\n${body}\n`;

  writeFile(destPath, output);

  if (DRY_RUN) {
    console.log(`  [dry] ${section}/ko/${slug}.mdx  |  "${fm.title.slice(0, 40)}"`);
  } else {
    console.log(`  ✓ ${section}/ko/${slug}.mdx`);
  }
  stats.converted++;
}

// ── Hugo 마이그레이션 ─────────────────────────────────────────────────

function migrateHugo() {
  console.log('\n📦  Hugo (mustardseed)');
  const cats = fs.readdirSync(SRC.hugo, { withFileTypes: true })
    .filter(e => e.isDirectory()).map(e => e.name);

  for (const cat of cats) {
    const section = HUGO_SECTION[cat];
    if (section === null) { console.log(`  skip: ${cat} (excluded)`); continue; }
    if (!section)         { console.log(`  skip: ${cat} (no mapping)`); continue; }

    const files = walkDir(path.join(SRC.hugo, cat));
    console.log(`  ${cat} → ${section} (${files.length})`);
    for (const f of files) convertFile(f, section, { hasLocalImages: true });
  }
}

// ── Popcorn 마이그레이션 ──────────────────────────────────────────────

function migratePopcorn() {
  console.log('\n🍿  Eleventy (popcorn)');

  // 이미지 디렉토리 전체 복사
  if (fs.existsSync(POPCORN_IMG_SRC)) {
    if (DRY_RUN) console.log('  [dry] 이미지 복사 생략');
    else { copyDirRecursive(POPCORN_IMG_SRC, PUBLIC_IMG); console.log('  이미지 복사 완료'); }
  }

  const files = walkDir(SRC.popcorn);
  console.log(`  culture (${files.length})`);
  for (const f of files) convertFile(f, 'culture');
}

// ── Tech-AI 마이그레이션 ──────────────────────────────────────────────

function migrateTechai() {
  console.log('\n🔥  Eleventy (tech-ai)');
  const files = walkDir(SRC.techai);
  console.log(`  총 ${files.length}개`);
  for (const f of files) {
    const { data } = readMarkdown(f);
    const section  = techaiSection(String(data.category || ''));
    convertFile(f, section);
  }
}

// ── 실행 ─────────────────────────────────────────────────────────────

console.log(`\n🚀  마이그레이션 시작`);
console.log(`    source=${SOURCE}  dry-run=${DRY_RUN}  force=${FORCE}`);

if (['all', 'hugo'].includes(SOURCE))    migrateHugo();
if (['all', 'popcorn'].includes(SOURCE)) migratePopcorn();
if (['all', 'techai'].includes(SOURCE))  migrateTechai();

console.log(`\n📊  결과`);
console.log(`    ✓ 변환됨: ${stats.converted}`);
console.log(`    → 건너뜀: ${stats.skipped}`);
console.log(`    ✗ 오류:   ${stats.error}`);
