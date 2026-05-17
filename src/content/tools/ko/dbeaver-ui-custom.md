---
title: "[DBeaver] 투박한 UI 탈출! 개발자를 위한 테마, 폰트, 운영 실수 방지 설정"
description: DBeaver의 UI를 커스터마이징하여 눈이 편안하고 실수를 줄이는 환경을 만드는 방법을 알아봅니다.
date: 2026-01-16
category: Tools
tags:
  - "dbeaver"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2262&auto=format&fit=crop"
---

DBeaver를 처음 설치하고 "아, 너무 복잡하고 안 예쁜데?"라고 생각하셨나요? 
약간의 설정만 더하면 TablePlus 부럽지 않은 쾌적한 작업 환경을 만들 수 있습니다. 맥 사용자라면 꼭 설정해야 할 **DBeaver 꿀팁 3가지**를 정리했습니다.

---

### 1. 눈이 편안한 테마 설정 (Dark Mode)

DBeaver는 시스템 테마를 따라가기도 하지만, 직접 지정하는 것이 가장 정확합니다.

1.  **설정 경로:** `Settings` (단축키: `Cmd + ,`) -> `User Interface` -> `Appearance`
2.  **Theme:** `Dark` 또는 `Light` 중 선호하는 것을 선택하세요.
3.  **Color and Font:** 테마를 바꾼 후에는 반드시 하단의 **Colors and Fonts** 메뉴에서 에디터 색상이 잘 맞는지 확인해야 합니다.



---

### 2. 가독성 끝판왕 폰트 추천 (JetBrains Mono)

쿼리를 오래 보다 보면 폰트가 정말 중요합니다. DBeaver의 기본 폰트는 맥에서 다소 얇게 보일 수 있습니다.

* **추천 폰트:** `JetBrains Mono` (무료이며 읽기 편함) 또는 `D2Coding`.
* **설정 방법:** * `Settings` -> `User Interface` -> `Appearance` -> `Colors and Fonts`
    * `Database` -> `SQL Editor` -> `Monospaced font` 선택 후 **Edit** 클릭.
    * 폰트 크기를 **13pt ~ 14pt** 정도로 키우면 가독성이 대폭 향상됩니다.

---

### 3. "내 손가락 멈춰!" 운영/개발 환경 색상 구분

이 기능은 DBeaver의 가장 강력한 **사고 방지 기능**입니다. 운영 서버 연결 시 배경색을 빨간색으로 바꿔서 긴장감을 유지하게 해줍니다.

1.  **설정 방법:** 왼쪽 데이터베이스 리스트에서 서버 우클릭 -> `Edit Connection`
2.  **Connection Type:** * 운영 서버라면 `Production` 선택.
    * 개발 서버라면 `Development` 선택.
3.  **색상 효과:** `General` 탭에서 **Connection type**을 설정하면, 해당 DB의 쿼리창 배경색이나 사이드바 라벨 색상이 지정된 색상으로 변합니다.



> **꿀팁:** 운영(Production)으로 설정된 연결에서는 데이터를 수정하는 쿼리를 실행할 때 한 번 더 확인 팝업을 띄우도록 설정할 수 있어 매우 안전합니다.

---

### 4. 쿼리 자동 완성 & 대문자 자동 변환

SQL 키워드(SELECT, FROM 등)를 대문자로 쓰는 것을 선호하신다면 다음 설정을 꼭 켜보세요.

* **설정 경로:** `Settings` -> `Editors` -> `SQL Editor` -> `SQL Formatting`
* **Keyword case:** `Upper`로 변경.
* 이렇게 설정하면 `select`라고 소문자로 쳐도 스페이스를 누르는 순간 자동으로 `SELECT`로 변환되어 코드가 깔끔해집니다.

---

### 마치며

DBeaver는 "다듬어서 쓰는" 도구입니다. 처음의 복잡함만 극복하면, 무료 툴 중 이만큼 강력한 생산성을 주는 툴은 없습니다. 오늘 소개한 설정으로 여러분의 소중한 눈과 운영 데이터를 보호하세요!
