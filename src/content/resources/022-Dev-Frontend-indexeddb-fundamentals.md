---
title: "IndexedDB 핵심 원리 정리"
summary: 브라우저 내장 NoSQL DB의 CRUD, Cursor 순회, Float32Array 변환까지
date: 2025-01-15
draft: false
tags:
  - JavaScript
  - IndexedDB
  - Browser Storage
  - Web API
category1: Dev
category2: Frontend
---

## 질문

IndexedDB 코드 원리를 알려줘.

## 답변

### IndexedDB란?

IndexedDB는 브라우저에 내장된 **NoSQL 데이터베이스**입니다. localStorage와 달리 대용량 데이터(오디오 등)를 저장할 수 있고, 비동기로 동작하여 UI를 블로킹하지 않습니다.

### 핵심 구조

```
┌─────────────────────────────────────────────────────┐
│  Browser                                            │
│  ┌─────────────────────────────────────────────────┐│
│  │  IndexedDB (NoSQL)                              ││
│  │  ┌─────────────────────────────────────────────┐││
│  │  │  Database: "my-app"                         │││
│  │  │  ┌─────────────────────────────────────────┐│││
│  │  │  │  Object Store: "scripts"                ││││
│  │  │  │  ├── id (Primary Key)                   ││││
│  │  │  │  ├── Index: createdAt (정렬용)          ││││
│  │  │  │  └── Index: category (필터링용)         ││││
│  │  │  └─────────────────────────────────────────┘│││
│  │  └─────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 데이터베이스 열기

```javascript
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // indexedDB.open(이름, 버전) - DB 열기 요청
    const request = indexedDB.open('my-app', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    // 스키마 업그레이드 (최초 생성 또는 버전 변경 시)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Object Store 생성 (테이블과 유사)
      const store = db.createObjectStore('scripts', { keyPath: 'id' })
      
      // Index 생성 - 특정 필드로 빠른 조회/정렬 가능
      store.createIndex('createdAt', 'createdAt', { unique: false })
    }
  })
}
```

### CRUD 패턴

```javascript
// CREATE/UPDATE - put()은 upsert
const tx = db.transaction('scripts', 'readwrite')
const store = tx.objectStore('scripts')
store.put({ id: '123', title: 'Hello' })

// READ - 단일 조회
store.get('123')

// READ - 전체 조회 (Cursor 사용)
const index = store.index('createdAt')
const request = index.openCursor(null, 'prev') // 내림차순

request.onsuccess = (event) => {
  const cursor = event.target.result
  if (cursor) {
    console.log(cursor.value) // 현재 레코드
    cursor.continue()         // 다음 레코드로
  }
}

// DELETE
store.delete('123')
```

### Float32Array 변환 (오디오 저장 시)

IndexedDB에 `Float32Array`(오디오 데이터)를 저장할 때는 일반 배열로 변환해야 안전합니다:

```javascript
// 저장 시: Float32Array → number[]
const stored = {
  ...audioSegment,
  channelData: Array.from(audioSegment.channelData)
}

// 읽을 때: number[] → Float32Array
const restored = {
  ...stored,
  channelData: new Float32Array(stored.channelData)
}
```

### 핵심 포인트

1. **콜백 → Promise 변환**: `new Promise()`로 감싸서 `async/await` 사용
2. **Transaction**: 모든 읽기/쓰기는 `transaction()` 내에서 수행
3. **Cursor**: `openCursor('prev')`로 정렬된 순서로 순회
4. **Index**: 특정 필드로 빠른 조회/정렬 가능
