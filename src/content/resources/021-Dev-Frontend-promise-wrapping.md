---
title: "Promise 래핑은 왜 하는 걸까?"
summary: IndexedDB 같은 콜백 기반 API를 Promise로 감싸서 async/await로 사용하는 이유
date: 2025-01-15
draft: false
tags:
  - JavaScript
  - Promise
  - IndexedDB
  - async/await
category1: Dev
category2: Frontend
---

## 질문

Promise 래핑은 왜 하는 거야?

## 답변

**Promise 래핑**을 하는 이유는 IndexedDB의 구식 API 때문입니다.

### IndexedDB의 원래 방식 (콜백 지옥)

```javascript
// 콜백 기반 - 중첩이 깊어지고 에러 처리가 복잡함
const request = indexedDB.open('myDB', 1)

request.onsuccess = (event) => {
  const db = event.target.result
  const tx = db.transaction('store', 'readonly')
  const store = tx.objectStore('store')
  const getRequest = store.get('id')
  
  getRequest.onsuccess = () => {
    console.log(getRequest.result)
    // 또 다른 작업이 필요하면 또 중첩...
  }
  getRequest.onerror = () => { /* 에러 처리 */ }
}
request.onerror = () => { /* 에러 처리 */ }
```

### Promise 래핑 후 (깔끔한 async/await)

```javascript
// Promise로 감싸면 이렇게 사용 가능
const db = await openDB()
const script = await getScript('id')
await saveScript(newScript)

// try/catch로 에러 처리도 간단
try {
  await saveScript(script)
} catch (error) {
  console.error('저장 실패:', error)
}
```

### 핵심 비교

| 콜백 방식 | Promise 방식 |
|-----------|--------------|
| 중첩 깊어짐 (콜백 지옥) | 플랫한 코드 |
| 에러 처리 분산 | `try/catch` 통합 |
| 순차 실행 어려움 | `await`로 간단 |
| 가독성 나쁨 | 동기 코드처럼 읽힘 |

IndexedDB는 2010년대 초반에 설계되어서 `Promise`가 없던 시절의 API입니다. 그래서 현대적인 `async/await` 패턴으로 쓰려면 래핑이 필요합니다.
