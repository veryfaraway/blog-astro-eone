---
title: "Raycast 실전 가이드: 웹 검색부터 Rectangle/Itsycal 기능 통합까지"
description: "브라우저를 열지 않고 구글·네이버를 즉시 검색하는 Quicklinks 동적 인자 설정부터 북마크 조회, Rectangle(창 분할)·Itsycal(일정·회의)·Maccy(클립보드) 대체 세팅까지 실전 팁을 정리했습니다."
date: 2026-01-27
category: macOS
tags:
  - "macos"
  - "raycast"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1632893037506-aac33bf18107?q=80&w=2148&auto=format&fit=crop"
series: "Raycast 완전 정복기"
series_order: 2
---

[1편 알프레드 대안 및 Raycast 입문 가이드](/tools/raycast-complete-guide-2026)에서 초기 세팅과 스니펫 이사를 마쳤다면, 이번 2편에서는 매일 반복하는 브라우저 검색과 유틸리티 앱 동작을 Raycast 하나로 묶는 실전 세팅을 다룹니다.

---

## 1. 웹 검색: 브라우저 실행 없이 바로 검색하기

Raycast의 **Quicklinks** 기능을 쓰면 브라우저를 열고 검색창을 마우스로 클릭하는 단계가 통째로 사라집니다.

* **기본 검색:** Raycast를 띄우고 검색어를 입력한 뒤 기본 검색 항목(또는 Fallback Commands)을 실행하면 기본 브라우저에서 곧장 결과가 열립니다.
* **특정 사이트 즉시 검색 (Custom Quicklinks):**
    1. Raycast 설정(`Cmd + ,`) > **Extensions** > **Quicklinks**로 이동하거나 `Create Quicklink` 명령을 실행합니다.
    2. 동적 인자 플레이스홀더(`{argument name="query"}`)를 넣어 검색 URL을 등록합니다.
       - **Google:** `https://www.google.com/search?q={argument name="query"}`
       - **Naver:** `https://search.naver.com/search.naver?query={argument name="query"}`
       - **Amazon:** `https://www.amazon.com/s?k={argument name="query"}`
    3. **Alias**를 짧게 지정하세요(예: 구글은 `g`, 네이버는 `n`, 아마존은 `az`).
    4. 이제 Raycast 창에 `g` → `Tab`(또는 `Space`) → `맥북프로`만 치면 곧장 검색 결과 페이지로 연결됩니다.

---

## 2. 즐겨찾기(Bookmarks) 검색 방법

브라우저 북마크 바를 뒤지기 위해 마우스로 손을 옮길 필요가 없습니다.

* **브라우저 통합:** Raycast Store에서 사용 중인 브라우저(Chrome, Safari, Arc, Brave 등)의 **Bookmarks 확장 프로그램**을 설치하세요.
* **검색 방법:** Raycast 창에 별칭 `b` 또는 `Search Bookmarks`를 입력한 뒤 저장해 둔 사이트 이름을 치면 즉시 목록이 필터링됩니다.
* **자주 가는 사이트 고정:** 사내 위키나 대시보드처럼 매일 여는 주소는 Quicklink로 등록하고 전용 단축키(Hotkey)를 할당해 두면 창을 띄울 필요도 없이 한 번에 열립니다.

---

## 3. 기존 앱 완전 대체하기 (Rectangle, Itsycal, Maccy)

Raycast 무료 내장 기능으로 상주 앱 개수를 줄이면 단축키 관리가 한곳으로 모이고 시스템도 깔끔해집니다.

### [Rectangle 대체] Window Management

별도 창 관리 앱 없이도 단축키 기반 화면 분할을 그대로 쓸 수 있습니다.

* **설정:** `Settings` > `Extensions` > `Window Management`로 이동합니다.
* **활용:**
  * `Almost Maximize`, `Left Half`, `Right Half`, `First Two Thirds` 등 자주 쓰는 배치에 핫키를 직접 할당하세요(예: `Ctrl + Option + Enter`로 최대화).
  * 기존 Rectangle에서 쓰던 키맵을 그대로 옮기면 적응 기간이 필요 없습니다. 삼분할·Hyper 키 활용법과 전용 앱과의 비교는 [맥 윈도우 관리 앱 추천 2026](/tools/mac-window-manager-apps) 글에서 자세히 정리했습니다.

### [Itsycal 대체] Calendar & My Schedule

메뉴바의 작은 달력 앱보다 일정 합류 동선이 훨씬 짧습니다.

* **설정:** `Settings` > `Extensions` > `Calendar`에서 시스템 캘린더 접근 권한을 허용합니다.
* **활용:**
  * **Menu Bar Calendar:** `Menu Bar` 항목을 켜두면 Itsycal처럼 상단 메뉴바에 다가오는 일정이 표시됩니다.
  * **My Schedule:** Raycast를 열자마자 오늘 남은 일정과 화상회의 링크(Zoom, Google Meet, Teams 등)가 최상단에 잡힙니다. 엔터 한 번으로 회의실에 바로 입장할 수 있어요.

### [Maccy 대체] Clipboard History

복사 기록 관리 역시 무료 플랜만으로 3개월 보관을 지원합니다. 설정에서 보관 기간을 `3 Months`로 늘리고 `Opt + Cmd + V` 같은 전용 핫키를 붙여두세요. OCR 텍스트 추출과 순차 붙여넣기 등 세부 팁은 [맥 클립보드 관리 앱 추천 2026](/tools/mac-clipboard-manager-apps)에서 확인할 수 있습니다.

---

## 4. 2026년형 Raycast 세팅 핵심 요약

| 기능 | 기존 방식 | Raycast 방식 | 추천 단축키/Alias |
| :--- | :--- | :--- | :--- |
| **웹 검색** | 브라우저 접속 > 검색 | **Quicklinks** 활용 | `g` · `n` 별칭 |
| **창 분할** | Rectangle 별도 실행 | **Window Management** | `Ctrl + Opt + 방향키` |
| **달력·회의** | Itsycal / 캘린더 앱 | **My Schedule / Menu Bar** | 메뉴바 상시 표시 |
| **클립보드** | Maccy 등 별도 앱 | **Clipboard History** | `Opt + Cmd + V` |

---

## 마치며

단축키와 별칭을 한 번 손에 익혀두면 `Export Settings & Data` 백업 파일 하나로 새 맥북에서도 1분 만에 똑같은 작업 환경을 복원할 수 있습니다.

무료 코어 세팅을 마쳤다면 이어지는 [3편 Raycast Pro AI 완전 정복](/tools/raycast-ai-guide-2026)과 [4편 Raycast Pro 7일 무료체험 검증 플랜](/tools/raycast-pro-trial-guide)에서 유료 AI·클라우드 기능이 내 업무에 돈값을 하는지 확인해 보세요.
