---
title: "HashSet vs LinkedHashSet: Java 컬렉션의 두 가지 Set 구현체 비교"
description: HashSet vs LinkedHashSet
date: 2022-10-06
category: Backend
tags:
  - "java"
  - "collection"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1520261714703-84c0762360ee?q=80&w=2499&auto=format&fit=crop&ixlib=rb-4.0.3"
---

Java 컬렉션 프레임워크에서 Set 인터페이스의 두 가지 주요 구현체인 HashSet과 LinkedHashSet은 둘 다 고유한 요소를 저장하는 데 사용되지만, 몇 가지 중요한 차이점이 있습니다. 이 글에서는 이 두 클래스의 차이점을 살펴보고 예제 코드를 통해 그 차이를 확인해보겠습니다.

### 주요 차이점

1. **순서 유지**
   - HashSet: 요소의 순서를 유지하지 않습니다.
   - LinkedHashSet: 삽입 순서를 유지합니다.

2. **내부 구조**
   - HashSet: 해시 테이블을 사용하여 요소를 저장합니다.
   - LinkedHashSet: 해시 테이블과 연결 리스트를 결합하여 사용합니다.

3. **성능**
   - HashSet: 기본 작업(추가, 제거, 검색)에 대해 일반적으로 더 빠릅니다.
   - LinkedHashSet: 순서 유지로 인해 약간의 추가 오버헤드가 있습니다.

4. **메모리 사용**
   - HashSet: 순서를 유지하지 않아 메모리 오버헤드가 적습니다.
   - LinkedHashSet: 연결 리스트를 유지하기 위해 추가 메모리가 필요합니다.

### 예제 코드

다음 예제 코드를 통해 HashSet과 LinkedHashSet의 차이점을 확인해보겠습니다:

```java
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

public class SetComparisonExample {
    public static void main(String[] args) {
        // HashSet 예제
        Set<String> hashSet = new HashSet<>();
        hashSet.add("바나나");
        hashSet.add("사과");
        hashSet.add("오렌지");
        hashSet.add("포도");
        
        System.out.println("HashSet:");
        for (String fruit : hashSet) {
            System.out.println(fruit);
        }
        
        // LinkedHashSet 예제
        Set<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("바나나");
        linkedHashSet.add("사과");
        linkedHashSet.add("오렌지");
        linkedHashSet.add("포도");
        
        System.out.println("\nLinkedHashSet:");
        for (String fruit : linkedHashSet) {
            System.out.println(fruit);
        }
    }
}
```

이 코드를 실행하면 다음과 같은 결과를 얻을 수 있습니다:

```

HashSet:
포도
오렌지
바나나
사과

LinkedHashSet:
바나나
사과
오렌지
포도
```

### 결과 분석

1. HashSet의 경우, 출력 순서가 삽입 순서와 다릅니다. 이는 HashSet이 내부적으로 해시 함수를 사용하여 요소를 저장하기 때문입니다.

2. LinkedHashSet의 경우, 출력 순서가 삽입 순서와 정확히 일치합니다. 이는 LinkedHashSet이 연결 리스트를 사용하여 요소의 삽입 순서를 유지하기 때문입니다.

### 사용 시 고려사항

- 요소의 순서가 중요하지 않고 빠른 성능이 필요한 경우 HashSet을 사용하세요.
- 요소의 삽입 순서를 유지해야 하는 경우 LinkedHashSet을 사용하세요.
- 메모리 사용량이 중요한 경우, HashSet이 더 효율적일 수 있습니다.

이 두 Set 구현체의 특성을 이해하고 적절히 선택하면 Java 애플리케이션의 성능과 기능성을 최적화할 수 있습니다.
