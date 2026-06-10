---
title: 쉘 스크립트 백그라운드로 실행하는 방법
description: Running Shell Script in Background
date: 2022-04-07
category: Development
tags:
  - "shell"
  - "bash"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop"
---

shell script를 background로 실행하려면 다음과 같이 입력할 수 있습니다.

```sh
nohup script.sh >script.out 2>script.err &
```

`script.sh`를 실행하는 도중 output 이 있다면 script.out 파일로 저장이 되고, 에러 메세지는 script.err 파일에 저장이 됩니다.


만약 일반적인 출력과 에러 메세지를 하나의 파일에 저장되도록 하려면 다음과 같이 하면 됩니다.

```sh
nohup script.sh >script.out 2>&1 &
```

경우에 따라서 output을 저장하고 싶지 않을 때도 있습니다. 그럴때는 아래와 같이 `/dev/null`로 출력을 redirect 하면 됩니다.

```shell
nohup script >/dev/null 2>&1 &
```
