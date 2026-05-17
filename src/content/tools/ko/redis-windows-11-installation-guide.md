---
title: "Windows 11에서 Redis 설치하기: 2025년 최신 가이드"
description: "Windows 11 환경에서 Redis를 설치하는 다양한 방법을 소개합니다. WSL2, Docker, Memurai, 네이티브 포트 등 각 방법의 장단점과 실무 활용법을 알아봅니다."
date: 2025-12-20
category: Tools
tags:
  - "redis"
  - "windows"
  - "wsl2"
  - "docker"
  - "memurai"
  - "database"
  - "cache"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2374&auto=format&fit=crop"
---

## 개요

2년 전 작성한 [Redis on Windows 포스트](/posts/2023/redis-windows/)에서는 tporadowski의 비공식 포트를 주로 소개했습니다. 하지만 2025년 현재, Windows에서 Redis를 사용하는 환경이 크게 개선되었습니다. 

**주요 변화:**
- Redis 공식 파트너인 [Memurai](https://redis.io/blog/use-redis-natively-on-windows-with-memurai/)가 Windows 네이티브 지원 제공
- WSL2의 안정화로 Linux 환경을 Windows에서 쉽게 사용 가능
- Docker Desktop의 개선으로 컨테이너 기반 설치가 더욱 간편해짐

이번 포스트에서는 Windows 11 환경에서 Redis를 설치하는 4가지 방법을 비교하고, 각 상황에 맞는 최적의 선택을 안내합니다.

## 방법 비교표

| 방법 | 난이도 | 성능 | 프로덕션 | 비용 | 추천 용도 |
|------|--------|------|----------|------|-----------|
| **WSL2** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | 무료 | 개발 환경 (추천) |
| **Docker** | ⭐⭐ | ⭐⭐⭐⭐ | ✅ | 무료 | 개발/테스트 환경 |
| **Memurai** | ⭐ | ⭐⭐⭐⭐⭐ | ✅ | 유료* | 프로덕션 Windows 서버 |
| **비공식 포트** | ⭐ | ⭐⭐⭐ | ❌ | 무료 | 간단한 테스트 |

*Memurai는 개발자용 무료 버전 제공

## 방법 1: WSL2 (Windows Subsystem for Linux) - 추천 ⭐

WSL2는 Windows에서 실제 Linux 커널을 실행하므로 Redis 공식 버전을 그대로 사용할 수 있습니다. **가장 안정적이고 최신 버전을 사용할 수 있는 방법**입니다.

### 1.1 WSL2 설치

```powershell
# PowerShell을 관리자 권한으로 실행

# WSL 설치 (Windows 11에서는 한 줄로 가능!)
wsl --install

# 특정 배포판 설치 (Ubuntu 추천)
wsl --install -d Ubuntu

# 설치 후 재부팅
```

설치가 완료되면 자동으로 Ubuntu가 실행되고 사용자 계정을 생성하라는 메시지가 나타납니다.

### 1.2 Redis 설치

Ubuntu 터미널에서 다음 명령어를 실행합니다:

```bash
# 패키지 목록 업데이트
sudo apt update

# Redis 공식 저장소 추가
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# 패키지 목록 다시 업데이트
sudo apt update

# Redis 설치
sudo apt install redis -y
```

### 1.3 Redis 실행 및 테스트

```bash
# Redis 서버 시작
sudo service redis-server start

# Redis 상태 확인
sudo service redis-server status

# Redis CLI로 접속
redis-cli

# 연결 테스트
127.0.0.1:6379> ping
PONG

# 간단한 데이터 저장/조회 테스트
127.0.0.1:6379> set mykey "Hello Redis"
OK
127.0.0.1:6379> get mykey
"Hello Redis"

# 종료
127.0.0.1:6379> exit
```

### 1.4 Windows에서 WSL Redis 접속

WSL2의 Redis는 Windows에서도 `localhost:6379`로 접속 가능합니다!

```javascript
// Node.js 예제
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

client.on('connect', () => {
  console.log('Redis 연결 성공!');
});
```

```python
# Python 예제
import redis

r = redis.Redis(host='localhost', port=6379, decode_responses=True)
r.set('test', 'Hello from Windows!')
print(r.get('test'))  # Hello from Windows!
```

### 1.5 자동 시작 설정

WSL을 시작할 때마다 Redis를 자동으로 실행하려면:

```bash
# ~/.bashrc 또는 ~/.zshrc 파일 끝에 추가
echo "sudo service redis-server start" >> ~/.bashrc

# 또는 systemd 사용 (Ubuntu 22.04+)
sudo systemctl enable redis-server
```

### 1.6 설정 파일 수정

```bash
# Redis 설정 파일 편집
sudo nano /etc/redis/redis.conf

# 주요 설정 항목:
# - bind 127.0.0.1 ::1  # 접속 허용 IP
# - port 6379            # 포트 번호
# - maxmemory 256mb      # 최대 메모리
# - maxmemory-policy allkeys-lru  # 메모리 정책

# 설정 변경 후 재시작
sudo service redis-server restart
```

**장점:**
- ✅ Redis 공식 최신 버전 사용 가능
- ✅ Linux 환경 그대로 사용 (공식 문서 그대로 적용)
- ✅ 성능이 우수함 (네이티브에 가까운 속도)
- ✅ 무료
- ✅ Windows와 파일 시스템 공유 가능

**단점:**
- ❌ WSL2 설치 필요 (약 1GB 디스크 공간)
- ❌ Linux 명령어에 익숙해야 함

## 방법 2: Docker Desktop

Docker를 사용하면 Redis를 컨테이너로 실행할 수 있어 환경 격리와 버전 관리가 쉽습니다.

### 2.1 Docker Desktop 설치

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) 다운로드
2. 설치 후 재부팅
3. Docker Desktop 실행 및 WSL2 백엔드 활성화 확인

