#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "google-api-python-client>=2.100.0",
#     "google-auth>=2.20.0",
#     "rich>=13.0.0",
#     "pyyaml>=6.0",
# ]
# ///

"""
SEO & Search Console Insights Script for blog.eone.one
Analyzes queries from Google Search Console, correlates them with existing blog posts in src/content/,
and identifies:
1. Low CTR opportunities (High impressions, Low click rate)
2. Striking distance keywords (Average position between 4 and 15)
3. Content Gap (Keywords with impressions/clicks that lack a dedicated blog post)
"""

import argparse
import datetime
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Set, Tuple
from urllib.parse import unquote, urlparse

import yaml
from google.oauth2 import service_account
from googleapiclient.discovery import build
from rich.console import Console
from rich.panel import Panel

console = Console()

DEFAULT_SITE_URL = os.environ.get("GSC_SITE_URL", "https://blog.eone.one/")
CONTENT_DIR = Path(__file__).resolve().parent.parent / "src" / "content"
SECTIONS: Tuple[str, ...] = ("life", "money", "culture", "tools", "dev")

POSSIBLE_KEY_PATHS = [
    os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""),
    str(Path(__file__).resolve().parent.parent / "service-account.json"),
    str(Path.home() / ".config" / "gcp" / "blog-service-account.json"),
    str(Path.home() / ".config" / "gcp" / "service-account.json"),
]

# 다대다 한/영·약칭 동의어 클러스터
SYNONYM_GROUPS: List[Tuple[str, ...]] = [
    # 금융 / 투자 (money)
    ("공포지수", "공포 지수"),
    (
        "공포탐욕지수",
        "공포 탐욕 지수",
        "cnn 공포지수",
        "cnn 공포탐욕지수",
        "피어앤그리드",
        "피어 앤 그리드",
        "fear-greed",
        "fear & greed",
        "fear and greed",
    ),
    ("빅스", "빅스지수", "빅스 지수", "월가 공포지수", "월가공포지수", "vix", "vix 지수"),
    ("시킹알파", "시킹 알파", "seeking alpha", "seeking-alpha"),
    ("슈드", "schd"),
    ("나스닥", "nasdaq"),
    ("에스앤피", "에스엔피", "s&p500", "s&p 500", "sp500"),
    ("공매도", "short-selling", "short selling"),
    ("마진콜", "margin-call", "margin call"),
    ("리밸런싱", "rebalancing", "reconstitution"),
    # 영화 / 특별관 / 문화 (culture)
    ("아이맥스", "아맥", "imax"),
    ("용아맥", "용산 아이맥스", "용산 imax", "cgv 용산 아이맥스", "yongamac"),
    ("스크린엑스", "스크린 엑스", "스크린x", "스크린 x", "screenx", "screen-x"),
    ("용포디", "용산 4dx", "용포프", "ultra 4dx", "4dx"),
    ("돌비", "돌비시네마", "돌비 시네마", "dolby", "dolby cinema"),
    ("돌비애트모스", "돌비 애트모스", "dolby atmos", "atmos"),
    ("돌비비전", "돌비 비전", "dolby vision"),
    ("코돌비", "코엑스 돌비", "코엑스 돌비시네마", "coex dolby"),
    ("남돌비", "남양주 돌비", "남양주 돌비시네마", "namyangju dolby"),
    ("로튼토마토", "로튼 토마토", "rotten tomatoes", "rotten-tomatoes"),
    ("루미큐브", "rummikub"),
    ("밴드오브브라더스", "밴드 오브 브라더스", "band of brothers"),
    # 개발 / AI / 후원 / 결제 (dev)
    ("깃허브", "깃헙", "github"),
    ("스폰서", "sponsors", "sponsor"),
    ("코파이", "ko-fi", "kofi"),
    ("바이미어커피", "바이 미 어 커피", "buy me a coffee", "buymeacoffee"),
    ("패트리온", "patreon"),
    ("스트라이프", "stripe"),
    ("레몬스퀴지", "레몬 스퀴지", "lemon squeezy", "lemonsqueezy"),
    ("패들", "paddle"),
    ("폴라", "polar"),
    ("클로드", "claude"),
    ("클로드코드", "클로드 코드", "claude code", "claude-code"),
    ("코덱스", "codex"),
    ("제미나이", "gemini"),
    ("챗지피티", "chatgpt"),
    ("안티그래비티", "antigravity"),
    ("스프링부트", "스프링 부트", "spring boot", "springboot", "spring-boot"),
    ("자바", "java"),
    ("파이썬", "python"),
    ("리액트", "react"),
    ("도커", "docker"),
    ("몽고디비", "mongodb"),
    ("레디스", "redis"),
    # macOS / 터미널 / 생산성 도구 (tools)
    ("홈브루", "홈 브루", "브루", "homebrew", "brew"),
    ("터미널", "terminal"),
    ("아이텀", "아이텀2", "iterm", "iterm2"),
    ("티먹스", "tmux"),
    ("고스티", "ghostty"),
    ("카라비너", "karabiner", "karabiner-elements"),
    ("레이캐스트", "raycast"),
    ("알프레드", "alfred"),
    ("디비버", "dbeaver"),
    ("테이블플러스", "테이블 플러스", "tableplus", "table-plus"),
    ("인텔리제이", "intellij"),
    ("유튜브", "youtube"),
    ("클라우디너리", "cloudinary"),
    ("구름입력기", "구름 입력기", "gureum"),
    ("스태처", "stacher"),
    ("맥북", "맥os", "macos", "mac"),
    ("애플실리콘", "애플 실리콘", "apple silicon", "apple-silicon"),
    ("윈도우", "윈도우11", "windows", "windows 11"),
    # 일상 / 자동차 / 아쿠아리움 (life)
    ("왈스타드", "walstad"),
    ("시켐", "seachem"),
    ("애플워치", "애플 워치", "apple watch", "apple-watch"),
    ("볼보", "volvo"),
    ("폴스타", "polestar"),
    ("파이브가이즈", "파이브 가이즈", "five guys", "five-guys"),
]

