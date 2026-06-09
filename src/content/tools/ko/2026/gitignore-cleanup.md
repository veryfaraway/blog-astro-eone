---
title: .gitignore 수정 후 이미 올라간 파일 정리하는 네 가지 패턴
description: ".gitignore를 뒤늦게 수정했는데 이미 GitHub에 올라간 파일이 있을 때, 가장 많이 쓰는 네 가지 정리 패턴을 예시와 함께 정리했습니다. 작은 개인 레포부터 협업 레포, 그리고 민감 정보가 섞인 경우까지 상황별로 어떤 방법을 써야 덜 위험하고 덜 귀찮은지 정리해 두면 나중에 삽질을 줄일 수 있습니다."
date: 2026-01-04
category: Tools
tags:
  - "git"
  - "gitignore"
  - "github"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?q=80&w=2370&auto=format&fit=crop"
---

프로젝트를 하다 보면 `.gitignore`를 나중에 추가하거나, 제대로 설정하지 못해서 의도치 않은 파일들이 GitHub에 올라가는 일이 자주 생긴다.
이 글에서는 그런 상황에서 `.gitignore`를 고친 뒤, 이미 커밋·푸시된 파일들을 어떻게 정리할 수 있는지 가장 많이 쓰는 패턴들을 정리한다.

***

## 기본 개념: “추적 중인 파일”과 .gitignore

먼저 한 가지를 짚고 가야 한다.

- `.gitignore`는 “새로 추적하려는 파일”에만 영향을 준다.
- 이미 한 번 `git add`를 해서 Git이 추적(tracked) 중인 파일은, `.gitignore`에 추가해도 자동으로 무시되지 않는다.

그래서 흔한 상황이 이렇게 생긴다.

1. `.idea/`, `node_modules/`, 빌드 산출물 같은 것들을 모르고 `git add .` 해버린다.  
2. 나중에야 `.gitignore`를 추가/수정한다.  
3. 그런데 여전히 커밋 목록에 계속 등장한다.

이때 필요한 개념이 바로 `git rm --cached`(추적만 끊고, 로컬 파일은 유지)이다.

***

## 패턴 1: 전체 캐시 비우고 다시 등록 (개인 레포용)

가장 자주 공유되는 “한 방에 해결” 방식이다.
개인 레포이거나, 아직 히스토리가 많지 않을 때 특히 편하다.

### 명령어 패턴

```bash
# 1. .gitignore 수정 및 저장
#    예: node_modules, 빌드 폴더, IDE 설정 등 추가
#    .gitignore 예시는 아래에 따로 정리

# 2. 인덱스(캐시) 전체 비우기
git rm -r --cached .

# 3. 다시 전체 추가
git add .

# 4. 커밋
git commit -m "Apply .gitignore"

# 5. 필요하면 푸시
git push origin main
```

- `git rm -r --cached .` : Git이 “추적 중”이라고 기억하던 파일 목록을 전부 지운다. (로컬 파일은 그대로 남음)
- 그 다음 `git add .`를 하면, `.gitignore` 규칙을 반영한 상태로 다시 추적할 파일 목록이 정해진다.

### 예시: Vue + Spring Boot 프로젝트

예를 들어, 다음과 같은 `.gitignore`를 새로 작성했다고 해보자.

```gitignore
# Node
node_modules/
dist/
*.log

# IntelliJ / IDE
.idea/
*.iml

# Build
target/
out/
build/
```

위처럼 `.gitignore`를 저장한 뒤, 아까 패턴대로:

```bash
git rm -r --cached .
git add .
git commit -m "Apply .gitignore for build & IDE files"
git push origin main
```

이렇게 하면 `node_modules/`, `target/`, `.idea/` 같은 폴더는 Git이 더 이상 추적하지 않고, 이후 커밋에도 안 끼어든다.

### 언제 쓰면 좋은가

- 개인 레포 / 혼자 쓰는 레포  
- 히스토리가 많지 않음  
- “어떤 파일이 잘못 올라갔는지 하나하나 고르기 귀찮을 때”  
- 지금 스테이징 상태를 한 번 싹 비워도 문제 없을 때

이때는 이 패턴이 생각하기도 쉽고, 실수 여지도 적어서 가장 **편한** 선택지다.

***

## 패턴 2: 특정 파일(혹은 폴더)만 추적 해제

레포가 커지거나, 협업 중인 레포에서는 전체를 건드리는 것이 부담스러울 수 있다.
이때는 “문제 되는 파일만 골라서 Git이 잊게 만들기” 패턴을 쓰는 게 낫다.

### 명령어 패턴

- 파일 하나만 추적 해제

```bash
git rm --cached path/to/file
git commit -m "Stop tracking path/to/file (ignored)"
git push origin main
```

- 폴더 전체 추적 해제

