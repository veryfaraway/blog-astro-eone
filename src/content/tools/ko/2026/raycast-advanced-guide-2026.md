---
title: "Raycast 실전 가이드: 웹 검색부터 Rectangle/Itsycal 기능 통합까지"
description: "Raycast를 200% 활용하는 방법! 구글/아마존 즉시 검색, 즐겨찾기 관리, 그리고 기존 유틸리티 앱들을 대체하는 설정을 알아봅니다."
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

[지난 포스팅](/tools/raycast-complete-guide-2026)에서 Raycast의 기본적인 매력을 살펴봤다면, 오늘은 실제 업무 속도를 5배 이상 높여줄 **'실전 활용 설정'** 을 파헤쳐 보겠습니다. 특히 기존에 별도 앱으로 관리하던 기능들을 Raycast 하나로 합치는 방법을 중점적으로 다룹니다.

---

## 1. 🌐 웹 검색: 브라우저 실행 없이 바로 검색하기

Raycast의 **'Quicklinks'** 기능을 사용하면 브라우저를 열고, 검색창을 클릭하는 번거로움이 사라집니다.

* **기본 검색:** Raycast를 띄우고 바로 검색어를 입력하면 구글 검색이 제안됩니다. 엔터를 치면 기본 브라우저에서 결과가 열립니다.
* **특정 사이트 검색 (Custom Quicklinks):**
    1. Raycast 설정(`Cmd + ,`) > **Extensions** > **Quicklinks**로 이동합니다.
    2. `Create Quicklink`를 클릭합니다.
    3. `Query Parameter`를 이용해 주소를 등록합니다.
       - **Google:** `https://www.google.com/search?q={query}`
       - **Amazon:** `https://www.amazon.com/s?k={query}`
    4. **Link Alias**를 설정하세요 (예: 구글은 `g`, 아마존은 `az`).
    5. 이제 Raycast창에 `g 맥북프로`라고 치면 즉시 구글 검색 결과로 연결됩니다.

---

## 2. ⭐ 즐겨찾기(Bookmarks) 검색 방법

브라우저 북마크를 찾기 위해 마우스를 움직일 필요가 없습니다.

* **브라우저 통합:** Raycast Store에서 사용 중인 브라우저(Chrome, Safari, Brave 등)의 **Bookmarks 확장 프로그램**을 설치하세요.
* **검색 방법:** Raycast 창에 `b` 또는 `bookmarks`라고 입력한 뒤, 저장해둔 사이트 이름을 치면 즉시 리스트가 나타납니다. 
* **자주 가는 사이트 고정:** 특정 사이트를 Quicklink로 등록한 뒤 단축키(Hotkeys)를 할당하면, 클릭 한 번으로 해당 사이트를 즉시 실행할 수 있습니다.

---

## 3. 🧩 기존 앱 완전 대체하기 (Rectangle, Itsycal)

Raycast 내장 기능을 활용해 설치 앱 개수를 줄여보세요. 시스템 자원도 아끼고 훨씬 깔끔해집니다.

### **[Rectangle 대체] Window Management**

별도의 창 관리 앱 없이도 창 분할이 가능합니다.

* **설정:** `Settings` > `Extensions` > `Window Management`로 이동합니다.
* **활용:** - `Almost Maximize`, `Left Half`, `Right Half` 등 원하는 동작에 단축키를 할당하세요. (예: `Ctrl + Option + Enter`로 전체 화면)
  * Rectangle에서 쓰던 단축키와 똑같이 설정하면 적응 기간도 필요 없습니다.

### **[Itsycal 대체] Calendar & My Schedule**

메뉴바의 작은 달력 기능도 Raycast가 더 스마트하게 수행합니다.

* **설정:** `Settings` > `Extensions` > `Calendar`에서 시스템 캘린더 접근을 허용합니다.
* **활용:**
  * **Menu Bar Calendar:** 설정에서 `Show Calendar in Menu Bar`를 체크하면 Itsycal처럼 메뉴바에 날짜와 요일이 표시됩니다.
  * **My Schedule:** Raycast를 실행하자마자 오늘 남은 일정과 회의 링크(Zoom, Meet 등)가 바로 나타납니다. 엔터 한 번으로 회의에 바로 접속할 수 있어 Itsycal보다 더 강력합니다.

---

## 4. 2026년형 Raycast 세팅 핵심 요약

| 기능 | 기존 방식 | Raycast 방식 | 추천 단축키/Alias |
| :--- | :--- | :--- | :--- |
| **웹 검색** | 브라우저 접속 > 검색 | **Quicklinks** 활용 | `g [검색어]` |
| **창 분할** | Rectangle 앱 실행 | **Window Management** | `Ctrl + Opt + 화살표` |
| **달력 확인** | Itsycal 클릭 | **My Schedule / Menu Bar** | `메뉴바 자동 표시` |
| **클립보드** | Maccy 등 별도 앱 | **Clipboard History** | `Opt + V` |

---

## 마치며

Raycast는 단순한 실행기를 넘어 **'워크플로우의 단일화'** 를 지향합니다. 처음에는 단축키 설정이 번거로울 수 있지만, 한 번 세팅해두면 맥북을 새로 살 때마다 설정 파일만 불러와서 완벽한 환경을 1분 만에 재구축할 수 있습니다.

다음 포스팅에서는 Raycast의 꽃이라고 불리는 **'AI 기능 활용법'** 에 대해 다뤄보겠습니다. 궁금한 점은 댓글로 남겨주세요!
