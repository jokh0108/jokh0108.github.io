---
title: "Login 페이지로 배우는 TDD 실전 가이드"
summary: 실제 Login 페이지를 TDD로 개발하는 전체 과정을 13단계로 상세히 살펴보기
date: 2025-11-24
draft: false
tags:
  - TDD
  - React
  - Testing
  - Tutorial
category1: Dev
category2: Testing
---

## 질문

실제 Login 페이지를 TDD로 어떻게 개발하나요? 전체 과정을 보여주세요.

## 답변

프로젝트에서 실제로 Login 페이지를 TDD로 개발한 과정을 단계별로 설명합니다.

### Step 1: RED - 테스트 파일 작성

```typescript
// app/login/page.test.tsx
describe('Login Page', () => {
  it('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
❌ FAIL
error: Cannot find module './page' from 'app/login/page.test.tsx'
```

이유: `app/login/page.tsx` 파일이 없음!

### Step 2: GREEN - 최소 코드로 테스트 통과

```typescript
// app/login/page.tsx
export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <input aria-label="Email" />
      <input aria-label="Password" />
      <button>Login</button>
    </div>
  );
}
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
✅ PASS - Login Page › renders login form correctly
```

### Step 3: REFACTOR - UI 개선

테스트는 유지하고 코드 품질 개선:

```typescript
// app/login/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
✅ PASS - 여전히 모든 요소 렌더링됨!
```

### Step 4: RED - 이메일 검증 테스트 추가

```typescript
// app/login/page.test.tsx
it('validates email format', () => {
  render(<LoginPage />);

  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const submitButton = screen.getByRole('button', { name: /login/i });

  // ❌ 잘못된 이메일 입력
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  // 검증 실패하면 Supabase 호출 안 해야 함
  expect(mockSignInWithPassword).not.toHaveBeenCalled();
});
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
❌ FAIL
Expected: not to be called
Received: was called 1 time
```

이유: 검증 로직이 없어서 무조건 API 호출됨!

### Step 5: GREEN - 검증 로직 추가

```typescript
// app/login/page.tsx
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 검증 추가
    if (!validateEmail(email)) {
      return; // 호출 안 함
    }

    // 올바르면 로그인
    supabase.auth.signInWithPassword({ email, password });
  };

  return (
    // ... JSX (변경 없음)
  );
}
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
✅ PASS - validates email format
✅ PASS - renders login form correctly
```

### Step 6: REFACTOR - 코드 구조 개선

```typescript
// app/login/page.tsx
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 검증 함수 분리
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 폼 제출 (검증만)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setError('');
    handleLogin();
  };

  // 로그인 (비동기)
  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (data.user) {
      router.push('/chat');
    }
  };

  return (
    // ... JSX
  );
}
```

실행:
```bash
$ pnpm test -- app/login/page.test.tsx
✅ PASS - 모든 테스트 여전히 통과!
```

### Step 7-12: 계속 반복...

같은 방식으로 다음 기능들을 하나씩 추가:

- **Step 7**: 비밀번호 검증 테스트 추가
- **Step 8**: 에러 메시지 렌더링
- **Step 9**: 성공적인 로그인 테스트
- **Step 10**: 로그인 로직 완성
- **Step 11**: 로그인 실패 테스트
- **Step 12**: 에러 처리 완성

### Step 13: REFACTOR - 최종 정리

최종 테스트:
```bash
$ pnpm test -- app/login/page.test.tsx

PASS app/login/page.test.tsx
  Login Page
    ✓ renders login form correctly
    ✓ validates email format
    ✓ validates password is not empty
    ✓ successfully logs in and redirects to /chat
    ✓ shows error message on failed login

Test Suites: 1 passed, 1 total
Tests: 5 passed, 5 total
```

### TDD 사이클 요약

```
RED 1    → GREEN 1    → REFACTOR 1
  ❌        ✅            ✅
테스트 작성   기본 UI     UI 개선

RED 2    → GREEN 2    → REFACTOR 2
  ❌        ✅            ✅
이메일검증   검증추가    에러처리

RED 3    → GREEN 3    → REFACTOR 3
  ❌        ✅            ✅
로그인성공   API호출    리다이렉트

RED 4    → GREEN 4    → REFACTOR 4
  ❌        ✅            ✅
실패처리    에러표시    최종정리
```

총 5개 테스트 ✅ 모두 PASS

### 핵심 포인트

| 단계       | 시간  | 상태  | 목표      |
|----------|-----|-----|---------|
| RED      | 2분  | ❌   | 테스트 정의  |
| GREEN    | 3분  | ✅   | 통과만 하기  |
| REFACTOR | 2분  | ✅   | 더 나은 코드 |
| RED      | 2분  | ❌   | 다음 기능   |
| ...      | ... | ... | ...     |

**"작은 기능을 하나씩 테스트하며 안전하게 개발한다"**
