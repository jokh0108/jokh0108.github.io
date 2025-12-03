---
title: "Unit/Integration 테스트 vs E2E 테스트 - 무엇이 다를까?"
summary: 같은 로그인 기능을 테스트하지만 접근 방식이 완전히 다른 두 테스트 전략 비교
date: 2025-11-24
draft: false
tags:
  - Testing
  - E2E
  - Unit Testing
  - Testing Strategy
category1: Dev
category2: Testing
---

## 질문

Unit/Integration 테스트와 E2E 테스트는 무엇이 다른가요?

## 답변

React Testing Library로 작성한 테스트가 "시나리오를 가정한다"는 점에서 E2E와 비슷해 보이지만, 실제로는 완전히 다릅니다. 그 차이를 명확히 알아봅시다.

### 핵심 차이: Mock vs 실제

#### 현재 테스트 (Unit/Integration - Mock 사용)

```typescript
// app/login/page.test.tsx
jest.mock('next/navigation');  // ← 라우터를 가짜로
jest.mock('@/lib/supabase');   // ← Supabase를 가짜로

it('successfully logs in and redirects to /chat', async () => {
  // 가짜 환경
  mockSignInWithPassword.mockResolvedValue({
    data: { user: { id: '123' } },
    error: null,
  });

  render(<LoginPage />);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/chat');
  });
});
```

**특징**:
- ✅ 빠름 (0.5초)
- ✅ 가짜 API (mock)
- ✅ 가짜 라우터 (mock)
- ✅ 격리된 환경
- ❌ 실제 동작은 확인 못함

#### E2E 테스트 (실제 환경)

```typescript
// e2e/login.spec.ts (Playwright/Cypress)
test('user can log in and see chat page', async ({ page }) => {
  // 실제 브라우저
  await page.goto('http://localhost:3000/login');

  // 실제 입력
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');

  // 실제 클릭
  await page.click('button:has-text("Login")');

  // 실제 API 호출 → Supabase 서버
  // 실제 페이지 이동 → /chat

  // 실제 URL 확인
  await expect(page).toHaveURL('http://localhost:3000/chat');

  // 실제 DOM 확인
  await expect(page.locator('h1')).toHaveText('Chat');
});
```

**특징**:
- ✅ 실제 브라우저 (Chrome)
- ✅ 실제 API 호출
- ✅ 실제 페이지 이동
- ✅ 사용자 경험 검증
- ❌ 느림 (5-10초)
- ❌ 불안정 (네트워크, DB 상태)

### 환경의 차이

| 항목 | Unit/Integration | E2E |
|------|-----------------|-----|
| 브라우저 | ❌ jsdom (가짜) | ✅ Chrome (진짜) |
| 서버 | ❌ Mock | ✅ localhost:3000 |
| API | ❌ Mock | ✅ 실제 호출 |
| DB | ❌ Mock | ✅ 실제 DB |
| 네트워크 | ❌ 없음 | ✅ HTTP 요청 |
| CSS/Animation | ❌ 미검증 | ✅ 실제 렌더링 |

### 시각적 비교

#### Unit/Integration 테스트

```
┌─────────────────────────────────┐
│  Jest Test Runner (메모리)       │
│                                  │
│  ┌────────────────────┐          │
│  │ <LoginPage />      │          │
│  │  - email input     │  ← jsdom│
│  │  - password input  │    (가짜)│
│  │  - submit button   │          │
│  └────────────────────┘          │
│                                  │
│  mockSupabase.signIn()  ← 가짜  │
│  mockRouter.push()      ← 가짜  │
└─────────────────────────────────┘

속도: ⚡ 0.5초
안정성: ✅ 높음
현실성: ❌ 낮음
```

#### E2E 테스트

```
┌─────────────────────────────────┐
│  실제 Chrome 브라우저             │
│  ┌────────────────────────────┐ │
│  │ http://localhost:3000/login │ │
│  │                             │ │
│  │  ┌──────────────────┐       │ │
│  │  │ Login            │       │ │
│  │  │ ────────────────  │       │ │
│  │  │ Email: [____]    │       │ │
│  │  │ Password: [____] │       │ │
│  │  │ [ Login ]        │       │ │
│  │  └──────────────────┘       │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
         ↓ 실제 HTTP
┌─────────────────────────────────┐
│  Next.js Server (localhost:3000) │
└─────────────────────────────────┘
         ↓ 실제 API 호출
┌─────────────────────────────────┐
│  Supabase (실제 서버)            │
└─────────────────────────────────┘

속도: 🐌 5-10초
안정성: ⚠️ 중간
현실성: ✅ 높음
```

### 테스트 피라미드

```
           🔺 E2E 테스트
          ╱    ╲
         ╱ 10개 ╲      ← 느리지만 현실적
        ╱────────╲
       🔺 Integration
      ╱            ╲
     ╱    50개      ╲   ← 중간
    ╱──────────────╲
   🔺 Unit Tests        👈 현재 작성하는 테스트
  ╱                  ╲
 ╱      200개         ╲ ← 빠르고 많이
╱──────────────────────╲

권장 비율:
- Unit: 70%
- Integration: 20%
- E2E: 10%
```

### 언제 뭘 쓸까?

#### Unit/Integration 테스트 (현재 작성한 것)

```
✅ 빠른 피드백 필요
✅ 특정 컴포넌트 로직 검증
✅ 개발 중 자주 실행
✅ CI/CD 파이프라인
✅ 버그 수정 후 회귀 방지

예: "이메일 검증 로직이 맞나?"
예: "에러 메시지가 제대로 표시되나?"
```

#### E2E 테스트

```
✅ 전체 사용자 플로우 검증
✅ 배포 전 최종 확인
✅ 여러 페이지 연결 확인
✅ 실제 브라우저 동작

예: "회원가입 → 로그인 → 채팅 → 로그아웃" 전체 플로우
예: "결제 프로세스가 실제로 작동하나?"
```

### 이상적인 조합

```bash
# 개발 중 (자주 실행)
$ pnpm test
✅ 200개 Unit Tests (5초)

# 커밋 전
$ pnpm test && pnpm test:e2e-critical
✅ 200개 Unit Tests (5초)
✅ 5개 Critical E2E (30초)

# 배포 전
$ pnpm test:all
✅ 200개 Unit Tests
✅ 50개 Integration Tests
✅ 10개 E2E Tests
→ 전체 2분
```

### 핵심 요약

#### 현재 Login 테스트는 Unit/Integration 테스트

- Mock을 사용해 외부 의존성 제거
- 빠르고 안정적
- 컴포넌트 로직에 집중
- 실제 환경은 확인 못함

#### E2E 테스트와의 차이

- 실제 브라우저 vs 가상 환경
- 실제 API vs Mock
- 느리지만 현실적 vs 빠르지만 제한적

### 결론

"빠른 피드백은 Unit, 최종 검증은 E2E"

두 테스트는 서로 보완적입니다. Unit/Integration 테스트로 빠르게 개발하고, E2E 테스트로 최종 사용자 경험을 검증하는 것이 이상적입니다.
