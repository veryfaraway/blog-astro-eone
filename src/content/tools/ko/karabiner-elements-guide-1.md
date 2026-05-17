---
title: Karabiner 완전 정복기 1편 — 설치부터 기본 리매핑까지
description: "macOS 키보드 리매핑 툴 Karabiner-Elements 설치, 권한 설정, 외장 키보드 죽은 키 살리기까지. 처음 시작하는 사람을 위한 완전 입문 가이드."
date: 2026-03-25
category: Tools
tags:
  - "macos"
  - "karabiner"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1767916901536-d42f78ad2ecf?q=80&w=2148&auto=format&fit=crop"
---

> 키보드를 내 마음대로 바꿀 수 있다면? Karabiner-Elements는 그게 가능한 툴이다.

## 이 글에서 다루는 내용

- Karabiner-Elements가 뭔지, 왜 써야 하는지
- 설치와 보안 권한 설정 방법
- Simple Modifications로 키 하나씩 바꾸기
- 외장 키보드의 죽은 키(Print Screen, Scroll Lock 등) 살려 쓰기
- Home / End 키 macOS답게 동작시키기

---

## Karabiner-Elements가 뭔가

macOS는 기본적으로 키보드 리매핑 기능이 거의 없다. 시스템 설정에서 수식어 키(⌘, ⌃, ⌥, Caps Lock) 정도만 바꿀 수 있고, 그 이상은 방법이 없다.

**Karabiner-Elements**는 이 한계를 완전히 없애주는 오픈소스 툴이다. 키 하나를 다른 키로 바꾸는 단순한 리매핑부터, "이 앱이 실행 중일 때만", "이 키보드를 연결했을 때만"처럼 조건을 걸어 동작시키는 복잡한 규칙까지 만들 수 있다.

Windows 사용자가 Mac으로 넘어왔을 때, 또는 외장 키보드를 쓸 때 느끼는 불편함 대부분이 이 툴 하나로 해결된다.

---

## 설치와 권한 설정

### 설치

[karabiner-elements.pqrs.org](https://karabiner-elements.pqrs.org/) 에서 최신 버전을 받아서 설치한다. Homebrew를 쓴다면 더 간단하다.

```bash
brew install --cask karabiner-elements
```

### 보안 권한 허용

설치 후 처음 실행하면 권한 요청이 연속으로 뜬다. 키보드 입력을 가로채야 하는 툴 특성상 **두 가지 권한이 반드시 필요**하다.

**1) 시스템 확장 허용**

```
시스템 설정 → 개인 정보 보호 및 보안
→ 하단의 "karabiner-elements" 관련 시스템 소프트웨어 → 허용
```

**2) 입력 모니터링 허용**

```
시스템 설정 → 개인 정보 보호 및 보안 → 입력 모니터링
→ karabiner_grabber, karabiner_observer 체크
```

두 권한이 모두 허용되어야 리매핑이 정상 작동한다. 하나라도 빠지면 설정한 키가 먹히지 않으니 꼭 확인하자.

<div class="alert alert-warning">

macOS 업데이트 후 간혹 권한이 초기화되는 경우가 있다. 리매핑이 갑자기 안 된다면 여기부터 다시 확인해보자.

</div>

---

## Simple Modifications — 키 하나씩 바꾸기

설치가 끝나면 Karabiner-Elements를 열고 **Simple Modifications** 탭으로 이동한다. 말 그대로 단순한 1:1 키 교체다. "이 키를 누르면 저 키로 인식해라"는 규칙이다.

화면 상단의 **For device** 드롭다운에서 리매핑할 키보드를 선택할 수 있다. 특정 외장 키보드에만 적용하거나, 모든 키보드에 공통으로 적용하는 것도 가능하다.

`+ Add item` 버튼으로 규칙을 하나씩 추가한다. From key(원래 키) → To key(바꿀 키) 순으로 선택하면 즉시 적용된다.

