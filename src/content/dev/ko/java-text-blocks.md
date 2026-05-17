---
title: Java Text Blocks(자바 텍스트 블록)
description: Java에서 여러 줄의 문자열을 효율적으로 사용할 수 있는 텍스트 블록에 대해서 설명합니다.
date: 2024-11-17
category: Backend
tags:
  - "java"
  - "string"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1552508744-1696d4464960?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
---

이 글에서는 Java 15 텍스트 블록 기능을 사용하여 여러 줄 문자열을 가장 효율적으로 선언하는 방법을 자세히 살펴보겠습니다.


## 사용법

Java 15부터는 텍스트 블록이 표준 기능으로 제공됩니다. Java 13 및 14에서는 미리보기 기능으로 활성화해야 했습니다.

텍스트 블록은 “”” (큰따옴표 세 개)로 시작하여 공백과 줄 바꿈(선택 사항)으로 이어집니다. 간단하게 예를 들면 다음과 같습니다:

```java
String example = """
     Example text""";
```

텍스트 블록의 결과 유형은 여전히 문자열이라는 점에 유의하세요. 텍스트 블록은 소스 코드에서 문자열 리터럴을 작성하는 또 다른 방법을 제공할 뿐입니다.

텍스트 블록 안에서는 줄 바꿈 이스케이프 없이도 개행과 따옴표를 자유롭게 사용할 수 있습니다. 이를 통해 HTML, JSON, SQL 또는 필요한 모든 리터럴 조각을 보다 우아하고 읽기 쉬운 방식으로 포함할 수 있습니다.

결과 문자열에는 (기본) 들여쓰기와 첫 번째 줄 바꿈이 포함되지 않습니다. 다음 섹션에서 들여쓰기 처리에 대해 살펴보겠습니다.


## 들여쓰기

다행히 텍스트 블록을 사용할 때에도 코드를 적절하게 들여쓰기할 수 있습니다. 이를 위해 들여쓰기의 일부는 소스 코드로 간주되고 들여쓰기의 다른 일부는 텍스트 블록의 일부로 간주됩니다. 이를 위해 컴파일러는 비어 있지 않은 모든 줄에서 최소 들여쓰기를 확인합니다. 그런 다음 컴파일러는 전체 텍스트 블록을 왼쪽으로 이동합니다.

일부 HTML이 포함된 텍스트 블록을 예를 들어보겠습니다:

```java
public String getBlockOfHtml() {
    return """
            <html>

                <body>
                    <span>example text</span>
                </body>
            </html>""";
}
```

이 경우 <html> 라인의 들여쓰기가 `12칸`이고 이 텍스트 블록에서 최소 들여쓰기입니다. 따라서 <html> 왼쪽과 그 이후의 모든 줄에 있는 `12개`의 공백이 모두 제거됩니다. 이 말이 무슨 말인가 테스트 코드를 통해 확인해 보겠습니다:

```java
@Test
void givenAnOldStyleMultilineString_whenComparing_thenEqualsTextBlock() {
    String expected = "<html>\n"
      + "\n" 
      + "    <body>\n"
      + "        <span>example text</span>\n"
      + "    </body>\n"
      + "</html>";
    assertThat(subject.getBlockOfHtml()).isEqualTo(expected);
}

@Test
void givenAnOldStyleString_whenComparing_thenEqualsTextBlock() {
    String expected = "<html>\n\n    <body>\n        <span>example text</span>\n    </body>\n</html>";
    assertThat(subject.getBlockOfHtml())
       .isEqualTo(expected);
}
```

명시적인 들여쓰기가 필요한 경우 비어 있지 않은 줄(또는 마지막 줄)에 들여쓰기를 사용할 수 있습니다:

```java
public String getNonStandardIndent() {
    return """
                Indent
            """;
}

@Test
void givenAnIndentedString_thenMatchesIndentedOldStyle() {
    assertThat(subject.getNonStandardIndent())
            .isEqualTo("    Indent\n");
}
```

