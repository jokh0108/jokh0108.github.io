---
title: "프로덕션 배포 테스트 전략 - Unit만 블로킹하고 E2E는 비동기로?"
summary: 빠른 배포와 안정성의 균형, 실제 회사들의 배포 전략과 현실적인 접근법
date: 2025-11-24
draft: false
tags:
  - Deployment
  - CI/CD
  - Testing Strategy
  - DevOps
category1: Dev
category2: DevOps
---

## 질문

"Unit 테스트만 통과하면 배포하고, E2E는 백그라운드에서 돌리면 어때?"라는 전략이 실제로 좋은 방법인지 궁금합니다.

## 답변

### 제안된 전략

```yaml
# 배포 파이프라인
배포 블로킹:
  ✅ Unit Tests (5초)
  🚀 배포 (즉시)

백그라운드:
  🔔 Integration Tests (비동기, 1분)
  🔔 E2E Tests (비동기, 10분)
  🔔 실패 시 Slack/Email 알림
```

### 장단점 분석

**✅ 장점**

1. ⚡ 빠른 배포: Unit만 통과하면 즉시 배포 (2분 5초 vs 12분)
2. 🔄 빠른 개발 사이클: 하루에 10번 배포 가능
3. 💰 비용 효율: 개발자 대기 시간 없음
4. 🎯 유연성: 긴급 버그 수정, 롤백 후 재배포 빠름

**⚠️ 단점**

1. 🐛 프로덕션에 버그 유입 가능: E2E가 5분 후 실패해도 이미 배포됨
2. 🔔 알림 피로: E2E 실패 알림이 자주 올 수 있음
3. 🚨 롤백 필요성 증가: 프로덕션 불안정 기간 발생

### 실제 회사들의 전략

**Netflix**
```yaml
배포:
  - Unit Tests (블로킹)
  - 배포 (Canary - 1% 트래픽)
  - 모니터링 10분
  - 문제 없으면 100% 트래픽

백그라운드:
  - Integration/E2E (알림만)
```

**Google**
```yaml
배포:
  - Unit Tests (블로킹)
  - Small E2E Suite (블로킹, "Presubmit")
  - 배포

백그라운드:
  - Full Test Suite ("Postsubmit")
  - 실패 시 다음 배포 블로킹
```

**Amazon**
```yaml
배포:
  - Unit Tests (블로킹)
  - 배포 (각 Region별 점진적)

백그라운드:
  - E2E (알림)
  - 실패 시 자동 롤백 트리거
```

### 프로젝트 타입별 권장

| 프로젝트 타입 | 권장 전략 | 이유 |
|------------|----------|------|
| MVP / 스타트업 | Unit만 블로킹 | 속도가 생명 |
| 일반 웹앱 | Unit + Smoke 블로킹 | 균형 |
| E-commerce | Unit + Critical E2E | 결제 버그 치명적 |
| 금융 / 헬스케어 | 모든 테스트 블로킹 | 규제 / 리스크 |
| 내부 도구 | Unit만 블로킹 | 빠른 반복 |

### 도입 전 체크리스트

1. **모니터링 준비됨?** Sentry / DataDog 같은 에러 트래킹, 실시간 알림
2. **빠른 롤백 가능?** 1분 안에 이전 버전으로 복구
3. **알림 설정됨?** Slack, PagerDuty 연동
4. **팀 합의?** PM, 팀, 경영진 리스크 이해
5. **백업 플랜?** Feature Flag, Canary 배포, Blue-Green 배포

### 추천 전략 (대부분의 웹앱)

```yaml
배포 블로킹:
  ✅ Unit Tests (5초)
  ✅ TypeScript Check (3초)
  ✅ Build (10초)
  ✅ Smoke Tests (10초) ← 추가!

배포:
  🚀 Staging 먼저 (자동)
  ⏸️ 5분 대기 (문제 확인)
  🚀 Production (자동 또는 수동)

비동기:
  🔔 Integration (1분)
  🔔 E2E (10분)
  🔔 실패 시 알림 + 다음 배포 블로킹
```

### 최종 추천

**제안된 전략(Unit만 블로킹)은 좋습니다!** 단, 다음 조건이 필요합니다:

1. **Smoke Tests 추가** (10초면 충분): 홈페이지 로드, 로그인 플로우, 주요 API
2. **Canary 배포**: 1% → 10% → 100%, 문제 발견 시 자동 중단
3. **Feature Flags**: 새 기능 On/Off 가능, 문제 시 즉시 비활성화

### 핵심 요약

```
← 빠름                              안전 →
Unit만     Unit+Smoke    Unit+E2E    모든 테스트
30초       2분           5분         15분

스타트업   일반 웹앱      이커머스     금융/헬스
```

> "빠른 배포와 안정성의 균형을 찾아라. 처음엔 보수적으로, 익숙해지면 공격적으로" 🎯
