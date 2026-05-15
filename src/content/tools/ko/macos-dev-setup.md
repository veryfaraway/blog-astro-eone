---
title: "맥북 개발 환경 세팅 완전 가이드 2026"
description: "macOS에서 Homebrew, tmux, Ghostty, fnm까지 개발 환경을 한 번에 세팅하는 방법을 정리했습니다."
date: 2026-05-01
category: macOS
tags: [macos, tmux, homebrew, ghostty, fnm]
lang: ko
draft: false
---

## 시작하기 전에

맥북을 새로 샀거나 초기화했을 때마다 개발 환경 세팅에 시간을 쏟는 게 아깝다는 생각이 들었습니다.
이 글은 제가 매번 하는 세팅을 순서대로 정리한 개인 가이드입니다.

## 1. Homebrew 설치

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. 필수 패키지 설치

```bash
brew install git pnpm fnm tmux gh
```

## 3. Node.js (fnm)

```bash
fnm install --lts
fnm use lts-latest
fnm default lts-latest
```

## 4. Ghostty 터미널

Ghostty는 GPU 가속을 지원하는 빠른 터미널입니다.
[ghostty.org](https://ghostty.org)에서 다운로드합니다.

## 5. tmux 기본 설정

`~/.tmux.conf`에 아래 내용을 추가합니다.

```bash
set -g mouse on
set -g default-terminal "xterm-256color"
```
