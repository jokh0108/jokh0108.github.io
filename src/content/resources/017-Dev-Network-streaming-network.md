---
title: "스트리밍 응답 (2) - 네트워크에서 일어나는 일"
summary: 서버가 보낸 청크가 브라우저까지 어떻게 전달될까? HTTP Chunked Transfer Encoding과 TCP 패킷 흐름
date: 2025-12-02
draft: false
tags:
  - HTTP
  - Network
  - TCP
  - Streaming
category1: Dev
category2: Network
---

## 질문

서버에서 `res.write()`로 보낸 데이터가 브라우저까지 어떻게 도달하나요?

## 답변

### 데이터 흐름 전체 그림

```
[서버]
  └─ res.write("안녕")  ← 첫 번째 청크
        ↓
[TCP/IP 패킷으로 변환]
        ↓
[네트워크 전송]
        ↓
[OS 커널 소켓 버퍼]
        ↓
[브라우저 네트워크 스레드]
  └─ TLS 복호화, HTTP 파싱
        ↓
[브라우저 내부 바디 버퍼]
        ↓
[JavaScript에서 읽을 수 있게 됨]
```

### HTTP Chunked Transfer Encoding

**일반 HTTP 응답**
```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 15      ← 전체 길이를 미리 알려줌

안녕하세요, 반갑습니다
```

**스트리밍 HTTP 응답**
```
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked   ← 길이 모름, 청크로 보낼게

6\r\n
안녕하\r\n
6\r\n
세요, \r\n
0\r\n
\r\n
```

### 청크 형식 분석

```
[청크 크기(16진수)]\r\n
[청크 데이터]\r\n
```

- `6\r\n` → 다음 데이터가 6바이트라는 뜻
- `안녕하\r\n` → 실제 데이터 (UTF-8로 6바이트)
- `0\r\n\r\n` → 0바이트 청크 = **끝났다는 신호**

### TCP 레벨에서 일어나는 일

```
[서버]
  │
  │ res.write("안녕하세요")
  ↓
[서버 OS 소켓 버퍼]
  │
  │ TCP 세그먼트로 분할
  ↓
[네트워크]
  │
  │ 라우터들을 거쳐 전달
  ↓
[클라이언트 OS 소켓 버퍼]
  │
  │ 브라우저가 읽어감
  ↓
[브라우저 네트워크 스레드]
```

TCP는 **순서 보장**이 되기 때문에 청크1, 2, 3 순서가 바뀌지 않습니다.

### 브라우저 네트워크 스레드

브라우저가 데이터를 받으면 네트워크 스레드(메인 스레드와 별도)에서 처리합니다:

```
[OS 소켓에서 데이터 읽기]
         ↓
[TLS 복호화] (HTTPS인 경우)
         ↓
[HTTP 청크 파싱]
  - "6\r\n안녕하\r\n" → "안녕하" 추출
         ↓
[내부 바디 버퍼에 저장]
         ↓
[JS가 읽을 수 있도록 대기]
```

**왜 별도 스레드인가?**
네트워크 I/O는 느리고 불확실합니다. 메인 스레드에서 하면 UI 멈춤, 사용자 입력 처리 불가, 애니메이션 끊김이 발생합니다.

### Connection: keep-alive

```
res.setHeader('Connection', 'keep-alive');
```

이 헤더는 "TCP 연결 유지해"라는 의미입니다.

```
keep-alive 없이:
[요청1] → TCP 연결 → 응답 → TCP 종료
[요청2] → TCP 연결 → 응답 → TCP 종료

keep-alive 있으면:
[요청1] → TCP 연결 → 응답
[요청2] →          → 응답    (같은 연결 재사용)
```

스트리밍에서는 응답이 끝날 때까지 연결을 유지해야 하므로 필수입니다.

### 실제 타이밍 예시

```
스트리밍 응답:
  Waiting (TTFB): 100ms    ← 첫 번째 청크까지 시간
  Content Download: 5000ms  ← 마지막 청크까지 시간

일반 응답:
  Waiting (TTFB): 5000ms   ← 전체 완성까지 기다림
  Content Download: 10ms    ← 한 번에 다 받음
```

**TTFB(Time To First Byte)**가 스트리밍의 핵심입니다.

### 정리

| 개념 | 역할 |
|-----|------|
| Transfer-Encoding: chunked | 길이 모르고 조각으로 보낸다는 신호 |
| 청크 형식 | `[크기]\r\n[데이터]\r\n` |
| 0 청크 | 스트림 종료 신호 |
| TCP | 순서 보장, 신뢰성 보장 |
| 네트워크 스레드 | 메인 스레드 블로킹 방지 |
| keep-alive | TCP 연결 유지 |
| no-cache | 중간 캐시 우회 |
