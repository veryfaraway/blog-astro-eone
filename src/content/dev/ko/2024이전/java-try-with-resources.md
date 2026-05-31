---
title: "Java의 Try-with-Resources 구문: 자원 관리의 혁명"
description: Java 7에서 도입된 Try-with-Resources 구문에 대해서 설명합니다.
date: 2024-11-10
category: Backend
tags:
  - "java"
  - "try-catch"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1542318421-fc3d0f423551?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
---

## 개요

안녕하세요! 오늘은 Java의 Try-with-Resources 구문에 대해 자세히 알아보겠습니다. 이 기능은 Java 7에서 도입되어 try 블록 안에 선언된 자원에 대해서 자원의 자동 닫힘을 지원해서 자원 관리를 훨씬 더 쉽고 안전하게 만들어 주었습니다.

### 1. try-with-resources 사용하기

자원 자동 닫힘 기능을 사용하려면, 간단하게, try 안에서 자원을 생성하면 됩니다.

```java
try (PrintWriter writer = new PrintWriter(new File("test.txt"))) {
    writer.println("Hello World");
}
```

### 2. try-catch-finally를 try-with-resources로 대체하기

기존의 장황한 try-catch-finally 블록을 간단하게 try-with-resources 블록으로 대체할 수 있습니다.

다음 코드 샘플을 비교해 보겠습니다. 우선 일반적인 try-catch-finally 블록입니다:

```java
Scanner scanner = null;
try {
    scanner = new Scanner(new File("example.txt"));
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} finally {
    if (scanner != null) {
        scanner.close();
    }
}
```

그리고 다음은 try-with-resources를 사용하는 블록인데 매우 간결하게 바뀝니다. 
```java
try (Scanner scanner = new Scanner(new File("test.txt"))) {
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

### 3. 다수의 자원에 대해서 try-with-resources 사용하기

try-with-resources 블록에서 여러 리소스를 세미콜론으로 구분하여 리소스를 선언할 수 있습니다:

```java
try (Scanner scanner = new Scanner(new File("testRead.txt"));
    PrintWriter writer = new PrintWriter(new File("testWrite.txt"))) {
    while (scanner.hasNext()) {
	writer.print(scanner.nextLine());
    }
}
```

### 4. 자동 닫힘을 지원하는 사용자 정의 리소스

try-with-resources 블록에서 올바르게 처리되는 사용자 정의 리소스를 만들려면 클래스가 Closeable 또는 AutoCloseable 인터페이스를 구현하고 close 메서드를 재정의해야 합니다:

```java
public class MyResource implements AutoCloseable {
    @Override
    public void close() throws Exception {
        System.out.println("MyResource is auto-closed...");
    }
}
```

### 5. 자원이 닫히는 순서

먼저 정의/획득된 리소스가 마지막에 닫힙니다. 이런 동작은 아래의 예제로 확인할 수 있습니다.

**Resource 1:**

```java
public class AutoCloseableResourcesFirst implements AutoCloseable {

    public AutoCloseableResourcesFirst() {
        System.out.println("Constructor -&gt; AutoCloseableResources_First");
    }

    public void doSomething() {
        System.out.println("Something -&gt; AutoCloseableResources_First");
    }

    @Override
    public void close() throws Exception {
        System.out.println("Closed AutoCloseableResources_First");
    }
}
```

**Resource 2:**

```java
public class AutoCloseableResourcesSecond implements AutoCloseable {

    public AutoCloseableResourcesSecond() {
        System.out.println("Constructor -&gt; AutoCloseableResources_Second");
    }

    public void doSomething() {
        System.out.println("Something -&gt; AutoCloseableResources_Second");
    }

    @Override
    public void close() throws Exception {
        System.out.println("Closed AutoCloseableResources_Second");
    }
}
```

**Test:**

```java
private void orderOfClosingResources() throws Exception {
    try (AutoCloseableResourcesFirst af = new AutoCloseableResourcesFirst();
        AutoCloseableResourcesSecond as = new AutoCloseableResourcesSecond()) {

        af.doSomething();
        as.doSomething();
    }
}
```

**Results:**

> Constructor -> AutoCloseableResources_First
>
> Constructor -> AutoCloseableResources_Second
>
> Something -> AutoCloseableResources_First
>
> Something -> AutoCloseableResources_Second
>
> Closed AutoCloseableResources_Second
>
> Closed AutoCloseableResources_First

### 6. catch, finally 블록

try-with-resource 구문에서도 기존 try 구문에서처럼 catch, finally 블록을 동일한 방식으로 사용할 수 있습니다.

### 7. Java 9 - Effectively Final Variables

Java 9 이전에는 try-with-resource 블럭에서 새로 생성한 자원만 사용이 가능했습니다.

```java
try (Scanner scanner = new Scanner(new File("testRead.txt")); 
    PrintWriter writer = new PrintWriter(new File("testWrite.txt"))) { 
    // 생략
}
```

위에 표시된 것처럼 다수의 리소스를 선언하는 부분에서 특히 장황합니다. Java 9 및 JEP 213부터는 이제 try-with-resources 블록 내에서 final 변수 혹은 effectively final 변수를 사용할 수 있습니다:

```java
final Scanner scanner = new Scanner(new File("testRead.txt"));
PrintWriter writer = new PrintWriter(new File("testWrite.txt"))
try (scanner;writer) { 
    // 생략
}
```

간단히 말해, 변수가 명시적으로 final이라고 표시되지 않더라도 첫 번째 할당 후에도 변경되지 않으면 사실상 final 변수가 됩니다.

위와 같이 스캐너 변수는 명시적으로 final로 선언되었으므로 try-with-resource 블록과 함께 사용할 수 있습니다. writer 변수는 명시적으로 final 변수는 아니지만 첫 번째 할당 후에는 변경되지 않습니다. 따라서 writer 변수도 사용할 수 있습니다.

이렇게 Java 9부터는 이미 선언된 effectively final 변수를 try-with-Resources 구문에서 직접 사용할 수 있어, 코드가 더욱 간결해졌습니다.

## 마무리

try-with-Resources 구문은 자원 관리를 크게 단순화하고, 자원 누수의 위험을 줄여줍니다. 또한 Java 9의 개선사항으로 코드의 가독성이 더욱 향상되었습니다. 이 기능을 적극 활용하여 더 안전하고 깔끔한 코드를 작성해보세요!