```bash
git rm -r --cached path/to/dir/
git commit -m "Stop tracking path/to/dir (ignored)"
git push origin main
```

여기서 중요한 점:

- `--cached` 옵션을 쓰면 **로컬 파일은 삭제되지 않는다**.  
- Git이 “이 파일은 더 이상 버전 관리 안 할게” 하고 추적만 중단한다.

### 예시: `application-local.yml`만 빼고 싶을 때

예를 들어, Spring Boot 프로젝트에서 `src/main/resources/application-local.yml`을 실수로 올려 버렸고, 나중에 `.gitignore`에 다음을 추가했다고 하자.

```gitignore
# Local config
src/main/resources/application-local.yml
```

이때는 전체 캐시를 날릴 필요까지는 없고, 이렇게만 해도 된다.

```bash
git rm --cached src/main/resources/application-local.yml
git commit -m "Ignore application-local.yml"
git push origin main
```

이후에는 `.gitignore` 규칙 덕분에 앞으로 이 파일은 커밋 목록에 나타나지 않는다.

### 언제 쓰면 좋은가

- 딱 몇 개 파일/폴더만 잘못 올라간 경우  
- 협업 레포라서 스테이징 상태를 통째로 건드리기 부담될 때  
- 레포 크기가 커서 `git rm -r --cached .` / `git add .`가 느린 경우

***

## 패턴 3: 이미 커밋된 민감 정보가 있는 경우 (주의)

여기부터는 “실수로 올려서 지운다” 수준이 아니라, 보안 이슈에 가깝다.
예를 들어:

- AWS 액세스 키  
- 데이터베이스 비밀번호  
- JWT 시크릿  
- 개인 토큰 등

이런 값이 이미 커밋·푸시된 상태라면, 단순히 `.gitignore` + `git rm --cached`만으로는 충분하지 않다.

### 왜냐하면

- Git 히스토리(과거 커밋)에는 여전히 값이 남아 있다.  
- 누군가 레포를 클론해서 과거 커밋을 보면 여전히 볼 수 있다.

그래서 이런 경우에는 “히스토리에서 완전히 지우는 작업”이 필요하다.

### 대표적인 방법들

- `git filter-branch` 또는 더 최신 도구들(`git filter-repo` 등)을 사용해 해당 파일/패턴을 모든 커밋에서 제거
- BFG Repo Cleaner 같은 도구 사용 (민감 정보 제거 전용)

이 작업은:

- 히스토리가 재작성되기 때문에  
- 이미 클론된 다른 사람 레포와 히스토리가 달라지고  
- `git push --force`를 사용해야 할 수 있다.

그래서 협업 레포라면:

- 팀원들과 반드시 사전 조율  
- 히스토리를 다시 맞추는 방법도 안내  
- 이미 유출된 키는 “폐기 후 재발급”이 기본이다.

***

## 패턴 4: 처음부터 .gitignore 잘 쓰는 습관

마지막으로, 이런 일을 줄이려면 프로젝트 시작할 때 `.gitignore`를 어느 정도 정석대로 깔고 가는 습관이 중요하다.

### 추천하는 흐름

1. GitHub에서 템플릿 `.gitignore` 가져오기  
   - 예:  
     - `Node.gitignore`  
     - `Java.gitignore`  
     - `IntelliJ.gitignore` 등
2. 프로젝트 스택에 맞게 합쳐서 한 번에 작성  
3. **그 다음에** `git init`, `git add .`, `git commit` 진행  
4. 중간에 새로운 툴(예: 새로운 IDE, 빌드 도구)을 썼다면 `.gitignore`에 바로바로 추가

### Vue + Spring Boot 기준 예시

```gitignore
# Node / Frontend
node_modules/
dist/
*.log

# Java / Spring Boot
target/
build/
out/
*.class

# IDE
.idea/
*.iml
.vscode/

# OS
.DS_Store
Thumbs.db
```

이 정도만 있어도, 대부분의 “올리면 안 되는 것들”은 자동으로 걸러진다.

***

## 상황별로 어떤 패턴을 쓸지 정리

| 상황                                   | 권장 패턴                          | 비고 |
|----------------------------------------|------------------------------------|------|
| 개인 레포, 막 만든 프로젝트           | 패턴 1: 전체 캐시 비우고 재등록   | 가장 단순하고 기억하기 쉬움 |
| 레포가 크고, 특정 파일만 문제         | 패턴 2: 특정 파일/폴더만 `--cached` | 협업 중일 때도 안전한 편 |
| 이미 비밀번호/토큰이 커밋·푸시됨      | 패턴 3: 히스토리 재작성 + 키 폐기 | 단순 ignore로는 부족 |
| 앞으로 이런 문제를 줄이고 싶을 때     | 패턴 4: 시작할 때 .gitignore 세팅 | GitHub 템플릿 적극 활용 |
