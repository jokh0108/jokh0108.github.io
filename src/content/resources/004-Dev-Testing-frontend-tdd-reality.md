---
title: "프론트엔드에서 TDD를 많이 할까? - 이상과 현실"
summary: 백엔드와 다른 프론트엔드 TDD의 현실과 업계 현황, 그리고 현실적인 테스트 전략
date: 2025-11-24
draft: false
tags:
  - TDD
  - Frontend
  - Testing
  - Best Practices
category1: Dev
category2: Testing
---

## 질문

프론트엔드에서도 TDD를 많이 하나요? 백엔드와 어떻게 다른가요?

## 답변

"프론트엔드에서도 TDD를 많이 하나요?" 이 질문에 대한 현실적인 답변은: **이상적으로는 해야 하지만, 실제로는 적게 한다**입니다.

### 짧은 답변

"이상적으로는 해야 하지만, 실제로는 적게 한다"

### 백엔드 vs 프론트엔드 비교

| 항목 | 백엔드 | 프론트엔드 |
|------|--------|-----------|
| TDD 추천도 | ⭐⭐⭐⭐⭐ 강력 추천 | ⭐⭐⭐ 권장 (선택적) |
| 테스트 용이성 | 높음 | 중간~낮음 |
| 테스트 속도 | 빠름 | 느림 |
| 실제 사용 빈도 | 높음 | 낮음 |

### 프론트엔드에서 TDD가 어려운 이유

#### 1. UI 테스트가 복잡함

```javascript
// 백엔드 테스트 (간단)
expect(calculateTotal([10, 20])).toBe(30); // 1줄, 1초

// 프론트엔드 테스트 (복잡)
render(<LoginForm />);
fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
fireEvent.click(submitButton);
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
// 여러 줄, 시간이 오래 걸림
```

#### 2. 자주 변경되는 UI

```javascript
// 디자이너: "버튼 텍스트를 'Sign In'으로 변경해주세요"
// → 테스트도 수정해야 함
// → TDD의 이점이 줄어듦

// 이전 테스트
expect(screen.getByRole('button', { name: /login/i }))

// 변경 후 테스트도 수정
expect(screen.getByRole('button', { name: /sign in/i }))
```

#### 3. 느린 테스트 실행

```bash
# 백엔드
$ npm test
✅ 50개 테스트 완료 - 1초

# 프론트엔드
$ npm test
✅ 50개 테스트 완료 - 30초

# → 개발 중 자주 돌리기 어려움
```

#### 4. 브라우저 의존성

```javascript
// 테스트로는 잡을 수 없는 문제들
- Chrome에서는 작동, Safari에서는 안 됨
- 버튼이 0.5초 늦게 반응하는데 답답함
- 모바일에서 스크롤이 부자연스러움
- 실제 네트워크 지연 시 로딩 표시가 깜빡임
```

### 실제 업계 현황

#### 스타트업 / 스케일업
- **10% TDD** 실천
- **90% 후행 테스트** (기능 먼저, 테스트 나중)
- 이유: 빠른 MVP 검증이 우선

#### 대기업 / 엔터프라이즈
- **30-40% TDD** 실천
- **60-70% 후행 테스트**
- 이유: 안정성과 속도의 균형

#### 크리티컬 앱 (금융, 헬스케어)
- **70-80% TDD** 실천
- **20-30% 후행 테스트**
- 이유: 버그의 비용이 매우 큼

### 현실적인 프론트엔드 테스트 전략

#### Tier 1: 꼭 테스트해야 할 것 (TDD 권장)

```javascript
✅ 비즈니스 로직
  - 계산 로직: calculateTotal(), applyDiscount()
  - 검증 로직: validateEmail(), validatePassword()
  - 상태 관리: Redux reducers, Zustand stores

✅ Utils/Helper 함수
  - formatDate(), formatCurrency()
  - parseData(), transformData()

✅ Custom Hooks
  - useAuth(), useLocalStorage()
  - useFetch(), useDebounce()
```

#### Tier 2: 어느 정도 테스트 (선택적)

```javascript
⚠️ 주요 컴포넌트 상호작용
  - 로그인 플로우
  - 결제 프로세스
  - 중요한 폼 제출

⚠️ 조건부 렌더링
  - 권한에 따른 UI 표시
  - 에러/성공 메시지
```

#### Tier 3: 테스트하기 어려움 (E2E 권장)

```javascript
❌ 복잡한 UI 애니메이션
❌ 실제 사용자 경험 (UX)
❌ 브라우저별 호환성
❌ 성능 이슈
```

### 권장 사항: 프로젝트별 전략

| 프로젝트 타입 | 권장 전략 | 이유 |
|--------------|----------|------|
| MVP / 스타트업 | 비즈니스 로직만 TDD | 속도가 생명 |
| 일반 웹앱 | 핵심 기능 TDD | 균형 |
| E-commerce | 결제 로직 TDD 필수 | 버그 비용 높음 |
| 금융/헬스케어 | 전체 TDD | 규제/리스크 |
| 내부 도구 | 선택적 TDD | 빠른 반복 |

### 현실적인 접근법

#### Phase 1: 시작 단계
```javascript
✅ Utils 함수 TDD
✅ 비즈니스 로직 TDD
❌ UI 테스트 없음

이유: 빠른 시작, 핵심 로직 보호
```

#### Phase 2: 성장 단계
```javascript
✅ Utils 함수 TDD
✅ 비즈니스 로직 TDD
✅ 주요 컴포넌트 테스트 (후행)

이유: 안정성 강화
```

#### Phase 3: 성숙 단계
```javascript
✅ Utils 함수 TDD
✅ 비즈니스 로직 TDD
✅ 컴포넌트 테스트
✅ E2E 테스트

이유: 완전한 품질 보증
```

### 핵심 요약

#### 프론트엔드 TDD가 어려운 이유
1. UI 테스트가 복잡하고 느림
2. 요구사항이 자주 변경됨
3. 실제 UX는 테스트로 못 잡음

#### 현실적인 전략
1. **비즈니스 로직**: TDD 필수
2. **주요 기능**: 선택적 TDD
3. **UI 세부사항**: 후행 테스트 또는 E2E

### 결론

> "완벽한 TDD는 이상이고, 현실은 비즈니스 로직만 TDD하고 UI는 후행 테스트 또는 E2E 테스트를 섞어서 한다"

프론트엔드에서는 **선택적 TDD**가 현실적입니다. 모든 것을 테스트하려 하지 말고, 중요한 것부터 테스트하세요. 80-20 법칙: 20%의 테스트로 80%의 버그를 잡을 수 있습니다.
