---
title: "Git Merge vs Rebase: 브랜치 통합의 완벽한 이해"
description: "Git의 merge와 rebase 명령어를 완벽하게 이해하고, 각 상황에 맞는 올바른 선택을 할 수 있도록 시각적인 비교 가이드를 제공합니다."
date: 2025-12-29
category: DevOps
tags:
  - "git"
  - "merge"
  - "rebase"
  - "git-workflow"
  - "version-control"
  - "devops"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2676&auto=format&fit=crop"
---

Git을 사용하면서 `merge`와 `rebase` 중에 어떤 것을 써야 할지 고민한 적이 있으신가요? 두 명령어 모두 브랜치를 통합하는 방식이지만, 작동 방식과 결과가 완전히 다릅니다. 이 가이드에서는 시각적인 예제를 통해 두 방식을 완벽하게 이해하고, 어떤 상황에서 어떤 명령어를 사용해야 하는지 알아봅시다.

---

## 1. Git Merge와 Rebase란?

### 1.1 Git Merge (병합)

**Merge**는 두 개의 브랜치를 하나의 커밋으로 통합하는 방식입니다. 원본 브랜치의 히스토리는 보존되며, 모든 변경사항을 하나의 "머지 커밋"으로 묶어서 기록합니다.

**특징:**
- ✅ 원본 브랜치의 히스토리가 완전히 보존됨
- ✅ 작업 흐름을 명확하게 추적 가능
- ⚠️ 커밋 히스토리가 복잡해질 수 있음

### 1.2 Git Rebase (재배치)

**Rebase**는 한 브랜치의 베이스(기반)를 다른 브랜치의 최신 커밋으로 변경하는 방식입니다. 커밋 히스토리를 "재작성"하여 선형적인 히스토리를 만듭니다.

**특징:**
- ✅ 선형적이고 깔끔한 커밋 히스토리
- ✅ 히스토리 추적이 쉬움
- ⚠️ 공유 브랜치에서는 위험할 수 있음

---

## 2. 시각적 비교: Merge vs Rebase

### 2.1 초기 상태

작업을 시작할 때의 브랜치 구조를 살펴봅시다.

```
main    A---B---C
         \
feature   D---E
```

**설명:**
- `main` 브랜치: A, B, C 커밋이 있음
- `feature` 브랜치: D, E 커밋이 있음 (A를 기반으로 생성됨)

### 2.2 Merge로 통합

`main` 브랜치에서 `git merge feature` 실행:

```
main    A---B---C---M (머지 커밋)
         \       /
feature   D-----E
```

**결과:**
- 새로운 **머지 커밋 M**이 생성됨
- 모든 커밋의 순서가 보존됨
- 브랜치의 존재가 히스토리에 기록됨
- 순환 구조(diamond pattern)가 형성됨

**커밋 로그:**
```
M - Merge branch 'feature' into 'main'
C - Commit C
E - Commit E
D - Commit D
B - Commit B
A - Commit A
```

### 2.3 Rebase로 통합

`feature` 브랜치에서 `git rebase main` 실행:

```
main    A---B---C
         \
feature   D'--E'
```

그 다음 `main`에서 `git merge feature`:

```
main    A---B---C---D'---E'
```

**결과:**
- **새로운 커밋 D', E'**이 생성됨 (원본 D, E와 다른 해시)
- 선형적인 히스토리 형성
- 모든 커밋이 한 줄로 정렬됨
- 브랜치 통합이 전혀 보이지 않음

**커밋 로그:**
```
E' - Commit E (rebased)
D' - Commit D (rebased)
C - Commit C
B - Commit B
A - Commit A
```

---

## 3. 상세 명령어 가이드

### 3.1 Merge 사용법

#### 기본 merge
```bash
# feature 브랜치를 현재 브랜치(main)에 병합
git merge feature
```

#### Fast-Forward Merge (빠른 병합)

만약 main 브랜치에 새로운 커밋이 없다면:

```
main    A---B
         \
feature   C---D
```

이 경우 `git merge feature`는 자동으로 fast-forward merge를 수행합니다:

```
main    A---B---C---D
```

**새로운 머지 커밋이 생성되지 않음**

#### Fast-Forward 방지
```bash
# 항상 머지 커밋을 생성
git merge --no-ff feature
```

#### 3-way Merge (일반적인 merge)

```
main    A---B---C
         \     /
feature   D---E
```

이 경우는 자동으로 3-way merge를 수행하고 머지 커밋을 생성합니다.

