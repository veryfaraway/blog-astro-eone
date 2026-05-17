---
title: CSV 파일을 직접 MySQL 테이블로 Import 하는 방법
description: 대용량 파일을 MySQL에 업로드할 때 속도 향상 팁
date: 2022-02-09
category: Data
tags:
  - "mysql"
  - "csv"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?q=80&w=3174&auto=format&fit=crop"
---

MySQL 테이블에 데이터를 넣을 때 여러가지 방법이 있는데 CSV(Comma-separated values) 파일을 직접 넣는 방법도 있습니다.

## 알반적인 경우
CSV 파일과 DB 테이블 구조가 일치하면 아래와 같이 입력하면 됩니다.
```sql
-- load file
LOAD DATA LOCAL INFILE "filePath" 
INTO TABLE dbName.tableName FIELDS TERMINATED BY ",";
```


## 파일 구조와 테이블 구조가 다른 경우
만약 CSV 파일 구조와 DB 테이블 구조가 다른 경우에는 조금 복잡한데 아래 샘플 sql 문 참조해서 import 해보시길 바랍니다.
파일을 기준으로 테이블의 컬럼을 적어주면 됩니다(마지막 줄).
```sql
LOAD DATA LOCAL INFILE "filePath" 
INTO TABLE dbName.tableName
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
(column1,column2,column3, ...);
```


## 대용량 파일의 경우
만약 파일의 크기가 크고 테이블에 index가 걸려 있으면 시간이 굉장히 오래 걸릴 수 있습니다.
그럴 경우에는 아래와 같이 index를 먼저 해제해 주고 파일을 올린 다음 다시 index를 걸면 상당히 빠르게 테이블에 데이터를 넣을 수 있습니다.
```sql
-- disable index
ALTER TABLE dbName.tableName DISABLE KEYS;

-- load file
LOAD DATA local INFILE "filePath" 
INTO TABLE dbName.tableName FIELDS TERMINATED BY ",";

-- enable index
ALTER TABLE dbName.tableName ENABLE KEYS;
```


환경에 따라 다를 수 있지만 제가 테스트했을 때 대략 2GB 정도 되는 파일이 10분 정도에 import가 완료됐습니다.
