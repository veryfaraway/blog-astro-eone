---
title: mv 명령으로 디렉토리 이동시 덮어쓰기
description: 대상 디렉토리가 비어있지 않은 경우에 mv 명령으로 디렉토리 이동 방법
date: 2022-04-01
category: Tools
tags:
  - "shell"
  - "rsync"
  - "mv"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1600725935160-f67ee4f6084a?q=80&w=2940&auto=format&fit=crop"
---

<pre>
├── group
│     ├── member1
│     └── member2
└── member1
</pre>

예를 들어 위와 같은 디렉토리 구조일 때 아래 명령처럼 `member1` 디렉토리를 `group` 아래로 이동하려고 하려고 합니다. 

```sh
mv member1/ group/
```

이때 `group/member1` 디렉토리에 파일이 존재한다면 아래와 같이 `Directory not empty` 에러가 발생하면서 이동을 할 수가 없습니다. 

<pre>
mv: cannot move `member1/' to `group/member1': Directory not empty
</pre>

-f(--force) 옵션을 줘도 마찬가지입니다.

mv 명령으로는 해결 방법을 못 찾았고 아래와 같이 rsync 명령 후 rm 명령을 병행해서 써서 해결했습니다.

```
rsync -a member1/ group/member1/
rm -rf member1/
```
