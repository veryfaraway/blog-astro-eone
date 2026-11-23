---
title: "Mac Homebrew 설치 가이드 (2026): M1–M4·Intel 경로 및 PATH 오류 해결"
description: "macOS Homebrew 설치 명령어 한 줄부터 Apple Silicon(M1–M4, /opt/homebrew)과 Intel Mac(/usr/local) 경로 차이, brew command not found 환경변수(PATH) 해결법과 필수 명령어까지 정리했습니다."
date: 2026-08-23
category: macOS
tags:
  - "homebrew"
  - "macos"
  - "apple-silicon"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1758857088018-821209605077?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.1.0"
---

새 맥북을 세팅할 때 터미널에 `brew`부터 쳐봤다가 `zsh: command not found: brew`를 마주쳤다면, 설치 명령어 한 줄과 칩셋별 환경변수(`PATH`) 등록만 끝내면 3분 안에 해결됩니다. [Homebrew](https://brew.sh)는 Debian 계열의 `apt`, RedHat 계열의 `dnf`처럼 `git`, `node`, `python`부터 각종 macOS용 앱까지 명령어 한 줄로 설치·업그레이드해 주는 필수 패키지 관리자입니다.

## ⚡ 10초 요약: 내 Mac 칩셋별 설치 & PATH 등록 한눈에 보기

| 구분 | Apple Silicon Mac (M1–M4) | Intel Mac (`x86_64`) |
| :--- | :--- | :--- |
| **기본 설치 경로** | `/opt/homebrew` | `/usr/local` |
| **바이너리 위치** | `/opt/homebrew/bin/brew` | `/usr/local/bin/brew` |
| **`zprofile` 등록 명령** | `eval "$(/opt/homebrew/bin/brew shellenv)"` | `eval "$(/usr/local/bin/brew shellenv)"` |

## 1. 사전 준비 및 설치 명령어

Homebrew를 설치하려면 Xcode의 Command Line Tools(명령어 라인 개발자 도구)가 필요합니다. 수십 GB에 달하는 Xcode 전체를 깔 필요 없이 아래 명령으로 필수 컴파일러 도구만 가볍게 먼저 설치하세요(설치 스크립트 실행 중 자동으로 함께 설치되기도 합니다).

```bash
xcode-select --install
```

이어서 공식 설치 원라이너를 터미널에 그대로 붙여 넣습니다. 실행 중간에 Mac 로그인 비밀번호(`Password:`)를 물으면 입력 후 `Return` 키를 누르세요(보안상 화면에 별표나 글자가 표시되지 않는 것이 정상입니다).

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 2. Apple Silicon과 Intel Mac의 설치 경로 차이

예전 블로그 글들을 보고 따라 했다가 꼬이는 가장 흔한 지점이 바로 **칩셋별 기본 경로 분리**입니다.

| Mac 종류 | 기본 설치 루트 (`HOMEBREW_PREFIX`) | 비고 |
| :--- | :--- | :--- |
| **Apple Silicon** (M1–M4) | `/opt/homebrew` | macOS 기본 시스템 영역과 충돌을 피하기 위해 분리됨 |
| **Intel Mac** | `/usr/local` | 기존 유닉스 표준 로컬 경로 그대로 사용 |

설치된 패키지는 각 경로 하위의 `Cellar` 디렉터리에 버전별(keg)로 저장되고, `bin` 디렉터리로 심볼릭 링크가 연결됩니다. 구형 Intel 맥에서 마이그레이션 어시스턴트로 데이터를 그대로 옮겨 온 경우 `/usr/local`에 옛 Intel용 Homebrew가 남아 충돌할 수 있으니, Apple Silicon 맥에서는 반드시 `/opt/homebrew/bin/brew`가 우선 잡히는지 확인해야 합니다.

## 3. 설치 후 PATH 설정 (`brew: command not found` 해결)

설치가 100% 끝났는데도 `brew` 명령이 먹히지 않는 이유는 **Apple Silicon의 `/opt/homebrew/bin`이 macOS 기본 `PATH`에 포함되어 있지 않기 때문**입니다. 설치 직후 터미널 하단 `Next steps:` 안내에 따라 아래 두 줄을 실행해 `~/.zprofile`에 등록합니다.

### Apple Silicon (M1–M4) 기준

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Intel Mac 기준

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

기본 셸이 `zsh`가 아니라 `bash`라면 `~/.zprofile` 대신 `~/.bash_profile`에 추가하면 됩니다. 등록 후 버전을 조회해 정상 출력되는지 확인하세요.

```bash
brew -v
# Homebrew 4.x.x
```

2026년 기준 Homebrew 4.x 버전은 JSON API 기반으로 패키지 메타데이터를 받아와 예전처럼 무거운 Git 탭(`homebrew-core`) 전체를 클론하지 않아도 순식간에 업데이트되며, 대다수 패키지가 Apple Silicon 네이티브(`arm64`) 빌드를 기본 지원합니다.

## 4. 자주 쓰는 필수 명령어 & Cask(GUI 앱) 설치

터미널용 CLI 도구(**Formula**)와 아이콘이 있는 일반 macOS용 프로그램(**Cask**) 모두 같은 `brew` 명령으로 관리할 수 있습니다.

```bash
# CLI 패키지 설치 (예: wget, jq, ripgrep)
brew install wget

# macOS GUI 애플리케이션 설치 (예: Ghostty, Raycast, Karabiner-Elements)
brew install --cask ghostty
```

알아두면 평생 쓰는 핵심 관리 명령어 표입니다.

| 명령어 | 설명 |
| :--- | :--- |
| `brew search <이름>` | 설치 가능한 Formula 및 Cask 패키지를 검색합니다. |
| `brew install <이름>` | 패키지를 설치합니다(GUI 앱은 `--cask` 옵션 권장). |
| `brew update` | Homebrew 자체와 패키지 최신 버전 목록을 갱신합니다. |
| `brew upgrade` | 설치된 패키지들을 최신 버전으로 일괄 업그레이드합니다. |
| `brew uninstall <이름>` | 패키지를 삭제합니다(`rm` 또는 `remove`도 동일). |
| `brew list` | 현재 내 Mac에 설치된 전체 패키지 목록을 확인합니다. |
| `brew cleanup` | 업그레이드 후 남은 구버전 캐시 파일을 정리해 디스크 용량을 확보합니다. |
| `brew doctor` | 경로 꼬임이나 권한 충돌이 없는지 시스템 상태를 자가 진단합니다. |
| `brew pin <이름>` | `upgrade` 실행 시 특정 패키지만 현재 버전에 고정합니다(해제는 `brew unpin`). |

더 자세한 하위 옵션은 터미널에서 `brew --help` 또는 `man brew`로 언제든 조회할 수 있습니다. Homebrew 세팅을 마쳤다면 이어서 [Ghostty·tmux·Karabiner로 꾸미는 macOS 터미널 환경 가이드](/tools/macos-terminal-ghostty-tmux-karabiner)나 [fnm으로 Node.js 버전 깔끔하게 관리하기](/tools/fnm-fast-node-manager)로 개발 환경 세팅을 이어가 보세요.

> **이전 글 안내**: 2022년에 작성한 [구버전 Homebrew 설치 기록](/tools/install-homebrew)은 Intel Mac(`/usr/local`) 단일 기준으로 작성되어 있으므로 최신 macOS 환경에서는 본 가이드를 기준으로 진행하세요.
