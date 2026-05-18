# 블로그 통합 마이그레이션

> Hugo/Eleventy 3개 블로그 → blog-astro-eone(Astro) 통합 작업 문서

## 배경

| 기존 블로그 | 스택 | 도메인 | 섹션 대응 |
|------------|------|--------|----------|
| mustardseed | Hugo (mainroad) | mustardseed.eone.one | life · money |
| burn | Eleventy (tech-ai) | burn.eone.one | dev · tools |
| popcorn | Eleventy (popcorn) | popcorn.eone.one | culture |

3개 블로그를 `blog.eone.one` 단일 도메인으로 통합. 기존 URL은 Netlify 리다이렉트로 301 처리.

## 마이그레이션 스크립트

```bash
node scripts/migrate.mjs --source=all       # 전체 실행
node scripts/migrate.mjs --source=hugo      # Hugo만
node scripts/migrate.mjs --source=popcorn   # Eleventy popcorn만
node scripts/migrate.mjs --source=techai    # Eleventy tech-ai만
node scripts/migrate.mjs --source=all --dry-run  # 미리보기
node scripts/migrate.mjs --source=all --force    # 덮어쓰기
```

## Netlify 리다이렉트 (`netlify.toml`)

```toml
[[redirects]]
  from = "https://mustardseed.eone.one/*"
  to = "https://blog.eone.one/life/:splat"
  status = 301

[[redirects]]
  from = "https://burn.eone.one/*"
  to = "https://blog.eone.one/dev/:splat"
  status = 301

[[redirects]]
  from = "https://popcorn.eone.one/*"
  to = "https://blog.eone.one/culture/:splat"
  status = 301
```

## 포스트별 진행 현황

→ [migration-checklist.md](./migration-checklist.md) 참고

## 슬러그 정책

- 파일명 = URL slug (front matter `slug` 필드 사용 안 함)
- kebab-case, 영문 소문자, 날짜 prefix 금지
- **배포 후 파일명 변경 = URL 변경** → 반드시 301 리다이렉트 처리
- 언어 suffix 금지 (`-ko`, `-en`)

## 관련 문서

- [개발 계획서](./dev-plan.md)
- [디자인 시스템](./design-system.md)
- [히트맵 스펙](./heatmap-spec.md)
