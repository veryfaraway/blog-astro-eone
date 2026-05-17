---
title: "Karabiner 완전 정복기 2편 — Complex Modifications & Hyper Key"
description: "Caps Lock을 수십 개의 단축키로 만드는 Hyper Key, 한/영 전환 딜레이 제거, 백틱·원화 문제 해결까지. Karabiner의 진짜 힘을 꺼내쓰는 방법."
date: 2026-03-26
category: Tools
tags:
  - "macos"
  - "karabiner"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1767489697894-3b3a177070eb?q=80&w=2148&auto=format&fit=crop"
---

> Caps Lock은 한 번도 쓴 적 없는 키 1위다. 이걸 가장 강력한 단축키 레이어로 바꿔보자.

## 이 글에서 다루는 내용

- Complex Modifications가 Simple Modifications와 다른 점
- 커뮤니티 룰을 가져다 쓰는 방법
- Caps Lock → Hyper Key로 변환하기
- Hyper Key로 창 관리 단축키 세팅하기
- 한/영 전환 딜레이 없애기
- 백틱(`` ` ``)이 항상 백틱으로 찍히게 만들기

---

## Complex Modifications란

1편의 Simple Modifications는 "A키 → B키" 단순 교체였다. **Complex Modifications**는 조건과 조합을 걸 수 있다.

- 이 키를 **단독으로 짧게** 누를 때 vs **다른 키와 함께** 누를 때 다르게 동작
- **특정 앱이 켜져 있을 때만** 동작
- **특정 키보드가 연결됐을 때만** 동작
- 키를 **누르는 순간**과 **떼는 순간**을 각각 다르게 처리

이 조건 조합 덕분에 키보드 하나를 완전히 다른 도구로 만들 수 있다.

Complex Modifications는 JSON 파일로 정의된다. 직접 작성할 수도 있고 (3편에서 다룸), 커뮤니티가 올려둔 룰을 가져다 쓸 수도 있다.

---

## 커뮤니티 룰 가져다 쓰기

Karabiner-Elements에는 **[Karabiner-Elements Complex Modifications Rules](https://ke-complex-modifications.pqrs.org/)** 라는 공식 커뮤니티 사이트가 있다. 수천 개의 룰이 올라와 있고, 버튼 하나로 바로 가져올 수 있다.

```text
1. https://ke-complex-modifications.pqrs.org 접속
2. 원하는 룰 검색 (예: "hyper key", "korean", "backtick")
3. "Import to Karabiner-Elements" 버튼 클릭
4. Karabiner 앱이 열리며 자동으로 룰 추가
5. Complex Modifications 탭 → Add rule → 원하는 항목 Enable
```

처음엔 직접 JSON을 건드리기 전에 커뮤니티 룰부터 둘러보는 게 좋다. 웬만한 건 이미 누군가 만들어뒀다.

---

## Caps Lock → Hyper Key

**Hyper Key**는 Karabiner 사용자들 사이에서 가장 유명한 설정이다.

아이디어는 간단하다.

- `Caps Lock` **단독으로 짧게 누름** → `Escape` (또는 한/영 전환)
- `Caps Lock` + **다른 키** → `⌃⌥⌘⇧` + 그 키 (= 완전히 새로운 단축키 레이어)

`⌃⌥⌘⇧`를 동시에 누르는 건 사실상 다른 앱과 충돌할 일이 없다. 그래서 이 조합을 "Hyper Key"라고 부르고, 여기에 마음껏 기능을 붙이는 방식이다.

### 커뮤니티 룰로 설치하기

커뮤니티 사이트에서 **"Hyper Key"** 를 검색하면 바로 나온다. 가장 많이 쓰이는 건 "Change caps_lock to cmd+ctrl+option+shift" 룰이다.

Import 후 Enable하면 즉시 동작한다.

### Hyper Key + 창 관리 단축키 연결

Hyper Key가 활성화되면 `Caps Lock + H/J/K/L` 같은 조합이 `⌃⌥⌘⇧ + H/J/K/L`로 인식된다. 이걸 Rectangle 같은 창 관리 앱의 단축키로 등록하면 된다.

Rectangle 설정에서 아래처럼 지정해두면 Caps Lock 하나로 창을 마음대로 배치할 수 있다.

| 단축키 | 동작 |
|---|---|
| `Caps Lock + H` | 좌측 절반 |
| `Caps Lock + L` | 우측 절반 |
| `Caps Lock + K` | 상단 절반 |
| `Caps Lock + J` | 하단 절반 |
| `Caps Lock + F` | 최대화 |
| `Caps Lock + C` | 창 가운데 |
| `Caps Lock + →` | 다음 모니터로 이동 |
| `Caps Lock + ←` | 이전 모니터로 이동 |

vim 키 배열(H/J/K/L = 좌/하/상/우)과 맞물려서 손이 홈 포지션을 거의 안 벗어나도 된다.

```text
💡 추가 활용 예시
Caps Lock + 1~5 → 특정 앱 바로 포커스 (Raycast 또는 Alfred와 연동)
Caps Lock + T   → 터미널 열기
Caps Lock + B   → 브라우저 열기
Caps Lock + N   → 노트 앱 열기
```

---

## 한/영 전환 딜레이 없애기

macOS 기본 한/영 전환(`Caps Lock`)은 눈에 띄는 딜레이가 있다. 빠르게 타이핑하다가 전환하면 글자가 씹히거나 밀리는 현상이 발생한다.

Karabiner로 이 문제를 해결하는 방법은 두 가지다.

### 방법 1: F18 키를 한/영 전환에 연결

macOS 입력기는 `F18` 키를 한/영 전환 트리거로 인식한다. Karabiner에서 `Caps Lock` 단독 입력을 `F18`로 보내도록 설정하면, 시스템 입력기가 받아서 즉각 전환한다.

커뮤니티 룰에서 **"Korean input"** 또는 **"CapsLock to F18"** 을 검색하면 바로 가져올 수 있다.

```json
// 핵심 동작 (단순화)
// Caps Lock 단독 탭 → F18 (한/영 전환)
// Caps Lock + 다른 키 → Hyper Key 역할
```

이 방식은 Hyper Key와 완전히 공존한다. `Caps Lock`을 단독으로 짧게 누르면 한/영 전환, 다른 키와 함께 누르면 Hyper Key로 동작한다.

### 방법 2: 구름 입력기와 조합

**[구름 입력기](https://gureum.io/)** 를 함께 쓰면 전환 속도가 더 빨라진다. 구름 입력기 자체가 한/영 전환에 최적화되어 있고, Karabiner와 충돌 없이 잘 동작한다.

```text
권장 조합:
Karabiner (Caps Lock → F18) + 구름 입력기 (F18에 한/영 전환 매핑)
```

이 조합을 쓰면 딜레이를 거의 느낄 수 없는 수준이 된다.

---

## 백틱이 항상 백틱으로 찍히게 만들기

한국어 입력 상태에서 백틱(`` ` ``) 키를 누르면 **₩(원화 기호)** 가 찍히는 문제는 Mac 한국어 사용자라면 누구나 겪는다. 마크다운 쓸 때, 코드 블록 쓸 때마다 입력기를 영어로 전환해야 하는 불편함이다.

