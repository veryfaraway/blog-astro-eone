---
title: "Java Record: 불변 데이터 클래스의 혁명"
description: Java 16에서 정식 도입된 Record 클래스로 간결하고 안전한 불변 데이터 객체를 만드는 방법과 Spring Boot 활용 예제를 알아봅니다.
date: 2025-12-17
category: Backend
tags:
  - "java"
  - "record"
  - "immutability"
  - "spring-boot"
draft: false
lang: ko
thumbnail: "https://media.licdn.com/dms/image/v2/D5612AQEkpIuNMavuiA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1686767414414?e=2147483647&v=beta&t=PHNjoDG3_wsGDP0as26ILzaNkGbiQIccDA9JNW5fOIw"
---

## 개요

안녕하세요! 오늘은 Java의 Record 클래스에 대해 알아보겠습니다. Record는 Java 14에서 프리뷰로 등장하여 Java 16에서 정식 기능이 되었습니다. 데이터를 담는 불변(immutable) 클래스를 매우 간결하게 작성할 수 있게 해주는 강력한 기능입니다.

## 도입 배경과 역사

### 기존 방식의 문제점

데이터를 담는 간단한 클래스를 만들 때도 많은 보일러플레이트 코드가 필요했습니다.

```java
// 기존 방식 - 너무 장황함!
public class Person {
    private final String name;
    private final int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
    
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}
```

### 도입 시기

- **Java 14 (2020년 3월)**: 프리뷰 기능으로 첫 등장 (JEP 359)
- **Java 15 (2020년 9월)**: 두 번째 프리뷰
- **Java 16 (2021년 3월)**: 정식 기능으로 확정 (JEP 395)

## Record 기본 문법

위의 긴 코드를 단 한 줄로 작성할 수 있습니다!

```java
// Record 방식 - 간결함!
public record Person(String name, int age) {}
```

이 한 줄이 자동으로 생성해주는 것들:
- private final 필드
- 생성자
- getter 메서드 (getName()이 아닌 name()으로 생성)
- equals() 메서드
- hashCode() 메서드
- toString() 메서드

## 불변성(Immutability)이란?

불변성은 객체가 생성된 후 그 상태를 변경할 수 없다는 의미입니다. 쉽게 비유하자면:

### 가변(Mutable) 객체 - 노트

```java
// 일반 클래스 - 노트처럼 내용을 수정할 수 있음
public class MutablePerson {
    private String name;
    private int age;
    
    public void setName(String name) {
        this.name = name;  // 수정 가능!
    }
    
    public void setAge(int age) {
        this.age = age;  // 수정 가능!
    }
}

// 사용 예
MutablePerson person = new MutablePerson("홍길동", 20);
person.setAge(21);  // 나이 변경 가능
person.setAge(22);  // 또 변경 가능
```

### 불변(Immutable) 객체 - 인쇄된 책

```java
// Record - 인쇄된 책처럼 한 번 만들어지면 수정 불가
public record ImmutablePerson(String name, int age) {}

// 사용 예
ImmutablePerson person = new ImmutablePerson("홍길동", 20);
// person.setAge(21);  // 컴파일 에러! setter가 없음
// 나이를 바꾸려면 새로운 객체를 만들어야 함
ImmutablePerson olderPerson = new ImmutablePerson(person.name(), 21);
```

### 불변성의 장점

1. **스레드 안전**: 여러 스레드가 동시에 접근해도 안전
2. **예측 가능**: 객체 상태가 변하지 않아 버그 감소
3. **캐싱 가능**: 상태가 변하지 않으므로 안전하게 재사용
4. **HashMap/HashSet 키로 안전**: hashCode가 변하지 않음

```java
// 불변 객체의 안전성
Map<Person, String> map = new HashMap<>();
Person person = new Person("홍길동", 20);
map.put(person, "데이터");

// 만약 person이 가변이라면?
// person.setAge(21);  // hashCode 변경!
// map.get(person);    // 찾을 수 없음! 버그 발생!

// Record는 불변이므로 이런 문제가 없음
```

## Record 활용 예제

### 1. 기본 사용

```java
public record Product(String name, int price, String category) {}

public class RecordExample {
    public static void main(String[] args) {
        Product product = new Product("노트북", 1500000, "전자제품");
        
        // getter는 필드명과 동일 (get 접두사 없음)
        System.out.println(product.name());      // 노트북
        System.out.println(product.price());     // 1500000
        System.out.println(product.category());  // 전자제품
        
        // toString() 자동 생성
        System.out.println(product);
        // Product[name=노트북, price=1500000, category=전자제품]
    }
}
```

### 2. 커스텀 생성자와 검증

```java
public record Person(String name, int age) {
    // Compact 생성자 - 검증 로직 추가
    public Person {
        if (age < 0) {
            throw new IllegalArgumentException("나이는 0 이상이어야 합니다");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("이름은 필수입니다");
        }
    }
}

// 사용
Person person = new Person("홍길동", 20);  // OK
// Person invalid = new Person("", -1);    // 예외 발생!
```

### 3. 추가 메서드 정의

```java
public record Rectangle(double width, double height) {
    // 커스텀 메서드 추가 가능
    public double area() {
        return width * height;
    }
    
    public double perimeter() {
        return 2 * (width + height);
    }
    
    public boolean isSquare() {
        return width == height;
    }
}

// 사용
Rectangle rect = new Rectangle(10, 20);
System.out.println("넓이: " + rect.area());        // 200.0
System.out.println("둘레: " + rect.perimeter());   // 60.0
System.out.println("정사각형? " + rect.isSquare()); // false
```

### 4. 정적 팩토리 메서드

