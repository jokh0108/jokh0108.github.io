---
title: "React 컴포넌트 테스트 - 무엇을 테스트해야 할까?"
summary: React Testing Library를 사용한 컴포넌트 테스트에서 주로 검증해야 할 7가지 핵심 항목
date: 2025-11-24
draft: false
tags:
  - Testing
  - React
  - Testing Library
  - Frontend
category1: Dev
category2: Testing
---

## 질문

React 컴포넌트를 테스트할 때 무엇을 테스트해야 하나요?

## 답변

React 컴포넌트를 테스트할 때 "무엇을 테스트해야 할까?"는 항상 고민되는 질문입니다. React Testing Library를 사용한 테스트의 핵심 항목들을 정리해봤습니다.

### 테스트의 기본 철학

> "사용자 관점에서 이 컴포넌트가 제대로 작동하는가?"

React Testing Library는 구현 세부사항이 아닌 **사용자가 실제로 경험하는 것**을 테스트하도록 설계되었습니다.

### 주요 테스트 항목 7가지

#### 1. UI 렌더링 (Rendering)

**무엇을 확인하는가?**
- 페이지가 제대로 나타나는가?
- 필요한 요소들이 모두 있는가?

```typescript
it('renders login form correctly', () => {
  render(<LoginPage />);

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
```

**핵심**: 사용자가 볼 수 있는 요소들이 실제로 렌더링되는지 확인

#### 2. 사용자 상호작용 (User Interaction)

**무엇을 확인하는가?**
- 입력했을 때 값이 변경되는가?
- 버튼 클릭이 제대로 작동하는가?

```typescript
it('allows user to type email and password', () => {
  render(<LoginPage />);

  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');
});
```

**핵심**: 사용자의 행동(타이핑, 클릭)이 의도대로 작동하는지 확인

#### 3. 입력 검증 (Input Validation)

**무엇을 확인하는가?**
- 잘못된 데이터를 거부하는가?
- 필수 입력을 확인하는가?

```typescript
it('validates email format', () => {
  render(<LoginPage />);

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  // 잘못된 이메일은 API 호출하지 않음
  expect(mockSignInWithPassword).not.toHaveBeenCalled();
});
```

**핵심**: 유효하지 않은 데이터로 중요한 작업(API 호출)을 하지 않는지 확인

#### 4. 비동기 작업 (Async Operations)

**무엇을 확인하는가?**
- API 호출이 제대로 되는가?
- 응답을 기다리고 처리하는가?

```typescript
it('successfully logs in and redirects to /chat', async () => {
  mockSignInWithPassword.mockResolvedValue({
    data: { user: { id: '123' } },
    error: null,
  });

  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // 비동기 작업 완료 대기
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/chat');
  });
});
```

**핵심**: 비동기 작업(API, 타이머)의 결과가 올바르게 처리되는지 확인

#### 5. 상태 변경 (State Management)

**무엇을 확인하는가?**
- 작업 후 상태가 올바르게 업데이트되는가?
- 상태에 따라 UI가 변경되는가?

```typescript
it('shows loading state while submitting', async () => {
  render(<LoginPage />);

  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  fireEvent.click(submitButton);

  // 로딩 중 버튼 텍스트 변경 확인
  expect(screen.getByText(/logging in/i)).toBeInTheDocument();

  // 로딩 중 버튼 비활성화 확인
  expect(submitButton).toBeDisabled();
});
```

**핵심**: 로그인 성공 후 페이지 이동, 로딩 상태 표시 등이 올바르게 작동하는지 확인

#### 6. 에러 처리 (Error Handling)

**무엇을 확인하는가?**
- 에러가 발생하면 메시지가 표시되는가?
- 사용자가 실패 원인을 알 수 있는가?

```typescript
it('shows error message on failed login', async () => {
  mockSignInWithPassword.mockResolvedValue({
    data: null,
    error: { message: 'Invalid login credentials' },
  });

  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpassword' }
  });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
  });
});
```

**핵심**: 실패 시나리오에서 적절한 피드백을 제공하는지 확인

#### 7. 외부 의존성 모킹 (Mocking Dependencies)

**무엇을 확인하는가?**
- 실제 API 없이 테스트 가능한가?
- 외부 서비스에 의존하지 않는가?

```typescript
// 테스트 상단에서 모킹
jest.mock('next/navigation');
jest.mock('@/lib/supabase');

// 테스트에서 동작 제어
mockSignInWithPassword.mockResolvedValue({
  data: { user: { id: '123' } },
  error: null,
});
```

**핵심**: 실제 네트워크 호출 없이 모든 시나리오를 빠르게 테스트

### 테스트하지 말아야 할 것

#### ❌ 구현 세부사항
```typescript
// 나쁜 예
it('calls useState with empty string', () => {
  expect(useState).toHaveBeenCalledWith('');
});
```

#### ❌ 스타일링
```typescript
// 나쁜 예
it('button has correct CSS class', () => {
  expect(button).toHaveClass('bg-blue-500');
});
```

#### ❌ 프레임워크 동작
```typescript
// 나쁜 예
it('React renders components', () => {
  // React 자체를 테스트하는 것은 의미 없음
});
```

### 테스트 작성 우선순위

#### Priority 1 (필수)
- ✅ 비즈니스 로직 (계산, 검증, 상태 관리)
- ✅ 주요 사용자 플로우 (로그인, 결제)
- ✅ 에러 처리

#### Priority 2 (중요)
- ⚠️ 조건부 렌더링
- ⚠️ 입력 검증
- ⚠️ 네비게이션

#### Priority 3 (선택)
- 💡 UI 렌더링 세부사항
- 💡 사소한 엣지 케이스

### 핵심 요약

React 컴포넌트 테스트의 7가지 핵심:

| 항목 | 확인 내용 |
|------|----------|
| 1️⃣ 렌더링 | 보여야 할 것이 보이는가? |
| 2️⃣ 상호작용 | 클릭/입력이 작동하는가? |
| 3️⃣ 검증 | 잘못된 데이터를 거부하는가? |
| 4️⃣ 비동기 | API 호출이 올바른가? |
| 5️⃣ 상태 | 변경사항이 반영되는가? |
| 6️⃣ 에러 | 실패를 잘 처리하는가? |
| 7️⃣ 모킹 | 외부 의존성을 제어하는가? |

### 결론

**"사용자 관점에서 이 페이지가 제대로 작동하는가?"**

이 질문에 답하는 테스트를 작성하세요. 구현 세부사항이 아닌 사용자 경험을 테스트하면, 리팩토링에도 강하고 유지보수하기 쉬운 테스트를 만들 수 있습니다.
