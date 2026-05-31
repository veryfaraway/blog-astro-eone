---
title: "LinkedHashSet vs TreeSet: 차이점과 성능 비교"
description: LinkedHashSet과 TreeSet의 차이점과 성능 비교
date: 2022-10-05
category: Backend
tags:
  - "java"
  - "collection"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1489731007795-388eee095ff6?q=80&w=2974&auto=format&fit=crop&ixlib=rb-4.0.3"
---

Java 컬렉션 프레임워크에서 LinkedHashSet과 TreeSet은 모두 Set 인터페이스를 구현하지만, 내부 구조와 특성에 있어 중요한 차이점이 있습니다. 이 글에서는 두 클래스의 주요 차이점과 성능 특성을 살펴보겠습니다.

### 주요 차이점

1. **내부 구조**
   - LinkedHashSet: 해시 테이블과 연결 리스트를 결합하여 사용합니다.
   - TreeSet: 레드-블랙 트리 구조를 사용합니다.

2. **요소의 순서**
   - LinkedHashSet: 삽입 순서를 유지합니다.
   - TreeSet: 요소를 정렬된 순서로 유지합니다 (기본적으로 오름차순).

3. **성능 특성**
   - LinkedHashSet: 대부분의 연산에서 O(1) 시간 복잡도를 가집니다.
   - TreeSet: 대부분의 연산에서 O(log n) 시간 복잡도를 가집니다.

4. **Null 요소 처리**
   - LinkedHashSet: null 요소를 허용합니다.
   - TreeSet: null 요소를 허용하지 않습니다 (자연 순서를 사용할 때).

### 성능 비교

1. **삽입 연산**
   - LinkedHashSet: 일반적으로 더 빠릅니다. O(1) 시간 복잡도를 가집니다.
   - TreeSet: 요소를 정렬된 위치에 삽입해야 하므로 O(log n) 시간이 걸립니다.

2. **검색 연산**
   - LinkedHashSet: O(1) 시간 복잡도로 매우 빠릅니다.
   - TreeSet: O(log n) 시간 복잡도를 가지지만, 정렬된 데이터에 대한 범위 검색에 효율적입니다.

3. **삭제 연산**
   - LinkedHashSet: O(1) 시간 복잡도로 빠른 삭제가 가능합니다.
   - TreeSet: O(log n) 시간이 걸리며, 트리 재조정이 필요할 수 있습니다.

4. **순회 연산**
   - LinkedHashSet: 삽입 순서대로 빠르게 순회할 수 있습니다.
   - TreeSet: 정렬된 순서로 순회하며, 특정 범위의 요소를 효율적으로 접근할 수 있습니다.

### 사용 시나리오

1. **LinkedHashSet 사용 케이스**
   - 삽입 순서가 중요한 경우
   - 빈번한 삽입/삭제 작업이 필요한 경우
   - 해시 기반의 빠른 검색이 필요한 경우

2. **TreeSet 사용 케이스**
   - 요소를 항상 정렬된 상태로 유지해야 하는 경우
   - 범위 검색이 자주 필요한 경우
   - 최소값/최대값을 자주 조회해야 하는 경우

### 성능 테스트 예제

다음은 간단한 성능 테스트 코드 예시입니다:

```java
import java.util.*;

public class SetPerformanceTest {
    public static void main(String[] args) {
        int elementCount = 1000000;
        
        // LinkedHashSet 테스트
        Set<Integer> linkedHashSet = new LinkedHashSet<>();
        long startTime = System.nanoTime();
        for (int i = 0; i < elementCount; i++) {
            linkedHashSet.add(i);
        }
        long endTime = System.nanoTime();
        System.out.println("LinkedHashSet 삽입 시간: " + (endTime - startTime) + " ns");

        // TreeSet 테스트
        Set<Integer> treeSet = new TreeSet<>();
        startTime = System.nanoTime();
        for (int i = 0; i < elementCount; i++) {
            treeSet.add(i);
        }
        endTime = System.nanoTime();
        System.out.println("TreeSet 삽입 시간: " + (endTime - startTime) + " ns");
    }
}
```

이 테스트를 실행하면 LinkedHashSet이 TreeSet보다 삽입 연산에서 더 빠른 성능을 보일 것입니다.

### 결론

LinkedHashSet과 TreeSet은 각각 고유한 특성과 성능 프로필을 가지고 있습니다. LinkedHashSet은 빠른 삽입/삭제와 순서 유지가 중요한 경우에 적합하며, TreeSet은 정렬된 데이터와 범위 검색이 필요한 경우에 유용합니다. 애플리케이션의 요구사항에 따라 적절한 Set 구현체를 선택하는 것이 중요합니다.
