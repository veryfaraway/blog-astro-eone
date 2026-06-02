---
title: "Spring Boot 4 완벽 가이드: Spring Boot 3에서 마이그레이션하기"
description: "Spring Boot 4의 주요 신기능과 Spring Boot 3에서 4로 마이그레이션하는 실전 가이드. Java 21, Virtual Threads, GraalVM 네이티브 이미지 등 최신 기능을 활용하는 방법을 알아봅니다."
date: 2025-11-23
category: Backend
tags:
  - "spring-boot"
  - "java"
  - "migration"
  - "graalvm"
  - "virtual-threads"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2370&auto=format&fit=crop"
---

## 개요

Spring Boot 4가 2024년 11월에 정식 출시되었습니다! Spring Boot 3에서 4로의 마이그레이션은 비교적 간단하지만, 몇 가지 중요한 변경사항과 새로운 기능들이 있습니다. 이 포스트에서는 Spring Boot 4의 주요 특징과 실전 마이그레이션 가이드를 제공합니다.

## Spring Boot 버전 히스토리

- **Spring Boot 2.x** (2018-2023): Java 8+ 지원, Spring Framework 5
- **Spring Boot 3.x** (2022-2024): Java 17+ 필수, Jakarta EE 9, Spring Framework 6
- **Spring Boot 4.x** (2024-현재): Java 17+ 필수 (Java 21 권장), Jakarta EE 10, Spring Framework 6.1

## Spring Boot 4의 주요 변경사항

### 1. Java 버전 요구사항

**Spring Boot 3:**

- Java 17 이상 필수

**Spring Boot 4:**

- Java 17 이상 필수 (변경 없음)
- **Java 21 권장** - Virtual Threads 등 최신 기능 활용

```xml
<!-- pom.xml -->
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
</properties>
```

### 2. Spring Framework 6.1 기반

Spring Framework 6.1의 새로운 기능들이 Spring Boot 4에 포함되었습니다:

- **향상된 AOT (Ahead-of-Time) 컴파일 지원**
- **개선된 네이티브 이미지 지원**
- **더 나은 메모리 관리**

### 3. Jakarta EE 10 지원

**Spring Boot 3:** Jakarta EE 9
**Spring Boot 4:** Jakarta EE 10

주요 변경사항:

- `jakarta.servlet.*` 패키지 유지 (변경 없음)
- 새로운 Jakarta EE 10 API 활용 가능

### 4. Virtual Threads 기본 지원

Spring Boot 4에서는 Virtual Threads가 더욱 잘 통합되었습니다.

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true  # Java 21에서 기본 활성화 권장
```

### 5. GraalVM 네이티브 이미지 개선

네이티브 이미지 빌드가 더욱 안정적이고 빠르게 개선되었습니다.

```bash
# 네이티브 이미지 빌드
./mvnw -Pnative native:compile
```

## 마이그레이션 가이드: Spring Boot 3 → 4

### Step 1: 의존성 버전 업데이트

#### Maven (pom.xml)

```xml
<!-- Before: Spring Boot 3 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
    <relativePath/>
</parent>

<!-- After: Spring Boot 4 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.0</version>
    <relativePath/>
</parent>
```

#### Gradle (build.gradle)

```gradle
// Before: Spring Boot 3
plugins {
    id 'org.springframework.boot' version '3.2.5'
    id 'io.spring.dependency-management' version '1.1.4'
}

// After: Spring Boot 4
plugins {
    id 'org.springframework.boot' version '4.0.0'
    id 'io.spring.dependency-management' version '1.1.4'
}
```

### Step 2: Java 버전 확인 및 업그레이드

```bash
# 현재 Java 버전 확인
java -version

# Java 21 설치 (권장)
# macOS
brew install openjdk@21

# Linux (Ubuntu/Debian)
sudo apt install openjdk-21-jdk

# Windows
# https://adoptium.net/ 에서 다운로드
```

### Step 3: 호환성 확인

#### 3.1 주요 변경사항 체크리스트

- [ ] **의존성 호환성**: 서드파티 라이브러리가 Spring Boot 4와 호환되는지 확인
- [ ] **커스텀 Auto-Configuration**: 변경된 API 확인
- [ ] **테스트 코드**: 테스트 프레임워크 버전 확인

#### 3.2 주요 호환성 이슈

**1. Spring Data JPA 변경사항**

```java
// Spring Boot 3
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 기존 코드 그대로 동작
}

// Spring Boot 4 - 추가 기능 활용 가능
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 새로운 쿼리 메서드 활용 가능
    List<User> findByCreatedAtAfter(LocalDateTime date);
}
```

**2. Spring Security 설정**

```java
// Spring Boot 3 & 4 모두 동일
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            );
        return http.build();
    }
}
```

### Step 4: Virtual Threads 활성화 (Java 21+)

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true

server:
  port: 8080
```

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**성능 비교:**

```java
@RestController
@RequestMapping("/api")
public class ApiController {
    
    // Virtual Threads 활성화 시
    // - 동시 요청 처리 능력 향상
    // - 메모리 사용량 감소
    // - 응답 시간 개선
    
    @GetMapping("/users")
    public List<User> getUsers() {
        // I/O 작업 시 다른 요청도 처리 가능
        return userService.findAll();
    }
}
```

### Step 5: 테스트 실행

```bash
# 전체 테스트 실행
./mvnw test

# 특정 테스트만 실행
./mvnw test -Dtest=UserServiceTest

# Gradle
./gradlew test
```

### Step 6: 점진적 마이그레이션 (선택사항)

프로덕션 환경에서는 점진적 마이그레이션이 안전합니다:

1. **개발 환경에서 먼저 테스트**
2. **스테이징 환경 배포 및 검증**
3. **프로덕션 배포**

