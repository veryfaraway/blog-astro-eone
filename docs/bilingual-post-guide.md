# 영문/한글 이중 언어 포스트 작성 가이드

> **Claude 작업 지침:** 포스트에 영어(en) 버전을 함께 작성할 때 이 문서를 먼저 확인할 것.
> 일반 frontmatter·경로·컴포넌트 규칙은 [`docs/post-writing-guide.md`](post-writing-guide.md) 참고.

---

## 기본 원칙

- **한국어(ko)가 기본**. 모든 포스트는 ko 버전이 있어야 하며, en 버전은 **선택사항**이다.
- en 버전 작성 여부는 자유지만, 작성한다면 아래 규칙을 반드시 지켜야 한다. 어겼을 때 실제로 GSC에 "Duplicate, Google chose different canonical than user" 경고가 발생한 적이 있다 (원인: ko/en 상호 링크 불일치 → 자세한 배경은 [`docs/migration.md`](migration.md) 참고 안 해도 됨, 이 문서로 충분).

---

## 1. slug는 ko/en 완전히 동일해야 한다 (가장 중요)

```
src/content/{섹션}/ko/{연도}/{slug}.md(x)
src/content/{섹션}/en/{연도}/{slug}.md(x)
```

두 파일의 `{slug}`가 **한 글자도 다르지 않게 동일**해야 한다.

**이유**: `src/pages/[section]/[slug].astro`와 `src/pages/en/[section]/[slug].astro`는 같은 slug를 가진 반대 언어 파일이 있는지를 문자열 비교로만 찾는다 (`enSlugs.has(slug)` / `koSlugs.has(slug)`). slug가 어긋나면:

- 언어 전환 버튼(`LanguageSwitcher`)이 안 뜨거나 엉뚱한 글로 연결됨
- `<link rel="alternate" hreflang="...">`이 아예 생성되지 않아 Google이 ko/en을 서로 다른 언어의 같은 글로 인식하지 못함
- 최악의 경우 두 글이 "중복 콘텐츠"로 오인되어 canonical이 원치 않는 쪽으로 결정됨

연도 폴더(`2026/` 등)는 ko/en이 달라도 무방하다 — slug만 일치하면 된다.

---

## 2. Frontmatter 필드별 번역 규칙

| 필드 | 규칙 |
|------|------|
| `title`, `description` | **반드시 번역**. 검색엔진에 노출되는 핵심 텍스트. |
| `category` | **번역 권장**. 영어 독자가 볼 텍스트이므로 `주절주절` 대신 `Chit-chat`처럼 영문 카테고리명 사용 (기존 en 포스트 대부분 `Fishkeeping`, `Backend`, `Trends` 등 영문 사용 중 — 통일할 것). |
| `tags` | **번역 권장**, 단 ko/en 태그가 서로 일치할 필요는 없음. 각 언어 리스팅 페이지에서 독립적으로 사용되는 배열이라 자유롭게 작성 가능. |
| `series` | ko/en이 **같은 문자열일 필요 없음** — 같은 언어의 포스트끼리만 문자열이 일치하면 하나의 시리즈로 묶인다. 번역해서 써도 되고(`"DeReel Dev Log"` vs `"DeReel 개발기"`), 원문 그대로 유지해도 된다. **단, 같은 언어 내에서는 시리즈 전편에 걸쳐 완전히 동일한 문자열이어야 한다.** |
| `series_order` | 언어별로 독립적으로 매긴다 (보통 ko/en 동일한 순서를 쓰면 됨). |
| `thumbnail` | ko와 동일 이미지를 재사용해도 되고, 비워둬도 된다(`thumbnail: ""`). 필수 아님. |
| `lang` | en 파일은 반드시 `lang: en` 명시. |
| `draft` | ko/en 독립적으로 설정 가능 — 예: ko는 공개하고 en 번역은 아직 `draft: true`로 미공개 상태 유지 가능. |

---

## 3. 본문(MDX) 안에서 다른 포스트를 링크할 때

템플릿 코드(브레드크럼, 이전/다음 글, 시리즈 네비게이션)는 `src/lib/i18n.ts`의 `getLocalizedPath()`가 자동으로 언어 프리픽스를 붙여주지만, **본문 마크다운/MDX 안에 직접 쓰는 링크는 자동 처리되지 않는다.** 작성자가 직접 프리픽스를 붙여야 한다.

```md
<!-- ko 본문 -->
[지난 편](/dev/dereel-1a-github-actions-crawling-bot)

<!-- en 본문 -->
[Last time](/en/dev/dereel-1a-github-actions-crawling-bot)
```

en 본문에서 `/en/` 프리픽스를 빠뜨리면 링크가 ko 페이지로 연결된다.

---

## 4. 사이트 전역 네비게이션은 en 버전이 없다

`/blog`, `/sections`, `/tags`, `/about`, 홈(`/`)은 아직 en 전용 페이지가 없다. en 포스트를 작성해도 헤더 내비게이션, 태그 클라우드, 목록 페이지는 ko로 연결된다 — 의도된 동작이며 고칠 필요 없음.

---

## 5. 빌드 후 확인 체크리스트

새 ko/en 쌍 포스트를 추가했다면 `pnpm build` 후 아래를 확인:

```bash
grep -o 'rel="canonical"[^>]*\|hreflang="[^"]*" href="[^"]*"' dist/{섹션}/{slug}/index.html
grep -o 'rel="canonical"[^>]*\|hreflang="[^"]*" href="[^"]*"' dist/en/{섹션}/{slug}/index.html
```

- 두 출력의 `href`가 trailing slash까지 완전히 대칭인지
- `hreflang="x-default"`가 두 페이지 모두 **ko** URL을 가리키는지

(한글이 포함된 파일은 `grep`이 로케일 문제로 조용히 실패할 수 있다 — 매칭이 안 되면 `python3`으로 직접 파일을 읽어 확인할 것.)
