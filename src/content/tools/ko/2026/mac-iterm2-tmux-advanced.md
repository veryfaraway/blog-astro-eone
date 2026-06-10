---
title: "tmux 가이드 #4: Vim/Neovim 유저를 위한 심화 연동 (Seamless Navigation)"
description: tmux 패널과 Neovim 창 사이를 마치 하나의 프로그램처럼 자유롭게 넘나드는 설정을 알아봅니다.
date: 2026-01-13
category: Development
tags:
  - "iterm2"
  - "tmux"
  - "terminal"
  - "macos"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=2148&auto=format&fit=crop"
series: "tmux 가이드"
series_order: 4
---

터미널 기반 개발자의 최종 목적지는 결국 **tmux + Neovim**의 조합입니다. 하지만 tmux 패널 사이를 이동할 때는 `Ctrl+a + 방향키`를 쓰고, Neovim 창 사이를 이동할 때는 `Ctrl+w + hjkl`을 쓰는 것은 매우 번거롭습니다.

오늘은 이 두 도구 사이의 벽을 허무는 방법을 소개합니다.

## 1. 목표: 동일한 단축키로 이동하기

`Ctrl + hjkl` 단축키 하나로 Neovim의 분할 창과 tmux의 패널을 구분 없이 이동하는 설정을 구성합니다.

## 2. tmux 플러그인 설치

먼저 `~/.tmux.conf`에 아래 플러그인을 추가하고 설치(`Prefix + I`)합니다.

```bash
set -g @plugin 'christoomey/vim-tmux-navigation'

```

## 3. Neovim(Vim) 설정

Neovim 설정 파일(`init.lua` 또는 `init.vim`)에도 대응하는 플러그인을 설치해야 합니다. (packer, lazy.nvim 등 본인의 플러그인 매니저 사용)

**lazy.nvim 예시:**

```lua
{
  "christoomey/vim-tmux-navigator",
  cmd = {
    "TmuxNavigateLeft",
    "TmuxNavigateDown",
    "TmuxNavigateUp",
    "TmuxNavigateRight",
    "TmuxNavigatePrevious",
  },
  keys = {
    { "<c-h>", "<cmd><C-U>TmuxNavigateLeft<cr>" },
    { "<c-j>", "<cmd><C-U>TmuxNavigateDown<cr>" },
    { "<c-k>", "<cmd><C-U>TmuxNavigateUp<cr>" },
    { "<c-l>", "<cmd><C-U>TmuxNavigateRight<cr>" },
  },
}

```

## 4. 왜 이 설정이 중요한가요?

이 설정이 완료되면 코딩 중에 왼쪽 패널(Neovim)에서 오른쪽 패널(터미널 로그 창)로 넘어갈 때, 별도의 Prefix 입력 없이 `Ctrl + l` 한 번으로 즉시 이동할 수 있습니다.

마치 **Neovim과 터미널이 하나의 IDE(통합 개발 환경)처럼 작동**하게 되는 것이죠.

## 5. 추가 팁: 배경색 통일하기

tmux 위에서 Vim을 실행할 때 배경색이 어색하게 변한다면, `~/.tmux.conf`에 아래 설정을 확인하세요.

```bash
set -g default-terminal "screen-256color"
set -as terminal-features ",xterm-256color:RGB"

```

이것으로 4편에 걸친 tmux 시리즈를 마칩니다. 이제 여러분의 터미널은 단순한 입력창이 아니라, 세상에서 가장 효율적인 개발 전용 공간이 되었습니다!