## Spring Boot 4의 새로운 기능

### 1. 향상된 네이티브 이미지 지원

```bash
# 네이티브 이미지 빌드 (GraalVM 필요)
./mvnw -Pnative native:compile

# 실행
./target/application
```

**장점:**

- 빠른 시작 시간 (밀리초 단위)
- 낮은 메모리 사용량
- 작은 바이너리 크기

### 2. 개선된 Actuator 엔드포인트

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

```java
// 새로운 엔드포인트 활용
@RestController
public class HealthController {
    
    @Autowired
    private HealthEndpoint healthEndpoint;
    
    @GetMapping("/custom-health")
    public Health customHealth() {
        return healthEndpoint.health();
    }
}
```

### 3. 향상된 보안 기능

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp
                    .policyDirectives("default-src 'self'")
                )
            );
        return http.build();
    }
}
```

### 4. 개선된 로깅

```yaml
# application.yml
logging:
  level:
    root: INFO
    com.example: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

## 실전 예제: 마이그레이션 시나리오

### 시나리오 1: 기본 웹 애플리케이션

```java
// Spring Boot 3 코드 (그대로 동작)
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }
}
```

**변경사항:** 없음! 기존 코드 그대로 동작합니다.

### 시나리오 2: 비동기 처리 개선

```java
// Spring Boot 3 - CompletableFuture 사용
@Service
public class UserService {
    
    @Async
    public CompletableFuture<List<User>> findAllAsync() {
        return CompletableFuture.completedFuture(findAll());
    }
}

// Spring Boot 4 + Java 21 - Virtual Threads 활용
@Service
public class UserService {
    
    // @Async 어노테이션 없이도 Virtual Threads로 자동 처리
    public List<User> findAll() {
        // I/O 작업 시 자동으로 다른 요청 처리
        return userRepository.findAll();
    }
}
```

### 시나리오 3: 네이티브 이미지 빌드

```xml
<!-- pom.xml -->
<build>
    <plugins>
        <plugin>
            <groupId>org.graalvm.buildtools</groupId>
            <artifactId>native-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

```bash
# 네이티브 이미지 빌드
./mvnw -Pnative native:compile

# 실행 시간 비교
# JAR: ~2초
# 네이티브 이미지: ~0.05초 (40배 빠름!)
```

## 마이그레이션 체크리스트

### 필수 확인 사항

- [ ] **Java 버전**: Java 17 이상 (Java 21 권장)
- [ ] **의존성 버전**: Spring Boot 4.0.0으로 업데이트
- [ ] **서드파티 라이브러리**: 호환성 확인
- [ ] **테스트 코드**: 모든 테스트 통과 확인
- [ ] **프로덕션 배포**: 스테이징 환경에서 먼저 검증

### 선택적 개선 사항

- [ ] **Virtual Threads 활성화**: Java 21 사용 시
- [ ] **네이티브 이미지 빌드**: 빠른 시작 시간 필요 시
- [ ] **새로운 Actuator 엔드포인트 활용**
- [ ] **보안 설정 강화**

## 주의사항 및 알려진 이슈

### 1. 서드파티 라이브러리 호환성

일부 오래된 라이브러리는 Spring Boot 4와 호환되지 않을 수 있습니다:

```xml
<!-- 호환성 확인 필요 -->
<dependency>
    <groupId>com.example</groupId>
    <artifactId>old-library</artifactId>
    <version>1.0.0</version>
</dependency>
```

**해결 방법:**

- 최신 버전으로 업데이트
- 대체 라이브러리 검토
- 커뮤니티 확인

### 2. 커스텀 Auto-Configuration

```java
// 변경된 API 확인 필요
@Configuration
@ConditionalOnClass(SomeClass.class)
public class CustomAutoConfiguration {
    // Spring Boot 4 API 변경사항 확인
}
```

### 3. 테스트 프레임워크

```java
// JUnit 5 사용 권장
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testFindAll() {
        List<User> users = userService.findAll();
        assertThat(users).isNotEmpty();
    }
}
```

## 성능 개선 팁

### 1. Virtual Threads 활용

```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true
```

**예상 성능 향상:**

- 동시 요청 처리 능력: 10배 이상 향상
- 메모리 사용량: 50% 감소
- 응답 시간: 30% 개선

### 2. 네이티브 이미지 빌드

```bash
# 개발 환경에서는 JAR 사용
./mvnw spring-boot:run

# 프로덕션에서는 네이티브 이미지 사용
./mvnw -Pnative native:compile
```

**예상 성능 향상:**

- 시작 시간: 40배 빠름 (2초 → 0.05초)
- 메모리 사용량: 30% 감소
- 바이너리 크기: 증가 (하지만 실행 시 메모리 감소)

### 3. 연결 풀 최적화

```yaml
# application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```

## 마무리

Spring Boot 4는 Spring Boot 3에서 자연스럽게 진화한 버전입니다. 대부분의 코드는 변경 없이 동작하며, 새로운 기능들을 점진적으로 도입할 수 있습니다.

**핵심 정리:**

- ✅ **하위 호환성**: 대부분의 코드 변경 불필요
- ✅ **Java 21 권장**: Virtual Threads 등 최신 기능 활용
- ✅ **성능 개선**: Virtual Threads, 네이티브 이미지로 성능 향상
- ✅ **점진적 마이그레이션**: 안전하게 단계별 업그레이드 가능

**다음 단계:**

1. 개발 환경에서 Spring Boot 4로 업그레이드
2. 모든 테스트 통과 확인
3. Virtual Threads 활성화로 성능 테스트
4. 스테이징 환경 배포 및 검증
5. 프로덕션 배포

Spring Boot 4의 새로운 기능들을 활용하여 더욱 빠르고 효율적인 애플리케이션을 만들어보세요! 🚀