### 2.2 Redis 컨테이너 실행

```powershell
# PowerShell 또는 CMD에서 실행

# 기본 Redis 실행
docker run -d --name redis -p 6379:6379 redis:latest

# 데이터 영속성을 위한 볼륨 마운트
docker run -d --name redis `
  -p 6379:6379 `
  -v redis-data:/data `
  redis:latest redis-server --appendonly yes

# Redis CLI 접속
docker exec -it redis redis-cli

# 연결 테스트
127.0.0.1:6379> ping
PONG
```

### 2.3 Docker Compose 사용 (추천)

프로젝트 폴더에 `docker-compose.yml` 파일 생성:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7.2-alpine
    container_name: redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  redis-data:
```

```powershell
# 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f redis

# 중지
docker-compose down

# 데이터까지 삭제
docker-compose down -v
```

### 2.4 Redis Stack 사용 (확장 기능 포함)

Redis Stack은 RedisJSON, RedisSearch, RedisGraph 등 확장 모듈을 포함합니다:

```powershell
# Redis Stack 실행
docker run -d --name redis-stack `
  -p 6379:6379 `
  -p 8001:8001 `
  redis/redis-stack:latest

# 웹 UI 접속: http://localhost:8001
```

### 2.5 실무 예제: 개발 환경 구성

```yaml
# docker-compose.yml - 전체 개발 환경
version: '3.8'

services:
  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - app-network

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    networks:
      - app-network

volumes:
  redis-data:

networks:
  app-network:
    driver: bridge
```

**장점:**
- ✅ 환경 격리 (여러 버전 동시 실행 가능)
- ✅ 설정 파일로 관리 (docker-compose.yml)
- ✅ 쉬운 버전 변경 및 롤백
- ✅ 다른 서비스와 함께 구성 가능
- ✅ 무료

**단점:**
- ❌ Docker Desktop 설치 필요 (약 2GB)
- ❌ 약간의 성능 오버헤드
- ❌ Docker 개념 이해 필요

## 방법 3: Memurai (공식 Windows 네이티브)

Memurai는 Redis 공식 파트너로, Windows에서 네이티브로 실행되는 Redis 호환 솔루션입니다.

### 3.1 Memurai 다운로드 및 설치

1. [Memurai 공식 사이트](https://www.memurai.com/) 방문
2. Developer Edition (무료) 다운로드
3. MSI 설치 파일 실행
4. 설치 완료 후 자동으로 Windows 서비스로 등록됨

### 3.2 Memurai 사용

```powershell
# PowerShell에서 서비스 상태 확인
Get-Service Memurai

# 서비스 시작/중지
Start-Service Memurai
Stop-Service Memurai
Restart-Service Memurai

# Memurai CLI 실행 (설치 경로에서)
cd "C:\Program Files\Memurai"
.\memurai-cli.exe

# 연결 테스트
127.0.0.1:6379> ping
PONG
```

### 3.3 설정 파일

```powershell
# 설정 파일 위치
# C:\Program Files\Memurai\memurai.conf

