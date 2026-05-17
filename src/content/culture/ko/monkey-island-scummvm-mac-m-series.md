---
title: Mac M 시리즈에서 원숭이 섬의 비밀 실행하기 — ScummVM 설치 가이드
description: "Apple Silicon Mac에서 1990년 고전 어드벤처 게임을 실행하는 방법. ScummVM 설치부터 GOG.com 게임 파일 등록, 한글 자막 설정까지 단계별로 안내합니다."
date: 2026-05-06
category: 컨트롤이 안 되면 머리로
tags:
  - "고전게임"
  - "어드벤처게임"
  - "루카스아츠"
  - "원숭이섬의비밀"
  - "ScummVM"
draft: false
lang: ko
thumbnail: "https://static0.xdaimages.com/wordpress/wp-content/uploads/2024/07/scummvm-feature-image.png"
---

> 35년 된 게임을 2024년형 맥에서 돌린다. 생각보다 훨씬 간단하다.

## 이 글에서 다루는 내용

- ScummVM이 무엇인지, 왜 필요한지
- Mac M 시리즈(Apple Silicon)에서 ScummVM 설치하는 방법
- GOG.com에서 합법적으로 게임 파일을 구매하고 등록하는 방법
- 화면 설정과 조작 팁

---

## ScummVM이 필요한 이유

《원숭이 섬의 비밀》은 1990년 DOS 환경에서 만들어진 게임이다. 당연히 macOS에서 바로 실행되지 않는다. 여기서 등장하는 구원자가 **ScummVM**이다.

ScummVM은 루카스아츠, 시에라를 비롯한 수십 개 회사의 고전 어드벤처 게임을 현대 OS에서 실행할 수 있도록 해주는 오픈소스 에뮬레이터다. 이름의 SCUMM은 앞서 소개 포스트에서 언급한 바로 그 엔진, 루카스아츠의 SCUMM 엔진에서 따왔다.

Apple Silicon Mac, 즉 M1/M2/M3/M4 칩 계열을 탑재한 맥에서도 네이티브로 동작하는 ARM 빌드를 공식 지원한다. 별도의 Rosetta 설정이나 복잡한 환경 세팅 없이, 그냥 설치하고 게임 파일만 연결하면 된다.

<div class="alert alert-info">
<p class="alert-title">💡 ScummVM이 지원하는 게임 목록이 궁금하다면?</p>

