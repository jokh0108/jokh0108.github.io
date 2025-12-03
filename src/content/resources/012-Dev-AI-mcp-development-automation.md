---
title: "MCP로 개발 자동화하기 - Claude가 GitHub, DB, Slack을 직접 제어한다"
summary: Model Context Protocol(MCP)로 AI가 GitHub 커밋, DB 스키마 생성, E2E 테스트까지 자동화하는 방법
date: 2025-11-25
draft: false
tags:
  - MCP
  - Automation
  - AI
  - Claude
  - DevOps
category1: Dev
category2: AI
---

## 질문

"이 기능 구현해줘"라고 AI에게 말하면, AI가 코드를 작성하고, 테스트하고, GitHub에 커밋하고, PR까지 만들 수 있을까요?

## 답변

**MCP(Model Context Protocol)**로 가능합니다.

### MCP란?

MCP는 AI(Claude)가 외부 시스템과 연동할 수 있게 해주는 프로토콜입니다.

```
┌─────────────────────────────────┐
│   Claude Code (AI)              │
│   "TODO.md 실행해줘"            │
└─────────────────────────────────┘
          ↓ MCP Protocol
┌─────────────────────────────────┐
│   MCP Servers (도구들)           │
│   • GitHub API                  │
│   • Database                    │
│   • Browser                     │
│   • Slack                       │
└─────────────────────────────────┘
```

**MCP = AI가 사용할 수 있는 "도구 세트"**

### MCP 없이 vs MCP로

**MCP 없이 (기존)**
```
Claude가 할 수 있는 것: ✅ 코드 작성, 파일 생성, 테스트 실행
사람이 해야 하는 것: 😰 git commit, push, PR 생성, Slack 알림
```

**MCP로 (자동화)**
```
Claude가 모두 자동으로:
✅ 코드 작성 → git commit → PR 생성 → Slack 알림 → E2E 테스트 → 스크린샷 첨부

사람이 하는 것: 👀 앉아서 구경, ✅ PR 승인
```

### 주요 MCP 서버 5가지

**1️⃣ GitHub MCP (필수!)**
- 이슈 생성, PR 자동 생성, 커밋 & 푸시

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"
      }
    }
  }
}
```

**2️⃣ Supabase MCP (DB 직접 접근)**
- 테이블 자동 생성, RLS 정책 설정, 마이그레이션

**3️⃣ Browser MCP (E2E 테스트)**
- E2E 테스트 자동화, 스크린샷 캡처, 성능 측정

**4️⃣ Slack MCP (알림)**
- 진행 상황 알림, 테스트 실패 알림

**5️⃣ Filesystem MCP (고급 파일 관리)**
- 파일 템플릿 생성, 리팩토링

### 실전 시나리오: 완전 자동 Phase 실행

**프롬프트**
```
@TODO.md Phase 3을 실행해줘.

MCP 활용:
1. GitHub: feature/phase3 branch 생성
2. 각 컴포넌트 완료 시 자동 커밋
3. 모든 테스트 통과 시 PR 생성
4. Slack으로 진행 상황 알림
5. Browser로 E2E 테스트
```

**결과**
```
✅ feature/phase3-chat branch 생성
✅ 4개 컴포넌트 작성
✅ 15개 테스트 작성 및 통과
✅ 4개 커밋 (각 컴포넌트별)
✅ E2E 테스트 통과
✅ 스크린샷 5장 첨부
✅ PR #12 생성 (Draft)
✅ Slack 알림 3회 전송

총 소요 시간: 30분 (사람 개입 없음)
```

### MCP 활용 레벨

| 레벨 | 설명 | 사람이 하는 것 |
|------|------|--------------|
| 레벨 1 | MCP 없이 | git commit, push, PR, 알림 모두 수동 |
| 레벨 2 | GitHub 자동화 | Slack 알림, E2E 테스트는 수동 |
| 레벨 3 | 풀 자동화 ⭐ | PR 승인만 |

### 성능 비교

| 작업 | MCP 없이 | MCP 활용 |
|------|----------|----------|
| Phase 3 구현 | 2시간 (사람) | 30분 (자동) |
| 커밋/PR 생성 | 10분 (수동) | 1분 (자동) |
| E2E 테스트 | 30분 (수동) | 5분 (자동) |
| **총 시간** | **3시간 5분** | **38분** |

**시간 절약**: 80% 이상

### 시작하기

```bash
# 1. GitHub MCP 설정 (5분)
code ~/.config/claude/claude_desktop_config.json
# GitHub Token 추가

# 2. Claude Code 재시작

# 3. 실행
"@TODO.md Phase 3 실행 (MCP 활용)"

# 4. 🚀 앉아서 구경하기!
```

### 결론

**MCP = TODO.md 실행의 게임 체인저!**

코드 작성부터 GitHub PR, E2E 테스트, 팀 알림까지 모든 것을 자동화할 수 있습니다.

**ROI**: 15분 투자 → 180시간 절약 → **720배 수익률!**

이제 "코드 작성해줘"가 아니라 **"기능 배포해줘"**라고 말할 수 있는 시대입니다.
