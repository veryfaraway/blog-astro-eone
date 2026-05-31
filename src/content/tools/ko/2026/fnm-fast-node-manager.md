---
title: fnm - 빠르고 간단한 Node.js 버전 관리자
description: Rust로 작성된 초고속 Node.js 버전 관리 도구 fnm의 설치부터 활용까지 완벽 가이드
date: 2025-12-01
category: Development
tags:
  - "nodejs"
  - "fnm"
  - "version-manager"
  - "devtools"
draft: false
lang: ko
thumbnail: "https://repository-images.githubusercontent.com/166045424/8289ae80-d301-11e9-9417-c43aeaee86a2"
---

## fnm - 빠르고 간단한 Node.js 버전 관리자

fnm(Fast Node Manager)은 Rust로 작성된 빠르고 간단한 Node.js 버전 관리 도구입니다. nvm보다 훨씬 빠른 속도와 크로스 플랫폼 지원이 특징입니다.

### fnm이란?

fnm은 여러 Node.js 버전을 쉽게 설치하고 전환할 수 있게 해주는 도구입니다. 프로젝트마다 다른 Node.js 버전이 필요할 때 매우 유용합니다.

#### 주요 특징

- **빠른 속도**: Rust로 작성되어 nvm보다 20배 이상 빠름
- **크로스 플랫폼**: Windows, macOS, Linux 모두 지원
- **.nvmrc 지원**: 기존 nvm 프로젝트와 호환
- **자동 전환**: 디렉토리 이동 시 자동으로 Node 버전 전환
- **간단한 설치**: 단일 바이너리로 설치 간편

### OS별 설치 방법

#### macOS

Homebrew를 사용한 설치가 가장 간단합니다.

```bash
# Homebrew로 설치
brew install fnm

# 설치 확인
fnm --version
```

쉘 설정 파일에 다음을 추가합니다.

```bash
# ~/.zshrc 또는 ~/.bashrc
eval "$(fnm env --use-on-cd)"
```

#### Linux

curl을 사용하여 설치 스크립트를 실행합니다.

```bash
# 설치 스크립트 실행
curl -fsSL https://fnm.vercel.app/install | bash

# 설치 확인
fnm --version
```

쉘 설정 파일에 다음을 추가합니다.

```bash
# ~/.bashrc 또는 ~/.zshrc
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env --use-on-cd)"
```

#### Windows

PowerShell 또는 Chocolatey를 사용할 수 있습니다.

##### PowerShell 사용

```powershell
# 관리자 권한으로 PowerShell 실행
winget install Schniz.fnm

# 또는 Chocolatey 사용
choco install fnm
```

##### 환경 변수 설정

PowerShell 프로필에 다음을 추가합니다.

```powershell
# PowerShell 프로필 열기
notepad $PROFILE

# 다음 내용 추가
fnm env --use-on-cd | Out-String | Invoke-Expression
```

### Node.js 설치 방법

fnm을 설치했다면 이제 Node.js를 설치할 수 있습니다.

#### 최신 LTS 버전 설치

```bash
# 최신 LTS 버전 설치
fnm install --lts

# 설치된 버전 확인
fnm list
```

#### 특정 버전 설치

```bash
# 특정 버전 설치
fnm install 20.10.0
fnm install 18.19.0
fnm install 16.20.2

# 최신 20.x 버전 설치
fnm install 20
```

#### 설치된 버전 사용

```bash
# 특정 버전으로 전환
fnm use 20.10.0

# 기본 버전 설정
fnm default 20.10.0

# 현재 버전 확인
node --version
```

### 자주 사용하는 fnm 명령어

#### 버전 관리

```bash
# 설치 가능한 모든 버전 보기
fnm list-remote

# 설치된 버전 목록
fnm list

# 현재 사용 중인 버전
fnm current

# 특정 버전 제거
fnm uninstall 16.20.2
```

#### 프로젝트별 버전 관리

```bash
# .nvmrc 또는 .node-version 파일 생성
echo "20.10.0" > .node-version

# 파일에 명시된 버전 설치 및 사용
fnm install
fnm use

# 자동 전환 활성화 (쉘 설정에 추가)
eval "$(fnm env --use-on-cd)"
```

#### 별칭(Alias) 사용

```bash
# 별칭 생성
fnm alias 20.10.0 my-project

# 별칭으로 전환
fnm use my-project

# 별칭 목록 보기
fnm alias
```

### 알아두면 좋은 고급 기능

#### 1. 자동 버전 전환

디렉토리 이동 시 자동으로 Node 버전을 전환합니다.

