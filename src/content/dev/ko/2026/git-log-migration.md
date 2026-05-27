---
title: "Git 브랜치 히스토리 오염 시, 특정 파일만 안전하게 복구하고 새 브랜치로 옮기기"
description: "Main 브랜치의 히스토리가 비정상적으로 변경되었을 때, 당황하지 않고 git reflog를 통해 정상 시점을 찾아 수정된 파일들만 새 브랜치로 이관하는 실무 가이드입니다."
date: 2026-01-05
category: DevOps
tags:
  - "git"
  - "github"
  - "conflict"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=3432&auto=format&fit=crop"
---

## 🛑 상황 발생: Main 히스토리가 꼬였다!

협업 중 `main` 브랜치의 히스토리가 강제로 변경(Force Push 등)되면, 기존에 작업하던 `feature` 브랜치에서 `rebase`나 `merge`를 시도할 때 내가 수정하지도 않은 수많은 파일에서 충돌(Conflict)이 발생합니다.

이런 경우, 기존 브랜치를 포기하고 **내가 작업한 "알맹이(수정 파일)"만 골라내어 새로운 브랜치에 이식**하는 것이 가장 빠르고 안전한 해결책입니다.

---

## 1. 정상이었던 마지막 지점(Hash) 찾기

가장 먼저 할 일은 `main` 브랜치가 오염되기 전, 내 로컬에서 정상적으로 동작했던 마지막 커밋 해시를 찾는 것입니다.

### git reflog 활용

`git log`에는 나오지 않는 로컬의 포인터 이동 이력을 확인합니다.

```bash
git reflog main

```

* 목록에서 `pull` 혹은 `merge`가 일어나기 직전, 내가 기억하는 정상적인 상태의 **7자리 해시값**을 복사해둡니다. (예: `a1b2c3d`)

---

## 2. 변경된 파일 목록 확인하기

이제 정상 시점(`a1b2c3d`)을 기준으로, 내가 현재 작업 중인 `feature/a` 브랜치에서 **어떤 파일들이 수정되었는지** 목록을 뽑아봅니다.

```bash
# 상태와 함께 보기 (A: 추가, M: 수정, D: 삭제)
git diff --name-status a1b2c3d..feature/a

# 파일 경로만 깔끔하게 보기
git diff --name-only a1b2c3d..feature/a

```

---

## 3. 새 브랜치 생성 및 파일 이식하기

오염된 히스토리를 버리고, 깨끗한 최신 `main`에서 새 브랜치를 만들어 작업 내용을 가져옵니다.

### ① 새 브랜치 생성

```bash
git checkout main
git pull origin main
git checkout -b feature/a2

```

### ② 특정 파일만 "쏙" 가져오기 (`git checkout`)

수동으로 코드를 복사할 필요 없이, 기존 브랜치(`feature/a`)의 특정 파일 상태를 그대로 가져옵니다.

```bash
git checkout feature/a -- 경로/파일명.js

```

* 이 명령어를 실행하면 해당 파일은 `feature/a`의 최종 상태로 바뀌며, 즉시 **Staging** 상태가 됩니다.

### ③ (팁) 변경된 파일이 많을 때 한꺼번에 가져오기

파일이 너무 많다면 `xargs`를 조합해 한 번에 처리할 수 있습니다.

```bash
git diff --name-only a1b2c3d..feature/a | xargs git checkout feature/a --

```

---

## 4. 마무리 및 커밋

가져온 파일들이 새로운 `main` 환경에서도 잘 동작하는지 테스트한 후, 깔끔하게 커밋을 남깁니다.

```bash
git add .
git commit -m "feat: feature/a 브랜치로부터 작업 내용 복구 및 이관"
git push origin feature/a2

```

---

## 💡 요약 정리

1. **`git reflog`**: 문제가 생기기 전의 정상 해시를 찾는다.
2. **`git diff --name-only`**: 내가 실제로 수정한 파일이 무엇인지 파악한다.
3. **`git checkout [기존브랜치] -- [파일]`**: 새 브랜치에서 필요한 파일만 골라 담는다.

이 방법은 히스토리가 복잡하게 꼬였을 때 무리하게 `rebase`로 해결하려다 시간을 버리는 대신, **결과물(코드)에만 집중하여 문제를 해결**할 수 있는 매우 유용한 전략입니다.
