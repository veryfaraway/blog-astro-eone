---
title: "[DBeaver] 쿼리 성능 튜닝의 시작: Visual Explain(실행 계획) 활용법"
description: DBeaver의 실행 계획 기능을 활용하여 쿼리 성능 병목 구간을 정확히 짚어내는 방법을 알아봅니다.
date: 2026-01-16
category: Development
tags:
  - "dbeaver"
  - "optimization"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1496112576525-8b31e9ce4872?q=80&w=2370&auto=format&fit=crop"
---

쿼리가 느려질 때, 단순히 "데이터가 많아서"라고 결론짓고 있지는 않나요? **DBeaver**의 실행 계획 기능을 활용하면 어느 구간에서 병목이 발생하는지 정확히 짚어낼 수 있습니다.

---

## 1. 실행 계획(Execution Plan)이란?

데이터베이스가 쿼리를 실행하기 위해 수립하는 '최단 경로 전략'입니다. 인덱스를 제대로 타고 있는지, 불필요하게 전체 테이블을 다 뒤지고 있는지(Full Scan) 확인할 수 있습니다.

## 2. DBeaver에서 실행 계획 보는 법

DBeaver 쿼리 편집기에서 쿼리를 작성한 후 다음 중 하나를 실행하세요.

* **단축키:** `Ctrl` + `Shift` + `E`
* **버튼:** 왼쪽 도구 모음의 **'Explain Execution Plan'** 아이콘 클릭

## 3. Visual Explain 읽는 법

DBeaver는 실행 계획을 트리 구조의 그래프로 보여줍니다. 여기서 주의 깊게 봐야 할 포인트는 다음과 같습니다.

* **Node Color/Icon:** 빨간색 아이콘이나 'Full Table Scan' 문구가 보인다면 인덱스를 타지 못하고 있다는 경고입니다.
* **Cost (비용):** 숫자가 높을수록 해당 단계에서 자원을 많이 소모한다는 뜻입니다.
* **Rows:** 해당 단계에서 처리하는 예상 행 수입니다. 실제 데이터 양보다 너무 크다면 쿼리 조건(WHERE)을 검토해야 합니다.

## 4. 튜닝 시나리오 예시

1. **Full Scan 발견:** 특정 컬럼으로 필터링하는데 `Full Scan`이 뜬다면 해당 컬럼에 인덱스가 있는지 확인합니다.
2. **Using Temporary / Using Filesort:** 정렬(`ORDER BY`)이나 그룹핑(`GROUP BY`) 시 이 메시지가 뜬다면 메모리가 아닌 디스크를 사용하여 매우 느려질 수 있습니다. 복합 인덱스를 고려해야 합니다.

---

### 정리

가벼운 데이터 확인은 **Sequel Ace**에서 하더라도, 성능이 중요한 쿼리를 짤 때는 반드시 **DBeaver**의 `Visual Explain`을 켜는 습관을 들여보세요. 텍스트로만 보던 `EXPLAIN` 결과보다 훨씬 직관적으로 튜닝 포인트를 잡을 수 있습니다.
