---
title: "macOS에서 여러 버전의 JDK를 설치하고 관리하는 방법: SDKMAN! 사용 가이드"
description: SDKMAN 소개 및 사용 방법을 알려드립니다.
date: 2024-08-30
category: Development
tags:
  - "sdkman"
  - "java"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1542822192-416be3b9e479?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
---

macOS에서 여러 버전의 JDK를 설치하고 관리하는 것은 Java 개발자들에게 중요한 작업입니다. 이를 효율적으로 수행하기 위해 **SDKMAN!**이라는 툴을 사용하는 것을 추천합니다. SDKMAN!은 여러 버전의 JDK뿐만 아니라 다양한 SDK(Software Development Kit)를 쉽게 관리할 수 있는 명령줄(CLI) 기반의 도구입니다.

이 블로그 글에서는 SDKMAN!을 설치하고, 이를 사용해 여러 버전의 JDK를 관리하는 방법을 안내하겠습니다.

## 1. SDKMAN! 소개

![LOGO](https://sdkman.io/assets/img/sdk-man-small-pattern.svg)

SDKMAN!은 macOS뿐만 아니라 Linux와 Windows에서도 사용할 수 있는 멀티플랫폼 SDK 관리 도구입니다. 이를 사용하면 여러 버전의 JDK를 쉽게 설치하고, 필요한 버전을 빠르게 전환할 수 있습니다. 

## 2. SDKMAN! 설치

먼저, 터미널을 열고 SDKMAN!을 설치합니다. 다음 명령어를 실행하면 SDKMAN!이 설치됩니다:

```bash
curl -s "https://get.sdkman.io" | bash
```

설치가 완료되면 터미널을 재시작하거나 다음 명령어를 실행하여 SDKMAN!을 사용할 수 있도록 합니다:

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

설치가 완료되었는지 확인하려면 다음 명령어를 실행해 봅니다:

```bash
sdk version
```

이 명령어를 실행하면 SDKMAN!의 버전 정보가 표시됩니다.

## 3. 여러 버전의 JDK 설치

SDKMAN!을 사용하면 여러 버전의 JDK를 쉽게 설치할 수 있습니다. 예를 들어, Java 8, Java 11, Java 17을 설치하려면 다음과 같이 명령어를 입력합니다:

```bash
sdk install java 8.0.372-zulu
sdk install java 11.0.20-tem
sdk install java 17.0.8-tem
```

각 명령어는 특정 버전의 JDK를 다운로드하고 설치합니다. 설치 가능한 JDK 버전 목록을 확인하려면 다음 명령어를 사용합니다:

```bash
sdk list java
```

이 명령어를 통해 사용할 수 있는 모든 JDK 버전과 디스트리뷰션 목록을 확인할 수 있습니다.

## 4. JDK 버전 전환

설치된 JDK 버전 간에 전환하려면 `sdk use` 명령어를 사용합니다. 예를 들어, Java 11을 사용하려면 다음과 같이 입력합니다:

```bash
sdk use java 11.0.20-tem
```

이 명령어를 입력하면 현재 세션에서 Java 11이 활성화됩니다.

특정 JDK 버전을 시스템 기본으로 설정하려면 `sdk default` 명령어를 사용합니다:

```bash
sdk default java 17.0.8-tem
```

이 명령어를 실행하면 모든 새로운 터미널 세션에서 기본적으로 Java 17이 사용됩니다.

## 5. 설치된 JDK 버전 관리

설치된 JDK 버전을 확인하거나 관리하려면 다음 명령어를 사용합니다:

- **현재 사용 중인 JDK 버전 확인**:

  ```bash
  sdk current java
  ```

- **설치된 모든 JDK 버전 확인**:

  ```bash
  sdk list java
  ```

- **JDK 버전 제거**:
  특정 버전의 JDK를 더 이상 사용하지 않으려면 다음 명령어로 제거할 수 있습니다:
  
  ```bash
  sdk uninstall java 11.0.20-tem
  ```

## 6. 결론

SDKMAN!은 macOS에서 여러 버전의 JDK를 손쉽게 설치하고 관리할 수 있는 매우 유용한 도구입니다. SDKMAN!을 통해 필요한 JDK 버전을 빠르게 설치하고 전환함으로써 다양한 Java 프로젝트를 효율적으로 관리할 수 있습니다.

이제 SDKMAN!을 설치하고 JDK 버전을 관리하는 방법을 익혔으니, 더 많은 Java SDK와 툴을 탐색해보세요. 이 도구는 Java 개발자뿐만 아니라, 다양한 개발 환경에서 유용하게 활용될 수 있습니다.
