---
title: "Java의 Pattern Matching for instanceof: 타입 체크와 캐스팅을 한 번에"
description: Java 16에서 정식 도입된 Pattern Matching for instanceof 기능으로 타입 체크와 동시에 변수를 선언하여 사용하는 방법을 알아봅니다.
date: 2025-12-17
category: Backend
tags:
  - "java"
  - "pattern-matching"
  - "instanceof"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1588594276800-2de0522b3b73?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0"
---

## 개요

안녕하세요! 오늘은 Java의 Pattern Matching for instanceof 기능에 대해 알아보겠습니다. 이 기능은 Java 14에서 프리뷰로 처음 등장했고, Java 16에서 정식 기능으로 도입되었습니다. instanceof로 타입을 체크하면서 동시에 변수를 선언하여 바로 사용할 수 있게 해주는 매우 편리한 기능입니다.

## 도입 배경과 역사

### 기존 방식의 문제점

기존에는 instanceof로 타입을 확인한 후, 명시적으로 타입 캐스팅을 해야 했습니다. 이는 코드를 장황하게 만들고, 같은 타입을 두 번 작성해야 하는 불편함이 있었습니다.

```java
// 기존 방식 (Java 15 이전)
if (obj instanceof String) {
    String str = (String) obj;  // 명시적 캐스팅 필요
    System.out.println(str.length());
}
```

### 도입 시기

- **Java 14 (2020년 3월)**: 프리뷰 기능으로 첫 등장 (JEP 305)
- **Java 15 (2020년 9월)**: 두 번째 프리뷰
- **Java 16 (2021년 3월)**: 정식 기능으로 확정

## 기본 문법

Pattern Matching for instanceof를 사용하면 타입 체크와 변수 선언을 한 번에 할 수 있습니다.

```java
// 새로운 방식 (Java 16+)
if (obj instanceof String str) {
    // str 변수를 바로 사용 가능
    System.out.println(str.length());
}
```

### 문법 구조

```java
if (객체 instanceof 타입 변수명) {
    // 변수명을 사용한 코드
}
```

## 실전 활용 예제

### 1. 기본 사용 예제

```java
public class PatternMatchingExample {
    public static void main(String[] args) {
        Object obj = "Hello, Java 16!";
        
        // 기존 방식
        if (obj instanceof String) {
            String str = (String) obj;
            System.out.println("길이: " + str.length());
        }
        
        // 새로운 방식
        if (obj instanceof String str) {
            System.out.println("길이: " + str.length());
        }
    }
}
```

### 2. 다양한 타입 처리

```java
public void processObject(Object obj) {
    if (obj instanceof Integer num) {
        System.out.println("정수: " + num * 2);
    } else if (obj instanceof String str) {
        System.out.println("문자열 길이: " + str.length());
    } else if (obj instanceof Double dbl) {
        System.out.println("실수: " + dbl / 2);
    } else if (obj instanceof List<?> list) {
        System.out.println("리스트 크기: " + list.size());
    }
}
```

### 3. 논리 연산자와 함께 사용

```java
public void checkString(Object obj) {
    // AND 연산자와 함께 사용
    if (obj instanceof String str && str.length() > 5) {
        System.out.println("긴 문자열: " + str);
    }
    
    // 부정 연산자와 함께 사용
    if (!(obj instanceof String str)) {
        System.out.println("문자열이 아닙니다");
    } else {
        System.out.println("문자열입니다: " + str);
    }
}
```

### 4. 실무 예제: 도형 면적 계산

```java
interface Shape {
    // 도형 인터페이스
}

class Circle implements Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    public double getRadius() {
        return radius;
    }
}

class Rectangle implements Shape {
    private double width;
    private double height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    public double getWidth() {
        return width;
    }
    
    public double getHeight() {
        return height;
    }
}

public class ShapeCalculator {
    public double calculateArea(Shape shape) {
        // 기존 방식
        if (shape instanceof Circle) {
            Circle circle = (Circle) shape;
            return Math.PI * circle.getRadius() * circle.getRadius();
        } else if (shape instanceof Rectangle) {
            Rectangle rect = (Rectangle) shape;
            return rect.getWidth() * rect.getHeight();
        }
        return 0;
    }
    
    // 새로운 방식 - 훨씬 간결!
    public double calculateAreaNew(Shape shape) {
        if (shape instanceof Circle c) {
            return Math.PI * c.getRadius() * c.getRadius();
        } else if (shape instanceof Rectangle r) {
            return r.getWidth() * r.getHeight();
        }
        return 0;
    }
}
```

### 5. equals 메서드 구현

