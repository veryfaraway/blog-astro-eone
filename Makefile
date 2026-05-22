# blog-astro-eone Makefile
# 사용법: make <target>

.PHONY: help dev build preview check \
        clean clean-cache clean-dist clean-all \
        install fresh logs

# 기본: help 출력
.DEFAULT_GOAL := help

# ── 개발 ─────────────────────────────────────────────
dev:				## 개발 서버 시작 (localhost:4321)
	pnpm dev

build:				## 프로덕션 빌드
	pnpm build

preview:			## 빌드 결과 미리보기 (build 먼저 실행)
	pnpm preview

build-preview:			## 빌드 후 바로 미리보기
	pnpm build && pnpm preview

check:				## TypeScript / Astro 타입 체크
	pnpm astro check

# ── 정리 ─────────────────────────────────────────────
clean-cache:			## Astro 콘텐츠 캐시 제거 (.astro/)
	rm -rf .astro
	@echo "✓ .astro 캐시 제거됨"

clean-dist:			## 빌드 결과물 제거 (dist/)
	rm -rf dist
	@echo "✓ dist 제거됨"

clean:				## 캐시 + 빌드 결과물 제거
	rm -rf .astro dist
	@echo "✓ .astro, dist 제거됨"

clean-all:			## 캐시 + 빌드 + node_modules 제거
	rm -rf .astro dist node_modules
	@echo "✓ .astro, dist, node_modules 제거됨"

# ── 의존성 ───────────────────────────────────────────
install:			## 패키지 설치
	pnpm install

fresh:				## clean-all → install → dev (깨끗한 재시작)
	$(MAKE) clean-all
	pnpm install
	pnpm dev

# ── 도움말 ───────────────────────────────────────────
help:				## 사용 가능한 명령 목록
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
