---
title: "iTerm2 유저를 위한 tmux 가이드: 생산성을 극대화하는 터미널 활용법"
description: "터미널을 더 스마트하게! tmux의 핵심 개념부터 iTerm2 연동, 추천 설정까지 한 번에 정리합니다."
date: 2026-01-10
category: Tools
tags:
  - "iterm2"
  - "tmux"
  - "terminal"
  - "macos"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1551524163-d00af9f12253?q=80&w=2050&auto=format&fit=crop"
---

맥에서 개발을 하다 보면 터미널 창이 수십 개로 늘어나거나, 서버 접속이 끊겨 작업 중이던 프로세스가 날아가는 경험을 한 번쯤 해보셨을 겁니다. 오늘은 이 고민을 해결해 줄 터미널 멀티플렉서, **tmux**를 소개합니다.

## 1. tmux란 무엇인가?

**tmux(Terminal MUltiplexer)**는 하나의 터미널 창을 여러 개의 세션, 윈도우, 패널로 쪼개서 관리할 수 있게 해주는 도구입니다. 

### 왜 써야 하나요?
- **세션 유지:** 터미널 창을 닫거나 네트워크가 끊겨도 작업 내용이 서버에 그대로 살아있습니다.
- **자유로운 화면 분할:** 하나의 화면에서 코드 편집기, 로그 창, DB 접속 창을 동시에 띄울 수 있습니다.
- **환경 공유:** 내가 로컬에서 세팅한 화면 구성을 그대로 유지한 채 다른 기기에서 이어서 작업할 수 있습니다.



---

## 2. iTerm2와 tmux의 찰떡궁합 연동법

iTerm2 사용자라면 tmux를 더 강력하게 쓸 수 있는 **Control Mode**를 지원합니다.

### 설치하기 (macOS)
```bash
brew install tmux

```

### iTerm2 특수 연동 (tmux -CC)

터미널에서 `tmux -CC`를 입력해 보세요. tmux의 복잡한 단축키를 외우지 않아도 iTerm2의 네이티브 탭과 창 분할 기능을 이용해 tmux 세션을 제어할 수 있습니다.

* **장점:** 마우스 클릭으로 창 크기 조절 가능, iTerm2의 기본 단축키(`Cmd + D`, `Cmd + T`) 사용 가능.

---

## 3. 생산성을 높여주는 추천 설정 (.tmux.conf)

tmux의 기본 접두어(Prefix)는 `Ctrl + b`인데, 손가락 위치상 조금 불편합니다. 이를 `Ctrl + a`로 바꾸고 마우스 사용을 활성화하는 추천 설정을 공유합니다.

`~/.tmux.conf` 파일을 만들고 아래 내용을 복사해 넣으세요.

```bash
# 1. Prefix를 Ctrl+b에서 Ctrl+a로 변경 (Option)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# 2. 마우스 사용 활성화 (클릭으로 창 전환, 드래그로 크기 조절)
set -g mouse on

# 3. 화면 분할 단축키 직관적으로 변경
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# 4. 256 색상 지원 (테마 깨짐 방지)
set -g default-terminal "screen-256color"

```

적용 후 터미널에서 `tmux source-file ~/.tmux.conf`를 입력하면 바로 반영됩니다.

---

## 4. 유용한 활용 시나리오

### 로컬 작업 시: 프로젝트 단위 세션 관리

`tmux new -s my-project` 명령어로 프로젝트별 세션을 만드세요. 퇴근할 때 세션을 유지(Detach)하고, 다음 날 출근해서 `tmux attach -t my-project` 한 번이면 어제 작업하던 창 배치가 그대로 복구됩니다.

### 원격 서버 접속 시: "끊겨도 안심"

AWS나 개인 서버에 접속한 후 **반드시 tmux를 먼저 실행**하세요.

1. `ssh user@server-ip` 접속
2. `tmux` 실행
3. 긴 시간이 걸리는 빌드나 DB 마이그레이션 실행
4. 인터넷이 끊겨도 서버에서는 빌드가 계속 진행됩니다! 나중에 다시 접속해서 `tmux a`만 치면 됩니다.

---

## 마치며

iTerm2가 터미널의 '겉모습'을 화려하게 해준다면, **tmux**는 터미널 작업의 '영속성'과 '구조'를 만들어줍니다. 처음에는 단축키가 낯설 수 있지만, 딱 사흘만 써보시면 다시는 tmux 없는 터미널로 돌아가지 못할 것입니다.
