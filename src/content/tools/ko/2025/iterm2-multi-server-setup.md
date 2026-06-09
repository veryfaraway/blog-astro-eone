---
title: "iTerm2로 여러 서버를 편하게 관리하기: Profiles · Toolbelt · Password Manager · SSH config · 1Password 연동"
description: "iTerm2에서 Profiles, Toolbelt, Password Manager, SSH config를 활용해 여러 서버 SSH 접속을 효율적으로 관리하고, 3.5 버전의 1Password·LastPass 연동으로 비밀번호를 안전하게 자동 로그인하는 방법을 정리한 글입니다."
date: 2025-12-31
category: Tools
tags:
  - "iterm2"
  - "ssh"
  - "password-manager"
  - "macos"
draft: false
lang: ko
thumbnail: "https://iterm2.com/img/logo2x.jpg"
---

맥을 개발용 메인 머신으로 쓰다 보면, **여러 서버로의 SSH 접속을 얼마나 빠르고 안전하게 관리하느냐**가 생산성에 큰 영향을 줍니다. 이 글에서는 iTerm2의 Profiles, Toolbelt, Password Manager, SSH config를 조합해서 “SecureCRT 세션 매니저”에 가까운 워크플로우를 구성하고, iTerm2 3.5에서 추가된 1Password·LastPass 연동까지 활용하는 방법을 정리합니다.

## iTerm2 간략 소개

iTerm2는 macOS 기본 터미널을 대체하는 고급 터미널 에뮬레이터로, 탭/스플릿, 프로필, 트리거, 툴벨트 등 다양한 기능을 제공합니다.  
특히 SSH를 자주 쓰는 개발자에게 유용한 기능은 다음과 같습니다.

- Profiles: 서버별/업무별로 폰트, 색상, 시작 명령(예: `ssh user@host`)을 저장하는 프로필 기능.
- Toolbelt: 창 오른쪽에 Profiles, Paste History, Jobs, Notes 등을 띄워놓고 한 번의 클릭으로 프로필을 실행할 수 있는 사이드 패널.
- Password Manager: SSH 비밀번호를 안전하게 저장하고, 패스워드 프롬프트에 자동으로 입력해 주는 내장 비밀번호 관리 기능.
- Triggers: 출력된 텍스트를 정규식으로 매칭해서, 패스워드 프롬프트에서 Password Manager를 호출하는 등 자동화를 구성할 수 있는 기능.

이 글에서는 이 네 가지 기능에 SSH config까지 얹어서 “여러 서버를 빠르게 선택·접속·자동 로그인”하는 구성을 만드는 것이 목표입니다.

## Profiles + Toolbelt로 서버 그룹 관리

### 1. 서버 그룹 설계 (개발/테스트/운영)

먼저 서버를 논리적으로 그룹핑합니다.

- `dev-*`: 개발 서버
- `stg-*`: 스테이징/테스트 서버
- `prod-*`: 운영 서버

각 그룹마다 iTerm2 Profile을 별도로 만들고, 이름/색상/배지(badge)로 시각적인 구분을 강하게 넣어 두는 것이 포인트입니다.

예를 들어:

- `DEV - app01`
- `STG - app01`
- `PROD - app01`

처럼 이름을 통일된 규칙으로 맞춰주면, 나중에 검색/자동 전환에서도 유리합니다.

### 2. 프로필 기본 설정

메뉴 `iTerm2 → Settings(Preferences) → Profiles`에서 `+`를 눌러 새 프로필을 만듭니다.

예시: 개발 서버 프로필

- General 탭
  - Name: `DEV - app01`
  - Tags: `dev`, `app`, `ssh`
  - Command: `ssh devuser@app01.dev.example.com`
- Colors 탭
  - Presets에서 상대적으로 밝은 색 테마 선택 (예: Solarized Light 변형)
- Text 탭
  - 개발/테스트/운영별로 폰트 스타일을 살짝 다르게 줄 수도 있음 (예: 운영은 폰트를 살짝 크게).
- Window 탭
  - Open Toolbelt: 체크 (이 프로필로 창을 열면 Toolbelt가 자동으로 열리도록).
- Advanced 탭
  - Badge: `DEV` / `STG` / `PROD` 등으로 세팅

이런 식으로 `DEV-*`, `STG-*`, `PROD-*` 각 서버에 대한 프로필을 만들어 둡니다.

### 3. Toolbelt에서 프로필 빠르게 실행