### 수식어 키 위치 교정 (Windows 키보드 → Mac)

Windows 키보드를 Mac에 연결하면 `Win` 키와 `Alt` 키 위치가 macOS의 `⌘`와 `⌥` 위치와 반대로 되어 있다. 이게 가장 먼저 해야 할 교정이다.

| From | To |
|---|---|
| `left_option` (Alt) | `left_command` |
| `left_command` (Win) | `left_option` |

이 두 줄만 추가해도 Windows 키보드가 Mac 배열처럼 동작한다.

---

## 외장 키보드의 죽은 키 살려 쓰기

풀배열 Windows 키보드에는 macOS에서 아무 기능도 없는 키들이 가득하다. `Print Screen`, `Scroll Lock`, `Pause/Break`, `Insert` — 이 키들은 그냥 두면 평생 눌릴 일이 없다.

Simple Modifications에서 이 키들에 유용한 기능을 매핑해두면 강력한 단축키 버튼이 생긴다.

### 추천 매핑

| 원래 키 | 추천 매핑 | 이유 |
|---|---|---|
| `Print Screen` | `⌘⇧4` (스크린샷) | 직관적으로 같은 기능 |
| `Scroll Lock` | `⌃↑` (Mission Control) | 창 전체 조망할 때 |
| `Pause/Break` | `⌃⌘Q` (화면 잠금) | 자리 비울 때 원터치 |
| `Insert` | `⌃⌘Space` (이모지 피커) | Insert는 macOS에서 쓸 일 없음 |

<div class="alert alert-tip">

Print Screen에 스크린샷을 매핑할 때, Simple Modifications에서는 단일 키 매핑만 가능하다. `⌘⇧4`처럼 단축키 조합을 매핑하려면 2편에서 다룰 Complex Modifications를 써야 한다.

</div>

Simple Modifications 한계 안에서는 `print_screen` → `f13` 처럼 F13~F19 같은 "빈 기능 키"에 먼저 매핑해두고, 그 F키를 시스템 단축키로 연결하는 방식도 자주 쓴다.

---

## Home / End 키 macOS답게 고치기

이건 Windows에서 Mac으로 넘어온 사람이 거의 모두 겪는 불편이다.

- **Windows**: `Home` → 현재 줄 맨 앞 / `End` → 현재 줄 맨 끝
- **macOS 기본**: `Home` → 문서 맨 처음 / `End` → 문서 맨 끝

에디터에서 줄 단위로 이동하려고 Home을 눌렀는데 스크롤이 문서 처음으로 튀어 올라가는 경험을 한 번이라도 했다면, 이 설정이 필요하다.

Simple Modifications에서 아래와 같이 매핑한다.

| From | To |
|---|---|
| `home` | `⌘←` |
| `end` | `⌘→` |
| `⇧Home` | `⇧⌘←` (선택하며 줄 앞으로) |
| `⇧End` | `⇧⌘→` (선택하며 줄 끝으로) |

`⇧` 조합 매핑은 Complex Modifications에서 처리하는 게 더 정확하지만, 단순 이동만 교정하는 것도 충분히 체감이 크다.

---

## 마치며

Simple Modifications만으로도 외장 키보드 사용 경험이 확 달라진다. 특히 Windows 키보드 배열 교정과 죽은 키 재활용은 설정하고 나면 "왜 진작 안 했지"라는 생각이 든다.

다음 편에서는 본격적으로 **Complex Modifications**를 다룬다. Caps Lock 하나로 수십 개의 단축키를 만드는 Hyper Key, 한/영 전환 딜레이 제거, 백틱/원화 문제 해결까지 — 훨씬 강력한 내용이 기다리고 있다.

---

**이 글은 시리즈의 1편입니다.**

- 다음 편: [Karabiner 완전 정복기 2편 — Complex Modifications & Hyper Key](/posts/2026/karabiner-elements-guide-2)