# 단독 주제가 아닌 범용 검색 의도·수식어 (이 단어들만 일치해서 포스트가 오탐 매칭되는 현상 방지)
GENERIC_MODIFIERS: Set[str] = {
    "설치",
    "설치법",
    "설치하기",
    "사용법",
    "사용",
    "활용법",
    "활용",
    "방법",
    "하는법",
    "보는법",
    "보는",
    "가이드",
    "완전",
    "정복",
    "추천",
    "비교",
    "차이",
    "정리",
    "총정리",
    "요약",
    "후기",
    "리뷰",
    "장단점",
    "설정",
    "세팅",
    "초기세팅",
    "업데이트",
    "업그레이드",
    "삭제",
    "제거",
    "해결",
    "원인",
    "꿀팁",
    "팁",
    "무료",
    "유료",
    "가격",
    "비용",
    "수수료",
    "정산",
    "출금",
    "계좌",
    "송금",
    "한국",
    "국내",
    "해외",
    "실시간",
    "현재",
    "오늘",
    "최신",
    "확인",
    "조회",
    "기준",
    "기준표",
    "판별표",
    "계산기",
    "좌석",
    "자리",
    "명당",
    "배치도",
    "시야",
    "예매",
    "취소표",
    "등급",
    "추천열",
    "뜻",
    "의미",
    "개념",
    "원리",
    "이유",
    "대안",
    "순위",
    "체크",
    "목록",
    "리스트",
    "기본",
    "실전",
    "입문",
    "초보",
    "guide",
    "setup",
    "install",
    "installation",
    "usage",
    "how",
    "to",
    "vs",
    "review",
    "best",
    "top",
    "tips",
    "korea",
    "free",
    "2024",
    "2025",
    "2026",
    "2027",
}

