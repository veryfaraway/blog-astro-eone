---
title: "Spring Boot 3 + Kotlin 마이그레이션 실전 가이드"
description: "Java로 된 Spring Boot 프로젝트를 Kotlin으로 점진적으로 전환하는 전략과 실제 겪은 이슈를 정리했습니다."
date: 2026-03-15
category: Backend
tags: [kotlin, spring-boot, java, migration, backend]
lang: ko
draft: false
---

## 왜 Kotlin인가

Java와 100% 호환되면서 코드가 간결해집니다. Null safety가 언어 레벨에서 보장되고,
데이터 클래스, 확장 함수, 코루틴 등 현대적인 기능을 바로 쓸 수 있습니다.

## 점진적 전환 전략

Java와 Kotlin은 같은 JVM 위에서 공존할 수 있습니다.
모든 코드를 한 번에 바꾸지 않고 파일 단위로 전환할 수 있습니다.

### 1단계: 새 파일은 Kotlin으로

기존 Java 파일은 건드리지 않고, 새로 만드는 파일부터 Kotlin으로 작성합니다.

### 2단계: 데이터 클래스 우선 전환

```kotlin
// Java DTO → Kotlin data class
data class UserResponse(
    val id: Long,
    val email: String,
    val createdAt: LocalDateTime,
)
```

### 3단계: 서비스 레이어 전환

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
) {
    fun findById(id: Long): UserResponse =
        userRepository.findByIdOrNull(id)
            ?.toResponse()
            ?: throw UserNotFoundException(id)
}
```

## 주요 이슈

### JPA Entity는 open class 필요

Kotlin 클래스는 기본적으로 `final`이라 JPA 프록시가 동작하지 않습니다.
`kotlin-allopen` 플러그인을 사용하세요.

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.spring") version "2.0.0"
    kotlin("plugin.jpa") version "2.0.0"
}
```