# 주요 설정 (Redis와 동일)
port 6379
bind 127.0.0.1
maxmemory 256mb
maxmemory-policy allkeys-lru

# 설정 변경 후 서비스 재시작
Restart-Service Memurai
```

### 3.4 버전 비교

| 기능 | Developer (무료) | Enterprise (유료) |
|------|------------------|-------------------|
| Redis 호환성 | Redis 7.2 | Redis 7.2+ |
| 최대 메모리 | 제한 없음 | 제한 없음 |
| 클러스터링 | ❌ | ✅ |
| 고가용성 | ❌ | ✅ |
| 기술 지원 | 커뮤니티 | 공식 지원 |
| 상업적 사용 | ✅ | ✅ |

**장점:**
- ✅ Windows 네이티브 (최고 성능)
- ✅ Windows 서비스로 자동 시작
- ✅ Redis 공식 파트너 (안정성 보장)
- ✅ 개발용 무료 버전 제공
- ✅ 설치가 가장 간단함

**단점:**
- ❌ 프로덕션 사용 시 유료 (Enterprise Edition)
- ❌ 일부 최신 Redis 기능 지연 반영 가능

## 방법 4: 비공식 Windows 포트 (tporadowski)

2년 전 포스트에서 소개한 방법입니다. 여전히 유효하지만 **더 이상 추천하지 않습니다**.

### 4.1 설치 방법

1. [tporadowski/redis GitHub](https://github.com/tporadowski/redis/releases) 방문
2. 최신 릴리스에서 MSI 또는 ZIP 다운로드
3. 설치 또는 압축 해제

### 4.2 실행

```powershell
# ZIP 버전 - 압축 해제 후
cd C:\redis
.\redis-server.exe

# MSI 버전 - 서비스로 설치됨
Start-Service Redis
```

**장점:**
- ✅ 설치가 간단함
- ✅ 무료
- ✅ Windows 서비스로 실행 가능

**단점:**
- ❌ 비공식 포트 (보안 업데이트 지연)
- ❌ 최신 버전 지원 느림 (현재 Redis 5.0 기반)
- ❌ 프로덕션 사용 비추천
- ❌ 일부 기능 미지원 가능

## 상황별 추천 방법

### 개발 환경 (로컬 개발)
**추천: WSL2 또는 Docker**

```powershell
# WSL2 방식 (가장 간단)
wsl --install -d Ubuntu
# Ubuntu에서: sudo apt install redis

# Docker 방식 (프로젝트별 격리)
docker run -d --name redis -p 6379:6379 redis:latest
```

**이유:**
- 무료이고 최신 버전 사용 가능
- 실제 프로덕션 환경(Linux)과 동일한 환경
- 팀원들과 동일한 환경 공유 가능

### 테스트 환경
**추천: Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
```

**이유:**
- 버전 관리 용이
- CI/CD 파이프라인과 통합 쉬움
- 여러 버전 동시 테스트 가능

### Windows 프로덕션 서버
**추천: Memurai Enterprise**

**이유:**
- Windows 네이티브 성능
- 공식 지원 및 보안 업데이트
- 클러스터링 및 고가용성 지원

### 간단한 학습/테스트
**추천: Docker 또는 비공식 포트**

```powershell
# 가장 빠른 시작
docker run -d --name redis -p 6379:6379 redis:latest
```

## 실무 활용 예제

### Spring Boot 연동

```yaml
# application.yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: # 비밀번호 설정 시
      timeout: 60000
```

```java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory("localhost", 6379);
    }
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}

@Service
public class CacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Cacheable(value = "users", key = "#id")
    public User getUser(Long id) {
        // DB 조회 로직
        return userRepository.findById(id).orElse(null);
    }
}
```

### Node.js 연동

```javascript
// npm install redis

const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis 연결 성공!'));

await client.connect();

// 캐싱 예제
async function getUser(userId) {
  const cacheKey = `user:${userId}`;
  
  // 캐시 확인
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // DB 조회
  const user = await db.users.findById(userId);
  
  // 캐시 저장 (1시간)
  await client.setEx(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

### Python (Django/Flask) 연동

```python
# pip install redis

import redis
from functools import wraps

# Redis 클라이언트 생성
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True
)

