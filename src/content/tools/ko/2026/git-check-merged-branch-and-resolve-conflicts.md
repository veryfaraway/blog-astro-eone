---
title: Git 브랜치 머지 여부 확인하고 충돌 안전하게 해결하기
description: "오래된 feature 브랜치가 main과 stage 중 어디에 머지되었는지 확인하고, 로컬에서 안전하게 충돌을 해결하여 운영 배포하는 방법"
date: 2026-02-03
category: Tools
tags:
  - "git"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1615423263169-36d38558bd53?q=80&w=2369&auto=format&fit=crop"
---

오래된 feature 브랜치를 정리하다 보면 "이 브랜치가 운영(main)에 배포됐었나, 아니면 테스트(stage)에만 있나?" 헷갈릴 때가 있습니다. 특히 운영 배포까지 가야 하는데 충돌이 발생하면 더 조심스러워지죠. 이번 글에서는 브랜치 머지 여부를 확인하고, 로컬에서 안전하게 충돌을 해결하는 방법을 정리했습니다.

## 상황 정리

- **main**: 운영 배포용 브랜치
- **stage**: 테스트 환경 배포용 브랜치
- **feature/my-feature**: 오래 전에 작업했던 feature 브랜치

이 feature 브랜치가 main과 stage 중 어디에 머지되었는지 기억이 안 나는 상황입니다.

## 1단계: 브랜치 머지 여부 확인

### 가장 간단한 방법: `git branch --merged`

먼저 main 브랜치에서 확인합니다.

```bash
git checkout main
git branch --merged
```

여기서 `feature/my-feature`가 목록에 나오면 main에 완전히 머지된 상태입니다.

같은 방식으로 stage에서도 확인합니다.

```bash
git checkout stage
git branch --merged
```

### 결과 해석

- **stage에만 나오고 main에는 없다** → stage에만 머지됨, 아직 운영 배포 안 됨
- **둘 다 나온다** → 이미 운영까지 배포 완료
- **둘 다 안 나온다** → 어디에도 머지 안 된 상태

### 더 정확하게: `git merge-base` 사용

`git branch --merged`가 애매하면 다음 명령으로 확인할 수 있습니다.

```bash
# main 기준 확인
git merge-base main feature/my-feature
git rev-parse feature/my-feature

# stage 기준 확인
git merge-base stage feature/my-feature
git rev-parse feature/my-feature
```

두 명령의 출력(커밋 해시)이 **같으면** 해당 브랜치에 완전히 머지된 상태이고, **다르면** 아직 머지되지 않은 것입니다.

## 2단계: 충돌 없이 main에 머지하기 (stage → main 전체)

stage에 다른 불안정한 변경이 없고, stage 전체를 운영에 올려도 된다면 가장 간단합니다.

```bash
git checkout main
git pull origin main

git merge stage
git push origin main
```

이 방법은 stage의 모든 변경사항을 main에 반영합니다.

## 3단계: 특정 feature 브랜치만 main에 머지하기

stage에 여러 기능이 섞여 있고, `feature/my-feature`만 운영에 배포하고 싶다면:

```bash
git checkout main
git pull origin main

git merge feature/my-feature
```

이때 **충돌이 발생**할 수 있습니다. 특히 오래된 브랜치일수록 main과 코드가 많이 달라져서 충돌 가능성이 높습니다.

## 4단계: 로컬에서 안전하게 충돌 해결하기

PR에서 충돌이 발생하면, 로컬에서 먼저 충돌을 해결한 뒤 깔끔한 상태로 PR을 올리는 게 안전합니다.

### 기본 흐름

```bash
# 1. feature 브랜치로 이동
git checkout feature/my-feature

# 2. 원격 최신 상태 가져오기
git fetch origin

# 3. 최신 main을 feature 브랜치에 머지
git merge origin/main
```

### 충돌 발생 시

충돌이 발생하면 Git이 머지를 중단하고 충돌 파일 목록을 보여줍니다.

```bash
# 4. 충돌 파일 확인
git status
```

### 충돌 해결 과정

1. **충돌 파일 열기**: 에디터나 IDE에서 충돌 파일을 엽니다
2. **충돌 마커 확인**: 다음과 같은 형태로 표시됩니다

```
<<<<<<< HEAD
(현재 브랜치의 코드)
=======
(main 브랜치의 코드)
>>>>>>> origin/main
```

3. **코드 정리**:

   - 어느 한쪽을 선택하거나
   - 둘을 적절히 합쳐서 최종 코드 작성
   - 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`) 모두 삭제

4. **파일 저장 및 스테이징**:

```bash
git add <충돌_해결한_파일>
```

5. **머지 커밋 생성**:

```bash
git commit
# Git이 자동으로 "Merge branch 'main'..." 메시지를 생성해줍니다
```

### 테스트 후 원격에 반영

```bash
# 로컬에서 빌드/테스트 수행
npm test
# 또는 mvn test, gradle test 등

# 원격 브랜치에 푸시
git push origin feature/my-feature
```

이제 해당 브랜치로 main에 PR을 열면 **충돌 없음** 상태로 깔끔하게 보입니다.

## rebase를 사용하는 방법 (선택)

히스토리를 더 깔끔하게 유지하고 싶다면 merge 대신 rebase를 사용할 수 있습니다.

```bash
git checkout feature/my-feature
git fetch origin
git rebase origin/main
```

충돌이 발생하면:

```bash
# 충돌 파일 수정 후
git add <파일명>
git rebase --continue
# 모든 충돌이 해결될 때까지 반복
```

rebase 완료 후:

```bash
git push --force-with-lease origin feature/my-feature
```

**주의**: rebase는 커밋 히스토리를 재작성하므로, 다른 팀원과 공유 중인 브랜치라면 팀 내 합의가 필요합니다.

## 정리

1. **`git branch --merged`** 로 브랜치가 어디에 머지됐는지 확인
2. stage에만 있고 main에는 없다면 → 아직 운영 배포 안 됨
3. main에 머지할 때 충돌 발생 → **로컬에서 먼저 해결**
4. `feature` 브랜치에 `origin/main`을 merge → 충돌 해결 → 테스트 → push
5. 깔끔한 PR로 안전하게 운영 배포

이 방법을 사용하면 오래된 브랜치도 충돌 걱정 없이 안전하게 운영에 배포할 수 있습니다.
