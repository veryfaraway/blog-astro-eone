#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "google-analytics-data>=0.18.0",
#     "google-analytics-admin>=0.23.0",
#     "google-auth>=2.20.0",
#     "rich>=13.0.0",
# ]
# ///

"""
GA4 Insights Script for blog.eone.one
Uses the existing Google Cloud Service Account (service-account.json) to:
1. Fetch traffic sources (Google, Naver, AI assistants, Direct, etc.)
2. Fetch top pages by views, active users, average engagement time, and bounce rate
3. Identify high-traffic posts with high bounce rate / short engagement time for improvement
"""

import argparse
import os
import sys
from pathlib import Path
from typing import Optional

from google.analytics.admin import AnalyticsAdminServiceClient
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.oauth2 import service_account
from rich.console import Console
from rich.panel import Panel

console = Console()

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
DEFAULT_PROPERTY_ID = "properties/538668200"

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


def discover_property_id(credentials) -> Optional[tuple[str, str]]:
    """Auto-discover the first available GA4 property ID and display name."""
    admin_client = AnalyticsAdminServiceClient(credentials=credentials)
    summaries = list(admin_client.list_account_summaries())
    for account in summaries:
        for prop in account.property_summaries:
            return prop.property, prop.display_name
    return None


def main():
    parser = argparse.ArgumentParser(description="Analyze GA4 data for blog.eone.one")
    parser.add_argument("--key", help="Path to Google Service Account JSON key file")
    parser.add_argument(
        "--property",
        default=os.environ.get("GA4_PROPERTY_ID", DEFAULT_PROPERTY_ID),
        help="GA4 Property ID (default: properties/538668200).",
    )
    parser.add_argument("--days", type=int, default=28, help="Days of history (default: 28)")
    parser.add_argument("--out", help="Save report to markdown file path")
    args = parser.parse_args()

    creds_path = find_credentials_path(args.key)
    if not creds_path:
        console.print(
            Panel(
                "[bold red]❌ Google Cloud 서비스 계정 키 파일(service-account.json)을 찾을 수 없습니다.[/bold red]",
                title="인증 파일 필요",
                border_style="red",
            )
        )
        sys.exit(1)

    credentials = service_account.Credentials.from_service_account_file(
        str(creds_path), scopes=SCOPES
    )
    sa_email = getattr(credentials, "service_account_email", "서비스 계정")
    console.print(f"[green]✓ 서비스 계정 로드 완료:[/green] {sa_email}")

    prop_id = args.property.strip()
    prop_name = "astro-blog"
    if not prop_id:
        discovered = discover_property_id(credentials)
        if discovered:
            prop_id, prop_name = discovered

    if not prop_id.startswith("properties/"):
        prop_id = f"properties/{prop_id}"

    console.print(f"[cyan]ℹ 대상 GA4 속성:[/cyan] {prop_name} ({prop_id}, 최근 {args.days}일)")

    data_client = BetaAnalyticsDataClient(credentials=credentials)
    date_range = DateRange(start_date=f"{args.days}daysAgo", end_date="today")

    try:
        page_resp = data_client.run_report(
            RunReportRequest(
                property=prop_id,
                dimensions=[Dimension(name="pagePath")],
                metrics=[
                    Metric(name="screenPageViews"),
                    Metric(name="activeUsers"),
                    Metric(name="userEngagementDuration"),
                    Metric(name="bounceRate"),
                ],
                date_ranges=[date_range],
                order_bys=[
                    OrderBy(
                        metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"),
                        desc=True,
                    )
                ],
                limit=50,
            )
        )

        source_resp = data_client.run_report(
            RunReportRequest(
                property=prop_id,
                dimensions=[Dimension(name="sessionSourceMedium")],
                metrics=[
                    Metric(name="sessions"),
                    Metric(name="activeUsers"),
                    Metric(name="engagementRate"),
                ],
                date_ranges=[date_range],
                order_bys=[
                    OrderBy(
                        metric=OrderBy.MetricOrderBy(metric_name="sessions"),
                        desc=True,
                    )
                ],
                limit=15,
            )
        )
    except Exception as e:
        console.print(f"[bold red]❌ GA4 Data API 호출 실패:[/bold red] {e}")
        sys.exit(1)

    md = []
    md.append(f"# 📈 GA4 블로그 유입 & 체류 분석 리포트 (최근 {args.days}일)\n")
    md.append(f"- **대상 속성**: {prop_name} (`{prop_id}`)\n")

    md.append("## 🌐 1. 주요 유입 경로 (Source / Medium)")
    if source_resp.rows:
        md.append("| 유입 경로 (Source / Medium) | 세션수 | 활성 사용자 | 참여율 |")
        md.append("| :--- | :---: | :---: | :---: |")
        for row in source_resp.rows:
            src = row.dimension_values[0].value
            sessions = int(row.metric_values[0].value or 0)
            users = int(row.metric_values[1].value or 0)
            eng_rate = float(row.metric_values[2].value or 0.0) * 100
            md.append(f"| **{src}** | {sessions:,} | {users:,} | {eng_rate:.1f}% |")
    else:
        md.append("_아직 수집된 유입 데이터가 없습니다._")

    pages = []
    for row in page_resp.rows:
        path = row.dimension_values[0].value
        views = int(row.metric_values[0].value or 0)
        users = int(row.metric_values[1].value or 0)
        total_eng = float(row.metric_values[2].value or 0.0)
        bounce = float(row.metric_values[3].value or 0.0) * 100
        avg_eng = (total_eng / users) if users > 0 else 0.0
        pages.append(
            {
                "path": path,
                "views": views,
                "users": users,
                "avg_eng": avg_eng,
                "bounce": bounce,
            }
        )

    md.append("\n## 📄 2. 인기 페이지 Top 20 및 체류 시간")
    if pages:
        md.append("| 페이지 경로 | 조회수 | 사용자 | 평균 체류시간 | 이탈률 |")
        md.append("| :--- | :---: | :---: | :---: | :---: |")
        for p in pages[:20]:
            md.append(
                f"| `{p['path']}` | {p['views']:,} | {p['users']:,} | **{p['avg_eng']:.0f}초** | {p['bounce']:.1f}% |"
            )
    else:
        md.append("_아직 수집된 페이지뷰 데이터가 없습니다._")

    # 3. High traffic but high bounce (>40%) or short engagement (<35s) posts (excluding index/pagination)
    improvement_targets = [
        p
        for p in pages
        if p["views"] >= 15
        and p["path"] not in ("/", "/life/", "/dev/", "/tools/", "/culture/", "/money/")
        and not p["path"].startswith("/blog/")
        and (p["bounce"] >= 40.0 or p["avg_eng"] < 35.0)
    ]

    md.append("\n## 🛠️ 3. 도입부/본문 개선 추천 포스트 (유입 대비 빠른 이탈)")
    md.append("> 조회수는 높지만 이탈률이 40% 이상이거나 평균 체류시간이 35초 미만인 포스트입니다. 첫 단락 훅이나 상단 요약표를 보강하면 체류시간을 늘릴 수 있습니다.\n")
    if improvement_targets:
        md.append("| 페이지 경로 | 조회수 | 평균 체류시간 | 이탈률 | 개선 포인트 |")
        md.append("| :--- | :---: | :---: | :---: | :--- |")
        for p in improvement_targets[:10]:
            reason = "이탈률 높음 + 체류 짧음" if (p["bounce"] >= 40 and p["avg_eng"] < 35) else ("이탈률 높음" if p["bounce"] >= 40 else "체류시간 짧음")
            md.append(
                f"| `{p['path']}` | {p['views']:,} | **{p['avg_eng']:.0f}초** | **{p['bounce']:.1f}%** | {reason} |"
            )
    else:
        md.append("_현재 조건에 해당하는 개선 시급 포스트가 없습니다._")

    report_text = "\n".join(md)
    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(report_text, encoding="utf-8")
        console.print(f"\n[bold green]✓ GA4 리포트 저장 완료:[/bold green] {out_path.resolve()}")
    else:
        console.print("\n" + report_text)


if __name__ == "__main__":
    main()