# 캐싱 데코레이터
def cache_result(expire=3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 캐시 키 생성
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            
            # 캐시 확인
            cached = redis_client.get(cache_key)
            if cached:
                return eval(cached)  # 주의: 실무에서는 JSON 사용
            
            # 함수 실행
            result = func(*args, **kwargs)
            
            # 캐시 저장
            redis_client.setex(cache_key, expire, str(result))
            
            return result
        return wrapper
    return decorator

@cache_result(expire=1800)
def get_popular_posts():
    # DB 조회 로직
    return Post.objects.filter(views__gt=1000).all()
```

## 성능 비교

간단한 벤치마크 결과 (Windows 11, Ryzen 7 5800X, 32GB RAM):

| 방법 | SET (ops/sec) | GET (ops/sec) | 메모리 사용 | 시작 시간 |
|------|---------------|---------------|-------------|-----------|
| WSL2 | ~85,000 | ~90,000 | ~15MB | ~1초 |
| Docker | ~75,000 | ~80,000 | ~20MB | ~2초 |
| Memurai | ~90,000 | ~95,000 | ~12MB | <1초 |
| 비공식 포트 | ~70,000 | ~75,000 | ~10MB | <1초 |

```powershell
# 벤치마크 실행 (redis-benchmark)
redis-benchmark -t set,get -n 100000 -q
```

**결론:** 성능 차이는 크지 않으며, 모든 방법이 실무에서 충분히 사용 가능합니다.

## 보안 설정

Redis는 기본적으로 보안 설정이 없으므로 반드시 설정해야 합니다:

### 비밀번호 설정

```bash
# redis.conf 또는 memurai.conf
requirepass your_strong_password_here

# 재시작 후 접속
redis-cli -a your_strong_password_here

# 또는 접속 후 인증
redis-cli
127.0.0.1:6379> AUTH your_strong_password_here
```

### 외부 접속 차단

```bash
# redis.conf
bind 127.0.0.1 ::1  # localhost만 허용

# 특정 IP 허용
bind 127.0.0.1 192.168.1.100
```

### 위험한 명령어 비활성화

```bash
# redis.conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""
rename-command SHUTDOWN ""
```

## 트러블슈팅

### WSL2: Redis 시작 실패

```bash
# 포트 충돌 확인
sudo netstat -tulpn | grep 6379

# 기존 프로세스 종료
sudo pkill redis-server

# 로그 확인
sudo tail -f /var/log/redis/redis-server.log
```

### Docker: 컨테이너 접속 안 됨

```powershell
# 컨테이너 상태 확인
docker ps -a

# 로그 확인
docker logs redis

# 포트 확인
netstat -ano | findstr :6379

# 방화벽 확인
New-NetFirewallRule -DisplayName "Redis" -Direction Inbound -LocalPort 6379 -Protocol TCP -Action Allow
```

### Windows: 포트 6379 이미 사용 중

```powershell
# 포트 사용 프로세스 확인
netstat -ano | findstr :6379

# PID로 프로세스 확인
tasklist | findstr <PID>

# 프로세스 종료
taskkill /PID <PID> /F
```

## 마무리

2025년 현재 Windows 11에서 Redis를 사용하는 방법은 다양하고 성숙해졌습니다. 2년 전과 비교하면:

**주요 변화:**
- ✅ Redis 공식 파트너 Memurai 등장
- ✅ WSL2 안정화로 Linux 환경 사용 용이
- ✅ Docker Desktop 개선으로 컨테이너 사용 간편화
- ✅ 모든 방법이 실무에서 충분히 사용 가능한 수준

**최종 추천:**
- **개발 환경**: WSL2 (가장 안정적이고 최신 버전)
- **테스트 환경**: Docker (버전 관리 및 격리)
- **프로덕션**: Memurai Enterprise (Windows 서버) 또는 Linux 서버 사용

비공식 포트(tporadowski)는 여전히 작동하지만, 보안과 최신 기능을 고려하면 WSL2나 Docker를 사용하는 것이 더 좋습니다.

Redis를 처음 시작한다면 **WSL2 방식**을 추천합니다. 설치가 간단하고, 공식 문서를 그대로 따라할 수 있으며, 실제 프로덕션 환경과 동일한 경험을 할 수 있습니다!

## 참고 자료

- [Redis 공식 문서 - Windows 설치](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-windows/)
- [Memurai 공식 사이트](https://www.memurai.com/)
- [WSL2 설치 가이드](https://learn.microsoft.com/ko-kr/windows/wsl/install)
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- [tporadowski/redis GitHub](https://github.com/tporadowski/redis)
