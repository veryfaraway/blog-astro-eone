---
title: "tmux 가이드 #3: 한 장으로 끝내는 핵심 단축키 요약 (Cheatsheet)"
description: tmux를 쓰면서 매번 구글링하기 귀찮으셨죠? 가장 자주 쓰는 필수 단축키를 상황별로 정리했습니다.
date: 2026-01-12
category: Tools
tags:
  - "iterm2"
  - "tmux"
  - "terminal"
  - "macos"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1503551723145-6c040742065b-v2?q=80&w=2370&auto=format&fit=crop"
---

tmux는 강력하지만 단축키가 익숙해지기까지 시간이 걸립니다. 이 포스트를 즐겨찾기 해두고 필요할 때마다 꺼내 보세요! 
*(모든 단축키는 본인의 설정에 따라 `Ctrl+b` 또는 `Ctrl+a`인 **Prefix**를 먼저 누른 후 입력해야 합니다.)*

## 1. 세션(Session) 관리 - 프로젝트 단위
| 기능 | 단축키 / 명령어 |
| :--- | :--- |
| 새 세션 생성 | `tmux new -s [이름]` |
| 세션 이름 변경 | `Prefix` + `$` |
| 세션 목록 보기/이동 | `Prefix` + `s` |
| 세션 나가기 (Detach) | `Prefix` + `d` |
| 마지막 세션 다시 접속 | `tmux attach` |

## 2. 윈도우(Window) 관리 - 탭 기능
| 기능 | 단축키 |
| :--- | :--- |
| 새 윈도우 생성 | `Prefix` + `c` |
| 다음/이전 윈도우 이동 | `Prefix` + `n` / `p` |
| 윈도우 번호로 이동 | `Prefix` + `0~9` |
| 윈도우 이름 변경 | `Prefix` + `,` |
| 윈도우 종료 | `Prefix` + `&` |

## 3. 패널(Pane) 관리 - 화면 분할
| 기능 | 단축키 |
| :--- | :--- |
| 세로 화면 분할 | `Prefix` + `%` (또는 설정한 `|`) |
| 가로 화면 분할 | `Prefix` + `"` (또는 설정한 `-`) |
| 패널 간 이동 | `Prefix` + `방향키` |
| 현재 패널 전체화면 전환 | `Prefix` + `z` (강력 추천!) |
| 패널 번호 보이기 | `Prefix` + `q` |
| 패널 종료 | `Prefix` + `x` |

## 4. 스크롤 및 복사 (Copy Mode)
tmux에서는 마우스 휠이 가끔 먹히지 않을 때가 있습니다.
1. `Prefix` + `[` 입력: 복사 모드 진입
2. 방향키나 Page Up/Down으로 스크롤
3. `q` 눌러서 빠져나오기

> **Pro Tip:** 지난 포스트에서 설정한 `set -g mouse on` 옵션을 사용 중이라면 마우스 휠로도 스크롤이 가능합니다!
