---
title: "100개 앱을 공장처럼 찍어내기 - Monorepo vs NPM Package vs Template Fork"
summary: 대규모 앱 개발을 위한 3가지 코드 공유 전략 완전 비교. 100개 앱 시나리오에서 Monorepo가 압도적으로 유리한 이유
date: 2025-11-25
draft: false
tags:
  - Monorepo
  - Architecture
  - Scaling
  - Turborepo
  - DevOps
category1: Dev
category2: Architecture
---

## 질문

여러 앱을 만들 때마다 로그인, 회원가입 같은 공통 기능을 매번 복사-붙여넣기하고 있습니다. 10개, 20개, 100개의 앱을 만든다면 어떻게 해야 할까요?

## 답변

### 문제 상황

```typescript
// App 1
function LoginPage() { /* 로그인 로직 */ }

// App 2
function LoginPage() { /* 똑같은 로그인 로직 복붙 */ }

// App 100
function LoginPage() { /* 😱 */ }
```

**버그 발견 시**: 100개 파일을 일일이 수정해야 합니다.

### 3가지 전략 한눈에 비교

| 항목 | Template Fork | NPM Package | Monorepo |
|------|---------------|-------------|----------|
| 초기 설정 | ⚡ 10분 | ⚡⚡ 1시간 | ⚡⚡⚡ 2시간 |
| 새 앱 생성 | ⚡ 5분 | ⚡⚡ 30분 | ⚡ 2분 |
| 공통 로직 수정 | 😱 10시간 | 😐 30분 | ⚡ 5분 |
| 버그 수정 전파 | 😱 수동 100번 | 😐 npm update | ⚡ 자동 |
| 타입 안전성 | ❌ 없음 | ⚠️ 제한적 | ✅ 완벽 |
| 100개 앱 추천도 | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 1️⃣ Template Repository (Fork 방식)

```
GitHub:
  my-saas-template (template)
    ↓ fork
  my-chat-app (독립 repo)
    ↓ fork
  ... (100개)
```

**장점**: 💰 완전 무료, ⚡ 빠른 시작, 🔒 완전 독립
**단점**: 😱 업데이트 지옥 (100개 앱에 수동 패치)

### 2️⃣ NPM Private Package

```
@mycompany/saas-auth (npm package)
    ↓ npm install
my-chat-app: "@mycompany/saas-auth": "^1.0.0"
```

**장점**: 📦 표준 방식, 🔄 npm update 한 줄
**단점**: 💰 비용 ($7/월~), ⏰ 배포 딜레이

### 3️⃣ Monorepo (Turborepo) ⭐ 추천

```
my-saas-factory/
├── apps/
│   ├── chat-app/
│   ├── todo-app/
│   └── ... (100개)
├── packages/
│   ├── auth/         # 🔐 공통 인증
│   ├── ui/           # 🎨 공통 UI
│   └── utils/        # 🛠️ 공통 유틸
└── turbo.json
```

**장점**:
- ⚡ 한 번 수정 → 100개 동시 반영
- 🚀 병렬 빌드/테스트 (10배 빠름)
- 💡 최고의 개발 경험 (타입스크립트 완벽 지원, HMR 즉시 반영)

**단점**: 📚 학습 곡선 (초기 2시간)

### 💰 비용 비교 (1년, 개발자 시급 $50 가정)

- **Template**: $0 + 700시간 = **$35,000**
- **NPM**: $184 + 150시간 = **$7,684**
- **Monorepo**: $50 + 30시간 = **$1,550** ⭐

### 시나리오별 추천

| 시나리오 | 추천 | 이유 |
|---------|------|------|
| 혼자 빠르게 MVP (1-3개) | Template Fork | 설정 시간 최소화 |
| 소규모 팀 (5-20개) | NPM Package | 표준 방식, 관리 가능 |
| 공장처럼 찍어내기 (20-100개) | Monorepo | 유일한 현실적 선택 |

### Turborepo 시작하기

```bash
# 1. Turborepo 프로젝트 생성
npx create-turbo@latest my-saas-factory

# 2. Auth 패키지 추가
mkdir -p packages/auth

# 3. 첫 번째 앱 생성
cd apps && npx create-next-app@latest app-1

# 4. Auth 패키지 연결
cd app-1 && pnpm add @my-saas/auth

# 5. 개발 시작
turbo dev
```

### 핵심 요약

🏆 **100개 앱 시나리오라면 Monorepo (Turborepo) 압도적 추천**

**이유**:
1. ⚡ 한 번 수정 → 100개 동시 반영
2. 🚀 10배 빠른 빌드
3. 💰 장기적으로 가장 저렴 ($1,550 vs $35,000)
4. 🔧 최고의 개발 경험

**ROI**: 4시간 투자 → 700시간 절약 → **175배 수익률!**
