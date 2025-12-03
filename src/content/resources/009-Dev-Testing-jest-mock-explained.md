---
title: "jest.mock() - 진짜를 가짜로 바꾸는 마법"
summary: jest.mock()이 테스트 코드에서 어떻게 동작하는지, 왜 필요한지 완벽 가이드
date: 2025-11-24
draft: false
tags:
  - Jest
  - Testing
  - JavaScript
  - Mocking
category1: Dev
category2: Testing
---

## 질문

테스트 코드 상단에 항상 등장하는 `jest.mock()`이 정확히 무엇을 하는지, 왜 필요한지 궁금합니다.

## 답변

`jest.mock()`은 **"진짜를 가짜로 바꾸는 마법"**입니다.

### jest.mock()의 역할

```typescript
jest.mock('next/navigation');  // ← 라우터를 가짜로
jest.mock('@/lib/supabase');   // ← Supabase를 가짜로
```

### Before vs After

**Before (Mock 없이)**

```typescript
// LoginPage.tsx
import { useRouter } from 'next/navigation';  // 진짜 라우터
import { supabase } from '@/lib/supabase';    // 진짜 Supabase

export default function LoginPage() {
  const router = useRouter();  // 진짜 Next.js 라우터

  const handleLogin = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email, password
    });  // 진짜 Supabase API 호출

    router.push('/chat');  // 진짜 페이지 이동 시도
  };
}
```

테스트 실행하면:
```bash
❌ Error: useRouter() is only available in Client Components
❌ Error: Network request failed (Supabase)
❌ Error: Cannot navigate outside test environment
```

**After (Mock 적용)**

```typescript
// page.test.tsx
jest.mock('next/navigation');  // ← 이 줄이 마법을 부림!
jest.mock('@/lib/supabase');   // ← 이 줄도!

import LoginPage from './page';

// LoginPage 안에서:
// - useRouter()는 가짜 함수를 반환
// - supabase는 가짜 객체로 교체됨
```

테스트 실행하면:
```bash
✅ PASS - 문제없이 실행됨!
```

### Step-by-Step: 무슨 일이 일어나나?

**Step 1: Mock 선언**

```typescript
jest.mock('next/navigation');
```

Jest가 하는 일:
```
1. "next/navigation 모듈을 찾아라"
2. "그 모듈의 모든 export를 가짜로 바꿔라"
3. "실제 모듈 대신 가짜를 사용해라"
```

**Step 2: Import 가로채기**

```typescript
// LoginPage.tsx에서
import { useRouter } from 'next/navigation';
```

원래라면:
```
next/navigation 패키지 로드
  ↓
실제 useRouter 함수 가져옴
  ↓
Next.js 라우터 인스턴스 반환
```

Mock 후에는:
```
jest.mock('next/navigation') 확인
  ↓
가짜 useRouter 함수 가져옴
  ↓
jest.fn() (빈 함수) 반환
```

### 실제 동작 예시

**1️⃣ Next.js Router Mock**

```typescript
// page.test.tsx
jest.mock('next/navigation');
import { useRouter } from 'next/navigation';

// useRouter는 이제 jest.fn()
console.log(typeof useRouter);  // 'function'
console.log(useRouter._isMockFunction);  // true

// 실제 테스트에서 설정
(useRouter as jest.Mock).mockReturnValue({
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
});
```

결과:
```typescript
// LoginPage.tsx 안에서
const router = useRouter();
// router = { push: [Function], back: [Function], forward: [Function] }

router.push('/chat');
// 실제 페이지 이동 안 함!
// 단지 함수 호출만 기록됨

// 테스트에서 확인 가능:
expect(router.push).toHaveBeenCalledWith('/chat');  // ✅
```

**2️⃣ Supabase Mock**

```typescript
// page.test.tsx
jest.mock('@/lib/supabase');
import * as supabaseModule from '@/lib/supabase';

// supabaseModule.supabase는 이제 undefined
console.log(supabaseModule.supabase);  // undefined

// 수동으로 가짜 객체 설정
(supabaseModule.supabase as any) = {
  auth: {
    signInWithPassword: jest.fn(),
  },
};
```

### 왜 이렇게 하는가?

**1. 속도 ⚡**

```typescript
// Mock 없이
await supabase.auth.signInWithPassword()
// → 실제 네트워크 요청 (500ms~2s)

// Mock 사용
mockSignInWithPassword()
// → 즉시 반환 (0.001ms)
```

**2. 격리 🧪**

```
Mock 없이:
- Supabase 서버 다운 → 테스트 실패
- 네트워크 느림 → 테스트 느림
- 다른 테스트의 데이터 영향

Mock 사용:
- 외부 의존성 없음
- 항상 동일한 결과
- 독립적인 테스트
```

**3. 제어 🎮**

```typescript
// Mock 없이
- API 에러를 어떻게 발생시키지?
- 특정 상황을 어떻게 만들지?

// Mock 사용
mockSignInWithPassword.mockResolvedValue({
  error: { message: 'User not found' }
});
// → 원하는 대로 에러 발생!
```

### 핵심 개념

**Mock = "껍데기만 남기고 속은 비우기"**

```typescript
// 진짜 useRouter (복잡함)
function useRouter() {
  const ctx = React.useContext(RouterContext);
  const pathname = window.location.pathname;
  // ... 100줄의 복잡한 로직
  return {
    push: (url) => {
      window.history.pushState({}, '', url);
      // ... 50줄의 복잡한 로직
    },
  };
}

// Mock된 useRouter (단순함)
const useRouter = jest.fn(() => ({
  push: jest.fn(),  // 빈 함수
}));
```

### 비유

영화 촬영에서 진짜 총 대신 소품 총 사용하는 것과 같음:

**진짜 총**: 위험함 ⚠️, 통제 불가, 문제 생기면 큰일
**소품 총**: 안전함 ✅, 연출 가능, 언제든 멈출 수 있음

### 결론

`jest.mock()`은 테스트를 위한 안전한 가짜 환경을 만듭니다. 실제 네트워크 호출, 페이지 이동, 데이터베이스 접근 없이도 모든 시나리오를 빠르고 안전하게 테스트할 수 있습니다.

**"Mock = 테스트를 위한 안전한 가짜 환경"** 🎭
