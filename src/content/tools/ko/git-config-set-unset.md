---
title: "Git Configuration 명령어: set과 unset 옵션 설명"
description: Git Configuration 값을 설정하고 해제하는 방법을 설명합니다.
date: 2023-05-08
category: Tools
tags:
  - "git"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3"
---

Git은 버전 관리 시스템으로 널리 사용되며, 사용자의 환경에 맞게 설정할 수 있는 다양한 옵션을 제공합니다. 이를 위해 Git은 `git config` 명령어를 제공합니다. 이 명령어를 사용하여 사용자별로 또는 프로젝트별로 Git의 동작을 조정할 수 있습니다. 그 중에서도 `set`과 `unset` 옵션은 특히 중요한데요, 이 둘에 대해 자세히 알아보겠습니다.

### `git config set`

`git config set` 명령어는 Git의 설정을 변경하거나 새로운 설정을 추가하는 데 사용됩니다. 이 명령어를 사용하면 Git의 설정 파일에 값을 설정할 수 있습니다. 보통은 이를 통해 사용자 이름, 이메일 주소, 에디터 설정, 코어 설정 등을 변경합니다.

예를 들어, 사용자 이름을 설정하는 방법은 다음과 같습니다:

```bash
git config --global user.name "Your Name"
```

위 명령어는 Git의 전역 설정 파일에 사용자 이름을 설정합니다. `--global` 플래그는 전역 설정을 의미하며, 모든 저장소에서 동일한 사용자 이름이 사용됩니다.

또한, 프로젝트별로 설정을 변경하고 싶다면 `--local` 옵션을 사용할 수 있습니다:

```bash
git config --local user.name "Your Name"
```

이 명령어는 현재 작업 중인 Git 저장소에 대한 설정을 변경합니다.

### `git config unset`

반면에, `git config unset` 명령어는 설정에서 값을 제거하는 데 사용됩니다. 이를 통해 이전에 설정한 값을 제거하고 기본값을 사용하거나 다른 값으로 설정할 수 있습니다.

예를 들어, 이메일 주소를 설정한 후 이를 제거하고 싶다면 다음과 같이 합니다:

```bash
git config --global --unset user.email
```

위 명령어는 Git의 전역 설정 파일에서 사용자 이메일 주소를 제거합니다. 이제 Git은 사용자 이메일 주소에 대해 기본값을 사용하게 됩니다.

---

Git 설정은 Git을 효율적으로 사용하기 위해 매우 중요합니다. `git config set`과 `git config unset` 명령어를 사용하여 개인 설정을 손쉽게 관리할 수 있습니다. Git의 동작을 원하는 대로 조정하여 작업 흐름을 최적화할 수 있습니다.
