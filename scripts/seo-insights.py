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
from typing import Dict, List, Any, Optional

import yaml
from google.oauth2 import service_account
from googleapiclient.discovery import build
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console = Console()

DEFAULT_SITE_URL = os.environ.get("GSC_SITE_URL", "https://blog.eone.one/")
CONTENT_DIR = Path(__file__).resolve().parent.parent / "src" / "content"

POSSIBLE_KEY_PATHS = [
    os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", ""),
    str(Path(__file__).resolve().parent.parent / "service-account.json"),
    str(Path.home() / ".config" / "gcp" / "blog-service-account.json"),
    str(Path.home() / ".config" / "gcp" / "service-account.json"),
]


def find_credentials_path(custom_path: Optional[str] = None) -> Optional[Path]:
    if custom_path and Path(custom_path).is_file():
        return Path(custom_path)
    for p in POSSIBLE_KEY_PATHS:
        if p and Path(p).is_file():
            return Path(p)
    return None


def parse_frontmatter(file_path: Path) -> Dict[str, Any]:
    """Parse YAML frontmatter from markdown/mdx file."""
    try:
        content = file_path.read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if match:
            data = yaml.safe_load(match.group(1)) or {}
            data["_path"] = str(file_path)
            data["_slug"] = file_path.stem
            return data
    except Exception:
        pass
    return {"_path": str(file_path), "_slug": file_path.stem}


def load_existing_posts() -> List[Dict[str, Any]]:
    """Index all markdown/mdx posts in src/content/."""
    posts = []
    if not CONTENT_DIR.exists():
        return posts

    for ext in ("*.md", "*.mdx"):
        for file_path in CONTENT_DIR.rglob(ext):
            post = parse_frontmatter(file_path)
            posts.append(post)
    return posts


def normalize_text(text: str) -> str:
    """Normalize text by removing spaces, hyphens, and non-alphanumeric chars for fuzzy comparison."""
    return re.sub(r"[\s\-_—·:,'\"`]+", "", text.lower())


SYNONYMS = {
    "깃허브": "github",
    "스폰서": "sponsors",
    "유튜브": "youtube",
    "아이맥스": "imax",
    "용아맥": "yongsan",
}


