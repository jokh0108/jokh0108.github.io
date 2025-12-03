---
title: "스트리밍 응답 (3) - 브라우저 내부에서 일어나는 일"
summary: 네트워크에서 받은 데이터를 브라우저가 어떻게 처리할까? 내부 버퍼와 ReadableStream의 관계
date: 2025-12-02
draft: false
tags:
  - Browser
  - ReadableStream
  - Web API
  - Streaming
category1: Dev
category2: Frontend
---

## 질문

네트워크를 통해 도착한 데이터가 브라우저 내부에서 어떻게 처리되어 JavaScript로 전달되나요?

## 답변

### 브라우저 내부 구조

```
   (네이티브/C++ 영역)
[내부 바디 버퍼]  ← 서버에서 오는 바이트들이 계속 쌓임
   ▲
   │  네트워크 스레드가 채움
   │
   └──────────────────────────────┐
                                  │
                      JS에서 보는 인터페이스
                                  ▼
                  [ReadableStream(response.body)]
                                  │
                          getReader()
                                  │
                          reader.read()
                        (버퍼에 있는 만큼
                         Uint8Array로 꺼내줌)
```

핵심 발견:
- **네트워크 스레드**: 버퍼에 **채우는 역할** (백그라운드)
- **JavaScript**: 버퍼에서 **꺼내가는 역할** (메인 스레드)

### 내부 버퍼가 왜 필요한가?

**속도 차이 문제**

```
네트워크 도착 속도:    ████████░░░░░░░░ (불규칙)
JS 처리 속도:         ██░░██░░██░░██░░ (이벤트 루프에 따라)
```

네트워크와 JavaScript의 속도가 다릅니다. 버퍼가 이 둘 사이에서 **완충 역할**을 합니다.

### reader.read() 할 때 일어나는 일

```
[네트워크 스레드]           [브라우저 내부 버퍼]           [JS 메인 스레드]
서버에서 바이트 수신 →   [바이트 바이트 바이트]   →   reader.read() 호출
                         ▲                        ←   필요하면 여기서 가져감
                         계속 채움
```

- **버퍼 안에 데이터가 충분히 있으면**: `Uint8Array`로 포장해서 JS에 넘김
- **아직 데이터가 더 오기 전이면**: Promise를 **pending 상태로 두고 기다림**

### response.body가 뭔가요?

`fetch()`의 응답에서 `response.body`는 `ReadableStream`입니다.

```typescript
const response = await fetch('/api/chat');
console.log(response.body);
// ReadableStream { locked: false }
```

**ReadableStream이란?**
"읽기 전용으로, 데이터를 조각 단위로 흘려 보내주는 객체"

### getReader()와 read()

```typescript
const reader = response.body.getReader();  // 리더 획득
const { done, value } = await reader.read();  // 청크 읽기
```

- `done`: 스트림이 끝났는지 (boolean)
- `value`: 읽은 데이터 (Uint8Array 또는 undefined)

**read()가 비동기인 이유**

버퍼에 데이터가 있으면 → 즉시 resolve
버퍼가 비어있으면 → 네트워크에서 데이터 도착할 때까지 pending

### Uint8Array가 뭔가?

```typescript
const { value } = await reader.read();
console.log(value);
// Uint8Array(6) [236, 149, 136, 235, 133, 149]
// (이건 "안녕"을 UTF-8로 인코딩한 바이트들)
```

HTTP 응답은 원래 **바이너리**입니다. 브라우저는 바이트로 주고, 문자열로 바꾸는 건 JavaScript의 몫입니다.

### response.text() vs response.body

```typescript
// response.text() - 전체 다 받아야 반환 (스트리밍 불가)
const text = await response.text();

// response.body - 조금씩 받으면서 처리 가능 (스트리밍 UI에 적합)
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // value는 Uint8Array, 청크 단위로 처리 가능
}
```

### 정리

```
[네트워크 스레드]           [내부 버퍼]           [JS 메인 스레드]
서버에서 바이트 수신 →   [바이트 바이트]   →   reader.read() 호출
                         ▲                  ←   필요하면 꺼내감
                         계속 채움
```

| 개념 | 설명 |
|-----|------|
| 내부 버퍼 | 네트워크와 JS 사이의 완충 |
| response.body | ReadableStream 인스턴스 |
| getReader() | 스트림에서 읽을 리더 획득 |
| read() | 버퍼에서 Uint8Array로 청크 읽기 |
| Uint8Array | 바이트 배열 (바이너리 데이터) |
