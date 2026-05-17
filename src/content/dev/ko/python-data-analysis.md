---
title: Python으로 시작하는 데이터 분석
description: Pandas와 NumPy를 활용한 데이터 분석 기초를 배워봅니다.
date: 2025-01-18
category: Data
tags:
  - "python"
  - "pandas"
  - "data-analysis"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1649180556628-9ba704115795?q=80&w=2362&auto=format&fit=crop&ixlib=rb-4.1.0"
---

# Python으로 시작하는 데이터 분석

Python은 데이터 분석에 가장 많이 사용되는 언어입니다. Pandas와 NumPy를 활용하면 강력한 데이터 분석이 가능합니다.

## Pandas 기초

Pandas는 데이터 조작과 분석을 위한 라이브러리입니다.

```python
import pandas as pd
import numpy as np

# DataFrame 생성
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['Seoul', 'Busan', 'Incheon']
})

print(df)
```

## 데이터 읽기

CSV 파일을 읽어오는 것은 매우 간단합니다.

```python
# CSV 파일 읽기
df = pd.read_csv('data.csv')

# 기본 정보 확인
print(df.head())        # 처음 5행
print(df.info())        # 데이터 타입과 null 값
print(df.describe())    # 통계 정보
```

## 데이터 필터링

조건에 맞는 데이터를 쉽게 필터링할 수 있습니다.

```python
# 나이가 30 이상인 사람들
adults = df[df['age'] >= 30]

# 여러 조건
seoul_adults = df[(df['age'] >= 30) & (df['city'] == 'Seoul')]

# isin 사용
selected_cities = df[df['city'].isin(['Seoul', 'Busan'])]
```

## 데이터 집계

그룹별로 데이터를 집계할 수 있습니다.

```python
# 도시별 평균 나이
city_avg_age = df.groupby('city')['age'].mean()

# 여러 집계 함수 적용
city_stats = df.groupby('city').agg({
    'age': ['mean', 'min', 'max'],
    'name': 'count'
})
```

## 데이터 시각화

Matplotlib과 함께 사용하면 데이터를 시각화할 수 있습니다.

```python
import matplotlib.pyplot as plt

# 막대 그래프
df.groupby('city')['age'].mean().plot(kind='bar')
plt.title('도시별 평균 나이')
plt.xlabel('도시')
plt.ylabel('평균 나이')
plt.show()
```

## 실전 예제: 데이터 정제

실제 데이터는 항상 깨끗하지 않습니다. 데이터 정제가 필요합니다.

```python
# 결측치 처리
df['age'].fillna(df['age'].mean(), inplace=True)  # 평균으로 채우기
df.dropna(subset=['name'], inplace=True)          # null 행 제거

# 중복 제거
df.drop_duplicates(inplace=True)

# 데이터 타입 변환
df['age'] = df['age'].astype(int)

# 이상치 제거 (IQR 방법)
Q1 = df['age'].quantile(0.25)
Q3 = df['age'].quantile(0.75)
IQR = Q3 - Q1
df = df[(df['age'] >= Q1 - 1.5*IQR) & (df['age'] <= Q3 + 1.5*IQR)]
```

## 마치며

Pandas는 데이터 분석의 필수 도구입니다. 이 기초를 바탕으로 더 복잡한 분석을 시도해보세요!
