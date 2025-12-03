---
title: "스트리밍 응답 (4) - JavaScript에서 청크 처리하기"
summary: Uint8Array를 문자열로 바꾸고, React state에 반영하기까지. TextDecoder 사용법과 실제 코드 분석
date: 2025-12-02
draft: false
tags:
  - JavaScript
  - TextDecoder
  - Streaming
  - Web API
category1: Dev
category2: Frontend
---

## 질문

브라우저에서 받은 `Uint8Array`를 어떻게 문자열로 바꾸고 화면에 표시하나요?

## 답변

### 전체 흐름

```
ReadableStream
  → getReader()
  → reader.read() (Promise)
  → { done, value: Uint8Array } 반복
  → TextDecoder.decode(value) → string
  → setStreamingContent(prev + string)
```

### 전체 클라이언트 코드

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  setStreamingContent(prev => prev + chunk);
}
```

### 단계별 분석

**1. fetch로 요청 보내기**
```typescript
const response = await fetch('/api/chat', { ... });
```
`await fetch()`는 **헤더만 받으면** 반환합니다. 바디는 아직 다 안 왔을 수 있어요.

**2. getReader()로 리더 획득**
```typescript
const reader = response.body?.getReader();
```
`getReader()`를 호출하면 스트림이 **locked** 상태가 됩니다.

**3. TextDecoder 생성**
```typescript
const decoder = new TextDecoder();  // 기본값: UTF-8
```
바이너리를 **UTF-8 문자열로 변환**하는 유틸입니다.

```typescript
const bytes = new Uint8Array([236, 149, 136, 235, 133, 149]);
const text = decoder.decode(bytes);
console.log(text);  // "안녕"
```

**4. while 루프로 청크 읽기**
```typescript
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 청크 처리
}
```

**5. 바이트를 문자열로 디코딩**
```typescript
const chunk = decoder.decode(value);
```

**6. React state 업데이트**
```typescript
setStreamingContent(prev => prev + chunk);
```

### 왜 함수형 업데이트인가?

```typescript
// 잘못된 방법
setStreamingContent(streamingContent + chunk);
// 클로저 문제로 streamingContent가 오래된 값일 수 있음

// 올바른 방법
setStreamingContent(prev => prev + chunk);
// prev는 항상 최신 state를 참조
```

### 내 머리 속 시뮬레이션

서버가 `"안녕하세요" → ", 오늘" → " 뭐 도와드릴까요?"` 이렇게 조각조각 보낸다면:

**1. 첫 번째 read()**
- chunk = "안녕하세요"
- state: "" → "안녕하세요"

**2. 두 번째 read()**
- chunk = ", 오늘"
- state: "안녕하세요" → "안녕하세요, 오늘"

**3. 세 번째 read()**
- chunk = " 뭐 도와드릴까요?"
- state: "안녕하세요, 오늘" → "안녕하세요, 오늘 뭐 도와드릴까요?"

**4. 네 번째 read()**
- `{ done: true, value: undefined }`
- while 종료

### 에러 처리

```typescript
async function streamChat(messages: Message[]) {
  try {
    const response = await fetch('/api/chat', { ... });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setStreamingContent(prev => prev + chunk);
    }
  } catch (error) {
    setError('메시지 전송에 실패했습니다.');
  }
}
```

### 스트림 취소하기

```typescript
const controller = new AbortController();

const response = await fetch('/api/chat', {
  signal: controller.signal,  // abort 신호 연결
});

// 취소 버튼 클릭 시
controller.abort();
```

### 정리

| 단계 | 역할 |
|-----|------|
| getReader() | 스트림에서 읽을 리더 획득 |
| TextDecoder | Uint8Array를 문자열로 변환 |
| read() | 청크 하나 읽기 (비동기) |
| decode() | 바이트 배열 → 문자열 |
| setState(prev => ...) | 함수형 업데이트로 최신 값 보장 |

**JS 입장에서는:**
1. `read()` 할 때마다 `Uint8Array` 한 덩어리를 비동기로 받음
2. `TextDecoder`로 문자열 조각으로 변환
3. React state에 이전 문자열과 이어붙임

→ **"문자열이 조금씩 도착할 때마다 점점 긴 텍스트를 만든다"**
