---
title: iTerm2 Password Manager 사용해보자
description: iTerm2 3.0에 새로 추가된 Password Manager 사용방법을 설명합니다.
date: 2022-02-07
category: Tools
tags:
  - "macos"
  - "terminal"
  - "iterm2"
  - "password-manager"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1615775036480-f0cff4e2ff6d?q=80&w=2940&auto=format&fit=crop"
---

맥용 터미널 에뮬레이터 [iTerm2][1]가 얼마전 3.0 버전으로 업데이트 됐습니다. iTerm3로 발표될 줄 알았는데 버전이 3.0으로 올라갔습니다.

비록 공짜지만 [SecureCRT](https://www.vandyke.com/products/securecrt/)에 비해 좀 아쉬웠는데 이번 업데이트는 SecureCRT를 잊어도 될 정도로 강력한 기능들이 많이 추가가 됐습니다.

이번에는 그 중에서도 Password Manager에 대해서 알아보려고 합니다.

패스워드 매니저는 매번 패스워드를 입력할 필요없이 맥의 키체인과 연계해 계정별 암호를 관리하고 자동으로 입력할 수 있도록 도와줍니다.

## 사용방법

![Password Manager](https://cdn-std.droplr.net/files/acc_503345/UkU4aj)

사용방법은 간단합니다. 우선 메뉴에서 `Window > Password Manager`를 선택하거나 단축키 ⌥⌘F (Command-Option-F)를 눌러서 패스워드 매니저를 호출합니다.

아래쪽 `+` 버튼을 누르면(1) 새로운 계정을(New Account) 추가할 수 있습니다. ssh 로그인에 필요한 계정을 입력하고(2) 해당 패스워드를 입력합니다.(3)

계정을 선택하고 아래쪽에 있는 `Enter Password` 버튼(4)을 눌르면 터미널에 패스워드가 입력됩니다.

![계정추가 하기](https://cdn-std.droplr.net/files/acc_503345/pHf1Ia)

이후 아래와 같이 패스워드 입력이 필요할때(로그인, 패키지 설치 등) 바로 패스워드를 입력하지 말고 패스워드 매니저를 호출한(⌥⌘F) 다음 해당 계정을 선택하고 `enter`키를 누릅니다.

```sh
$ ssh root@192.168.1.4
root@192.168.1.4's password:
```

관리할 계정이 많을 수록 더 편리하게 사용할 수 있습니다. 하지만 그래도 좀 뭔가 아쉽네요.

## 패스워드 자동(?)으로 입력하기

이번에는 Trigger 기능을 활용해서 패스워드가 자동으로 입력이 되도록 해볼께요.

패스워드 자동 입력을 원하는 서버의 프로파일을 열고(⌘O) 해당 프로파일의 수정화면에서 오른쪽 끝 Advanced 탭을 선택합니다.

![Open Profile](https://cdn-std.droplr.net/files/acc_503345/lE1M1R)

그리고 첫번째 Triggers에서 `Edit` 버튼을 클릭합니다.

우선 root@로 시작하고 password:으로 끝나는 문장이 나오면 패스워드가 자동으로 입력이 되도록 해볼께요.

1. Regular Expression에 `\broot@.*password:\s` 라고 입력합니다.
2. Action에 Open Password Manager를 선택합니다.
3. Parameter에서 password manager에서 입력해둔 계정을 선택할 수 있는데 root를 선택합니다. (계정이 입력되어 있지 않으면 패스워드 매니저를 열어서 입력해둡니다)
4. `Instant`에 체크를 합니다.

![Trigger](https://cdn-std.droplr.net/files/acc_503345/HkSPiE)

입력이 끝났으면 방금 입력한 프로파일을 열어서 해당서버로 접속해보세요.
iTerm2의 Triggers에 대해서는 [여기](https://www.iterm2.com/documentation-triggers.html)를 클릭하면 더 자세한 내용을 볼 수 있습니다.

**_프로파일 특성에 트리거 항목을 추가한 것이라 다른 프로파일에서는 해당 트리거 이벤트가 발생하지 않습니다._**

여기서도 한가지 아쉬운 점이 있는데 패스워드 입력 문구가 나왔을때 자동으로 해당 패스워드가 입력되는 것이 아니고 패스워드 매니저가 트리거되고 해당 계정에 포커스가 맞춰지는 것 까지만 자동으로 실행이 됩니다. 고로 엔터키를 사용자가 수동으로 눌러줘야 패스워드가 입력이 됩니다.

추후 업데이트 때에는 좀 더 편리하게 변경이 되기를 기대해 봅니다.

- - -

## 참조

* [iTerm2 홈페이지][1]
* [Regular expression Wikipedia](https://en.wikipedia.org/wiki/Regular_expression)
* [Regular expression 위키](https://ko.wikipedia.org/wiki/정규_표현식)
* [Regular expression Tester](https://regexr.com)

[1]: https://www.iterm2.com/