```java
public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // 기존 방식
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Person person = (Person) obj;
        return age == person.age && 
               Objects.equals(name, person.name);
    }
    
    // 새로운 방식 - 더 읽기 쉬움
    public boolean equalsNew(Object obj) {
        return obj instanceof Person person &&
               age == person.age &&
               Objects.equals(name, person.name);
    }
}
```

## 변수 스코프 (Scope)

Pattern variable의 스코프는 컴파일러가 타입이 확실히 보장되는 범위로 제한됩니다.

```java
public void scopeExample(Object obj) {
    // 1. if 블록 내에서만 사용 가능
    if (obj instanceof String str) {
        System.out.println(str.length());  // OK
    }
    // System.out.println(str.length());  // 컴파일 에러!
    
    // 2. && 연산자 뒤에서 사용 가능
    if (obj instanceof String str && str.length() > 5) {
        System.out.println(str);  // OK
    }
    
    // 3. || 연산자 뒤에서는 사용 불가
    // if (obj instanceof String str || str.isEmpty()) {  // 컴파일 에러!
    //     System.out.println(str);
    // }
    
    // 4. 부정 연산자 사용 시 else 블록에서 사용 가능
    if (!(obj instanceof String str)) {
        System.out.println("문자열 아님");
    } else {
        System.out.println(str.length());  // OK
    }
}
```

## 주의할 점

### 1. null 체크

instanceof는 null에 대해 false를 반환하므로, null 체크가 자동으로 됩니다.

```java
Object obj = null;

if (obj instanceof String str) {
    // 이 블록은 실행되지 않음
    System.out.println(str.length());
}
```

### 2. 변수명 중복

같은 스코프에서 동일한 변수명을 사용할 수 없습니다.

```java
public void duplicateVariable(Object obj) {
    String str = "existing";
    
    // 컴파일 에러: 변수명 중복
    // if (obj instanceof String str) {
    //     System.out.println(str);
    // }
    
    // 다른 변수명 사용
    if (obj instanceof String s) {
        System.out.println(s);  // OK
    }
}
```

### 3. final 변수

Pattern variable은 암묵적으로 final입니다.

```java
if (obj instanceof String str) {
    // str = "new value";  // 컴파일 에러!
    System.out.println(str);
}
```

### 4. 제네릭 타입 소거

제네릭 타입 정보는 런타임에 소거되므로 주의가 필요합니다.

```java
// 컴파일 에러: 제네릭 타입 체크 불가
// if (obj instanceof List<String> list) {
//     System.out.println(list);
// }

// OK: raw 타입 사용
if (obj instanceof List<?> list) {
    System.out.println(list.size());
}
```

## 성능 고려사항

Pattern Matching for instanceof는 컴파일 타임에 최적화되므로, 기존 방식과 성능 차이가 거의 없습니다. 오히려 코드가 간결해져 가독성이 향상되고, 실수로 인한 버그를 줄일 수 있습니다.

```java
// 두 방식 모두 동일한 바이트코드로 컴파일됨
// 기존 방식
if (obj instanceof String) {
    String str = (String) obj;
    process(str);
}

// 새로운 방식
if (obj instanceof String str) {
    process(str);
}
```

## 다른 언어와의 비교

### Kotlin의 스마트 캐스트

```kotlin
// Kotlin
fun process(obj: Any) {
    if (obj is String) {
        // 자동으로 String으로 캐스팅됨
        println(obj.length)
    }
}
```

### C#의 패턴 매칭

```csharp
// C#
if (obj is string str) {
    Console.WriteLine(str.Length);
}
```

Java의 Pattern Matching for instanceof는 이러한 현대적인 언어 기능을 Java에 도입한 것입니다.

## 향후 발전 방향

Java는 패턴 매칭 기능을 계속 확장하고 있습니다:

- **Java 17**: Switch 표현식에서의 패턴 매칭 (프리뷰)
- **Java 21**: Record 패턴, Switch 패턴 매칭 정식 도입

```java
// Java 21+ Switch 패턴 매칭
String result = switch (obj) {
    case String str -> "문자열: " + str.length();
    case Integer num -> "정수: " + num;
    case null -> "null 값";
    default -> "알 수 없는 타입";
};
```

## 마무리

Pattern Matching for instanceof는 Java 코드를 더 간결하고 읽기 쉽게 만들어주는 훌륭한 기능입니다. Java 16 이상을 사용한다면 적극적으로 활용하여 불필요한 타입 캐스팅을 제거하고, 더 안전하고 깔끔한 코드를 작성해보세요!

주요 장점을 정리하면:

- 코드 간결성 향상
- 타입 안정성 보장
- 실수로 인한 ClassCastException 방지
- 가독성 개선

Java 16 이상을 사용하고 계시다면, 오늘부터 바로 적용해보시기 바랍니다!
