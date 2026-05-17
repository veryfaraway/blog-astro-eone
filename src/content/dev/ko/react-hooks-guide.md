---
title: React Hooks 완벽 가이드
description: "useState, useEffect, useContext 등 React Hooks의 모든 것을 알아봅니다."
date: 2025-01-20
category: Frontend
tags:
  - "react"
  - "javascript"
  - "hooks"
draft: false
lang: ko
thumbnail: "https://studio.uxpincdn.com/studio/wp-content/uploads/2024/07/React-Hooks.webp"
---

# React Hooks 완벽 가이드

React Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 강력한 기능입니다.

## useState - 상태 관리

가장 기본적인 Hook으로, 컴포넌트에 상태를 추가할 수 있습니다.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
```

## useEffect - 부수 효과 처리

컴포넌트가 렌더링될 때마다 특정 작업을 수행할 수 있습니다.

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // userId가 변경될 때만 실행

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

## useContext - 전역 상태 관리

Context API와 함께 사용하여 props drilling을 피할 수 있습니다.

```javascript
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return (
    <button className={`btn-${theme}`}>
      테마 버튼
    </button>
  );
}
```

## Custom Hooks

자주 사용하는 로직을 재사용 가능한 Hook으로 만들 수 있습니다.

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 사용 예제
function App() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  );
}
```

## 마치며

React Hooks는 함수형 프로그래밍의 장점을 살리면서도 강력한 기능을 제공합니다. 적절히 활용하면 더 깔끔하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