# 5개 섹션별 도메인 키워드 사전 (콘텐츠 갭 타깃 섹션 추론용)
SECTION_KEYWORDS: Dict[str, Tuple[str, ...]] = {
    "money": (
        "주식",
        "증시",
        "미국주식",
        "서학개미",
        "배당",
        "배당주",
        "etf",
        "schd",
        "슈드",
        "qqq",
        "나스닥",
        "nasdaq",
        "s&p",
        "sp500",
        "다우존스",
        "공포지수",
        "공포탐욕지수",
        "피어앤그리드",
        "fear",
        "greed",
        "vix",
        "빅스",
        "빅스지수",
        "공매도",
        "마진콜",
        "헤지펀드",
        "리밸런싱",
        "13f",
        "시킹알파",
        "seeking alpha",
        "금리",
        "파킹통장",
        "예금",
        "적금",
        "환율",
        "달러",
        "재테크",
        "투자",
        "수익률",
        "분할매수",
        "분할 매수",
        "포트폴리오",
        "주가",
        "폭락",
        "상승장",
        "하락장",
        "앱테크",
        "만보기",
        "절약",
        "추천인",
        "쿠팡",
        "직구",
        "신용카드",
        "연말정산",
        "종합소득세",
        "부동산",
        "내집마련",
    ),
    "culture": (
        "영화",
        "개봉",
        "상영관",
        "특별관",
        "예고편",
        "쿠키영상",
        "평점",
        "로튼토마토",
        "rotten",
        "imdb",
        "cgv",
        "메가박스",
        "롯데시네마",
        "아이맥스",
        "아맥",
        "imax",
        "용아맥",
        "스크린엑스",
        "스크린x",
        "screenx",
        "돌비",
        "돌비시네마",
        "돌비애트모스",
        "돌비비전",
        "코돌비",
        "남돌비",
        "dolby",
        "atmos",
        "dva",
        "4dx",
        "용포디",
        "용포프",
        "좌석",
        "명당",
        "배치도",
        "시야",
        "예매",
        "마블",
        "mcu",
        "dcu",
        "디즈니",
        "넷플릭스",
        "netflix",
        "애플티비",
        "드라마",
        "애니",
        "스타워즈",
        "스파이더맨",
        "어벤져스",
        "듄",
        "보드게임",
        "루미큐브",
        "카탄",
        "고전게임",
        "공략",
        "영어",
        "회화",
        "여행",
        "온천",
        "스타벅스",
        "텀블러",
    ),
    "tools": (
        "홈브루",
        "브루",
        "homebrew",
        "brew",
        "macos",
        "맥북",
        "맥미니",
        "맥os",
        "mac",
        "터미널",
        "terminal",
        "iterm",
        "iterm2",
        "아이텀",
        "tmux",
        "티먹스",
        "tpm",
        "ghostty",
        "고스티",
        "karabiner",
        "카라비너",
        "raycast",
        "레이캐스트",
        "alfred",
        "알프레드",
        "dotfiles",
        "zsh",
        "zprofile",
        "bash",
        "shell",
        "쉘",
        "단축키",
        "리매핑",
        "클립보드",
        "창관리",
        "윈도우관리",
        "dbeaver",
        "디비버",
        "tableplus",
        "테이블플러스",
        "sequel",
        "intellij",
        "인텔리제이",
        "xcode",
        "fnm",
        "nvm",
        "pyenv",
        "sdkman",
        "yt-dlp",
        "stacher",
        "스태처",
        "다운로더",
        "nextdns",
        "광고차단",
        "구름입력기",
        "한글입력기",
        "finicky",
        "arc",
        "브라우저",
        "코딩폰트",
        "윈도우11",
        "windows 11",
        "wsl",
        "고정ip",
    ),
    "dev": (
        "개발",
        "개발자",
        "코딩",
        "프로그래밍",
        "바이브코딩",
        "에이전트",
        "claude",
        "클로드",
        "gpt",
        "chatgpt",
        "codex",
        "코덱스",
        "gemini",
        "제미나이",
        "kimi",
        "antigravity",
        "안티그래비티",
        "llm",
        "인공지능",
        "프롬프트",
        "mcp",
        "오픈소스",
        "깃허브",
        "깃헙",
        "github",
        "스폰서",
        "sponsors",
        "코파이",
        "ko-fi",
        "kofi",
        "바이미어커피",
        "buymeacoffee",
        "buy me a coffee",
        "패트리온",
        "patreon",
        "후원",
        "stripe",
        "스트라이프",
        "lemon squeezy",
        "레몬스퀴지",
        "paddle",
        "패들",
        "polar",
        "해외결제",
        "saas",
        "백엔드",
        "프론트엔드",
        "api",
        "rest",
        "http",
        "rfc",
        "멱등성",
        "페이징",
        "에러",
        "코드",
        "프레임워크",
        "java",
        "자바",
        "jdk",
        "jvm",
        "spring",
        "스프링",
        "스프링부트",
        "kotlin",
        "코틀린",
        "python",
        "파이썬",
        "fastapi",
        "react",
        "리액트",
        "nextjs",
        "astro",
        "typescript",
        "javascript",
        "nodejs",
        "docker",
        "도커",
        "aws",
        "azure",
        "gcp",
        "mysql",
        "postgresql",
        "mongodb",
        "몽고디비",
        "redis",
        "레디스",
        "spark",
        "hadoop",
        "빅데이터",
        "크롤링",
        "cidr",
        "서브넷",
        "uuid",
        "ulid",
        "git",
        "merge",
        "rebase",
        "브랜치",
        "커밋",
        "pull request",
    ),
    "life": (
        "어항",
        "수조",
        "물생활",
        "아쿠아리움",
        "여과기",
        "스펀지여과기",
        "걸이식",
        "시켐",
        "seachem",
        "왈스타드",
        "walstad",
        "무환수",
        "수초",
        "조류",
        "질산염",
        "전기차",
        "배터리",
        "볼보",
        "volvo",
        "폴스타",
        "polestar",
        "테슬라",
        "모델y",
        "bmw",
        "아우디",
        "도요타",
        "폭스바겐",
        "하이브리드",
        "통풍시트",
        "성경",
        "기도",
        "말씀",
        "찬양",
        "예화",
        "기독교",
        "크리스마스",
        "초등학교",
        "통지표",
        "성적표",
        "육아",
        "대학",
        "랭킹",
        "유학",
        "애플워치",
        "운동링",
        "선글라스",
        "파이브가이즈",
        "수제버거",
        "야구",
        "kbo",
        "드래프트",
    ),
}


def normalize_text(text: str) -> str:
    """Normalize text by removing spaces, hyphens, and punctuation for fuzzy comparison."""
    return re.sub(r"[\s\-_—·:,/()\"'`!?&+]+", "", text.lower())


def _build_synonym_indices() -> Tuple[Dict[str, Set[str]], List[Tuple[str, Set[str]]]]:
    """Build normalized synonym lookup map and longest-first phrase match list."""
    norm_to_group: Dict[str, Set[str]] = {}
    phrase_patterns: List[Tuple[str, Set[str]]] = []

    for group in SYNONYM_GROUPS:
        # Preserve raw lowercase forms (for word-boundary checks) + normalized forms
        variants: Set[str] = set()
        for term in group:
            t_low = term.lower().strip()
            t_norm = normalize_text(t_low)
            if t_low:
                variants.add(t_low)
            if t_norm:
                variants.add(t_norm)

        # Merge if overlapping with an existing group
        merged = set(variants)
        for v in list(variants):
            if v in norm_to_group:
                merged |= norm_to_group[v]
        for v in merged:
            norm_to_group[v] = merged

        for term in group:
            t_low = term.lower().strip()
            if any(ch in t_low for ch in (" ", "-", "&")):
                phrase_patterns.append((t_low, merged))

    phrase_patterns.sort(key=lambda item: len(item[0]), reverse=True)
    return norm_to_group, phrase_patterns


SYNONYM_MAP, MULTIWORD_SYNONYMS = _build_synonym_indices()
KOREAN_SYNONYM_STEMS: List[str] = sorted(
    [
        k
        for k in SYNONYM_MAP
        if len(k) >= 3 and re.search(r"[가-힣]", k) and " " not in k
    ],
    key=len,
    reverse=True,
)
SORTED_MODIFIERS: List[str] = sorted(
    [m for m in GENERIC_MODIFIERS if len(m) >= 2 and re.search(r"[가-힣]", m)],
    key=len,
    reverse=True,
)