```java
public record Point(int x, int y) {
    // 정적 팩토리 메서드
    public static Point origin() {
        return new Point(0, 0);
    }
    
    public static Point of(int x, int y) {
        return new Point(x, y);
    }
}

// 사용
Point origin = Point.origin();
Point point = Point.of(10, 20);
```

## Spring Boot에서 Record 활용

### 1. DTO (Data Transfer Object)

```java
// 요청 DTO
public record CreateUserRequest(
    String username,
    String email,
    int age
) {
    // 검증 로직
    public CreateUserRequest {
        if (username == null || username.length() < 3) {
            throw new IllegalArgumentException("사용자명은 3자 이상이어야 합니다");
        }
        if (!email.contains("@")) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다");
        }
        if (age < 0 || age > 150) {
            throw new IllegalArgumentException("올바른 나이를 입력하세요");
        }
    }
}

// 응답 DTO
public record UserResponse(
    Long id,
    String username,
    String email,
    int age
) {
    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAge()
        );
    }
}
```

### 2. REST Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.ok(UserResponse.from(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
```

### 3. Service Layer

```java
@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(CreateUserRequest request) {
        // Record의 getter 사용 (get 접두사 없음)
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setAge(request.age());
        
        return userRepository.save(user);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
```

### 4. 복잡한 응답 구조

```java
// 페이징 응답
public record PageResponse<T>(
    List<T> content,
    int pageNumber,
    int pageSize,
    long totalElements,
    int totalPages
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages()
        );
    }
}

// API 응답 래퍼
public record ApiResponse<T>(
    boolean success,
    String message,
    T data
) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "성공", data);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}

// Controller에서 사용
@GetMapping
public ApiResponse<PageResponse<UserResponse>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    Page<User> userPage = userService.findAll(PageRequest.of(page, size));
    Page<UserResponse> responsePage = userPage.map(UserResponse::from);
    
    return ApiResponse.success(PageResponse.from(responsePage));
}
```

### 5. JPA Projection

```java
// JPA에서 필요한 필드만 조회
public record UserSummary(String username, String email) {}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // JPQL로 Record에 직접 매핑
    @Query("SELECT new com.example.dto.UserSummary(u.username, u.email) " +
           "FROM User u WHERE u.age >= :minAge")
    List<UserSummary> findUserSummaries(@Param("minAge") int minAge);
}
```

### 6. Configuration Properties

```java
// application.yml 설정을 Record로 매핑
@ConfigurationProperties(prefix = "app")
public record AppProperties(
    String name,
    String version,
    Security security,
    Database database
) {
    public record Security(
        String jwtSecret,
        long jwtExpiration
    ) {}
    
    public record Database(
        int maxConnections,
        int timeout
    ) {}
}

// application.yml
// app:
//   name: MyApp
//   version: 1.0.0
//   security:
//     jwt-secret: secret-key
//     jwt-expiration: 3600000
//   database:
//     max-connections: 10
//     timeout: 30
```

## Record 제약사항

### 1. 상속 불가

```java
// 컴파일 에러: Record는 다른 클래스를 상속할 수 없음
// public record Employee(String name) extends Person {}

// 하지만 인터페이스 구현은 가능
public interface Identifiable {
    Long getId();
}

public record User(Long id, String name) implements Identifiable {
    @Override
    public Long getId() {
        return id;
    }
}
```

### 2. 필드는 항상 final

```java
public record Person(String name, int age) {
    // 컴파일 에러: Record의 필드는 final이므로 수정 불가
    // public void setAge(int age) {
    //     this.age = age;
    // }
}
```

### 3. 추가 인스턴스 필드 선언 불가

```java
public record Person(String name, int age) {
    // 컴파일 에러: 추가 인스턴스 필드 선언 불가
    // private String address;
    
    // 정적 필드는 가능
    private static int count = 0;
}
```

## 일반 클래스 vs Record 선택 가이드

### Record를 사용하면 좋은 경우

- 단순히 데이터를 담는 용도 (DTO, VO)
- 불변 객체가 필요한 경우
- equals, hashCode, toString이 필요한 경우
- API 요청/응답 객체
- 설정 값을 담는 객체

```java
// 적합한 사용 예
public record LoginRequest(String username, String password) {}
public record Point(int x, int y) {}
public record Money(BigDecimal amount, String currency) {}
```

### 일반 클래스를 사용해야 하는 경우

- 상태가 변경되어야 하는 경우 (JPA Entity 등)
- 상속이 필요한 경우
- 복잡한 비즈니스 로직이 있는 경우
- 필드를 나중에 초기화해야 하는 경우

```java
// JPA Entity는 일반 클래스 사용
@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;
    
    private String username;
    private String email;
    
    // Setter 필요, 상태 변경 가능
}
```

## 성능 고려사항

Record는 일반 클래스와 성능 차이가 거의 없습니다. 컴파일 타임에 일반 클래스로 변환되기 때문입니다.

```java
// 이 Record는
public record Person(String name, int age) {}

// 컴파일 후 이런 클래스와 거의 동일
public final class Person {
    private final String name;
    private final int age;
    // ... 생성자, getter, equals, hashCode, toString
}
```

## 마무리

Java Record는 데이터 중심 클래스를 작성할 때 코드를 극적으로 줄여주는 훌륭한 기능입니다. 특히 Spring Boot에서 DTO를 작성할 때 매우 유용합니다.

**핵심 정리:**
- Record는 불변 데이터 클래스를 간결하게 작성
- 불변성으로 스레드 안전성과 예측 가능성 확보
- Spring Boot의 DTO, 응답 객체로 최적
- 상속이 필요하거나 상태 변경이 필요하면 일반 클래스 사용

Java 16 이상을 사용한다면, 데이터 클래스 작성 시 Record를 적극 활용해보세요!