또한 다음 섹션에서 살펴볼 것처럼 텍스트 블록 내부에서 이스케이프 이스케이프를 사용할 수도 있습니다.


## Escaping

### 큰따옴표 이스케이프

텍스트 블록 안에서는 큰따옴표를 이스케이프 처리할 필요가 없습니다. 텍스트 블록에서 큰따옴표 3개가 텍스트 블록 안에 쓰일 경우 이스케이프 처리하여 사용할 수도 있습니다:

```java
public String getTextWithEscapes() {
    return """
            "fun" with
            whitespace
            and other escapes \"""
            """;
}
```

큰따옴표를 이스케이프 처리해야 하는 유일한 경우입니다. 다른 경우에는 잘못된 관행으로 간주됩니다.

### Line Terminators 이스케이프

일반적으로 텍스트 블록 내부에서 개행은 이스케이프 처리할 필요가 없습니다.

그러나 소스 파일에 Windows 줄 끝(\r\n)이 있더라도 텍스트 블록은 개행(\n)으로만 종료된다는 점에 유의하세요. 캐리지 리턴(\r)이 필요한 경우 텍스트 블록에 명시적으로 추가해야 합니다:

```java
public String getTextWithCarriageReturns() {
return """
separated with\r
carriage returns""";
}

@Test
void givenATextWithCarriageReturns_thenItContainsBoth() {
assertThat(subject.getTextWithCarriageReturns())
.isEqualTo("separated with\r\ncarriage returns");
}
```

가끔 소스 코드에 읽기 쉬운 방식으로 서식을 지정하고 싶은 긴 텍스트 줄이 있을 수 있습니다. Java 14 프리뷰에는 이 작업을 수행할 수 있는 기능이 추가되었습니다. 개행이 무시되도록 이스케이프 처리할 수 있습니다:

```java
public String getIgnoredNewLines() {
    return """
            This is a long test which looks to \
            have a newline but actually does not""";
}
```

실제로 이 문자열 리터럴은 줄 변경이 없는 일반 문자열과 같습니다:

```java
@Test
void givenAStringWithEscapedNewLines_thenTheResultHasNoNewLines() {
    String expected = "This is a long test which looks to have a newline but actually does not";
    assertThat(subject.getIgnoredNewLines())
            .isEqualTo(expected);
}
```


### 공백 이스케이프

컴파일러는 텍스트 블록의 모든 후행 공백을 무시합니다. 하지만 Java 14 프리뷰 버전부터는 새로운 이스케이프 시퀀스 \s를 사용하여 공백을 이스케이프할 수 있습니다. 컴파일러는 이 이스케이프된 공백 앞의 공백도 보존합니다.

이스케이프된 공백의 영향을 자세히 살펴보겠습니다:

```java
public String getEscapedSpaces() {
    return """
            line 1·······
            line 2·······\s
            """;
}

@Test
void givenAStringWithEscapesSpaces_thenTheResultHasLinesEndingWithSpaces() {
    String expected = "line 1\nline 2        \n";
    assertThat(subject.getEscapedSpaces())
            .isEqualTo(expected);
}
```

참고: 위 예제에서 공백은 '·' 기호로 대체되어 표시되어 있습니다.

컴파일러는 첫 번째 줄에서 공백을 제거합니다. 그러나 두 번째 줄은 이스케이프된 공백으로 종료되므로 모든 공백이 유지됩니다.


### 서식 지정

변수 치환을 지원하기 위해 문자열 리터럴에서 직접 String.format 메서드를 호출할 수 있는 새로운 메서드가 추가되었습니다:

```java
public String getFormattedText(String parameter) {
    return """
            Some parameter: %s
            """.formatted(parameter);
}
```


## 마무리

짧은 예제를 통해 Java 텍스트 블록 기능을 살펴봤습니다. Scala를 사용하면서 이 기능이 부러웠는데 Java에서도 도입이 되어 더 읽기 쉬운 코드를 작성하는 데 도움이 될 것 같습니다.
