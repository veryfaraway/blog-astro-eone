---
title: "구 시스템을 Spring Boot 3.x + Java 17로 업그레이드하기: 체크리스트부터 신기능 활용까지"
description: "Spring Boot 2.x에서 3.x로, Java 8/11에서 17로 업그레이드하는 과정에서 반드시 알아야 할 핵심 체크리스트와 Java 17의 신기능을 활용하여 코드 품질을 높이는 방법을 설명합니다."
date: 2026-02-19
category: Backend
tags:
  - "java"
  - "java17"
  - "spring-boot"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1602763288580-927cfda37a72?q=80&w=2372&auto=format&fit=crop"
---

> **Java 17**은 단순한 버전 업그레이드가 아닙니다. Spring Boot 3.x로의 전환은 Jakarta EE 네임스페이스 변경, 새로운 언어 기능, 향상된 보안 모델까지 아우르는 **아키텍처 수준의 변화**입니다.

***

## 🔍 왜 지금 업그레이드해야 할까?

- **Spring Boot 2.x EOL** — Spring Boot 2.7은 2023년 11월 공식 지원 종료 [dev](https://dev.to/nichetti/migrating-to-spring-boot-30-and-java-17-a-comprehensive-guide-2pbn)
- **Spring Boot 3.x 최소 요건** — Java 17 미만은 아예 실행 불가 [atlantbh](https://www.atlantbh.com/java-17-and-spring-boot-3-upgrade-roadmap/)
- **Java 17 LTS** — Oracle 기준 **2029년 9월까지** 장기 지원 보장 [javaspring](https://www.javaspring.net/blog/spring-boot-version-for-java-17/)

***

## ✅ 업그레이드 전 체크리스트

### 1단계: 현재 버전 파악 및 점진적 업그레이드

갑자기 Boot 2.x → 3.x로 건너뛰면 충돌이 많습니다. **먼저 Spring Boot 2.7로 올린 뒤** 3.x로 마이그레이션하는 것이 정석입니다. [dev](https://dev.to/nichetti/migrating-to-spring-boot-30-and-java-17-a-comprehensive-guide-2pbn)

```
Spring Boot 1.x / 2.x → Spring Boot 2.7 → Spring Boot 3.x
```

### 2단계: 핵심 Breaking Change — `javax` → `jakarta`

Spring Boot 3.x는 **Jakarta EE 9+** 기반으로 전환되었습니다. 가장 많이 마주치는 변경 사항입니다. [openlogic](https://www.openlogic.com/blog/planning-spring-boot-upgrade)

```java
// Before (Spring Boot 2.x)
import javax.persistence.Entity;
import javax.servlet.http.HttpServletRequest;

// After (Spring Boot 3.x)
import jakarta.persistence.Entity;
import jakarta.servlet.http.HttpServletRequest;
```

> 💡 **팁**: IDE의 전체 텍스트 검색으로 `javax.` 를 일괄 치환하되, `javax.swing`, `javax.crypto` 등 Java SE 영역은 변경하지 않아야 합니다.

### 3단계: 의존성 호환성 확인 — 연쇄 업그레이드 주의

Spring Boot를 올리면 **연쇄 업그레이드(butterfly effect)** 가 발생합니다. 주요 라이브러리 호환 버전을 미리 확인하세요. [atlantbh](https://www.atlantbh.com/java-17-and-spring-boot-3-upgrade-roadmap/)

| 라이브러리 | Spring Boot 2.7 | Spring Boot 3.x |
| --- | --- | --- |
| Hibernate | 5.x | 6.x |
| Spring Security | 5.x | 6.x |
| Flyway | 8.x | 9.x+ |
| Apache HttpClient | 4.x | 5.x |
| Spring Kafka | 2.x | 3.x |

### 4단계: Properties Migrator 적용

설정 파일(application.yml/properties)의 deprecated 키를 자동으로 분석해줍니다. 마이그레이션 후 반드시 제거해야 합니다. [dev](https://dev.to/nichetti/migrating-to-spring-boot-30-and-java-17-a-comprehensive-guide-2pbn)

```xml
<!-- pom.xml에 임시 추가 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-properties-migrator</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 5단계: Spring Security 6.x 변경 대응

`WebSecurityConfigurerAdapter`가 **완전 삭제**되었습니다. 컴포넌트 기반 방식으로 전환해야 합니다. [linkedin](https://www.linkedin.com/pulse/upgrading-spring-boot-projects-3x-jdk-17-rakesh-upadhayaya-xtckc)

```java
// Before
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception { ... }
}

// After (Spring Boot 3.x / Security 6.x)
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // ...
        return http.build();
    }
}
```

***

## 🚀 Java 17 신기능으로 코드 품질 높이기

업그레이드를 완료했다면, 이제 Java 17의 장점을 적극 활용할 차례입니다. [linkedin](https://www.linkedin.com/pulse/exploring-new-features-java-17-spring-boot-developers-ioexc)

### ① Record — DTO 코드 대폭 간소화

기존에 Lombok으로 처리하던 DTO를 `record`로 대체하면 코드가 훨씬 명확해집니다.

```java
// Before (Lombok 사용)
@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
}

// After (Java 17 Record)
public record UserResponse(Long id, String name, String email) {}
```

### ② Text Block — SQL/JSON을 가독성 좋게

```java
// Before
String query = "SELECT u.id, u.name " +
               "FROM users u " +
               "WHERE u.active = true " +
               "ORDER BY u.name";

// After
String query = """
        SELECT u.id, u.name
        FROM users u
        WHERE u.active = true
        ORDER BY u.name
        """;
```

### ③ Sealed Class — 도메인 계층 설계 강화

결제 수단처럼 **확장을 제한해야 하는 도메인 모델**에 매우 유용합니다. [linkedin](https://www.linkedin.com/pulse/exploring-new-features-java-17-spring-boot-developers-ioexc)

```java
public sealed interface PaymentMethod
    permits CreditCard, BankTransfer, KakaoPay {}

public final class CreditCard implements PaymentMethod { ... }
public final class BankTransfer implements PaymentMethod { ... }
public final class KakaoPay implements PaymentMethod { ... }
```

### ④ Pattern Matching — 서비스 레이어 분기 처리 간결화

```java
// Before
public String process(Object request) {
    if (request instanceof CreateRequest) {
        CreateRequest cr = (CreateRequest) request;
        return "생성: " + cr.getName();
    } else if (request instanceof UpdateRequest) {
        UpdateRequest ur = (UpdateRequest) request;
        return "수정 ID: " + ur.getId();
    }
    return "알 수 없는 요청";
}

// After (Pattern Matching for switch)
public String process(Object request) {
    return switch (request) {
        case CreateRequest cr -> "생성: " + cr.getName();
        case UpdateRequest ur -> "수정 ID: " + ur.getId();
        default -> "알 수 없는 요청";
    };
}
```

***

## 📊 마이그레이션 로드맵 요약

```
[현재 상태 분석]
  └─ javax → jakarta 영향 범위 파악
  └─ 의존성 호환 버전 매핑

[점진적 업그레이드]
  └─ Boot 2.x → 2.7 → 3.x
  └─ Properties Migrator 적용 → 검증 후 제거

[코드 현대화]
  └─ DTO → Record 전환
  └─ 문자열 → Text Block 적용
  └─ instanceof 분기 → Pattern Matching 전환
  └─ 폐쇄 계층 → Sealed Class 설계

[검증]
  └─ 단위/통합 테스트 전수 실행
  └─ 런타임 기능 테스트 (Actuator, Security, DB 연결)
```

***

> **결론**: Spring Boot 3.x + Java 17 업그레이드는 단기적으로 공수가 들지만, `jakarta` 네임스페이스 통일, LTS 보안 지원, 언어 표현력 향상까지 **장기적인 기술 부채를 줄이는 가장 확실한 투자**입니다.
