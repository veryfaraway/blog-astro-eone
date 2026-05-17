---
title: "Git checkout vs switch: 브랜치 관리의 새로운 표준"
description: Git에서 브랜치를 전환하는 두 가지 명령어인 checkout과 switch의 차이점과 사용법을 알아봅니다.
date: 2026-01-13
category: DevOps
tags:
  - "git"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1645743705820-adf8356be3c8?q=80&w=2370&auto=format&fit=crop"
---

Git checkout vs switch: 브랜치 관리의 역할 분담과 활용법
Git 2.23 버전부터 `checkout`의 과도한 책임을 분산하기 위해 `switch`와 `restore`가 도입되었습니다. 이제 브랜치 관리는 더 직관적인 `switch`를 사용하세요!

1. 왜 분리되었나요?
기존의 `git checkout`은 다음과 같은 작업을 모두 수행했습니다.

• 브랜치 전환

• 브랜치 생성 및 전환

• 특정 커밋으로 이동

• 파일 변경 사항 되돌리기 (파일 복구)

이처럼 한 명령어가 너무 많은 역할을 수행하다 보니 사용자가 의도치 않게 파일을 덮어쓰거나 혼란을 겪는 경우가 많았습니다. 이를 해결하기 위해 브랜치 전환은 `switch`로, 파일 복구는 `restore`로 명확히 분리되었습니다.

2. 역할 분담 및 활용 예제
A. 브랜치 전환 (switch)

브랜치를 이동하거나 새로 만들 때 사용합니다.

• 기존 브랜치로 이동

```

git switch feature/a

```

• 새로운 브랜치 생성 후 즉시 이동

```

git switch -c hotfix/emergency

```

• 이전 작업 브랜치로 돌아가기

```

git switch -

```


B. 파일 복구 및 관리 (restore)

작업 디렉토리의 변경 사항을 관리할 때 사용합니다.

• 수정한 파일 원래대로 되돌리기

```

git restore main.js

```

• 스테이징된 파일을 언스테이징(Unstage) 하기

```

git restore --staged README.md

```


3. 요약: 무엇을 써야 할까?

• 브랜치를 옮기거나 만들 때는? `git switch`

• 파일의 수정 내용을 취소하거나 스테이징을 풀 때는? `git restore`

이제 더 이상 복잡한 `checkout` 명령어로 고민하지 마세요!
