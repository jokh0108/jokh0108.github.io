---
title: "ChatGPT 클론 만들기 시리즈 - 스트리밍 응답의 모든 것"
summary: 글자가 하나씩 나타나는 UI는 어떻게 동작할까? 서버부터 React 렌더링까지 5편에 걸쳐 깊이 파헤쳐봅니다
date: 2025-12-02
draft: false
tags:
  - JavaScript
  - React
  - Streaming
  - Node.js
  - ChatGPT
category1: Dev
category2: Frontend
---

## 질문

ChatGPT처럼 응답이 한 글자씩 흘러나오는 UI는 어떻게 구현하나요?

## 답변

### 만들려는 것

```
사용자: "안녕하세요"
    ↓
AI: "안" → "안녕" → "안녕하" → "안녕하세" → "안녕하세요!"
    (글자가 타이핑되듯이 나타남)
```

이걸 구현하려면 서버와 클라이언트 양쪽에서 "스트리밍"을 이해해야 합니다.

### 스트림(Stream)이란?

**"스트림" = 데이터를 한 번에 다 주는 게 아니라, 조각들이 시간에 따라 흘러들어오는 것**

```
일반 응답:                스트리밍 응답:
┌────────────────┐        ┌──┐ ┌──┐ ┌──┐ ┌──┐
│   전체 데이터    │        │조│→│각│→│조│→│각│
└────────────────┘        └──┘ └──┘ └──┘ └──┘
       ↓                     시간 순서대로 도착
   한 번에 받음
```

- `await fetch()` 후 `response.text()` → 전체 바디를 다 받은 다음 한 번에 문자열을 줌
- `response.body` (ReadableStream) → 데이터를 **청크(chunk) 단위로 조금씩** 받을 수 있음

### 전체 아키텍처

```
[OpenAI API]
     │ (스트리밍 응답)
     ▼
[Node.js 서버]
     │ (청크 단위로 전달)
     ▼
[브라우저 네트워크]
     │
     ▼
[ReadableStream]
     │
     ▼
[React State]
     │
     ▼
[화면에 글자가 하나씩]
```

### 시리즈 목차

이 시리즈는 5편으로 구성되어 있습니다:

1. **서버 관점** - Node.js에서 스트리밍 응답 보내기
2. **네트워크 관점** - HTTP Chunked Transfer Encoding
3. **브라우저 관점** - 내부 버퍼와 ReadableStream
4. **JavaScript 관점** - getReader, TextDecoder 사용법
5. **React 관점** - setState와 렌더링 최적화

### 전체 흐름 상세 도식

```
[서버]
   │  (TCP/IP 패킷들, HTTP 응답)
   ▼
[OS 커널 소켓 버퍼]
   │
   ▼
[브라우저 네트워크 스택]
   │  (TLS 복호화, HTTP 헤더/바디 파싱)
   ▼
[브라우저 내부 바디 버퍼]  ←←←  스트림 소스
   │
   ▼
[ReadableStream (response.body)]
   │  (getReader → read)
   ▼
[JS 엔진 (메인 스레드)]
   │  (Uint8Array → TextDecoder → string)
   ▼
[React state 업데이트]
   │
   ▼
[브라우저 렌더링 엔진]
   │  (DOM 변경, layout/paint)
   ▼
[화면에 텍스트 점점 늘어남]
```

### 다섯 관점 압축 정리

```
(1) 서버: [OpenAI API] → [Node.js] → res.write(chunk)
(2) 네트워크: [서버] → [패킷] → [OS 소켓 버퍼] → [브라우저 네트워크 스택]
(3) 브라우저 내부: → [내부 바디 버퍼] → [ReadableStream]
(4) JS & 메모리: → [reader.read() → Uint8Array] → [TextDecoder → string]
(5) 렌더링: → [vDOM 업데이트] → [DOM 패치] → [화면에 스트리밍 텍스트]
```

이렇게 "서버 → 네트워크 → 브라우저 내부 버퍼 → ReadableStream → JS/React → 렌더링"이 **파이프라인처럼 연결**돼 있습니다.