### 3.2 Rebase 사용법

#### 기본 rebase
```bash
# feature 브랜치를 main 브랜치 위에 재배치
git rebase main feature
```

또는:
```bash
# feature 브랜치에서 실행
git checkout feature
git rebase main
```

#### Interactive Rebase (대화형 리베이스)

여러 커밋을 정리하면서 리베이스:

```bash
# 최근 3개의 커밋을 대화형으로 리베이스
git rebase -i HEAD~3
```

**가능한 옵션:**
```
pick   ef12345  Commit message 1
reword d4a6789  Commit message 2
squash a2b3456  Commit message 3
```

- `pick`: 커밋 유지
- `reword`: 커밋 메시지 수정
- `squash`: 이전 커밋과 합치기
- `fixup`: 이전 커밋과 합치기 (메시지 폐기)
- `drop`: 커밋 삭제

---

## 4. 실전 시나리오별 선택 가이드

### 4.1 공유 리포지토리에서 작업할 때

**❌ Rebase 사용 금지!**

```bash
# 금지된 방식 (팀에 혼란 야기)
git push origin feature
git rebase main
git push origin feature --force  # 위험!
```

**✅ Merge 사용:**

```bash
# 올바른 방식
git merge main
git push origin feature
```

**이유:**
- 공유 브랜치에서 히스토리를 재작성하면 다른 사람들의 작업과 충돌
- `git push --force`는 다른 사람의 변경사항을 덮어쓸 수 있음

### 4.2 로컬 개인 브랜치에서 작업할 때

**✅ Rebase 사용 권장:**

```bash
# 깔끔한 히스토리 유지
git checkout feature
git rebase main
git checkout main
git merge --ff-only feature
```

**이유:**
- 자신의 작업만 영향을 받음
- 메인 브랜치의 히스토리가 깔끔함

### 4.3 장기 기능 브랜치(Long-lived branch)

**✅ Merge 사용:**

```bash
# 예: release/v1.0 브랜치
git merge main
git push origin release/v1.0
```

**이유:**
- 여러 사람이 함께 작업할 가능성 높음
- 브랜치 통합 과정이 명확해야 함

### 4.4 커밋 정리 후 메인에 병합할 때

**✅ 먼저 Rebase로 정리, 그 다음 Merge:**

```bash
# 로컬 feature 브랜치
git rebase -i main feature

# main 브랜치에서
git merge --no-ff feature
```

결과:
```
main    A---B---C---M
                 \  /
feature           D'---E'
```

---

## 5. Merge와 Rebase 충돌 처리

### 5.1 Merge 충돌

```bash
$ git merge feature
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

**충돌 표시:**
```javascript
// file.txt 내용
function example() {
<<<<<<< HEAD
  return "main branch version";  // 현재 브랜치 (main)
=======
  return "feature branch version";  // 병합할 브랜치 (feature)
>>>>>>> feature
}
```

**해결 방법:**
```bash
# 1. 충돌 해결
# file.txt를 수정하여 원하는 버전 선택

# 2. 스테이징
git add file.txt

# 3. 커밋
git commit -m "Merge branch 'feature': resolve conflicts"
```

### 5.2 Rebase 충돌

```bash
$ git rebase main
First, rewinding head to replay your work on top of main...
Applying: Commit D
error: could not apply d123456... Commit D
hint: Resolve all conflicts manually
```

**충돌 표시:**
```javascript
// 충돌은 merge와 동일하게 표시됨
<<<<<<< HEAD
  ...
=======
  ...
>>>>>>> branch-name
```

**해결 방법:**
```bash
# 1. 충돌 해결 (파일 수정)

# 2. 스테이징
git add file.txt

# 3. Rebase 계속
git rebase --continue

# 모든 충돌 해결 후 자동으로 커밋됨
```

**Rebase 취소:**
```bash
# Rebase 중단
git rebase --abort
```

---

## 6. 실전 워크플로우 예제

### 6.1 Pull Request 스타일의 Merge 워크플로우

이 방식은 GitHub, GitLab 등에서 권장합니다:

```bash
# 1. feature 브랜치 생성
git checkout -b feature/new-auth
git commit -m "Add authentication"
git commit -m "Add JWT support"

# 2. 로컬에서 main과 동기화
git fetch origin
git rebase origin/main

# 3. 푸시
git push origin feature/new-auth

# 4. Pull Request 생성 (UI에서)
# PR 검토 후 merge commit을 통해 병합

