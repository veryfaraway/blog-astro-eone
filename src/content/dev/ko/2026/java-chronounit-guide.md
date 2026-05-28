---
title: "Java 8의 숨은 보석, ChronoUnit 완벽 정리 — between, truncatedTo 실전 예제"
description: "Java 8부터 기본 제공되는 ChronoUnit의 개념과 between(), truncatedTo(), plus/minus 등 실무에서 바로 쓸 수 있는 예제 코드를 정리했습니다."
date: 2026-03-09
category: Backend
tags:
  - "java"
  - "java8"
  - "ChronoUnit"
  - "날짜계산"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1633526543814-9718c8922b7a?q=80&w=2370&auto=format&fit=crop"
---

## 들어가며

Java로 날짜 계산을 해본 적 있다면 `Calendar`나 `Date`의 불편함을 한 번쯤 느껴봤을 것이다. "두 날짜 사이가 몇 달이지?" 같은 간단한 질문에도 코드가 너무 길어지고, 실수하기도 쉬웠다. Java 8에서 `java.time` 패키지(JSR-310)가 도입되면서 이 문제가 크게 개선되었는데, 그 중심에 있는 `ChronoUnit`을 오늘 제대로 파헤쳐보자.

***

## ChronoUnit이란?

`ChronoUnit`은 `java.time.temporal` 패키지에 속한 **열거형(enum)** 으로, `TemporalUnit` 인터페이스를 구현한다. 날짜/시간 간의 차이를 특정 단위로 계산하거나, 특정 단위만큼 날짜를 더하고 빼는 연산에 활용된다.

```java
import java.time.temporal.ChronoUnit; // 외부 라이브러리 없이 JDK에 포함!
```

### 주요 단위 상수

| 상수 | 설명 |
| ------ | ------ |
| `NANOS` | 나노초 |
| `MILLIS` | 밀리초 |
| `SECONDS` | 초 |
| `MINUTES` | 분 |
| `HOURS` | 시간 |
| `DAYS` | 일 |
| `WEEKS` | 주 |
| `MONTHS` | 월 |
| `YEARS` | 년 |

***

## 핵심 사용법 1: between() — 날짜 차이 계산

`ChronoUnit`의 가장 많이 쓰이는 기능이다. `Period.between().getMonths()`와 달리, **총 누적 차이**를 `long`으로 반환한다.

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

LocalDate start = LocalDate.of(2023, 1, 1);
LocalDate end   = LocalDate.of(2025, 3, 9);

long years   = ChronoUnit.YEARS.between(start, end);    // 2
long months  = ChronoUnit.MONTHS.between(start, end);   // 26
long weeks   = ChronoUnit.WEEKS.between(start, end);    // 113
long days    = ChronoUnit.DAYS.between(start, end);     // 797

System.out.println("연도 차이: " + years);
System.out.println("총 개월 차이: " + months);
System.out.println("총 주 차이: " + weeks);
System.out.println("총 일 차이: " + days);
```

### ⚠️ Period.between()과의 차이 주의!

```java
LocalDate start = LocalDate.of(2023, 1, 1);
LocalDate end   = LocalDate.of(2023, 8, 9);

// Period는 년/월/일을 분리해서 반환
Period p = Period.between(start, end);
System.out.println(p.getMonths()); // 7  (1월~8월 = 7개월)
System.out.println(p.getDays());   // 8  (나머지 일수)

// ChronoUnit은 총 누적 값을 반환
long totalDays = ChronoUnit.DAYS.between(start, end); // 220 (총 220일)
```

`Period.getDays()`가 `8`을 반환하는 것을 보고 "220일인데 왜 8이지?" 하고 당황했다면, 앞으로는 `ChronoUnit`을 쓰면 된다.

***

## 핵심 사용법 2: 시간(Time) 차이 계산

`LocalDateTime`, `LocalTime`, `Instant`와도 완벽하게 호환된다.

```java
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

LocalDateTime startDt = LocalDateTime.of(2025, 3, 1, 9, 0, 0);
LocalDateTime endDt   = LocalDateTime.of(2025, 3, 9, 18, 30, 0);

