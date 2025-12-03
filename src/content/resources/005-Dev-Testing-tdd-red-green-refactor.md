---
title: "TDD 개발 플로우 - Red, Green, Refactor 사이클"
summary: Test-Driven Development의 핵심인 Red-Green-Refactor 사이클을 실전 예제로 이해하기
date: 2025-11-24
draft: false
tags:
  - TDD
  - Development
  - Best Practices
category1: Dev
category2: Testing
---

## 질문

TDD의 Red-Green-Refactor 사이클은 무엇이고, 실제로 어떻게 적용하나요?

## 답변

TDD(Test-Driven Development)의 핵심은 **Red-Green-Refactor 사이클**입니다. 이론은 간단하지만, 실전에서 어떻게 적용하는지 살펴봅시다.

### TDD의 핵심: Red-Green-Refactor

```
┌─────────────────────────────────────┐
│  1️⃣ RED (테스트 실패)              │
│  - 테스트 작성                       │
│  - 코드 없으니 실패 ❌              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  2️⃣ GREEN (테스트 통과)            │
│  - 최소한의 코드 작성               │
│  - 테스트 통과 ✅                   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  3️⃣ REFACTOR (개선)               │
│  - 코드 정리                        │
│  - 테스트는 계속 통과 ✅            │
└─────────────────────────────────────┘
           ↓ (반복)
```

### 실제 예시: Signup 페이지 개발

#### Step 1: RED - 테스트 작성

사용자가 원하는 기능을 테스트로 정의합니다:

```typescript
// app/signup/page.test.tsx
describe('Signup Page', () => {
  it('renders signup form correctly', () => {
    render(<SignupPage />);

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
});
```

테스트 실행:
```bash
$ pnpm test
❌ FAIL - SignupPage 컴포넌트가 없음!
```

#### Step 2: GREEN - 최소 코드로 통과

테스트를 통과시키기 위한 **최소한의 코드만** 작성합니다:

```typescript
// app/signup/page.tsx
export default function SignupPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <input aria-label="Email" />
      <input aria-label="Password" />
      <input aria-label="Confirm Password" />
      <button>Sign Up</button>
    </div>
  );
}
```

테스트 실행:
```bash
$ pnpm test
✅ PASS - 모든 요소가 렌더링됨!
```

#### Step 3: REFACTOR - 코드 정리

더 나은 구조로 개선하되, **테스트는 계속 통과**:

```typescript
// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign Up</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
```

테스트 실행:
```bash
$ pnpm test
✅ PASS - 여전히 모든 테스트 통과!
```

### 사이클 반복: 다음 기능 추가

#### Step 4: RED - 검증 기능 테스트

```typescript
it('validates email format', () => {
  render(<SignupPage />);

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /sign up/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  // invalid email이면 signup API 호출 안 함
  expect(mockSignUp).not.toHaveBeenCalled();
});
```

테스트 실행:
```bash
$ pnpm test
❌ FAIL - 검증 로직이 없음!
```

#### Step 5: GREEN - 검증 로직 추가

최소한의 검증 코드:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // 최소한의 검증
  if (!email.includes('@')) {
    return; // 호출 안 함
  }

  // signup 호출
  signUp(email, password);
};
```

테스트 실행:
```bash
$ pnpm test
✅ PASS
```

#### Step 6: REFACTOR - 검증 함수로 추출

```typescript
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }

  signUp(email, password);
};
```

테스트 실행:
```bash
$ pnpm test
✅ PASS - 더 나은 코드, 테스트는 여전히 통과!
```

### TDD 사이클 요약

| 단계 | 내용 | 상태 | 시간 |
|------|------|------|------|
| 1. RED | 테스트 작성 | ❌ 실패 | 2분 |
| 2. GREEN | 최소 코드로 통과 | ✅ 통과 | 3분 |
| 3. REFACTOR | 코드 정리/개선 | ✅ 통과 | 2분 |
| 4. 반복 | 다음 기능... | ↻ 순환 | - |

### 핵심 원칙

#### RED 단계에서
- ✅ 실패하는 테스트를 먼저 작성
- ✅ 한 번에 하나의 기능만 테스트
- ✅ 명확하고 읽기 쉬운 테스트

#### GREEN 단계에서
- ✅ 최소한의 코드만 작성
- ✅ 일단 통과시키는 것이 목표
- ❌ 완벽한 코드를 만들려 하지 말 것

#### REFACTOR 단계에서
- ✅ 코드 중복 제거
- ✅ 가독성 개선
- ✅ 구조 개선
- ❌ 새로운 기능 추가하지 말 것

### 결론

TDD의 핵심은 **작은 단위로, 자주, 테스트하며 개발**하는 것입니다.

#### Red-Green-Refactor의 가치
- **Red**: 무엇을 만들지 명확히 정의
- **Green**: 빠르게 작동하는 코드 작성
- **Refactor**: 안전하게 코드 개선

이 사이클을 반복하면:
- ✅ 버그가 적은 코드
- ✅ 자신감 있는 리팩토링
- ✅ 명확한 요구사항 문서 (테스트 자체가 문서)

"작은 단위로, 자주, 테스트하며 개발한다"
