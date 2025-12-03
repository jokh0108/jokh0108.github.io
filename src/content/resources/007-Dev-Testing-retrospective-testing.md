---
title: "이미 작성한 코드에 테스트 추가하기 - 후행 테스트 전략"
summary: 코드를 먼저 작성했을 때 효과적으로 테스트를 추가하는 실전 가이드
date: 2025-11-24
draft: false
tags:
  - Testing
  - TDD
  - Best Practices
  - Refactoring
category1: Dev
category2: Testing
---

## 질문

코드는 이미 있고 테스트는 없는 경우, 어떻게 테스트를 추가해야 하나요?

## 답변

현실에서 가장 흔한 상황: 코드는 이미 있고 테스트는 없는 경우, 어떻게 해야 할까요?

### 전략: 후행 테스트 (Retrospective Testing)

```
┌─────────────────────────────────────┐
│  현재 상태: 코드는 있고 테스트 없음  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  1️⃣ 현재 동작을 테스트로 고정      │
│  2️⃣ 리팩토링 안전장치 확보          │
│  3️⃣ 버그 수정 시 테스트 추가        │
└─────────────────────────────────────┘
```

### Step 1: 현재 동작을 테스트로 "고정"

**목표: 지금 작동하는 것을 깨트리지 않기**

#### 1-1. 가장 중요한 것부터 (Happy Path)

```typescript
// app/login/page.test.tsx
describe('Login Page', () => {
  it('successfully logs in with valid credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    render(<LoginPage />);

    // 현재 작동하는 시나리오를 테스트로 고정
    fireEvent.change(
      screen.getByLabelText(/email/i),
      { target: { value: 'test@example.com' } }
    );
    fireEvent.change(
      screen.getByLabelText(/password/i),
      { target: { value: 'password123' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/chat');
    });
  });
});
```

실행:
```bash
$ pnpm test
✅ PASS - 현재 동작이 "고정"됨
```

**이제 리팩토링해도 안전함!**

#### 1-2. 주요 실패 케이스 추가

```typescript
it('shows error for invalid credentials', async () => {
  mockSignInWithPassword.mockResolvedValue({
    data: null,
    error: { message: 'Invalid login credentials' },
  });

  render(<LoginPage />);

  fireEvent.change(
    screen.getByLabelText(/email/i),
    { target: { value: 'wrong@example.com' } }
  );
  fireEvent.change(
    screen.getByLabelText(/password/i),
    { target: { value: 'wrongpassword' } }
  );
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
```

#### 1-3. Edge Case는 나중에

```typescript
it('validates email format', () => {
  render(<LoginPage />);

  fireEvent.change(
    screen.getByLabelText(/email/i),
    { target: { value: 'invalid-email' } }
  );
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // 잘못된 이메일은 API 호출 안 함
  expect(mockSignInWithPassword).not.toHaveBeenCalled();
});
```

### Step 2: 코드 이해하면서 테스트 추가

#### 2-1. 코드 읽기 → 테스트 작성

```typescript
// 코드를 읽으면서 질문하기:
// "이 함수는 뭘 하는가?"
const validateEmail = (email: string) => {
  return email.includes('@');
};

// → 테스트 추가
it('validates email with @ symbol', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid-email')).toBe(false);
});
```

#### 2-2. 버그를 발견하면?

```typescript
// 코드 읽다가 발견한 버그:
// "email.includes('@')는 너무 약한 검증 아닌가?"
// test@@example.com도 통과함!

// 1. 먼저 현재 동작을 테스트로 고정
it('accepts double @ symbol (bug)', () => {
  expect(validateEmail('test@@example.com')).toBe(true);
});

// 2. 수정 후 원하는 동작 테스트 작성
it('rejects double @ symbol', () => {
  expect(validateEmail('test@@example.com')).toBe(false);
});

// 3. 코드 수정
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 4. 테스트 실행
$ pnpm test
✅ PASS - 버그 수정 완료!
```

### Step 3: 리팩토링 전 테스트 추가

```typescript
// 리팩토링하고 싶은 코드
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.includes('@')) {
    setError('Invalid email');
    return;
  }

  if (!password) {
    setError('Password required');
    return;
  }

  const { data, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    setError(authError.message);
    return;
  }

  router.push('/chat');
};
```

**리팩토링 전에 테스트 추가:**

```typescript
describe('handleSubmit validation', () => {
  it('validates email before API call', () => {
    // 테스트 작성
  });

  it('validates password before API call', () => {
    // 테스트 작성
  });

  it('calls API with correct credentials', () => {
    // 테스트 작성
  });
});
```

테스트 통과 확인:
```bash
$ pnpm test
✅ PASS - 현재 동작 고정됨
```

**이제 안전하게 리팩토링:**

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // 검증 분리
  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }

  if (!password) {
    setError('Password required');
    return;
  }

  // 비동기 로그인 분리
  handleLogin();
};

const handleLogin = async () => {
  const { data, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    setError(authError.message);
    return;
  }

  router.push('/chat');
};
```

테스트 실행:
```bash
$ pnpm test
✅ PASS - 리팩토링해도 모든 테스트 통과!
```

### 우선순위 가이드

어떤 테스트부터 작성할까?

```
Priority 1 (필수) ⭐⭐⭐
├─ Happy Path (정상 동작)
├─ Critical Error Cases (치명적 에러)
└─ 가장 자주 사용되는 기능

Priority 2 (중요) ⭐⭐
├─ Edge Cases (경계값)
├─ 입력 검증
└─ 비즈니스 로직

Priority 3 (선택) ⭐
├─ UI 렌더링
├─ 스타일링
└─ 사소한 케이스
```

### 테스트 작성 순서

```typescript
// ✅ 1. Happy Path (가장 중요)
it('successfully logs in and redirects to /chat', async () => { ... });

// ✅ 2. Critical Error
it('shows error message on failed login', async () => { ... });

// ✅ 3. Input Validation
it('validates email format', () => { ... });
it('validates password is not empty', () => { ... });

// ✅ 4. UI Rendering (나중에)
it('renders login form correctly', () => { ... });
```

### 시간 배분

1시간 작업 기준:

- **20분** → Happy Path + Critical Error
- **20분** → Input Validation
- **10분** → Edge Cases
- **10분** → UI Tests (선택)

### 요약: 후행 테스트 전략

| 단계                | 목표       | 시간  |
|-------------------|----------|-----|
| 1️⃣ Happy Path 고정 | 현재 동작 보존 | 20분 |
| 2️⃣ Error Cases   | 에러 처리 검증 | 20분 |
| 3️⃣ Edge Cases    | 경계값 검증   | 10분 |
| 4️⃣ Refactor      | 안전한 개선   | 30분 |

**"완벽한 테스트보다, 핵심 기능을 보호하는 테스트가 낫다"**

### 마지막 팁

코드 작성 후 테스트 추가할 때:

1. **불 끄기 (버그 수정)**
   - 버그 재현 테스트 작성
   - 버그 수정
   - 테스트 통과 확인

2. **방화벽 만들기 (주요 기능 보호)**
   - Happy Path 테스트
   - Critical Error 테스트

3. **리팩토링 (코드 개선)**
   - 테스트가 있으니 안전하게 개선
   - 테스트 통과하는지 계속 확인

4. **점진적 개선**
   - 새 기능 추가할 때마다 테스트도 추가
   - 서서히 테스트 커버리지 증가

**핵심: 완벽하게 하려고 하지 말고, 조금씩 개선하기!**
