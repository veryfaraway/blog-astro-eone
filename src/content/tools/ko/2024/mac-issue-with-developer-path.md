---
title: macOS를 Ventura로 업그레이드 후 Git 오류 해결 방법
description: macOS 업그레이 후 invalid active developer path (/Library/Developer/CommandLineTools) 에러가 발생할때 해결 방법
date: 2022-12-28
category: Tools
tags:
  - "macos"
  - "command-line-tools"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1675266873434-5ba73c38ce6f?q=80&w=2914&auto=format&fit=crop&ixlib=rb-4.0.3"
---

맥에서 터미널 사용 시 아래와 같은 에러가 발생하는 경우가 있습니다.

> xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun

위 에러는 OS 버전을 업그레이드 한 이후에 종종 발생하며 `git`, `pip`, `Homebrew`나 다른 Shell command를 수행할 때 발생합니다.

## 오류 해결 방법

다행히 이런 에러는 `Command Line Tools`를 다시 설치함으로써 간단하게 해결할 수 있습니다. `Command Line Tools`은 콘솔에서 아래와 같은 명령을 실행해서 설치할 수 있습니다.

```bash
xcode-select --install
```

`Command Line Tools`를 다시 설치한 후 맥을 재부팅하거나 터미널 프로그램을 종료 후 다시 실행하면 됩니다.

## Command Line Tools 설치 실패 해결 방법

만약 위 명령으로 `Command Line Tools` 설치 시 에러가 발생한다면 수동으로 설치 파일을 받아서 설치해야 합니다.

설치 파일은 [애플 개발자 사이트](https://developer.apple.com/download/all/)에서 받을 수 있습니다. 접속하려면 애플 계정으로 로그인이 필요합니다.

로그인 후 최신 버전의 `Command Line Tools`을 찾아서 다운로드해 설치하면 됩니다.
