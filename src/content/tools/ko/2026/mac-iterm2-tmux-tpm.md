---
title: "tmux 가이드 #2: 플러그인 매니저(tpm)로 터미널에 날개 달기"
description: 단조로운 tmux는 잊으세요. tpm을 이용한 플러그인 설치와 테마 적용으로 나만의 멋진 터미널 환경을 구축하는 방법을 소개합니다.
date: 2026-01-11
category: Development
tags:
  - "iterm2"
  - "tmux"
  - "tpm"
  - "terminal"
  - "macos"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1601467450590-8c3d11cde2fd?q=80&w=2370&auto=format&fit=crop"
series: "tmux 가이드"
series_order: 2
---

지난 포스팅에서는 tmux의 기초와 iTerm2 연동법을 알아봤습니다. 하지만 기본 tmux 화면은 왠지 투박하고 90년대 개발자 환경처럼 보이죠. 

오늘은 tmux의 기능을 무한대로 확장해주는 **tpm(tmux Plugin Manager)** 설치법과, 작업 효율을 높여주는 필수 플러그인들을 소개합니다.

---

## 1. tpm(tmux Plugin Manager) 설치하기

tpm은 마치 맥의 Homebrew나 Python의 pip처럼 tmux 플러그인을 관리해주는 도구입니다.

### 저장소 복제

먼저 GitHub에서 tpm 소스 코드를 내 맥의 설정 폴더로 가져옵니다.

```bash
git clone [https://github.com/tmux-plugins/tpm](https://github.com/tmux-plugins/tpm) ~/.tmux/plugins/tpm

```

### .tmux.conf 설정 추가

`~/.tmux.conf` 파일 맨 아랫부분에 아래 내용을 추가합니다.

```bash
# 플러그인 리스트
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'

# 이 라인이 파일의 가장 마지막에 있어야 합니다!
run '~/.tmux/plugins/tpm/tpm'

```

---

## 2. 강력 추천하는 필수 플러그인 3가지

단순히 예쁜 것뿐만 아니라, 로컬과 원격 작업을 획기적으로 도와주는 플러그인들입니다.

### ① tmux-resurrect & tmux-continuum

맥을 재부팅해도 tmux 세션이 그대로 살아있길 원하시나요? 이 조합이 정답입니다.

* **기능:** 세션 상태를 저장하고, 재부팅 시 자동으로 복구합니다.
* **설정:**

```bash
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-restore 'on' # 자동 복구 활성화

```

### ② dracula/tmux (테마 플러그인)

가장 인기 있는 테마 중 하나인 Dracula입니다. 하단 바에 CPU 점유율, 시간, 날씨 등을 깔끔하게 표시해줍니다.

* **설정:**

```bash
set -g @plugin 'dracula/tmux'
set -g @dracula-show-powerline true
set -g @dracula-show-network false
set -g @dracula-show-left-icon session

```

### ③ tmux-yank

터미널에서 텍스트를 드래그해서 복사할 때, 시스템 클립보드와 연동되어 `Cmd + V`로 바로 붙여넣을 수 있게 해줍니다.

---

## 3. 플러그인 설치 및 적용 방법

설정 파일을 수정했다고 바로 적용되지 않습니다. 아래의 '마법의 단축키'를 기억하세요.

1. **설정 파일 새로고침:** 터미널에서 `tmux source ~/.tmux.conf` 실행
2. **플러그인 설치:** tmux 실행 상태에서 `Prefix` (우리의 경우 `Ctrl + a`) 누른 후 `I` (대문자 i) 입력
3. 하단에 `Installing...` 메시지가 뜨고 잠시 기다리면 모든 설정이 완료됩니다!

---

## 4. 활용 꿀팁: 원격 서버에서도 똑같은 환경을?

로컬 맥에서 설정한 `~/.tmux.conf` 파일을 GitHub Gist나 본인의 저장소에 올려두세요.
새로운 원격 서버에 접속했을 때 해당 파일만 복사해오면, 어떤 서버에서도 내가 쓰던 편리한 단축키와 테마를 그대로 사용할 수 있습니다.

> **주의:** 원격 서버에 tpm을 설치할 때는 해당 서버에도 `git`이 설치되어 있어야 합니다.

---

## 마치며

이제 여러분의 터미널은 단순히 검은 화면이 아니라, 실시간 시스템 상태를 보여주고 내 작업 흐름을 기억하는 영리한 파트너가 되었습니다. iTerm2의 비주얼과 tmux의 기능성이 합쳐진 최고의 개발 환경을 즐겨보세요!