### Karabiner로 글로벌 고정

커뮤니티 룰에서 **"backtick"** 또는 **"₩"** 를 검색하면 "Change ₩ to ` in all input sources" 룰이 나온다.

이 룰을 Enable하면 **입력기 상태와 무관하게** 백틱 키는 항상 `` ` `` 를 입력한다.

직접 JSON으로 작성하면 이렇게 생겼다.

```json
{
  "description": "₩ to ` (Korean input fix)",
  "manipulators": [
    {
      "type": "basic",
      "from": {
        "key_code": "grave_accent_and_tilde",
        "modifiers": { "optional": ["any"] }
      },
      "to": [
        {
          "key_code": "grave_accent_and_tilde",
          "modifiers": []
        }
      ],
      "conditions": [
        {
          "type": "input_source_if",
          "input_sources": [{ "language": "ko" }]
        }
      ]
    }
  ]
}
```

`input_source_if` 조건으로 한국어 입력 상태일 때만 동작하도록 제한한 것이다. 3편에서 이런 JSON 구조를 직접 작성하는 법을 자세히 다룬다.

<div class="alert alert-info">

백틱 문제는 Karabiner 없이도 `~/Library/KeyBindings/DefaultKeyBinding.dict` 파일을 수정해서 해결할 수 있다. 하지만 이미 Karabiner를 쓰고 있다면 한 곳에서 관리하는 게 편하다.

</div>

---

## 마치며

Complex Modifications와 Hyper Key를 적용하고 나면 키보드 사용 방식이 진짜로 달라진다. 창 배치, 앱 전환, 한/영 전환, 백틱 입력 — 이 네 가지만 해결해도 하루 타이핑 흐름이 눈에 띄게 매끄러워진다.

다음 편에서는 JSON을 직접 작성해서 **나만의 룰**을 만드는 법을 다룬다. 앱별 조건, 기기별 조건, 그리고 실전에서 쓰는 세팅을 통째로 공유할 예정이다.

---

**이 글은 시리즈의 2편입니다.**
  
- 이전 편: [Karabiner 완전 정복기 1편 — 설치부터 기본 리매핑까지](/posts/2026/karabiner-elements-guide-1)
- 다음 편: [Karabiner 완전 정복기 3편 — 나만의 룰 만들기](/posts/2026/karabiner-elements-guide-3)
