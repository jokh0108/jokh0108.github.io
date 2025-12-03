---
title: "스트리밍 응답 (1) - 서버에서 청크 단위로 보내기"
summary: Node.js에서 스트리밍 응답은 어떻게 보낼까? 일반 응답과 스트리밍 응답의 차이, OpenAI API 연동까지
date: 2025-12-02
draft: false
tags:
  - Node.js
  - Streaming
  - Express
  - Next.js
  - OpenAI
category1: Dev
category2: Backend
---

## 질문

서버가 어떻게 데이터를 조각조각 보내는지 궁금합니다.

## 답변

### 일반 응답 vs 스트리밍 응답

**일반 응답: 다 만들고 한 번에**

```typescript
app.get('/normal', async (req, res) => {
  const result = await generateLongText();  // 5초 걸림
  res.json({ text: result });  // 5초 후에야 클라이언트가 받음
});
```

클라이언트는 5초 동안 아무것도 못 보고 기다려야 합니다.

**스트리밍 응답: 만드는 대로 바로바로**

```typescript
app.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  for await (const chunk of generateChunks()) {
    res.write(chunk);  // 바로바로 전송
  }
  res.end();
});
```

클라이언트는 첫 번째 청크가 오는 순간부터 화면에 표시할 수 있습니다.

### 핵심 차이

```
일반 응답:
서버: [====생성중====] → [완성!] → 전송
클라이언트:     (대기...)         → 전체 수신

스트리밍 응답:
서버: [청크1] → [청크2] → [청크3] → 끝
클라이언트: 수신 → 수신 → 수신 → 완료
```

### 스트리밍의 핵심 요소

**1. Transfer-Encoding: chunked**
```typescript
res.setHeader('Transfer-Encoding', 'chunked');
```
HTTP에게 "아직 끝 안 났어, 계속 보낼 거야"라고 알려줍니다.

**2. res.write() vs res.json()**
```typescript
// res.json() - 한 번 호출하면 연결 종료
res.json({ data: 'hello' });  // 이후 더 보낼 수 없음

// res.write() - 여러 번 호출 가능
res.write('첫 번째 ');
res.write('두 번째 ');
res.end();  // 명시적으로 종료
```

### Express로 구현하기

```typescript
import express from 'express';

const app = express();

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');

  const words = ['안녕', '하세요, ', '저는 ', 'AI', '입니다.'];
  let i = 0;

  const interval = setInterval(() => {
    if (i < words.length) {
      res.write(words[i]);
      i++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 500);
});
```

### OpenAI API 연동

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,  // 핵심!
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) res.write(content);
  }

  res.end();
});
```

### Next.js App Router로 구현하기

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

### 정리

| 구분 | 일반 응답 | 스트리밍 응답 |
|-----|---------|-------------|
| 전송 방식 | 전체 완성 후 한 번에 | 청크 단위로 즉시 |
| 헤더 | Content-Length | Transfer-Encoding: chunked |
| 메서드 | res.json() | res.write() + res.end() |
| 사용자 경험 | 로딩 후 한 번에 표시 | 점진적 표시 |
