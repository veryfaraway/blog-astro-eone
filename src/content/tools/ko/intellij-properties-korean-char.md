---
title: IntelliJ .properties 한글 깨짐(\\uXXXX) 원인과 해결 방법 (유니코드 복원 팁)
description: IntelliJ에서 .properties 파일의 한글이 \\uXXXX 형태로 깨지는 문제의 원인과 이를 해결하는 방법을 알아봅니다.
date: 2026-01-13
category: Tools
tags:
  - "intellij"
  - "unicode"
  - "properties"
  - "java"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?q=80&w=2370&auto=format&fit=crop"
---

Java 개발을 하다 보면 `.properties` 설정 파일의 한글 주석이 `\uD658\uACBD`처럼 알 수 없는 문자로 변해 있는 당황스러운 상황을 겪곤 합니다. 오늘은 이 현상이 발생하는 원인과 완벽한 해결법, 그리고 급할 때 빠르게 복원하는 팁까지 정리해 보겠습니다.

---

### 1. 원인: 왜 한글이 유니코드로 보일까?

Java의 표준 설계 때문입니다. 전통적으로 Java의 `.properties` 파일은 **ISO-8859-1** 인코딩을 기본으로 사용합니다. 이 인코딩은 한글을 직접 표현할 수 없기 때문에, IntelliJ 같은 IDE가 한글을 저장할 때 자동으로 **유니코드 이스케이프 시퀀스(Unicode Escape Sequence)**로 변환하여 저장하는 것입니다.

---

### 2. 해결 방법: IntelliJ 설정 변경

파일의 실제 데이터는 유니코드로 안전하게 저장하되, 우리 눈(에디터)에는 한글로 편하게 보이게 설정할 수 있습니다.

**설정 순서:**

1. `Settings` (단축키: `Ctrl + Alt + S` / Mac: `Cmd + ,`) 창을 엽니다.
2. **Editor > File Encodings** 메뉴로 이동합니다.
3. **Properties Files (.properties)** 섹션에서 아래와 같이 설정합니다.
* **Default encoding for properties files:** `UTF-8`로 변경
* **Transparent native-to-ascii conversion:** **체크 (중요!)**



> **💡 핵심:** `Transparent native-to-ascii conversion` 옵션을 켜면, IDE가 백그라운드에서 유니코드 변환을 자동으로 처리해주어 에디터에서는 한글을 그대로 보고 편집할 수 있습니다.

---

### 3. 꿀팁: 브라우저 개발자 도구로 즉시 복원하기

설정을 바꾸기 전 이미 깨져버린(인코딩된) 문구들이 무슨 뜻인지 급하게 확인해야 할 때가 있습니다. 이때는 별도의 변환 사이트에 접속할 필요 없이 **브라우저 콘솔**을 활용하세요.

1. 크롬이나 엣지 브라우저에서 **`F12`**를 눌러 개발자 도구를 엽니다.
2. **`Console`** 탭을 클릭합니다.
3. 깨진 문구를 따옴표(`" "`)로 감싸서 입력하고 엔터를 누릅니다.

**예시:**

```javascript
// 입력
"\uD658\uACBD\uC5D0\uC11C \uC0AC\uC6A9"

// 출력 결과
"환경에서 사용"

```

---

### 마치며

`.properties` 파일의 유니코드 변환은 데이터 유실이 아니라 Java 표준을 지키기 위한 과정입니다. 하지만 개발 생산성을 위해 위 설정을 꼭 적용해 보세요! 이 포스팅이 누군가의 삽질 시간을 줄여주길 바랍니다.
