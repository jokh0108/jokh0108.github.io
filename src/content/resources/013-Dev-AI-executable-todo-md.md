---
title: "실행 가능한 TODO.md 만들기 - AI가 한 번에 앱을 만들 수 있을까?"
summary: TODO.md 하나로 전체 앱을 구현하는 것이 가능한가? 가능성 분석과 실전 전략, Checkpoint 시스템 구축 방법
date: 2025-11-25
draft: false
tags:
  - AI
  - Automation
  - Project Management
  - Claude
  - Prompting
category1: Dev
category2: AI
---

## 질문

"@TODO.md를 실행해줘"라고 한 번만 말하면 AI가 전체 앱을 만들어 줄 수 있을까요?

## 답변

기술적으로는 가능합니다. 하지만 현실적으로는 몇 가지 개선이 필요합니다.

### 일반적인 TODO.md의 문제점

```markdown
## Phase 3: Chat Interface
- [ ] Write test: Login form renders correctly
- [ ] Implement login page (/login)
```

**문제점**: 애매한 요구사항, 의존성 불명확, 검증 방법 없음, 롤백 계획 없음

### 실행 가능한 TODO.md의 4가지 핵심 요소

**1️⃣ 구체적인 컨텍스트**
```markdown
#### Context
- Location: `app/login/page.tsx`
- Dependencies: Supabase client, Input component
- Reference: SPECIFICATION.md#authentication
```

**2️⃣ 명확한 테스트 시나리오 (Given-When-Then)**
```markdown
- [ ] `it('validates email format')`
  - Given: invalid email "invalid-email"
  - When: submit clicked
  - Then: error message shown, no API call
```

**3️⃣ Acceptance Criteria**
```markdown
- ✅ All tests pass
- ✅ TypeScript errors resolved
- ✅ No console errors
```

**4️⃣ 의존성 명시**
```markdown
- Requires: Supabase client setup
- Blocks: Signup page, AuthGuard
```

### Checkpoint System

```markdown
## Checkpoints

### CP1: After Phase 2 (Authentication) ⬅️ 현재 여기
**State:**
- ✅ Login/Signup working
- ✅ AuthGuard implemented

**Next:** Phase 3 (Chat Interface)

### CP2: After Phase 3 (Chat UI)
**State:**
- ✅ ChatInput, MessageList working
- ❌ No AI integration yet
```

**사용법**:
```typescript
"CP1부터 CP2까지 진행해줘"  // → Phase 3만 실행
"CP2 상태로 롤백해줘"       // → git checkout CP2
```

### 실행 모드 정의

| 모드 | 설명 | 특징 |
|------|------|------|
| Auto | 모든 Phase를 한 번에 | 에러 시 자동 재시도 (최대 3회) |
| Checkpoint-based ⭐ | Phase별로 실행 | 각 Checkpoint 후 검증 |
| Interactive | 각 Task 후 확인 | 가장 안전하지만 느림 |

### 현실적인 접근법

**Option 1: Phase-by-Phase (추천) ⭐**
```typescript
"@TODO.md Phase 3을 실행해줘. Phase 2가 완료된 상태야"
// → 20분, 3개 파일, 15개 테스트

"@TODO.md Phase 4를 실행해줘. 이전 Phase들 완료됨"
// → 40분, API + 스트리밍
```

**장점**: 중간 확인 가능, 에러 즉시 수정, 컨텍스트 관리 가능

**Option 2: All-in-One (가능하지만 위험) ⚠️**
```typescript
"@TODO.md 전체를 실행해줘. Phase 1-7까지 MVP를 만들어줘."
```

**단점**: 컨텍스트 한계 (200K 토큰), 중간 에러 시 전체 재실행

### 성능 비교

| 접근법 | Phase별 | All-in-One |
|--------|---------|------------|
| 성공률 | 95% | 60% |
| 디버깅 | 쉬움 | 어려움 |
| 총 시간 | 3시간 | 5시간 (재시도 포함) |

### TODO.md를 실행 가능하게 만드는 5가지 요소

| 요소 | 설명 | 예시 |
|------|------|------|
| 구체적 컨텍스트 | 파일 경로, 의존성 | `Location: app/login/page.tsx` |
| 명확한 테스트 | Given-When-Then | `Given: invalid email → Then: error` |
| Acceptance Criteria | 완료 판단 기준 | `✅ All tests pass` |
| Decision Points | AI가 선택할 옵션들 | `Default: OpenAI GPT-3.5-turbo` |
| Checkpoint System | 중간 저장 포인트 | `CP1: Auth → CP2: Chat UI` |

### 결론

**TODO.md로 전체 앱을 만들 수 있는가?**

- ❌ 완전 자동 실행: 불가능 (외부 의존성, 결정 필요)
- ✅ Phase별 실행: 가능 (각 30-60분)
- ⭐ 개선 후: 더 좋음 (Checkpoint System + Decision Points)

**ROI**:
- TODO.md 작성: 2시간
- Phase별 실행: 5시간 (AI 자동)
- 수동 개발: 40시간

**시간 절약**: 85% (35시간)

실행 가능한 TODO.md는 AI와 사람이 협업하는 새로운 개발 방식입니다.