프로필을 만들었다면, Toolbelt를 통해 “클릭 한 번으로 접속”할 수 있게 합니다.

- `View → Toolbelt → Show Toolbelt` 를 선택해 Toolbelt를 켭니다.
- `View → Toolbelt → Profiles` 를 체크해 Toolbelt에 Profiles 패널을 추가합니다.

이제 창 오른쪽에 Profiles 목록이 나타나고, 여기서 `DEV - app01`을 더블 클릭하면 해당 프로필로 새 탭/창/스플릿을 생성할 수 있습니다.  
SecureCRT의 Session Manager와 비슷한 UX를 제공하므로, 여러 서버를 번갈아 다닐 때 상당히 편리합니다.

## SSH config + Dynamic Profiles로 대량 서버 관리

개별 프로필을 수십 개, 수백 개 만들다 보면 관리가 귀찮아집니다. 이 때는 `~/.ssh/config`를 “단일 소스”로 두고, 이 파일을 기반으로 iTerm2 Dynamic Profiles를 생성하는 스크립트를 사용하는 것이 좋습니다.

### 1. SSH config 예시

```
Host dev-app01
  HostName app01.dev.example.com
  User devuser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_dev

Host stg-app01
  HostName app01.stg.example.com
  User stguser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_stg

Host prod-app01
  HostName app01.prod.example.com
  User produser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_prod
```

여기서 `Host` 이름(`dev-app01`, `stg-app01`, `prod-app01`)이 곧 iTerm2 프로필 이름이 됩니다.

### 2. ssh config → iTerm2 Dynamic Profiles

`ssh-to-iterm2`, `ssh2iterm2` 같은 도구를 사용하면 SSH config를 읽어서 iTerm2 Dynamic Profiles JSON을 자동 생성할 수 있습니다.

- `~/.ssh/config` 파일을 읽어서
- 각 `Host` 항목을 iTerm2 프로필로 변환
- `Command`를 자동으로 `ssh host-alias` 형식으로 설정

이 방식의 장점:

- SSH config만 잘 관리하면, iTerm2 프로필은 자동으로 따라옴.
- Git으로 SSH config를 버전 관리하거나, 팀원과 공유하기 편함.

## Password Manager로 자동 로그인 구성

프로필/SSH config가 “어느 서버에 어떤 계정으로 들어가느냐”를 관리한다면, Password Manager는 “비밀번호를 어떻게 안전하고 편하게 넣느냐”를 담당합니다.

### 1. Password Manager 기본 사용

- 메뉴 `Window → Password Manager` 를 열어 비밀번호 항목을 추가합니다.
- 각 서버용 계정을 아래처럼 등록:

예시:

- Name: `dev-app01`
- Username: `devuser`
- Password: `********`

Password Manager는 기본적으로 macOS 키체인을 백엔드로 사용하여 비밀번호를 암호화 저장합니다.

### 2. Triggers로 패스워드 자동 입력

SSH 접속 시 `password:` 프롬프트가 나오면 자동으로 Password Manager에서 해당 항목을 선택해 넣도록 설정할 수 있습니다.

- `Settings → Profiles → (예: DEV - app01) → Advanced 탭 → Triggers → Edit`.
- `+`로 새 트리거 추가
  - Regular Expression: `password:\s*$`
  - Action: `Open Password Manager`
  - Parameters: `dev-app01` (Password Manager에 저장한 항목 이름)
  - Instant: 체크

이렇게 하면 `password:`가 출력되자마자 Password Manager가 `dev-app01` 항목을 찾아 현재 세션에 비밀번호를 자동 입력합니다.

## iTerm2 3.5: 1Password·LastPass 백엔드 사용

3.5 버전부터 iTerm2 Password Manager는 더 이상 macOS 키체인에만 의존하지 않고, 1Password·LastPass를 백엔드로 사용할 수 있습니다.  
즉, “터미널 전용 비밀번호 저장소”가 아니라, 이미 쓰고 있는 패스워드 매니저의 금고를 그대로 가져다 쓰는 구조가 됩니다.

### 1. 1Password/LastPass 백엔드 활성화

1. 1Password 또는 LastPass CLI를 설치합니다. (예: 1Password의 `op` CLI).
2. iTerm2에서 `Window → Password Manager`를 엽니다.
3. 검색창 오른쪽에 있는 `…` 버튼을 클릭합니다.
4. Backend를 `Keychain`에서 `1Password` 또는 `LastPass`로 변경합니다.

