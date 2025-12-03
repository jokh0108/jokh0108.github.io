---
title: "Jest의 beforeEach 블록 - 왜 테스트마다 환경을 초기화할까?"
summary: React Testing Library를 사용할 때 beforeEach 블록에서 Mock을 초기화하는 이유와 동작 원리를 이해해봅니다
date: 2025-11-24
draft: false
tags:
  - Testing
  - Jest
  - React
  - TDD
category1: Dev
category2: Testing
---

## 질문

Jest의 beforeEach 블록은 무엇이고, 왜 테스트마다 환경을 초기화해야 하나요?

## 답변

React Testing Library로 컴포넌트를 테스트하다 보면 항상 등장하는 `beforeEach` 블록. 이 코드가 정확히 무엇을 하는지, 왜 필요한지 알아봅시다.

### beforeEach 블록의 역할

```typescript
describe("Login Page", () => {
  const mockPush = jest.fn();
  const mockSignInWithPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (supabaseModule.supabase as any) = {
      auth: {
        signInWithPassword: mockSignInWithPassword,
      },
    };
  });
});
```

이 블록은 **각 테스트가 실행되기 전에 테스트 환경을 초기화**하는 역할을 합니다.

### 각 줄의 역할 설명

#### 1. jest.clearAllMocks()

```typescript
jest.clearAllMocks();
```

**목적**: 이전 테스트에서 남아있는 모의 함수 호출 기록을 삭제합니다.

**왜 필요한가?**

- 테스트들이 서로 영향을 주지 않도록 격리하기 위해
- 각 테스트가 깨끗한 상태에서 시작하도록 보장

**예시**:

```typescript
// Test 1
it("calls login API", () => {
  fireEvent.click(submitButton);
  expect(mockSignInWithPassword).toHaveBeenCalledTimes(1); // ✅ 통과
});

// Test 2 (clearAllMocks 없이)
it("handles error", () => {
  fireEvent.click(submitButton);
  expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
  // ❌ 실패! 실제로는 2번 호출됨 (Test 1의 호출 + Test 2의 호출)
});

// Test 2 (clearAllMocks 있으면)
it("handles error", () => {
  // beforeEach에서 호출 기록 초기화됨
  fireEvent.click(submitButton);
  expect(mockSignInWithPassword).toHaveBeenCalledTimes(1);
  // ✅ 통과! 이 테스트의 호출만 카운트
});
```

#### 2. useRouter 모킹

```typescript
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});
```

**목적**: Next.js의 라우터를 가짜 버전으로 교체합니다.

**왜 필요한가?**

- 실제 라우터를 사용하면 페이지 이동이 실제로 일어나 테스트 환경에서 문제 발생
- 라우팅 동작을 검증 가능하게 만듦

**실제 동작**:

```typescript
// 컴포넌트 내부에서
const router = useRouter();
router.push("/chat"); // 실제 페이지 이동 안 함, 호출만 기록

// 테스트에서 검증
expect(mockPush).toHaveBeenCalledWith("/chat"); // ✅ 호출 여부 확인
```

#### 3. Supabase 모킹

```typescript
(supabaseModule.supabase as any) = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
  },
};
```

**목적**: 실제 Supabase API 호출을 차단하고 테스트용 모의 함수로 교체합니다.

**왜 필요한가?**

- 실제 API 호출은 느림 (테스트가 수 초 걸림)
- API 응답이 일정하지 않을 수 있음
- 테스트 환경에서 실제 데이터베이스 접근은 위험

**효과**:

```typescript
// 테스트에서 성공 케이스 시뮬레이션
mockSignInWithPassword.mockResolvedValue({
  data: { user: { id: "123" } },
  error: null,
});

// 테스트에서 실패 케이스 시뮬레이션
mockSignInWithPassword.mockResolvedValue({
  data: null,
  error: { message: "Invalid credentials" },
});
```

### 비유로 이해하기

#### 실제 상황: 은행에서 송금 테스트

**문제**: "송금 버튼을 누르면 실제로 돈이 이동하는가?"

**beforeEach 없이 (위험)**

- ❌ 테스트할 때마다 실제로 돈이 이동됨
- ❌ 테스트가 느림 (실제 네트워크 통신)
- ❌ 이전 테스트의 데이터가 남아있어 다음 테스트에 영향

**beforeEach로 모킹 (안전)**

- ✅ 가짜 은행 시스템에서 테스트
- ✅ 빠르고 안전함 (실제 데이터 변경 없음)
- ✅ 각 테스트가 독립적으로 실행됨

### 핵심 요약

#### beforeEach가 하는 일

1. **격리**: 테스트들이 서로 영향을 주지 않도록 함
2. **초기화**: 깨끗한 상태에서 시작
3. **모킹**: 외부 의존성을 제어 가능한 가짜 객체로 교체

#### 장점

- ✅ 빠른 테스트 실행
- ✅ 안정적인 결과
- ✅ 외부 서비스에 의존하지 않음
- ✅ 원하는 시나리오를 쉽게 만들 수 있음

### 결론

`beforeEach`는 각 테스트를 "깨끗한 상태"에서 시작하게 하고, 외부 의존성(라우터, API)을 제어 가능한 모의 객체로 교체하여 **테스트의 신뢰성과 속도를 보장**합니다.

마치 실험실에서 매번 새로운 시약과 깨끗한 실험 도구로 실험을 시작하는 것과 같습니다. 이전 실험의 오염 없이 정확한 결과를 얻을 수 있죠.
