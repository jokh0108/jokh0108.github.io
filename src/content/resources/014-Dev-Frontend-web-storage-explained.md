---
title: "웹 스토리지 완벽 정리 - localStorage, AsyncStorage, IndexedDB"
summary: 왜 React Native는 AsyncStorage고, 브라우저는 localStorage일까? 웹 스토리지의 역사와 차이점을 이해하기
date: 2025-12-02
draft: false
tags:
  - JavaScript
  - React Native
  - Web Storage
  - Browser
category1: Dev
category2: Frontend
---

## 질문

React Native는 왜 AsyncStorage이고, 브라우저는 왜 localStorage(동기)인지 궁금합니다.

## 답변

### React Native는 왜 AsyncStorage인가?

React Native에는 브라우저의 `localStorage` 같은 **동기(Sync) 스토리지**가 없습니다.

이유는 간단합니다:
- **브라우저가 아님** → DOM/`localStorage` 없음
- **네이티브 모듈과 브리지 통신** → I/O가 비동기로 설계
- **네이티브 디스크 접근 비용** → JS 메인 스레드 안 막으려고 비동기 API 사용

```typescript
// React Native - 비동기
const value = await AsyncStorage.getItem('key');

// 브라우저 - 동기
const value = localStorage.getItem('key');
```

### 브라우저의 localStorage는 왜 동기일까?

**당시 브라우저/웹의 전제** 때문에 동기로 설계됐습니다.

1. **초창기 전제: 작고 빠른 연산만** - "아주 작은 문자열 몇 개" 수준이라 동기로 막혀도 큰 문제 없다고 봄
2. **개발자 경험(단순함) 우선** - 콜백/Promise 같은 비동기 패턴보다 직관적인 동기 API가 선호됨
3. **나중에야 한계가 드러남** - 앱이 커지면서 **IndexedDB(비동기)**를 나중에 따로 만듦

### 메인 스레드 블로킹이 왜 문제인가?

브라우저에서 **JS 실행 + 렌더링 + 유저 입력 처리**가 대부분 **같은 메인 스레드**에서 돌아갑니다.

```
동기 I/O 실행 → 메인 스레드 블로킹
  ↓
- 화면 리렌더 안 됨
- 클릭/스크롤 입력 늦게 처리
- 애니메이션/스크롤 끊김 (jank)
```

**언제 "무거운" 접근이 생기나?**

1. localStorage 자체가 커질 때 (수백 KB~MB 단위)
2. 잘못된 사용 패턴 (스크롤 이벤트마다, 렌더링마다 접근)
3. 규모가 커진 웹앱 (SPA, 노션/피그마급 웹앱)

### IndexedDB는 언제 쓸까?

```
localStorage        IndexedDB
─────────────────────────────────────
동기               비동기
간단               복잡 (트랜잭션, 인덱스)
소량 데이터         대용량 데이터
문자열만           구조화된 데이터 (객체)
```

**IndexedDB가 적합한 경우:**
- 데이터가 크거나 많을 때 (수십 KB+)
- 오프라인/PWA 지원
- 구조화된 데이터 + 쿼리 필요
- 메인 스레드 안 막고 싶을 때

### 브라우저 스토리지 전체 구조

```
┌─────────────────────────────────────┐
│           브라우저                   │
├─────────────────────────────────────┤
│  localStorage    sessionStorage     │
│    (동기)          (동기)           │
│                                     │
│  IndexedDB      Cache Storage       │
│   (비동기)        (비동기)          │
│                                     │
│  Cookies                            │
└─────────────────────────────────────┘
```

### 정리

| 특성 | localStorage | AsyncStorage (RN) | IndexedDB |
|------|--------------|-------------------|-----------|
| 동기/비동기 | 동기 | 비동기 | 비동기 |
| 데이터 형태 | 문자열만 | 문자열만 | 객체, 바이너리 |
| 용량 | ~5MB | 제한 없음 | 많음 |
| 쿼리/인덱스 | 불가 | 불가 | 가능 |
| 사용 시점 | 소량 설정 | RN 앱 전반 | 대용량/오프라인 |

**결론:**
- 작은 설정 몇 개 → `localStorage`
- React Native → `AsyncStorage`
- 대용량/오프라인/구조화 → `IndexedDB` (보통 라이브러리 경유)

스토리지 선택은 **"데이터 크기"**와 **"메인 스레드 영향"**을 기준으로 판단하면 됩니다.