이제 Password Manager는 신규/기존 항목을 macOS 키체인이 아니라 1Password/LastPass 금고와 동기화합니다.

### 2. 1Password에서 iTerm2용 항목 태그 지정

iTerm2와 1Password의 통합은 태그 기반으로 동작합니다.

- 1Password 항목에 `iTerm2` 태그를 추가하면, iTerm2 Password Manager에서 해당 항목을 볼 수 있습니다.
- OTP(2FA 코드)를 붙이지 않고 비밀번호만 쓰고 싶다면, `iTerm2-no-otp` 같은 태그를 활용해 iTerm2 쪽 동작을 제어할 수 있습니다.

예시:

- 이름: `prod-app01`
- 사용자 이름: `produser`
- 비밀번호: `********`
- 태그: `iTerm2`, `prod`, `ssh`

iTerm2 Password Manager에서 `prod-app01` 항목을 선택하면, 실제 저장·동기화는 1Password가 담당합니다.

### 3. Triggers + 1Password 조합 예시

앞서 만든 `password:` 트리거에 동일한 이름(`prod-app01`)의 1Password 항목을 연결하면, SSH 접속 시 1Password 금고에 저장된 비밀번호가 자동으로 들어가게 됩니다.

- 운영 서버 비밀번호를 바꾸더라도 1Password 한 곳에서만 업데이트하면 됨.
- 브라우저/모바일에서도 같은 계정을 사용할 수 있고, Watchtower 같은 기능으로 보안 점검까지 가능.

## Profiles Theme/Badge 팁: 개발/테스트/운영 시각적으로 구분하기

운영 서버에 실수로 명령을 날리는 위험을 줄이려면, “현재 어느 환경에 접속해 있는지”를 시각적으로 강하게 보여주는 것이 좋습니다.

### 1. Colors Preset으로 환경별 테마 분리

`Settings → Profiles → (각 프로필) → Colors`에서 Presets를 환경별로 구분합니다.

- DEV: 밝은 계열 테마 (예: Solarized Light 변형, 연한 배경색)
- STG: 중간 톤 테마 (예: 약간 어두운 그레이)
- PROD: 아주 어두운 테마 (예: Solarized Dark, Dracula 등)

이렇게 하면 탭의 배경색만 봐도 어느 환경인지 직관적으로 눈에 들어옵니다.

### 2. Badge로 환경을 직관적으로 표시

`Profiles → Advanced → Badge`에서 환경 이름을 적어둡니다.

- DEV: `DEV`
- STG: `STG`
- PROD: `PROD ⚠`

Badge는 터미널 상단에 반투명한 배너로 표시되므로, 운영 서버에는 아이콘(⚠) 같은 걸 붙여서 긴장감을 높이는 것도 좋습니다.

### 3. Automatic Profile Switching 활용

SSH config와 Dynamic Profiles를 쓴다면, “어느 호스트에 접속했는지”에 따라 자동으로 프로필(색상/배지)을 바꾸는 기능도 사용할 수 있습니다.

- `Profiles → Advanced → Automatic Profile Switching`에서 호스트 패턴을 지정.
- 예:
  - `DEV` 프로필: `Hostnames: *.dev.example.com`
  - `STG` 프로필: `Hostnames: *.stg.example.com`
  - `PROD` 프로필: `Hostnames: *.prod.example.com`

이렇게 설정하면, 동일한 탭/창에서도 접속 대상에 따라 테마/배지가 자동으로 바뀌어 시각적 피드백을 제공합니다.

## 마무리

이 글에서 정리한 구성은 대략 다음과 같은 워크플로우를 목표로 합니다.

1. `~/.ssh/config`에서 서버/계정/키를 표준화해 관리.
2. Dynamic Profiles 또는 수동 Profiles로 iTerm2 프로필을 생성.
3. Toolbelt의 Profiles 패널에서 서버를 클릭해 빠르게 접속.
4. Password Manager + Triggers로 비밀번호를 자동 입력.
5. iTerm2 3.5 이후라면, 백엔드를 1Password·LastPass로 바꿔 전체 비밀번호 관리 체계와 통합.
6. Colors/Badge/Automatic Profile Switching으로 DEV/STG/PROD 환경을 강하게 구분.

SecureCRT의 세션 매니저가 그리웠다면, 이 조합으로 macOS에서도 꽤 비슷한 수준의 “여러 서버 관리 + 안전한 자동 로그인” 경험을 만들 수 있습니다.
