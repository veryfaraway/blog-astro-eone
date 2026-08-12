# blog-astro-eone Makefile
# 사용법: make <target>

.PHONY: help dev build preview build-preview check \
        clean clean-cache clean-dist clean-all \
        install fresh logs \
        coupang coupang-dry coupang-retry coupang-refresh

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

# ── 쿠팡 상품 캐시 ───────────────────────────────────
# 상품 정보는 src/data/coupang-products.json(커밋 대상)에서만 읽는다.
# 빌드 중에는 API를 호출하지 않으므로, 카드를 추가했으면 아래를 실행하고
# 캐시 JSON을 함께 커밋해야 한다.
#
# ⚠️ 검색 API 한도는 시간당 수십 회 수준이고, 초과가 3회 누적되면
#    파트너스 계정 이용이 제한된다. refresh는 꼭 필요할 때만.

coupang:			## 쿠팡 캐시 갱신 (캐시에 없는 상품만 조회 — 평소 이것만)
	pnpm coupang

coupang-dry:			## 조회 대상만 출력 (API 호출 없음, 안전)
	pnpm coupang --dry-run

coupang-retry:			## '검색 결과 없음'이었던 항목만 재시도
	pnpm coupang --retry-missing

coupang-refresh:		## 전체 상품 재조회 (한도 소모 큼 — 확인 후 실행)
	@echo "⚠️  전체 상품을 재조회합니다. 카드 수만큼 API를 호출합니다."
	@echo "   한도 초과 3회 누적 시 파트너스 계정이 제한됩니다."
	@printf "   계속하시겠습니까? [y/N] "; \
		read ans; \
		if [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then \
			pnpm coupang --refresh; \
		else \
			echo "   취소됨"; \
		fi

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