def is_ascii_alnum(term: str) -> bool:
    return bool(re.fullmatch(r"[a-z0-9]+", term))


def term_in_field(term: str, raw_lower: str, norm_field: str) -> bool:
    """
    Match a single variant against a field safely:
    - Short/pure ASCII words use alphanumeric boundaries so 'mac' does not match 'yongamac'
      and 'ai' does not match 'tidal'.
    - Longer ASCII compounds (>=5 chars, e.g. 'homebrew', 'screenx', 'springboot') also check norm_field.
    - Korean / mixed terms check normalized substring directly.
    """
    t_low = term.lower().strip()
    t_norm = normalize_text(t_low)
    if not t_norm:
        return False

    if is_ascii_alnum(t_low):
        if re.search(rf"(?<![a-z0-9]){re.escape(t_low)}(?![a-z0-9])", raw_lower):
            return True
        # Allow hyphen-collapsed match like 'kofi' against 'ko-fi'
        raw_hyphen_collapsed = re.sub(r"(?<=[a-z0-9])-(?=[a-z0-9])", "", raw_lower)
        if re.search(rf"(?<![a-z0-9]){re.escape(t_norm)}(?![a-z0-9])", raw_hyphen_collapsed):
            return True
        if len(t_norm) >= 5 and t_norm in norm_field:
            return True
        return False

    if any(ch in t_low for ch in (" ", "-", "&")) and t_low in raw_lower:
        return True

    return t_norm in norm_field


def find_credentials_path(custom_path: Optional[str] = None) -> Optional[Path]:
    if custom_path and Path(custom_path).is_file():
        return Path(custom_path)
    for p in POSSIBLE_KEY_PATHS:
        if p and Path(p).is_file():
            return Path(p)
    return None


def parse_frontmatter(file_path: Path) -> Dict[str, Any]:
    """Parse YAML frontmatter and path metadata from markdown/mdx file."""
    rel_parts = file_path.relative_to(CONTENT_DIR).parts
    section = rel_parts[0] if rel_parts and rel_parts[0] in SECTIONS else ""
    path_lang = rel_parts[1] if len(rel_parts) > 1 and rel_parts[1] in ("ko", "en") else "ko"

    base_meta: Dict[str, Any] = {
        "_path": str(file_path),
        "_slug": file_path.stem,
        "_section": section,
        "_lang": path_lang,
    }
    try:
        content = file_path.read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if match:
            data = yaml.safe_load(match.group(1)) or {}
            if isinstance(data, dict):
                data.update(base_meta)
                if "lang" in data and data["lang"] in ("ko", "en"):
                    data["_lang"] = data["lang"]
                return data
    except Exception:
        pass
    return base_meta


def _prepare_post_search_cache(post: Dict[str, Any]) -> None:
    """Precompute lowercase and normalized fields for fast, accurate matching."""
    titles = [str(post.get("title", ""))] + [str(t) for t in post.get("_extra_titles", [])]
    descs = [str(post.get("description", ""))] + [str(d) for d in post.get("_extra_descriptions", [])]
    tags = [str(t) for t in post.get("tags", [])] + [str(t) for t in post.get("_extra_tags", [])]
    slug = str(post.get("_slug", ""))

    title_raw = " | ".join(t.lower() for t in titles if t)
    slug_raw = slug.lower()
    tags_raw = " | ".join(t.lower() for t in tags if t)
    desc_raw = " | ".join(d.lower() for d in descs if d)

    post["_title_raw"] = title_raw
    post["_slug_raw"] = slug_raw
    post["_tags_raw"] = tags_raw
    post["_desc_raw"] = desc_raw

    post["_titles_norm"] = [normalize_text(t) for t in titles if t]
    post["_slug_norm"] = normalize_text(slug_raw)
    post["_tags_norm"] = [normalize_text(t) for t in tags if t]
    post["_desc_norm"] = normalize_text(desc_raw)
    post["_title_norm_joined"] = " ".join(post["_titles_norm"])
    post["_tags_norm_joined"] = " ".join(post["_tags_norm"])


def load_existing_posts() -> List[Dict[str, Any]]:
    """
    Index published markdown/mdx posts in src/content/.
    - Excludes `draft: true`
    - Merges `ko` and `en` twins sharing `(section, slug)` so bilingual posts are not double-counted
      while retaining English metadata for English search queries.
    """
    if not CONTENT_DIR.exists():
        return []

    raw_posts: List[Dict[str, Any]] = []
    for ext in ("*.md", "*.mdx"):
        for file_path in sorted(CONTENT_DIR.rglob(ext)):
            post = parse_frontmatter(file_path)
            if post.get("draft") is True:
                continue
            raw_posts.append(post)

    grouped: Dict[Tuple[str, str], Dict[str, Any]] = {}
    # Process 'ko' first so 'ko' metadata is always primary
    raw_posts.sort(key=lambda p: (0 if p.get("_lang") == "ko" else 1, str(p.get("_path", ""))))

    for post in raw_posts:
        key = (str(post.get("_section", "")), str(post.get("_slug", "")).lower())
        if key not in grouped:
            post["_extra_titles"] = []
            post["_extra_descriptions"] = []
            post["_extra_tags"] = []
            grouped[key] = post
        else:
            primary = grouped[key]
            if post.get("title"):
                primary["_extra_titles"].append(post["title"])
            if post.get("description"):
                primary["_extra_descriptions"].append(post["description"])
            if post.get("tags"):
                primary["_extra_tags"].extend(post["tags"])

    posts = list(grouped.values())
    for post in posts:
        _prepare_post_search_cache(post)
    return posts


