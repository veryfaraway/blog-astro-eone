---
title: GitHub에서 특정 브랜치의 PR 머지 여부 검색하는 방법
description: "GitHub Pull Requests 탭에서 검색 쿼리를 사용하여 특정 브랜치가 어디로 머지되었는지, 머지된 PR이 있는지 빠르게 찾는 방법"
date: 2026-02-06
category: DevOps
tags:
  - "git"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1766074542618-13b6964adf26?q=80&w=2370&auto=format&fit=crop"
---

Git 브랜치를 정리하다 보면 "이 브랜치로 PR을 만들었었나?", "그 PR이 머지됐었나?" 같은 질문이 자주 생깁니다. 특히 오래된 브랜치나 여러 환경(dev, stage, main)으로 배포하는 프로젝트에서는 더욱 헷갈리죠. 다행히 GitHub의 Pull Requests 탭에서는 강력한 검색 쿼리를 지원하여 이런 정보를 빠르게 찾을 수 있습니다.

## 기본: 특정 브랜치에서 나온 PR 찾기

GitHub 리포지토리의 **Pull requests** 탭으로 이동한 뒤, 상단 검색창에 다음과 같이 입력합니다.

```text
is:pr head:feature/my-branch
```

### 쿼리 설명

- `is:pr`: Pull Request만 검색
- `head:feature/my-branch`: 소스 브랜치(From)가 `feature/my-branch`인 PR만 필터링

이 검색은 해당 브랜치를 **출발점으로 만든 모든 PR**을 보여줍니다. 열린 PR, 닫힌 PR, 머지된 PR 모두 포함됩니다.

## 머지된 PR만 보기

특정 브랜치가 **이미 머지되었는지** 확인하려면:

```text
is:pr is:merged head:feature/my-branch
```

### 결과 해석

- **PR이 나온다** → 이 브랜치는 이미 머지되었습니다
- **PR이 안 나온다** → 머지된 적 없거나, PR을 만들지 않았습니다

이 방법으로 "이 브랜치가 운영에 배포됐었나?" 같은 질문에 바로 답할 수 있습니다.

## 상태별로 세분화하기

### 1. 열려있는 PR만

```text
is:open is:pr head:feature/my-branch
```

현재 리뷰 중이거나 대기 중인 PR을 찾습니다.

### 2. 닫혔지만 머지 안 된 PR

```text
is:pr is:closed -is:merged head:feature/my-branch
```

PR을 만들었지만 머지하지 않고 닫은 경우를 찾습니다. `-is:merged`는 "머지되지 않음"을 의미합니다.

## 타겟 브랜치(base) 기준으로 검색하기

특정 브랜치**로** 머지되는 PR을 찾고 싶다면 `base` 필터를 사용합니다.

```text
is:pr base:main
```

이는 **main 브랜치로 머지되는** 모든 PR을 보여줍니다.

### head와 base 조합하기

소스와 타겟 브랜치를 모두 지정하면 더 정확합니다.

```text
is:pr is:merged base:main head:feature/my-branch
```

이 쿼리는 "`feature/my-branch` → `main`"으로 **이미 머지된 PR**만 보여줍니다.

### 실전 예시

stage와 main 중 어디로 머지되었는지 확인하려면:

**stage로 머지되었는지:**

```text
is:pr is:merged base:stage head:feature/my-branch
```

**main으로 머지되었는지:**

```text
is:pr is:merged base:main head:feature/my-branch
```

## 전체 계정/조직에서 검색하기

리포지토리를 넘나들며 검색하고 싶다면 GitHub 전역 검색을 사용합니다.

1. GitHub 상단 메뉴에서 **Pull requests** 클릭 [https://github.com/pulls](https://github.com/pulls)
2. 검색창에 리포지토리 정보 포함:

```text
is:pr is:merged repo:owner/repo-name head:feature/my-branch
```

- `repo:owner/repo-name`: 특정 리포지토리 지정
- 나머지는 동일

이 방법은 여러 리포지토리를 관리할 때 특히 유용합니다.

## 추가 필터 옵션

GitHub PR 검색은 다양한 필터를 지원합니다. 자주 쓰이는 것들:

### 작성자 기준

```text
is:pr author:username head:feature/my-branch
```

특정 사용자가 만든 PR만 검색합니다.

### 날짜 기준

```text
is:pr is:merged merged:>2025-01-01 head:feature/my-branch
```

2025년 1월 1일 이후에 머지된 PR만 검색합니다.

### 리뷰어 기준

```text
is:pr reviewed-by:username head:feature/my-branch
```

특정 사용자가 리뷰한 PR을 찾습니다.

## 실전 시나리오

### 시나리오 1: 오래된 브랜치 정리

로컬에 `feature/old-task` 브랜치가 남아있는데 삭제해도 되는지 확인하려면:

```text
is:pr is:merged head:feature/old-task
```

머지된 PR이 나오면 안심하고 삭제할 수 있습니다.

### 시나리오 2: 배포 여부 확인

`feature/pd-2617` 브랜치가 운영(main)에 배포되었는지 확인:

```text
is:pr is:merged base:main head:feature/pd-2617
```

결과가 없으면 아직 운영 배포 안 된 것입니다.

### 시나리오 3: 테스트 환경에만 있는 기능 찾기

stage에는 머지됐지만 main에는 안 된 브랜치 찾기:

```text
is:pr is:merged base:stage head:feature/my-branch
```

(결과 있음)

```text
is:pr is:merged base:main head:feature/my-branch
```

(결과 없음)

→ 이 브랜치는 테스트 환경에만 배포된 상태입니다.

## 검색 결과 활용하기

검색 결과에서 PR을 클릭하면:

- **Files changed** 탭: 어떤 코드가 변경되었는지 확인
- **Commits** 탭: 커밋 히스토리 확인
- 우측 메타데이터: 누가 승인했는지, 언제 머지되었는지 확인

이 정보들을 통해 "이 브랜치를 삭제해도 되는지", "운영에 반영되었는지" 판단할 수 있습니다.

## 요약 치트시트

| 목적 | 검색 쿼리 |
| ------ | ----------- |
| 특정 브랜치의 모든 PR | `is:pr head:브랜치명` |
| 머지된 PR만 | `is:pr is:merged head:브랜치명` |
| main으로 머지된 PR | `is:pr is:merged base:main head:브랜치명` |
| 열려있는 PR | `is:open is:pr head:브랜치명` |
| 닫혔지만 머지 안 됨 | `is:pr is:closed -is:merged head:브랜치명` |
| 특정 리포지토리 전체 검색 | `is:pr repo:owner/name head:브랜치명` |

## 마치며

GitHub의 PR 검색 기능을 활용하면 브랜치 정리, 배포 이력 추적, 코드 리뷰 현황 파악이 훨씬 쉬워집니다. 특히 `head:`와 `base:` 필터를 조합하면 복잡한 브랜치 전략을 사용하는 프로젝트에서도 "어떤 브랜치가 어디로 머지되었는지" 명확하게 추적할 수 있습니다.

브랜치 관리가 헷갈릴 때는 Git 명령어보다 GitHub UI의 검색 기능을 먼저 활용해보는 것을 추천합니다.
