---
title: MongoDB 기초부터 실전까지
description: NoSQL 데이터베이스 MongoDB의 기본 개념과 사용법을 알아봅니다.
date: 2025-01-16
category: Data
tags:
  - "mongodb"
  - "database"
  - "nosql"
draft: false
lang: ko
thumbnail: "https://media.licdn.com/dms/image/v2/D4D12AQETgv5fMiYEXA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677609185621?e=2147483647&v=beta&t=Ora_YKTAmDz3efeDirq2YQ7INd_unqaFZ13TheQc_60"
---

## MongoDB 기초부터 실전까지

MongoDB는 가장 인기 있는 NoSQL 데이터베이스 중 하나입니다. 유연한 스키마와 높은 확장성이 특징입니다.

### MongoDB란?

MongoDB는 문서 지향(Document-Oriented) 데이터베이스입니다. JSON과 유사한 BSON 형식으로 데이터를 저장합니다.

#### 주요 특징

- **유연한 스키마**: 고정된 스키마 없이 데이터 저장 가능
- **확장성**: 수평적 확장(Sharding) 지원
- **고성능**: 인덱싱과 쿼리 최적화
- **풍부한 쿼리**: 복잡한 쿼리와 집계 지원

### 기본 CRUD 작업

#### Create (생성)

```javascript
// 단일 문서 삽입
db.users.insertOne({
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  interests: ["coding", "reading"]
});

// 여러 문서 삽입
db.users.insertMany([
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
]);
```

#### Read (조회)

```javascript
// 모든 문서 조회
db.users.find();

// 조건부 조회
db.users.find({ age: { $gte: 30 } });

// 특정 필드만 조회
db.users.find(
  { age: { $gte: 30 } },
  { name: 1, email: 1, _id: 0 }
);

// 단일 문서 조회
db.users.findOne({ name: "Alice" });
```

#### Update (수정)

```javascript
// 단일 문서 수정
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 26 } }
);

// 여러 문서 수정
db.users.updateMany(
  { age: { $lt: 30 } },
  { $inc: { age: 1 } }
);

// 배열에 요소 추가
db.users.updateOne(
  { name: "Alice" },
  { $push: { interests: "gaming" } }
);
```

#### Delete (삭제)

```javascript
// 단일 문서 삭제
db.users.deleteOne({ name: "Bob" });

// 여러 문서 삭제
db.users.deleteMany({ age: { $lt: 25 } });
```

### 인덱싱

인덱스는 쿼리 성능을 크게 향상시킵니다.

```javascript
// 단일 필드 인덱스
db.users.createIndex({ email: 1 });

// 복합 인덱스
db.users.createIndex({ name: 1, age: -1 });

// 텍스트 인덱스
db.posts.createIndex({ content: "text" });

// 인덱스 확인
db.users.getIndexes();
```

### Aggregation Pipeline

복잡한 데이터 처리를 위한 강력한 도구입니다.

```javascript
db.orders.aggregate([
  // 필터링
  { $match: { status: "completed" } },
  
  // 그룹화
  { $group: {
    _id: "$customerId",
    totalAmount: { $sum: "$amount" },
    orderCount: { $sum: 1 }
  }},
  
  // 정렬
  { $sort: { totalAmount: -1 } },
  
  // 제한
  { $limit: 10 }
]);
```

### Node.js에서 MongoDB 사용

```javascript
const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('mydb');
    const users = database.collection('users');

    // 데이터 삽입
    const result = await users.insertOne({
      name: "Alice",
      age: 25
    });
    console.log(`문서 ID: ${result.insertedId}`);

    // 데이터 조회
    const user = await users.findOne({ name: "Alice" });
    console.log(user);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
```

### 모범 사례

1. **적절한 인덱싱**: 자주 쿼리하는 필드에 인덱스 생성
2. **문서 크기 제한**: 16MB 제한을 고려한 설계
3. **임베딩 vs 참조**: 데이터 관계에 따라 적절히 선택
4. **연결 풀 사용**: 효율적인 연결 관리
5. **에러 처리**: 적절한 예외 처리 구현

### 마치며

MongoDB는 현대적인 애플리케이션 개발에 매우 유용한 데이터베이스입니다. 유연성과 확장성을 활용하여 효율적인 데이터 관리를 구현해보세요!
