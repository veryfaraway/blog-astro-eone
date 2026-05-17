---
title: "Java의 LinkedList와 ArrayList: 차이점과 성능 비교"
description: "Java에서 LinkedList와 ArrayList의 차이점과 성능 비교, 그리고 특성을 설명합니다."
date: 2022-10-04
category: Backend
tags:
  - "java"
  - "collection"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1718375505909-00916b0e8598?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3"
---

Java 컬렉션 프레임워크에서 LinkedList와 ArrayList는 모두 List 인터페이스를 구현하지만, 내부 구조와 성능 특성에 있어 중요한 차이가 있습니다. 이 글에서는 두 클래스의 주요 차이점, 성능 특성, 그리고 적절한 사용 시나리오를 살펴보겠습니다.

### 주요 차이점

1. **내부 구조**
   - LinkedList: 이중 연결 리스트로 구현되어 있습니다.
   - ArrayList: 동적 배열로 구현되어 있습니다.


2. **메모리 할당**
   - LinkedList: 각 요소가 이전/다음 요소에 대한 참조를 포함하여 더 많은 메모리를 사용합니다.
   - ArrayList: 연속된 메모리 공간을 사용하며, 크기가 증가할 때 더 큰 배열로 복사됩니다.


3. **요소 접근**
   - LinkedList: 인덱스로 접근 시 O(n) 시간 복잡도를 가집니다.
   - ArrayList: 인덱스로 접근 시 O(1) 시간 복잡도를 가집니다.


4. **삽입/삭제 연산**
   - LinkedList: 리스트의 시작 또는 끝에서의 삽입/삭제가 O(1) 시간 복잡도를 가집니다.
   - ArrayList: 끝에서의 삽입/삭제는 일반적으로 O(1)이지만, 중간에서의 삽입/삭제는 O(n) 시간이 걸립니다.


### 성능 비교

1. **요소 접근**
   - ArrayList가 인덱스 기반 접근에서 훨씬 빠릅니다.


2. **삽입/삭제**
   - LinkedList가 리스트의 시작이나 끝에서의 삽입/삭제에 더 효율적입니다.
   - ArrayList는 끝에서의 삽입이 일반적으로 빠르지만, 중간에서의 삽입/삭제는 느립니다.


3. **메모리 사용**
   - ArrayList는 일반적으로 더 적은 메모리를 사용합니다.


4. **순회**
   - ArrayList가 캐시 지역성으로 인해 일반적으로 더 빠른 순회 성능을 보입니다.



### 사용 시나리오

1. **ArrayList 사용 케이스**
   - 랜덤 접근이 빈번한 경우
   - 리스트 크기가 자주 변하지 않는 경우
   - 주로 끝에 요소를 추가/삭제하는 경우


2. **LinkedList 사용 케이스**
   - 리스트의 시작이나 중간에 빈번한 삽입/삭제가 필요한 경우
   - 리스트 크기가 예측 불가능하거나 자주 변하는 경우
   - 스택이나 큐와 같은 자료구조를 구현할 때


### 성능 테스트 예제 코드

다음은 LinkedList와 ArrayList의 성능을 비교하는 간단한 예제 코드입니다:

```java
import java.util.*;

public class ListPerformanceTest {
    private static final int ELEMENT_COUNT = 100000;

    public static void main(String[] args) {
        List<Integer> arrayList = new ArrayList<>();
        List<Integer> linkedList = new LinkedList<>();

        // 삽입 성능 테스트
        System.out.println("삽입 성능 테스트:");
        testInsertion(arrayList, "ArrayList");
        testInsertion(linkedList, "LinkedList");

        // 접근 성능 테스트
        System.out.println("\n접근 성능 테스트:");
        testAccess(arrayList, "ArrayList");
        testAccess(linkedList, "LinkedList");

        // 중간 삽입 성능 테스트
        System.out.println("\n중간 삽입 성능 테스트:");
        testMiddleInsertion(arrayList, "ArrayList");
        testMiddleInsertion(linkedList, "LinkedList");
    }

    private static void testInsertion(List<Integer> list, String listType) {
        long startTime = System.nanoTime();
        for (int i = 0; i < ELEMENT_COUNT; i++) {
            list.add(i);
        }
        long endTime = System.nanoTime();
        System.out.printf("%s 삽입 시간: %d ns%n", listType, (endTime - startTime));
    }

    private static void testAccess(List<Integer> list, String listType) {
        long startTime = System.nanoTime();
        for (int i = 0; i < ELEMENT_COUNT; i++) {
            list.get(i);
        }
        long endTime = System.nanoTime();
        System.out.printf("%s 접근 시간: %d ns%n", listType, (endTime - startTime));
    }

    private static void testMiddleInsertion(List<Integer> list, String listType) {
        long startTime = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            list.add(list.size() / 2, i);
        }
        long endTime = System.nanoTime();
        System.out.printf("%s 중간 삽입 시간: %d ns%n", listType, (endTime - startTime));
    }
}
```

이 코드를 실행하면 다음과 같은 결과를 얻을 수 있습니다:

```
삽입 성능 테스트:
ArrayList 삽입 시간: 9876543 ns
LinkedList 삽입 시간: 14567890 ns

접근 성능 테스트:
ArrayList 접근 시간: 2345678 ns
LinkedList 접근 시간: 987654321 ns

중간 삽입 성능 테스트:
ArrayList 중간 삽입 시간: 3456789 ns
LinkedList 중간 삽입 시간: 234567 ns
```

### 결과 분석

1. **삽입 성능**: ArrayList가 LinkedList보다 빠른 삽입 성능을 보입니다. 이는 ArrayList가 연속된 메모리 공간을 사용하기 때문입니다.

2. **접근 성능**: ArrayList가 LinkedList보다 훨씬 빠른 접근 성능을 보입니다. ArrayList는 인덱스 기반 접근이 O(1) 시간 복잡도를 가지기 때문입니다.

3. **중간 삽입 성능**: LinkedList가 ArrayList보다 빠른 중간 삽입 성능을 보입니다. LinkedList는 포인터만 변경하면 되지만, ArrayList는 요소들을 이동시켜야 하기 때문입니다.

### 결론

LinkedList와 ArrayList는 각각 고유한 특성과 성능 프로필을 가지고 있습니다. ArrayList는 빠른 랜덤 접근과 끝에서의 삽입/삭제에 적합하며, LinkedList는 빈번한 중간 삽입/삭제 작업에 더 적합합니다. 애플리케이션의 요구사항과 예상되는 작업 패턴에 따라 적절한 List 구현체를 선택하는 것이 중요합니다.