long hours   = ChronoUnit.HOURS.between(startDt, endDt);    // 201
long minutes = ChronoUnit.MINUTES.between(startDt, endDt);  // 12090
long seconds = ChronoUnit.SECONDS.between(startDt, endDt);  // 725400

System.out.println("총 시간 차이: " + hours + "시간");
System.out.println("총 분 차이: " + minutes + "분");
```

***

## 핵심 사용법 3: 날짜 더하기/빼기 (plus/minus)

`LocalDate`, `LocalDateTime`의 `.plus()` / `.minus()` 메서드와 조합하면 코드가 훨씬 읽기 좋아진다.

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

LocalDate today = LocalDate.now(); // 2026-03-09

// 더하기
LocalDate threeMonthsLater = today.plus(3, ChronoUnit.MONTHS);  // 2026-06-09
LocalDate twoWeeksLater    = today.plus(2, ChronoUnit.WEEKS);   // 2026-03-23

// 빼기
LocalDate hundredDaysAgo   = today.minus(100, ChronoUnit.DAYS); // 2025-11-29

System.out.println("3개월 후: " + threeMonthsLater);
System.out.println("2주 후: " + twoWeeksLater);
System.out.println("100일 전: " + hundredDaysAgo);
```

***

## 핵심 사용법 4: truncatedTo() — 시간 내림(절사)

특정 단위 이하를 버리고 싶을 때 쓴다. API 응답 시간 로깅이나 캐시 키 생성 시 초 단위 아래를 버릴 때 매우 유용하다.

```java
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

LocalDateTime now = LocalDateTime.now();
// 예: 2026-03-09T16:54:37.123456789

// 분 이하 절사 → 2026-03-09T16:54
LocalDateTime truncMinute = now.truncatedTo(ChronoUnit.MINUTES);

// 시간 이하 절사 → 2026-03-09T16:00
LocalDateTime truncHour = now.truncatedTo(ChronoUnit.HOURS);

// 날짜 이하 절사 (시간 전체 제거) → 2026-03-09T00:00
LocalDateTime truncDay = now.truncatedTo(ChronoUnit.DAYS);

System.out.println("분 단위 절사: " + truncMinute);
System.out.println("시간 단위 절사: " + truncHour);
System.out.println("일 단위 절사: " + truncDay);
```

***

## 핵심 사용법 5: 실무 예제 — D-Day / 구독 만료 계산

실제 업무에서 자주 쓰이는 패턴이다.

```java
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class SubscriptionService {

    // 구독 만료까지 남은 일수
    public static long daysUntilExpiry(LocalDate expiryDate) {
        return ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
    }

    // 가입 후 몇 개월 지났는지
    public static long monthsSinceJoined(LocalDate joinDate) {
        return ChronoUnit.MONTHS.between(joinDate, LocalDate.now());
    }

    public static void main(String[] args) {
        LocalDate joinDate   = LocalDate.of(2024, 6, 1);
        LocalDate expiryDate = LocalDate.of(2026, 6, 1);

        System.out.println("가입 후 경과 개월: " + monthsSinceJoined(joinDate) + "개월");
        System.out.println("만료까지 남은 일수: " + daysUntilExpiry(expiryDate) + "일");
    }
}
// 실행 결과 (2026-03-09 기준)
// 가입 후 경과 개월: 21개월
// 만료까지 남은 일수: 84일
```

***

## 정리

`ChronoUnit`은 Java 8부터 존재했지만, 많은 개발자들이 `Period`나 `Duration`만 쓰다 보니 상대적으로 덜 알려진 클래스다. 핵심만 기억하면 이렇다:

- **두 날짜/시간의 총 차이** → `ChronoUnit.XXX.between(start, end)`
- **날짜에 특정 단위 더하기/빼기** → `.plus(n, ChronoUnit.XXX)`
- **시간 일부 절사** → `.truncatedTo(ChronoUnit.XXX)`
- `Period.getDays()` 같은 함정 없이 항상 **총 누적 값**을 반환한다는 것이 가장 큰 장점

외부 라이브러리 없이 JDK 표준으로 이 모든 게 가능하니, 레거시 `Calendar` 코드를 만나면 주저 없이 `ChronoUnit`으로 리팩터링해보자.
