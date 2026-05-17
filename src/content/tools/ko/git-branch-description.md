---
title: Git 브랜치에 설명(Description)을 달고 확인하는 방법
description: "git branch 명령어로만은 부족한 브랜치 관리, 설명을 추가하고 Alias로 한눈에 확인하는 꿀팁을 소개합니다."
date: 2026-01-14
category: Tools
tags:
  - "git"
  - "alias"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2676&auto=format&fit=crop"
---

# Git 브랜치, 이름만으론 부족하다면? 설명(Description) 활용법

수많은 `feature/` 브랜치 사이에서 어떤 브랜치가 무슨 작업을 위한 것이었는지 헷갈린 적 없으신가요? Git 브랜치에 직접 설명을 달고, 이를 효율적으로 확인하는 방법을 정리했습니다.

## 1. 표준 Git Description 기능 활용

Git은 개별 브랜치에 메타데이터 성격의 설명을 저장할 수 있는 기능을 제공합니다.

- 설명 등록하기
```bash
git config branch.<브랜치명>.description "로그인 페이지 리팩토링 및 검증 로직 추가"
```

- 설명 확인하기

아쉽게도 기본 `git branch` 명령으로는 이 내용이 보이지 않습니다. 아래 명령어로 저장된 모든 설명을 조회할 수 있습니다.

```bash
git config --get-regexp "branch.*.description"
```

---

##  2. 추천: 최신 커밋과 함께 보는 Alias 설정

실무에서는 일일이 설명을 등록하기보다, 브랜치명 옆에 최신 커밋 메시지가 바로 뜨게 만드는 것이 훨씬 직관적입니다.

전역 Alias 등록

터미널에 아래 명령어를 한 줄로 입력하세요.

```bash
git config --global alias.br "branch --format='%(HEAD) %(color:yellow)%(refname:short)%(color:reset) - %(contents:subject) (%(color:green)%(committerdate:relative)%(color:reset))'"
```

확인하기

이제 `git br`만 입력하면 다음과 같이 출력됩니다.

• `* feature/login - 로그인 API 연동 완료 (2 hours ago)`

• `  hotfix/a - 보안 취약점 패치 (3 days ago)`

---

## 3. 결론: 어떤 방식이 좋을까?

• 특정한 상세 메모가 꼭 필요하다면 `git config`의 `description` 기능을 사용하세요.

• 전반적인 작업 흐름을 빠르게 파악하고 싶다면 `git br` Alias를 설정해 사용하는 것을 강력 추천합니다.

이 작은 설정 하나가 여러분의 커밋 히스토리와 브랜치 관리를 훨씬 쾌적하게 만들어 줄 것입니다!