[scummvm.org/compatibility](https://www.scummvm.org/compatibility/)에서 전체 목록을 확인할 수 있다. 원숭이 섬 시리즈 외에도 《그림 판당고》, 《풀 스로틀》, 《인디아나 존스》 시리즈 등 루카스아츠의 명작들이 가득하다.

</div>

---

## 게임 파일 준비: GOG.com에서 합법 구매

ScummVM은 에뮬레이터지, 게임 자체를 포함하고 있지 않다. 게임 파일은 별도로 준비해야 한다. 가장 깔끔하고 합법적인 방법은 **GOG.com**에서 구매하는 것이다.

GOG(Good Old Games)는 DRM 없는 고전 게임을 판매하는 플랫폼으로, 《원숭이 섬의 비밀》을 포함한 루카스아츠 어드벤처 게임 여러 편을 저렴한 가격에 구매할 수 있다.

**구매 절차**

1. [gog.com](https://www.gog.com)에 접속해 계정을 만든다
2. "Monkey Island" 또는 "Secret of Monkey Island"로 검색
3. **The Secret of Monkey Island: Special Edition**을 구매 (할인 시 $2~3 수준)
4. 구매 후 GOG Galaxy 앱 또는 오프라인 인스톨러로 게임 파일 다운로드

<div class="alert alert-warning">
<p class="alert-title">⚠️ Special Edition vs. 오리지널</p>

GOG에서 판매하는 버전은 2009년 리마스터된 Special Edition이다. ScummVM으로 실행할 때는 게임 설치 폴더 안의 오리지널 파일(`MONKEY.000`, `MONKEY.001` 등)을 사용한다. Special Edition 자체 실행 파일이 아닌, 데이터 파일을 ScummVM에 연결하는 방식이다.

</div>

---

## ScummVM 설치

### 1단계: ScummVM 다운로드

[scummvm.org/downloads](https://www.scummvm.org/downloads/)에 접속한다.

**macOS** 섹션에서 **Apple Silicon(ARM64)** 빌드를 선택해 다운로드한다. 파일명은 `ScummVM-X.X.X-arm64.dmg` 형태다.

<div class="alert alert-success">
<p class="alert-title">✅ Intel Mac 사용자</p>

Intel Mac을 사용 중이라면 같은 페이지에서 **x86-64** 빌드를 받으면 된다. 이 가이드의 나머지 설치 과정은 동일하게 적용된다.

</div>

### 2단계: 설치

다운로드한 `.dmg` 파일을 열고, ScummVM 아이콘을 Applications 폴더로 드래그한다. 일반적인 macOS 앱 설치와 동일하다.

처음 실행 시 "인터넷에서 다운로드한 앱"이라는 경고가 뜰 수 있다. **시스템 설정 → 개인 정보 보호 및 보안 → 보안** 섹션에서 "확인 없이 열기"를 선택하면 된다.

### 3단계: 게임 추가

ScummVM을 실행하면 다음과 같은 메인 화면이 나타난다.

```text
┌─────────────────────────────────┐
│  ScummVM                        │
│                                 │
│  [Add Game...]  [Start]         │
│                                 │
│  게임 목록 (현재 비어 있음)           │
└─────────────────────────────────┘
```

**Add Game...** 버튼을 클릭한 후, GOG에서 설치한 게임 폴더를 선택한다.

GOG Galaxy로 설치했다면 기본 경로는 다음과 같다:

```
~/Library/Application Support/GOG.com/Games/Secret of Monkey Island Special Edition/
```

폴더를 선택하면 ScummVM이 내부 파일을 자동으로 인식하고 게임 정보를 표시한다. **Add** 버튼을 눌러 목록에 추가한다.

---

## 실행 및 기본 설정

### 화면 설정

게임을 추가한 뒤 목록에서 선택하고 **Edit Game** → **Graphics** 탭을 열면 렌더링 옵션을 조정할 수 있다.

| 설정 항목 | 권장값 | 설명 |
|---|---|---|
| Graphics Mode | OpenGL | 고해상도 맥 디스플레이에 최적 |
| Render Mode | Default | 오리지널 그래픽 유지 |
| Stretch Mode | Fit to window | 창 크기에 맞게 자동 조정 |
| Scaler | HQ3x 또는 HQ2x | 픽셀 보간으로 그래픽을 부드럽게 |

레트로 감성을 살리고 싶다면 Scaler를 **Normal(no scaling)** 으로 두는 것도 좋다. 픽셀 아트 원본의 질감이 그대로 살아있다.

### 사운드 설정

1990년대 게임인 만큼 사운드 옵션도 다양하다. **Edit Game** → **Audio** 탭에서 조정한다.

| 옵션 | 설명 |
|---|---|
| Music Driver | MT-32 에뮬레이션 (가능한 경우) 또는 AdLib |
| AdLib | 가장 널리 쓰이던 사운드카드 방식. 익숙하고 안정적 |
| MT-32 | 당시 고급 사운드카드. 더 풍부한 음색이지만 롬 파일 필요 |

특별한 설정 없이 기본값으로 실행해도 게임 진행에 전혀 문제없다.

---

## 조작 방법

ScummVM에서 《원숭이 섬의 비밀》을 실행하면 화면 하단에 동사 버튼들이 늘어서 있다. 기본 조작은 다음과 같다.

| 조작 | 설명 |
|---|---|
| 좌클릭 | 이동 / 동사 선택 / 대상 선택 |
| 우클릭 | 현재 선택한 동사로 즉시 실행 |
| F5 | 메인 메뉴 (저장 / 불러오기) |
| Ctrl + S | 빠른 저장 |
| Ctrl + F5 | ScummVM 전역 메뉴 |

<div class="alert alert-success">
<p class="alert-title">✅ 세이브는 자주 하자</p>

게임 오버는 없지만, 특정 퍼즐의 분기점 전에 저장해두면 다양한 선택지를 실험해볼 수 있어 더 재미있다. ScummVM은 저장 슬롯을 넉넉하게 지원한다.

</div>

---

## 실행 확인

모든 설정을 마쳤다면 ScummVM 목록에서 게임을 선택하고 **Start** 버튼을 누른다.

루카스아츠 로고가 뜨고, 카리브해의 파도 소리와 함께 타이틀 화면이 나타나면 성공이다. 가이브러시 스렙우드의 여정을 시작할 준비가 됐다.

혹시 게임이 실행되지 않거나 오류가 발생한다면, ScummVM 공식 포럼([forums.scummvm.org](https://forums.scummvm.org))에서 대부분의 문제에 대한 해결책을 찾을 수 있다. 커뮤니티가 크고 활발해서 웬만한 문제는 검색으로 해결된다.

---

## 다음 편 예고

설치가 끝났으니 이제 본격적으로 게임을 시작할 차례다. 다음 편부터는 공략으로 넘어간다.

멜레이 섬에 도착한 가이브러시는 해적이 되기 위해 세 가지 시험을 통과해야 한다. 검술 대결, 도둑질, 그리고 사람 찾기. 하나하나 이야기하듯 풀어나갈 예정이다.
