---
title: SDKMAN 사용방법
description: SDKMAN 공식문서에 기록된 사용방법(한글번역)
date: 2024-08-30
category: Development
tags:
  - "sdkman"
  - "java"
draft: false
lang: ko
thumbnail: "https://sdkman.io/assets/img/sdkman-pattern.svg"
---

## SDK 설치

### 최신 버전 설치

가장 최신 버전의 SDK(예를 들어, Java JDK)를 설치하려면 아래와 같은 명령을 실행합니다:

```shell
sdk install java
```

설치가 정상적으로 시작되면 아래와 같이 출력됩니다:

```shell
Downloading: java 21.0.4-tem

In progress...

######################################################################## 100.0%

Installing: java 21.0.4-tem
Done installing!
```

설치가 완료되면 아래와 같이 해당 버전을 **default**로 지정할 것인지 묻는 화면이 나옵니다.

```shell
Do you want java 21.0.4-tem to be set as default? (Y/n):
```

`Y`(혹은 그냥 enter)를 입력하면 이후 열리는 모든 shell에서 해당 버전을 default로 사용하게 됩니다.

```shell
Setting java 21.0.4-tem as default.
```
