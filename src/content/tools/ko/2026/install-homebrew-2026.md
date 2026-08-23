---
title: "Homebrew 설치하기 (2026년 최신 가이드)"
description: "Apple Silicon과 Intel Mac의 Homebrew 설치 경로 차이, 설치 후 필수 PATH 설정, 최신 버전과 기본 사용법까지 정리한 macOS 패키지 관리자 설치 가이드"
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

[Homebrew](https://brew.sh)는 macOS(및 Linux)용 패키지 관리자입니다. Debian 계열의 apt-get, RedHat 계열의 yum을 생각하면 이해하기 쉽습니다.

git, node, python 같은 패키지를 설치할 때 각 프로젝트 홈페이지에서 직접 다운로드해도 되지만, Homebrew를 쓰면 설치와 업그레이드가 명령어 한 줄로 끝납니다.

## 설치

Homebrew를 설치하려면 Xcode의 Command Line Tools(명령어 라인 개발자 도구)가 필요합니다. 이미 Xcode가 설치되어 있다면 상관없지만, 그렇지 않다면 아래 명령으로 Command Line Tools만 설치할 수 있습니다. Xcode 전체 용량이 크므로(수 GB) Homebrew만 쓸 목적이라면 Command Line Tools만 설치하는 걸 추천합니다.

```shell
xcode-select --install
```

설치 명령은 다음과 같습니다. 터미널에 붙여 넣으면 스크립트가 진행 내용을 먼저 설명하고 확인을 받은 뒤 진행합니다.

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Apple Silicon과 Intel의 설치 경로 차이

여기가 예전 가이드들과 가장 크게 달라진 부분입니다. Mac 칩에 따라 Homebrew가 설치되는 위치가 다릅니다.

| Mac 종류 | 설치 경로 |
|----------|-----------|
| Apple Silicon (M1~M4) | `/opt/homebrew` |
| Intel | `/usr/local` |

패키지는 각 칩 경로 하위의 `Cellar`에 keg 형태로 저장되고, `bin` 디렉토리로 심링크됩니다.

## 설치 후 PATH 설정 (필수)

설치가 끝나도 바로 `brew` 명령이 인식되지 않는 경우가 많습니다. 특히 Apple Silicon Mac에서는 `/opt/homebrew/bin`이 기본 PATH에 없기 때문에, 설치 스크립트가 안내하는 아래 명령을 셸 프로필에 추가해야 합니다.

```shell
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

zsh가 기본 셸이 아니라면 `~/.zprofile` 대신 사용 중인 셸의 프로필 파일(`~/.bash_profile` 등)에 추가하세요. Intel Mac이라면 `/opt/homebrew/bin` 대신 `/usr/local/bin`을 사용합니다.

이 단계를 건너뛰면 새 터미널을 열 때마다 `brew: command not found`를 보게 됩니다.

설치가 잘 되었는지는 아래처럼 확인합니다.

```shell
$ brew -v
Homebrew 4.x.x
```

2026년 기준 Homebrew는 4.x대 버전이 배포되고 있으며, 대부분의 인기 패키지가 Apple Silicon 네이티브(ARM) 빌드를 제공해 Rosetta 없이도 잘 동작합니다.

## 사용법

wget을 설치하고 싶다면 아래와 같이 입력합니다.

```shell
brew install wget
```

자주 쓰는 명령은 다음과 같습니다.

| Command | Comment |
|---------------|----------------|
| update | 새로운 버전 정보를 가져옵니다. |
| upgrade | 패키지를 최신 버전으로 업그레이드합니다. |
| install | 패키지를 설치합니다. |
| uninstall | 패키지를 삭제합니다. `uninstall` 대신 `rm` 또는 `remove` 사용 가능. |
| list | 설치된 패키지 리스트를 확인합니다. |
| pin | `upgrade` 시 특정 패키지만 버전을 고정하고 싶을 때 사용. 예) `brew pin tomcat` |
| unpin | `pin`으로 고정된 패키지를 해제할 때 사용. |

더 자세한 정보는 아래 명령으로 확인할 수 있습니다.

```shell
brew --help
```

또는

```shell
man brew
```

> **이전 글 안내**: 2022년에 작성한 [이전 Homebrew 설치 가이드](/tools/install-homebrew)는 Intel Mac 기준(`/usr/local`)으로만 작성되어 있습니다. Apple Silicon Mac을 쓰고 있다면 이 글을 참고하세요.
