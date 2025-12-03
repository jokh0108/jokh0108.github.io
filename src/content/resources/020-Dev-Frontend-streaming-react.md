---
title: "스트리밍 응답 (5) - React에서 렌더링하기"
summary: setState마다 무슨 일이 일어날까? 스트리밍 UI의 렌더링 동작과 최적화 방법, 완성 코드까지
date: 2025-12-02
draft: false
tags:
  - React
  - Rendering
  - Performance
  - Streaming
category1: Dev
category2: Frontend
---

## 질문

`setStreamingContent`가 호출될 때마다 React에서 무슨 일이 일어나고, 어떻게 최적화할 수 있나요?

## 답변

### setState마다 일어나는 일

```
[setStreamingContent 호출]
        │
        ▼
[React: state 변경 감지]
        │
        ▼
[컴포넌트 함수 재실행 → vDOM 재계산]
        │
        ▼
[이전 vDOM vs 새 vDOM diff]
        │
        ▼
[변경된 부분만 실제 DOM 패치]
        │
        ▼
[브라우저 렌더링 파이프라인]
  - style 계산 - layout - paint - composite
        │
        ▼
[화면에 글자가 조금 더 보임]
```

이 과정이 **청크마다 반복**됩니다.

### 1만 글자에 2글자 추가하면?

```tsx
<div>{streamingContent}</div>  // 10000자 → 10002자
```

**React는 글자 단위 diff를 하지 않습니다.**

실제 동작:
1. React가 "이 div의 텍스트가 바뀌었다" 감지
2. 실제 DOM의 textContent를 통째로 교체
3. 브라우저가 해당 영역 다시 렌더링

### 렌더링 성능 문제

```
청크 도착 빈도: 50ms마다
setState 호출: 50ms마다
= 초당 20번 리렌더링
```

텍스트가 길어질수록 새 문자열 생성 비용, DOM 업데이트 비용이 증가합니다.

### 최적화 방법들

**1. 청크를 배열로 관리**
```tsx
const [chunks, setChunks] = useState<string[]>([]);

const onChunk = (chunk: string) => {
  setChunks(prev => [...prev, chunk]);
};

return (
  <div>
    {chunks.map((chunk, i) => <span key={i}>{chunk}</span>)}
  </div>
);
```

**2. requestAnimationFrame으로 배치 처리**
```tsx
function useStreamingContent() {
  const [content, setContent] = useState('');
  const pendingChunks = useRef<string[]>([]);

  const addChunk = useCallback((chunk: string) => {
    pendingChunks.current.push(chunk);

    requestAnimationFrame(() => {
      setContent(prev => prev + pendingChunks.current.join(''));
      pendingChunks.current = [];
    });
  }, []);

  return { content, addChunk };
}
```

**3. useDeferredValue (React 18+)**
```tsx
const deferredContent = useDeferredValue(content);
// 사용자 입력보다 텍스트 표시가 덜 급할 때 유용
```

### 완성된 ChatGPT 클론 코드

**클라이언트 (React)**
```tsx
'use client';
import { useState, useRef, useCallback } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: fullContent }
      ]);
      setStreamingContent('');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Stream failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {streamingContent && (
          <div className="message assistant">
            {streamingContent}
            <span className="cursor">|</span>
          </div>
        )}
      </div>
      <div className="input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}
```

### 시리즈 정리

| 편 | 주제 | 핵심 내용 |
|----|------|----------|
| 1편 | 서버 | res.write(), Transfer-Encoding: chunked |
| 2편 | 네트워크 | HTTP 청크 형식, TCP 순서 보장 |
| 3편 | 브라우저 | 내부 버퍼, ReadableStream |
| 4편 | JavaScript | getReader(), TextDecoder |
| 5편 | React | setState 최적화, 완성 코드 |

```
[서버] res.write(chunk)
   ↓
[네트워크] Transfer-Encoding: chunked
   ↓
[브라우저] 내부 버퍼 → ReadableStream
   ↓
[JavaScript] reader.read() → TextDecoder
   ↓
[React] setState → vDOM diff → DOM 패치
   ↓
[화면] 글자가 하나씩 나타남
```

이 파이프라인 전체를 이해하면, ChatGPT 같은 스트리밍 UI뿐 아니라 실시간 로그 뷰어, 파일 다운로드 진행률 표시 등 다양한 스트리밍 기능을 구현할 수 있습니다.