```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
eval "$(fnm env --use-on-cd)"
```

이제 `.node-version` 또는 `.nvmrc` 파일이 있는 디렉토리로 이동하면 자동으로 해당 버전으로 전환됩니다.

#### 2. 멀티쉘 지원

fnm은 다양한 쉘을 지원합니다.

```bash
# Bash
eval "$(fnm env --use-on-cd --shell bash)"

# Zsh
eval "$(fnm env --use-on-cd --shell zsh)"

# Fish
fnm env --use-on-cd --shell fish | source

# PowerShell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

#### 3. 로그 레벨 설정

문제 해결 시 유용한 디버그 모드입니다.

```bash
# 디버그 모드로 실행
fnm --log-level=debug install 20.10.0

# 조용한 모드
fnm --log-level=quiet install 20.10.0
```

#### 4. 커스텀 설치 디렉토리

기본 설치 위치를 변경할 수 있습니다.

```bash
# 환경 변수 설정
export FNM_DIR="$HOME/.config/fnm"
eval "$(fnm env --use-on-cd)"
```

#### 5. Corepack 지원

Yarn, pnpm 등의 패키지 매니저를 쉽게 사용할 수 있습니다.

```bash
# Corepack 활성화
corepack enable

# pnpm 사용
corepack prepare pnpm@latest --activate

# Yarn 사용
corepack prepare yarn@stable --activate
```

### 실전 활용 예제

#### 프로젝트 설정 예제

```bash
# 새 프로젝트 시작
mkdir my-project && cd my-project

# Node 버전 지정
echo "20.10.0" > .node-version

# 해당 버전 설치 및 사용
fnm install
fnm use

# package.json 생성
npm init -y

# 의존성 설치
npm install express
```

#### CI/CD 환경에서 사용

GitHub Actions에서 fnm 사용 예제:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install fnm
        run: |
          curl -fsSL https://fnm.vercel.app/install | bash
          echo "$HOME/.local/share/fnm" >> $GITHUB_PATH
      
      - name: Install Node.js
        run: |
          eval "$(fnm env)"
          fnm install
          fnm use
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

### nvm에서 fnm으로 마이그레이션

기존 nvm 사용자라면 쉽게 전환할 수 있습니다.

```bash
# 1. fnm 설치 (위의 OS별 설치 방법 참고)

# 2. 기존 nvm 버전 확인
nvm list

# 3. fnm으로 동일한 버전 설치
fnm install 20.10.0
fnm install 18.19.0

# 4. 기본 버전 설정
fnm default 20.10.0

# 5. 쉘 설정 업데이트
# nvm 관련 설정 제거하고 fnm 설정 추가
eval "$(fnm env --use-on-cd)"

# 6. (선택) nvm 제거
rm -rf ~/.nvm
```

### 문제 해결

#### 명령어를 찾을 수 없음

쉘 설정이 제대로 되지 않은 경우입니다.

```bash
# 쉘 설정 파일 다시 로드
source ~/.zshrc  # 또는 ~/.bashrc

# fnm 경로 확인
which fnm

# 수동으로 환경 변수 설정
eval "$(fnm env)"
```

#### 버전 전환이 안 됨

자동 전환 기능이 활성화되지 않은 경우입니다.

```bash
# --use-on-cd 옵션 추가 확인
eval "$(fnm env --use-on-cd)"
```

#### Windows에서 권한 오류

PowerShell 실행 정책을 변경해야 할 수 있습니다.

```powershell
# 관리자 권한으로 실행
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### fnm vs nvm 비교

| 특징 | fnm | nvm |
|------|-----|-----|
| 속도 | 매우 빠름 (Rust) | 느림 (Bash) |
| Windows 지원 | 네이티브 지원 | nvm-windows 필요 |
| 크로스 플랫폼 | 완벽 지원 | 제한적 |
| .nvmrc 지원 | 지원 | 지원 |
| 자동 전환 | 지원 | 추가 설정 필요 |
| 설치 크기 | 작음 (~3MB) | 큼 |

### 마치며

fnm은 빠르고 간단하며 크로스 플랫폼을 완벽하게 지원하는 현대적인 Node.js 버전 관리 도구입니다. nvm에서 마이그레이션을 고려하고 있다면, 또는 처음 Node.js 버전 관리 도구를 선택한다면 fnm을 강력히 추천합니다.

특히 Windows 환경에서 개발하거나, 여러 OS를 오가며 작업하는 개발자에게 fnm은 최고의 선택이 될 것입니다. 빠른 속도와 간편한 사용법으로 개발 생산성을 크게 향상시킬 수 있습니다.