# 5. 원격 브랜치 동기화
git checkout main
git pull origin main

# 6. 로컬 feature 브랜치 삭제
git branch -d feature/new-auth
```

**결과:**
```
main    A---B---C---M (PR merge commit)
```

### 6.2 정리된 히스토리를 원할 때

```bash
# 1. feature 브랜치 생성
git checkout -b feature/optimization
git commit -m "Fix performance issue"
git commit -m "Add caching"
git commit -m "Optimize query"

# 2. 로컬에서 정리
git rebase -i main

# Interactive rebase에서:
# pick d1 Fix performance issue
# squash d2 Add caching  
# squash d3 Optimize query

# 3. 최종적으로 하나의 커밋으로 통합

# 4. main에서 병합
git checkout main
git merge --ff-only feature/optimization
```

**결과:**
```
main    A---B---C---D' (한 개의 최적화 커밋)
```

---

## 7. 베스트 프랙티스

### ✅ Merge를 사용해야 할 때
1. **공유 브랜치에서 작업할 때** (main, develop, release)
2. **여러 개발자가 함께 작업하는 브랜치**
3. **브랜치 통합 과정을 기록해야 할 때**
4. **Pull Request 기반의 워크플로우**
5. **장기간 운영되는 브랜치** (release, hotfix)

### ✅ Rebase를 사용해야 할 때
1. **로컬 개인 브랜치에서만 작업할 때**
2. **공개되지 않은 커밋들을 정리할 때**
3. **선형적인 히스토리를 원할 때**
4. **커밋 메시지를 수정해야 할 때**
5. **지난 커밋들을 squash할 때**

### ⚠️ Rebase 할 때 주의사항

**절대 하지 말 것:**
```bash
# 공유 브랜치를 rebase 후 강제 푸시
git rebase main
git push --force  # 위험!
```

**안전한 방식:**
```bash
# 로컬 브랜치만 rebase
git push --force-with-lease  # 더 안전함
# 또는 그냥 merge 사용
```

---

## 8. 유용한 Git 설정

### 8.1 기본 병합 전략 설정

```bash
# merge 시 항상 머지 커밋 생성
git config --global pull.ff false
```

### 8.2 Rebase를 기본으로 설정

```bash
# pull 시 자동 rebase (로컬 저장소만 권장)
git config pull.rebase true
```

### 8.3 Git 로그를 더 읽기 쉽게

```bash
# Graph 형식의 로그 표시
git log --graph --oneline --all
git log --graph --oneline --decorate --all

# 별칭 설정
git config --global alias.lg "log --graph --oneline --all"
git lg  # 간단히 사용 가능
```

---

## 9. 자주 묻는 질문 (FAQ)

### Q1: Merge와 Rebase 중 뭘 써야 하나요?
**A:** 공유 브랜치에서는 **merge**, 개인 브랜치에서는 **rebase**를 사용하세요.

### Q2: 이미 Rebase한 커밋을 되돌릴 수 있나요?
**A:** `git reflog`로 원래 커밋을 찾아 되돌릴 수 있습니다:
```bash
git reflog
git checkout <원래-커밋-해시>
```

### Q3: Merge와 Rebase를 섞어서 써도 되나요?
**A:** 가능하지만 복잡해집니다. 팀과 규칙을 정하고 일관되게 사용하세요.

### Q4: 공개 저장소에 rebase한 내용을 푸시했어요. 어떻게 하나요?
**A:** `git revert`를 사용하여 되돌리세요:
```bash
git revert <원본-커밋-해시>
git push origin main
```

---

## 10. 마치며

Git의 `merge`와 `rebase`는 서로 다른 목적을 가진 도구입니다:

- **Merge**: "무엇을 언제 통합했는가"를 기록하는 **히스토리 보존형**
- **Rebase**: "어떻게 결과에 도달했는가"를 깔끔하게 정리하는 **히스토리 선형화형**

올바른 상황에서 올바른 도구를 선택하면, 팀과의 협업이 훨씬 더 효율적이고 명확해집니다. 이 가이드가 여러분의 Git 작업을 더욱 자신감 있게 만드는 데 도움이 되기를 바랍니다!

---

## 참고 자료

- [Git 공식 문서 - Merge](https://git-scm.com/docs/git-merge)
- [Git 공식 문서 - Rebase](https://git-scm.com/docs/git-rebase)
- [Git 공식 튜토리얼 - Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