def extract_url_section_and_slug(url: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract `(section, slug)` from a blog.eone.one page URL."""
    try:
        parsed = urlparse(url)
        segments = [unquote(seg).strip() for seg in parsed.path.split("/") if seg.strip()]
    except Exception:
        return None, None

    if not segments:
        return None, None

    if segments[0] == "en":
        segments = segments[1:]
    if not segments:
        return None, None

    sec = segments[0].lower()
    if sec not in SECTIONS:
        return None, None

    slug = segments[1].lower() if len(segments) >= 2 else None
    # Pagination like /life/2/ is not a post slug
    if slug and slug.isdigit():
        slug = None
    return sec, slug


def resolve_landing_post(
    page_impressions: Dict[str, int],
    posts_by_key: Dict[Tuple[str, str], Dict[str, Any]],
    posts_by_slug: Dict[str, Dict[str, Any]],
) -> Optional[Dict[str, Any]]:
    """Find the actual post ranked by Google for this query, ordered by impressions."""
    for url, _ in sorted(page_impressions.items(), key=lambda kv: kv[1], reverse=True):
        sec, slug = extract_url_section_and_slug(url)
        if sec and slug:
            if (sec, slug) in posts_by_key:
                return posts_by_key[(sec, slug)]
            if slug in posts_by_slug:
                return posts_by_slug[slug]
    return None


def _strip_safe_korean_particle(token: str) -> str:
    """Strip multi-char Korean postpositions on longer tokens without corrupting nouns like '코파이'."""
    if len(token) >= 4 and re.search(r"[가-힣]", token):
        for suffix in ("에서는", "으로는", "에서", "으로", "부터", "까지"):
            if token.endswith(suffix) and len(token) - len(suffix) >= 2:
                return token[: -len(suffix)]
    return token


def _split_unspaced_compound(token: str) -> List[str]:
    """Split unspaced Korean queries like '홈브루설치', '코파이수수료', '용산스크린엑스'."""
    if not re.search(r"[가-힣]", token) or len(token) < 4:
        return [token]

    # 1. Prefix stem + modifier suffix (e.g. '홈브루설치' -> '홈브루' + '설치')
    for mod in SORTED_MODIFIERS:
        if token.endswith(mod) and len(token) - len(mod) >= 2:
            return [token[: -len(mod)], mod]

    # 2. Contains a known Korean synonym stem (e.g. '용산스크린엑스' -> '용산' + '스크린엑스')
    for syn in KOREAN_SYNONYM_STEMS:
        if syn in token and syn != token:
            idx = token.find(syn)
            left = token[:idx]
            right = token[idx + len(syn) :]
            parts = [p for p in (left, syn, right) if len(p) >= 2]
            if len(parts) >= 2:
                return parts

    return [token]


def extract_query_concepts(query: str) -> Tuple[List[Set[str]], List[Set[str]]]:
    """
    Decompose a search query into `(subject_concepts, modifier_concepts)`.
    Each concept is a set of acceptable variant strings (from SYNONYM_GROUPS or the token itself).
    """
    q_work = query.lower().strip()
    subject_concepts: List[Set[str]] = []
    modifier_concepts: List[Set[str]] = []

    # 1. Extract multi-word / hyphenated synonym phrases longest-first
    for phrase, group_variants in MULTIWORD_SYNONYMS:
        if is_ascii_alnum(phrase.replace(" ", "").replace("-", "")):
            pattern = rf"(?<![a-z0-9]){re.escape(phrase)}(?![a-z0-9])"
        else:
            pattern = re.escape(phrase)
        if re.search(pattern, q_work):
            subject_concepts.append(set(group_variants))
            q_work = re.sub(pattern, " ", q_work)

    # 2. Tokenize remaining text
    raw_tokens = [t for t in re.split(r"[\s\-_—·:,/()\"'`!?]+", q_work) if len(t) >= 2]

    expanded_tokens: List[str] = []
    for tok in raw_tokens:
        cleaned = _strip_safe_korean_particle(tok)
        cleaned_norm = normalize_text(cleaned)
        if cleaned_norm in SYNONYM_MAP or cleaned_norm in GENERIC_MODIFIERS:
            expanded_tokens.append(cleaned)
        else:
            expanded_tokens.extend(_split_unspaced_compound(cleaned))

    for tok in expanded_tokens:
        t_norm = normalize_text(tok)
        if not t_norm or len(t_norm) < 2:
            continue
        if t_norm in SYNONYM_MAP:
            group = SYNONYM_MAP[t_norm]
            if group not in subject_concepts:
                subject_concepts.append(set(group))
        elif tok in GENERIC_MODIFIERS or t_norm in GENERIC_MODIFIERS:
            modifier_concepts.append({tok, t_norm})
        else:
            subject_concepts.append({tok, t_norm})

    if not subject_concepts and modifier_concepts:
        subject_concepts = modifier_concepts
        modifier_concepts = []

    return subject_concepts, modifier_concepts


def _concept_match_tier(concept: Set[str], post: Dict[str, Any]) -> int:
    """
    Return match quality tier of a concept against a post:
    3 = title or slug match, 2 = tag match, 1 = description match, 0 = no match.
    """
    for v in concept:
        if term_in_field(v, post["_title_raw"], post["_title_norm_joined"]) or term_in_field(
            v, post["_slug_raw"], post["_slug_norm"]
        ):
            return 3
    for v in concept:
        if term_in_field(v, post["_tags_raw"], post["_tags_norm_joined"]):
            return 2
    for v in concept:
        if term_in_field(v, post["_desc_raw"], post["_desc_norm"]):
            return 1
    return 0


def check_content_match(
    query: str,
    posts: Sequence[Dict[str, Any]],
    preferred_pages: Optional[Dict[str, int]] = None,
) -> Optional[Dict[str, Any]]:
    """
    Check if any existing post closely matches the search query as a dedicated topic.
    - Expands Korean/English synonyms via SYNONYM_GROUPS
    - Requires ALL subject concepts in the query to match the post's frontmatter
      (preventing partial false matches like '왕십리 아이맥스' -> Yongsan IMAX or '패트리온 정산' -> Ko-fi)
    - Uses modifier matches, GSC ranked page URLs, and post recency to break ties
    """
    q_lower = query.lower().strip()
    q_norm = normalize_text(q_lower)
    if not q_norm:
        return None

    preferred_keys: Set[Tuple[str, str]] = set()
    if preferred_pages:
        for url in preferred_pages:
            sec, slug = extract_url_section_and_slug(url)
            if sec and slug:
                preferred_keys.add((sec, slug))

    # Build full-query normalized variants for single-concept / exact-phrase fast hits
    query_norm_variants: Set[str] = {q_norm}
    if q_norm in SYNONYM_MAP:
        query_norm_variants |= {normalize_text(v) for v in SYNONYM_MAP[q_norm] if normalize_text(v)}

    subject_concepts, modifier_concepts = extract_query_concepts(q_lower)

    best_post: Optional[Dict[str, Any]] = None
    best_score: Tuple[float, str] = (-1.0, "")

    for post in posts:
        score = 0.0

        # 1. Exact or normalized full-query hit in title, slug, or tags
        full_hit = False
        if len(q_norm) >= 2 and (
            term_in_field(q_lower, post["_title_raw"], post["_title_norm_joined"])
            or term_in_field(q_lower, post["_slug_raw"], post["_slug_norm"])
        ):
            full_hit = True
            score += 65.0

        if not full_hit:
            for qv in query_norm_variants:
                if len(qv) < 2:
                    continue
                if term_in_field(qv, post["_title_raw"], post["_title_norm_joined"]) or term_in_field(
                    qv, post["_slug_raw"], post["_slug_norm"]
                ):
                    full_hit = True
                    score += 60.0
                    break
                if any(qv == tn or (len(qv) >= 4 and not is_ascii_alnum(qv) and qv in tn) for tn in post["_tags_norm"]):
                    full_hit = True
                    score += 50.0
                    break

        if not full_hit:
            for t_norm in post["_titles_norm"]:
                if len(t_norm) > 5 and t_norm in q_norm:
                    full_hit = True
                    score += 45.0
                    break

        # 2. Subject concept verification (all subject concepts must match frontmatter)
        if not full_hit:
            if not subject_concepts:
                continue

            tiers = [_concept_match_tier(c, post) for c in subject_concepts]
            if any(t == 0 for t in tiers):
                continue
            # At least one subject concept must be a primary topic (title, slug, or tag — not description-only)
            if max(tiers) < 2:
                continue

            score += sum(t * 10.0 for t in tiers)

        # 3. Bonus for matching intent/modifier words (e.g. '설치', '수수료', '좌석')
        for mod in modifier_concepts:
            m_tier = _concept_match_tier(mod, post)
            score += m_tier * 3.0

        # 4. Tie-breaker: prefer the post Google Search Console actually surfaced for this query
        post_key = (str(post.get("_section", "")), str(post.get("_slug", "")).lower())
        if post_key in preferred_keys:
            score += 8.0

        date_str = str(post.get("date", ""))
        candidate_rank = (score, date_str)
        if candidate_rank > best_score:
            best_score = candidate_rank
            best_post = post

    return best_post


def infer_target_section(query: str, page_impressions: Optional[Dict[str, int]] = None) -> str:
    """
    Infer the best target section (`money` | `culture` | `tools` | `dev` | `life`) for a content gap query
    by combining 5-section domain keyword scoring with GSC landing page section signals.
    """
    q_low = query.lower().strip()
    q_norm = normalize_text(q_low)

    scores: Dict[str, float] = {sec: 0.0 for sec in SECTIONS}

    # 1. Domain keyword matching across all 5 sections
    for sec, keywords in SECTION_KEYWORDS.items():
        for kw in keywords:
            if term_in_field(kw, q_low, q_norm):
                scores[sec] += 3.0

    # 2. GSC ranked URL section signal (strong fallback / tie-breaker when query hits a related section)
    if page_impressions:
        sec_impr: Dict[str, int] = {sec: 0 for sec in SECTIONS}
        total_sec_impr = 0
        for url, impr in page_impressions.items():
            sec, _ = extract_url_section_and_slug(url)
            if sec:
                w = max(impr, 1)
                sec_impr[sec] += w
                total_sec_impr += w

        if total_sec_impr > 0:
            for sec, impr in sec_impr.items():
                if impr > 0:
                    scores[sec] += 2.5 * (impr / total_sec_impr)

    best_sec = max(SECTIONS, key=lambda s: scores[s])
    return best_sec if scores[best_sec] > 0 else "life"


def fetch_gsc_data(creds_path: Path, site_url: str, days: int = 28) -> List[Dict[str, Any]]:
    """Query Google Search Console Search Analytics API."""
    credentials = service_account.Credentials.from_service_account_file(
        str(creds_path),
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
    )
    service = build("searchconsole", "v1", credentials=credentials)

    end_date = datetime.date.today() - datetime.timedelta(days=2)
    start_date = end_date - datetime.timedelta(days=days)

    request_body = {
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "dimensions": ["query", "page"],
        "rowLimit": 2500,
    }

    response = service.searchanalytics().query(siteUrl=site_url, body=request_body).execute()
    return response.get("rows", [])


def _format_post_label(
    matching_post: Optional[Dict[str, Any]],
    landing_post: Optional[Dict[str, Any]],
    page_impressions: Dict[str, int],
    max_len: int = 30,
) -> str:
    if matching_post:
        return str(matching_post.get("title", "없음"))[:max_len]
    if landing_post:
        title = str(landing_post.get("title", ""))[: max(10, max_len - 5)]
        return f"(간접) {title}"
    if page_impressions:
        top_url = max(page_impressions.items(), key=lambda kv: kv[1])[0]
        path = unquote(urlparse(top_url).path or "/")
        return f"`{path[:max_len]}`"
    return "직접 매칭 없음"


def generate_insights_report(rows: List[Dict[str, Any]], posts: List[Dict[str, Any]]) -> str:
    """Analyze rows and build a comprehensive markdown report."""
    low_ctr_queries = []
    striking_distance = []
    content_gaps = []

    posts_by_key: Dict[Tuple[str, str], Dict[str, Any]] = {}
    posts_by_slug: Dict[str, Dict[str, Any]] = {}
    for p in posts:
        sec = str(p.get("_section", ""))
        slug = str(p.get("_slug", "")).lower()
        if sec and slug:
            posts_by_key[(sec, slug)] = p
        if slug and slug not in posts_by_slug:
            posts_by_slug[slug] = p

    # Aggregate by query (with impression-weighted average position)
    query_stats: Dict[str, Dict[str, Any]] = {}
    for row in rows:
        q = row["keys"][0]
        page = row["keys"][1]
        clicks = int(row.get("clicks", 0))
        impressions = int(row.get("impressions", 0))
        position = float(row.get("position", 0.0))

        if q not in query_stats:
            query_stats[q] = {
                "query": q,
                "clicks": clicks,
                "impressions": impressions,
                "weighted_pos_sum": position * impressions,
                "positions": [position],
                "page_impressions": {page: impressions},
            }
        else:
            stat = query_stats[q]
            stat["clicks"] += clicks
            stat["impressions"] += impressions
            stat["weighted_pos_sum"] += position * impressions
            stat["positions"].append(position)
            stat["page_impressions"][page] = stat["page_impressions"].get(page, 0) + impressions

    for q, stat in query_stats.items():
        clicks = stat["clicks"]
        impr = stat["impressions"]
        avg_pos = (
            (stat["weighted_pos_sum"] / impr)
            if impr > 0
            else (sum(stat["positions"]) / len(stat["positions"]))
        )
        ctr = (clicks / impr) * 100 if impr > 0 else 0.0
        page_imprs = stat["page_impressions"]

        matching_post = check_content_match(q, posts, preferred_pages=page_imprs)
        landing_post = resolve_landing_post(page_imprs, posts_by_key, posts_by_slug)

        item = {
            "query": q,
            "clicks": clicks,
            "impressions": impr,
            "ctr": ctr,
            "position": avg_pos,
            "pages": list(page_imprs.keys()),
            "page_impressions": page_imprs,
            "matching_post": matching_post,
            "landing_post": landing_post,
        }

        # 1. Opportunity: High impressions, Low CTR (CTR < 2.5%, Impressions >= 20)
        if impr >= 20 and ctr < 2.5 and avg_pos <= 20:
            low_ctr_queries.append(item)

        # 2. Striking Distance (Position 4.0 ~ 15.0 with good impressions)
        if 4.0 <= avg_pos <= 15.0 and impr >= 15:
            striking_distance.append(item)

        # 3. Content Gap: Meaningful traffic/impressions, but no dedicated matching post
        if not matching_post and impr >= 15:
            content_gaps.append(item)

    # Sort items
    low_ctr_queries.sort(key=lambda x: x["impressions"], reverse=True)
    striking_distance.sort(key=lambda x: x["impressions"], reverse=True)
    content_gaps.sort(key=lambda x: x["impressions"], reverse=True)

    md = []
    md.append("# 📊 블로그 SEO & Search Console 유입 분석 리포트\n")
    md.append(f"- **분석 일자**: {datetime.date.today().isoformat()}")
    md.append(f"- **기존 포스트 인덱싱**: 총 {len(posts)}개 포스트 (초안 제외, 한/영 통합)")
    md.append(f"- **분석된 검색어 수**: 총 {len(query_stats)}개 쿼리\n")

    md.append("## 💡 1. 콘텐츠 갭 (신규 포스팅 추천 주제)")
    md.append("> 검색 노출 및 유입이 발생하고 있으나, 현재 블로그에 직접 대응하는 전용 포스트가 없는 키워드입니다.\n")
    if content_gaps:
        md.append("| 추천 검색어(Query) | 노출수 | 클릭수 | 평균 순위 | 추천 타깃 섹션 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for item in content_gaps[:15]:
            q = item["query"]
            sec = infer_target_section(q, item["page_impressions"])
            md.append(
                f"| **{q}** | {item['impressions']:,} | {item['clicks']} | {item['position']:.1f}위 | `{sec}` |"
            )
    else:
        md.append("_현재 노출 기준 콘텐츠 갭 키워드가 발견되지 않았습니다._\n")

    md.append("\n## 🎯 2. 순위 4~15위권 근접 키워드 (조금만 보강하면 1페이지 상단)")
    md.append("> 이미 구글 상위권 바로 아래(2페이지 초반~1페이지 중하위)에 안착해 있어, 본문 H2/H3 보강 시 클릭 급증이 예상되는 키워드입니다.\n")
    if striking_distance:
        md.append("| 검색어(Query) | 평균 순위 | 노출수 | 클릭수 | 현재 연결 페이지 / 매칭 포스트 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for item in striking_distance[:15]:
            post_label = _format_post_label(
                item["matching_post"], item["landing_post"], item["page_impressions"], max_len=30
            )
            md.append(
                f"| **{item['query']}** | **{item['position']:.1f}위** | {item['impressions']:,} | {item['clicks']} | {post_label} |"
            )
    else:
        md.append("_해당 조건의 키워드가 없습니다._\n")

    md.append("\n## 🚀 3. 노출 대비 저클릭 키워드 (제목 / 메타설명 리프레시 추천)")
    md.append("> 구글 검색 결과에는 많이 노출되지만 제목(Title)이나 스니펫 매력도가 부족해 클릭률(CTR)이 저조한 대상입니다.\n")
    if low_ctr_queries:
        md.append("| 검색어(Query) | 노출수 | 클릭수 | 현재 CTR | 평균 순위 | 개선 대상 포스트 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for item in low_ctr_queries[:15]:
            post_label = _format_post_label(
                item["matching_post"], item["landing_post"], item["page_impressions"], max_len=28
            )
            md.append(
                f"| **{item['query']}** | {item['impressions']:,} | {item['clicks']} | **{item['ctr']:.1f}%** | {item['position']:.1f}위 | {post_label} |"
            )
    else:
        md.append("_해당 조건의 키워드가 없습니다._\n")

    return "\n".join(md)


def main():
    parser = argparse.ArgumentParser(description="Analyze Google Search Console data for blog.eone.one")
    parser.add_argument("--key", help="Path to Google Service Account JSON key file")
    parser.add_argument(
        "--site",
        default=DEFAULT_SITE_URL,
        help="Search Console Site URL (e.g. sc-domain:blog.eone.one or https://blog.eone.one/)",
    )
    parser.add_argument("--days", type=int, default=28, help="Days of analytics history (default: 28)")
    parser.add_argument("--out", help="Save report to markdown file path")
    args = parser.parse_args()

    creds_path = find_credentials_path(args.key)
    if not creds_path:
        console.print(
            Panel(
                "[bold red]❌ Google Cloud 서비스 계정 키 파일(JSON)을 찾을 수 없습니다.[/bold red]\n\n"
                "다음 중 하나의 위치에 JSON 키 파일을 두고 다시 실행해 주세요:\n"
                "1. 프로젝트 루트의 [cyan]service-account.json[/cyan]\n"
                "2. [cyan]~/.config/gcp/blog-service-account.json[/cyan]\n"
                "3. [cyan]GOOGLE_APPLICATION_CREDENTIALS[/cyan] 환경변수 지정\n"
                "4. [cyan]--key /path/to/key.json[/cyan] 파라미터 전달",
                title="인증 파일 필요",
                border_style="red",
            )
        )
        sys.exit(1)

    console.print(f"[green]✓ 서비스 계정 키 로드 완료:[/green] {creds_path}")
    console.print(f"[cyan]ℹ 대상 사이트:[/cyan] {args.site} (최근 {args.days}일)")

    console.print("[dim]1/3. 블로그 기존 글 목록 인덱싱 중...[/dim]")
    posts = load_existing_posts()
    console.print(f"[green]✓ {len(posts)}개 포스트 인덱싱 완료[/green]")

    console.print("[dim]2/3. Google Search Console API 데이터 조회 중...[/dim]")
    try:
        rows = fetch_gsc_data(creds_path, args.site, days=args.days)
    except Exception as e:
        console.print(f"[bold red]❌ Search Console API 호출 실패:[/bold red] {e}")
        console.print(
            "[yellow]Tip:[/yellow] 서비스 계정이 Search Console 속성에 [읽기] 권한자로 등록되어 있는지, 혹은 사이트 URL 형식이 'sc-domain:blog.eone.one' 인지 확인해주세요."
        )
        sys.exit(1)

    console.print(f"[green]✓ {len(rows)}개 쿼리/페이지 데이터 수신 완료[/green]")
    console.print("[dim]3/3. 콘텐츠 갭 및 기회 키워드 분석 리포트 생성 중...[/dim]")

    report_md = generate_insights_report(rows, posts)

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(report_md, encoding="utf-8")
        console.print(f"\n[bold green]✓ 분석 리포트 파일 저장 완료:[/bold green] {out_path.resolve()}")
    else:
        console.print("\n" + report_md)


if __name__ == "__main__":
    main()