def check_content_match(query: str, posts: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """Check if any existing post closely matches the search query."""
    q_lower = query.lower().strip()
    q_norm = normalize_text(q_lower)
    words = [w for w in re.split(r"[\s\-_]+", q_lower) if len(w) > 1]

    # Expand query with synonyms
    expanded_words = list(words)
    for k, v in SYNONYMS.items():
        if k in q_lower:
            expanded_words.append(v)
        if v in q_lower:
            expanded_words.append(k)
    
    for post in posts:
        title = str(post.get("title", "")).lower()
        title_norm = normalize_text(title)
        slug = str(post.get("_slug", "")).lower()
        slug_norm = normalize_text(slug)
        tags = [str(t).lower() for t in post.get("tags", [])]
        tags_norm = [normalize_text(t) for t in tags]

        # 1. Normalized exact or substring match in title or slug
        if q_norm in title_norm or q_norm in slug_norm:
            return post

        if title_norm in q_norm and len(title_norm) > 5:
            return post

        # 2. Match in tags (exact or normalized)
        if any(q_norm == tn or (len(q_norm) > 4 and q_norm in tn) for tn in tags_norm):
            return post

        # 3. Match all words in title or slug
        if len(words) >= 2 and all(w in title for w in words):
            return post

        # 4. Synonym match
        if any(w in title or w in slug for w in expanded_words if len(w) > 2):
            matching_count = sum(1 for w in expanded_words if w in title or w in slug or any(w in t for t in tags))
            if matching_count >= 2:
                return post

    return None


def fetch_gsc_data(creds_path: Path, site_url: str, days: int = 28) -> List[Dict[str, Any]]:
    """Query Google Search Console Search Analytics API."""
    credentials = service_account.Credentials.from_service_account_file(
        str(creds_path),
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
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

    response = service.searchanalytics().query(
        siteUrl=site_url,
        body=request_body
    ).execute()

    return response.get("rows", [])


def generate_insights_report(rows: List[Dict[str, Any]], posts: List[Dict[str, Any]]) -> str:
    """Analyze rows and build a comprehensive markdown report."""
    low_ctr_queries = []
    striking_distance = []
    content_gaps = []

    # Aggregate by query
    query_stats: Dict[str, Dict[str, Any]] = {}
    for row in rows:
        q = row["keys"][0]
        page = row["keys"][1]
        clicks = row.get("clicks", 0)
        impressions = row.get("impressions", 0)
        ctr = row.get("ctr", 0.0)
        position = row.get("position", 0.0)

        if q not in query_stats:
            query_stats[q] = {
                "query": q,
                "clicks": clicks,
                "impressions": impressions,
                "pages": {page},
                "positions": [position],
            }
        else:
            query_stats[q]["clicks"] += clicks
            query_stats[q]["impressions"] += impressions
            query_stats[q]["pages"].add(page)
            query_stats[q]["positions"].append(position)

    for q, stat in query_stats.items():
        clicks = stat["clicks"]
        impr = stat["impressions"]
        avg_pos = sum(stat["positions"]) / len(stat["positions"])
        ctr = (clicks / impr) * 100 if impr > 0 else 0.0

        item = {
            "query": q,
            "clicks": clicks,
            "impressions": impr,
            "ctr": ctr,
            "position": avg_pos,
            "pages": list(stat["pages"]),
        }

        matching_post = check_content_match(q, posts)
        item["matching_post"] = matching_post

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
    md.append(f"# 📊 블로그 SEO & Search Console 유입 분석 리포트\n")
    md.append(f"- **분석 일자**: {datetime.date.today().isoformat()}")
    md.append(f"- **기존 포스트 인덱싱**: 총 {len(posts)}개 포스트")
    md.append(f"- **분석된 검색어 수**: 총 {len(query_stats)}개 쿼리\n")

    md.append("## 💡 1. 콘텐츠 갭 (신규 포스팅 추천 주제)")
    md.append("> 검색 노출 및 유입이 발생하고 있으나, 현재 블로그에 직접 대응하는 전용 포스트가 없는 키워드입니다.\n")
    if content_gaps:
        md.append("| 추천 검색어(Query) | 노출수 | 클릭수 | 평균 순위 | 추천 타깃 섹션 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for item in content_gaps[:15]:
            q = item["query"]
            # simple section heuristic
            sec = "dev" if any(w in q for w in ["코드", "에러", "개발", "api", "git", "linux", "mac", "install"]) else "life"
            md.append(f"| **{q}** | {item['impressions']:,} | {item['clicks']} | {item['position']:.1f}위 | `{sec}` |")
    else:
        md.append("_현재 노출 기준 콘텐츠 갭 키워드가 발견되지 않았습니다._\n")

    md.append("\n## 🎯 2. 순위 4~15위권 근접 키워드 (조금만 보강하면 1페이지 상단)")
    md.append("> 이미 구글 상위권 바로 아래(2페이지 초반~1페이지 중하위)에 안착해 있어, 본문 H2/H3 보강 시 클릭 급증이 예상되는 키워드입니다.\n")
    if striking_distance:
        md.append("| 검색어(Query) | 평균 순위 | 노출수 | 클릭수 | 현재 연결 페이지 / 매칭 포스트 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for item in striking_distance[:15]:
            post_title = item["matching_post"].get("title", "없음") if item["matching_post"] else "직접 매칭 없음"
            md.append(f"| **{item['query']}** | **{item['position']:.1f}위** | {item['impressions']:,} | {item['clicks']} | {post_title[:30]} |")
    else:
        md.append("_해당 조건의 키워드가 없습니다._\n")

    md.append("\n## 🚀 3. 노출 대비 저클릭 키워드 (제목 / 메타설명 리프레시 추천)")
    md.append("> 구글 검색 결과에는 많이 노출되지만 제목(Title)이나 스니펫 매력도가 부족해 클릭률(CTR)이 저조한 대상입니다.\n")
    if low_ctr_queries:
        md.append("| 검색어(Query) | 노출수 | 클릭수 | 현재 CTR | 평균 순위 | 개선 대상 포스트 |")
        md.append("| :--- | :---: | :---: | :---: | :---: | :--- |")
        for item in low_ctr_queries[:15]:
            post_title = item["matching_post"].get("title", "매칭 필요") if item["matching_post"] else "랜딩 페이지"
            md.append(f"| **{item['query']}** | {item['impressions']:,} | {item['clicks']} | **{item['ctr']:.1f}%** | {item['position']:.1f}위 | {post_title[:28]} |")
    else:
        md.append("_해당 조건의 키워드가 없습니다._\n")

    return "\n".join(md)


def main():
    parser = argparse.ArgumentParser(description="Analyze Google Search Console data for blog.eone.one")
    parser.add_argument("--key", help="Path to Google Service Account JSON key file")
    parser.add_argument("--site", default=DEFAULT_SITE_URL, help="Search Console Site URL (e.g. sc-domain:blog.eone.one or https://blog.eone.one/)")
    parser.add_argument("--days", type=int, default=28, help="Days of analytics history (default: 28)")
    parser.add_argument("--out", help="Save report to markdown file path")
    args = parser.parse_args()

    creds_path = find_credentials_path(args.key)
    if not creds_path:
        console.print(Panel(
            "[bold red]❌ Google Cloud 서비스 계정 키 파일(JSON)을 찾을 수 없습니다.[/bold red]\n\n"
            "다음 중 하나의 위치에 JSON 키 파일을 두고 다시 실행해 주세요:\n"
            "1. 프로젝트 루트의 [cyan]service-account.json[/cyan]\n"
            "2. [cyan]~/.config/gcp/blog-service-account.json[/cyan]\n"
            "3. [cyan]GOOGLE_APPLICATION_CREDENTIALS[/cyan] 환경변수 지정\n"
            "4. [cyan]--key /path/to/key.json[/cyan] 파라미터 전달",
            title="인증 파일 필요",
            border_style="red"
        ))
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
        console.print("[yellow]Tip:[/yellow] 서비스 계정이 Search Console 속성에 [읽기] 권한자로 등록되어 있는지, 혹은 사이트 URL 형식이 'sc-domain:blog.eone.one' 인지 확인해주세요.")
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
