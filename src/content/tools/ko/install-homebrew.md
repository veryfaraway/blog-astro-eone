---
title: Homebrew 설치하기
description: macOS Package 관리자인 Homebrew를 설치하고 사용하는 방법을 설명합니다
date: 2022-05-08
category: Tools
tags:
  - "homebrew"
  - "macos"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1530346460498-48afc564f57a?q=80&w=2940&auto=format&fit=crop"
---

[Homebrew](http://brew.sh)는 macOS용 패키지 관리자입니다. Debian 계열의 apt-get, RedHat 계열의 yum을 생각하면 이해하기가 쉽겠네요.

git, gradle, python, scala 등의 패키지를 설치하려고 할때 해당 패키지의 홈페이지에서 다운로드 받아 설치해도 되지만 Homebrew를 이용하면 간단하게 설치할 수 있고, 또 패키지가 버전이 올라갔을 때 업그레이드도 쉽게 할 수 있습니다.

## 설치

Homebrew를 설치하려면 Xcode에 포함된 Command Line Tools(명령어 라인 개발자 도구)가 필요합니다. 이미 Xcode가 설치되어 있으면 상관 없지만 그렇지 않은 분은 아래 명령을 통해 Command Line Tools만 설치 할 수 있습니다. Xcode 전체 용량이 5GB 정도 되므로 Homebrew만을 위해서라면 Command Line Tools만 설치하는 것을 추천합니다.

```sh
xcode-select --install
```

Homebrew 설치는 간단합니다. 터미널에 아래의 명령을 붙여 넣어주세요.

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

설치가 잘 되었는지 확인하려면 아래와 같이 brew 명령을 입력했을때 오류없이 잘 출력이 되면 됩니다.

```shell
$ brew -v
Homebrew 2.2.10
Homebrew/homebrew-core (git revision 9dfa; last commit 2020-03-11)
```

## 사용법

만약 wget을 설치하고 싶으면 아래와 같이 터미널에 입력하세요.

```shell
brew install wget
```

패키지는 `/usr/local/Cellar` 위치에 설치가 됩니다. 아래는 자주 사용하는 명령에 대한 설명입니다.

| Command | Comment |
|---------------|----------------|
| update | 새로운 버전 정보를 가져옵니다. |
|upgrade| 패키지를 최신 버전으로 업그레이드 합니다.|
|install|패키지를 설치합니다.|
|uninstall|패키지를 삭제합니다. uninstall 대신 rm 또는 remove 사용 가능.|
|list|설치된 패키지 리스트를 확인합니다.|
|pin|upgrade 명령시 새로운 버전이 있으면 패키지를 무조건 업그레이드 하는데 만약 어떤 이유에 의해서 특정 버전을 계속해서 사용하고 싶을 때 사용하는 명령  예) brew pin tomcat|
|unpin|pin으로 고정된 패키지를 해제할 경우 사용|

더 자세한 정보는

```shell
brew --help
```

를 입력하거나

```shell
man brew
```

를 입력해서 확인해 보세요.
