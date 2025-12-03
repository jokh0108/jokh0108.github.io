---
title: "Claude Code의 Subagent 시스템 이해하기"
summary: Claude Code가 제공하는 다양한 전문 Subagent들의 역할과 활용법을 알아봅니다
date: 2025-11-24
draft: false
tags:
  - AI
  - Claude
  - Development
category1: Dev
category2: AI
---

## 질문

Claude Code의 Subagent 시스템은 무엇이고 어떻게 활용하나요?

## 답변

Claude Code를 사용하다 보면 복잡한 작업을 처리할 때 'Subagent'를 활용하는 것을 볼 수 있습니다. 이 Subagent 시스템은 특정 작업에 특화된 AI 에이전트들을 활용해 더 효율적으로 작업을 수행하도록 설계되었습니다.

### Subagent란?

Subagent는 특정 작업에 최적화된 전문 AI 에이전트입니다. 메인 Claude 인스턴스가 복잡한 작업을 감지하면, 해당 작업에 가장 적합한 Subagent를 생성하여 자율적으로 작업을 수행하게 합니다.

### 주요 Subagent 종류

#### 1. General-Purpose Agent
- **용도**: 복잡한 질문 리서치, 코드 검색, 다단계 작업
- **도구**: 모든 도구 사용 가능
- **활용 시나리오**: 특정 키워드나 파일을 찾을 때, 첫 시도에서 올바른 매치를 찾을 확신이 없는 경우

#### 2. Explore Agent
- **용도**: 코드베이스 탐색에 특화
- **속도**: 빠른 처리
- **활용 예시**:
  - 파일 패턴 검색: `src/components/**/*.tsx`
  - 키워드 검색: "API endpoints"
  - 코드베이스 질문: "API endpoints가 어떻게 동작하나요?"
- **검색 세밀도**: `quick`, `medium`, `very thorough` 중 선택 가능

#### 3. Plan Agent
- **용도**: 코드베이스 분석 및 계획 수립
- **특징**: Explore Agent와 유사하지만 계획 수립에 초점
- **검색 세밀도**: `quick`, `medium`, `very thorough` 중 선택 가능

#### 4. Claude Code Guide Agent
- **용도**: Claude Code 및 Claude Agent SDK 관련 문서 검색
- **활용 시나리오**:
  - "Claude Code에서 이 기능을 사용할 수 있나요?"
  - "특정 기능 사용법은?" (hooks, slash commands, MCP servers)
  - Claude Agent SDK 아키텍처 및 개발 관련 질문
- **최적화**: 기존 실행 중인 에이전트가 있다면 재사용 가능

#### 5. Statusline Setup Agent
- **용도**: Claude Code의 상태 표시줄 설정
- **도구**: Read, Edit

### Subagent 사용 시 장점

1. **효율성**: 작업별 최적화된 도구와 접근 방식 사용
2. **병렬 처리**: 여러 Subagent를 동시에 실행 가능
3. **컨텍스트 관리**: 각 Subagent가 독립적으로 작업하여 메인 세션의 컨텍스트 부담 감소
4. **전문성**: 특정 작업에 특화된 지시사항과 도구 제공

### 사용 예시

#### 코드베이스 탐색
```
사용자: "클라이언트 에러는 어디서 처리되나요?"
Claude: [Explore Agent를 사용하여 에러 핸들링 파일 검색]
```

#### 문서 검색
```
사용자: "MCP 서버를 어떻게 설치하나요?"
Claude: [Claude Code Guide Agent를 사용하여 공식 문서 검색]
```

#### 복잡한 검색
```
사용자: "특정 키워드가 포함된 파일을 찾아주세요"
Claude: [General-Purpose Agent를 사용하여 다중 검색 수행]
```

### 주의사항

1. **특정 파일 읽기**: 정확한 경로를 아는 경우 Read 도구를 직접 사용하는 것이 더 빠릅니다
2. **클래스 정의 검색**: `class Foo` 같은 특정 정의는 Glob 도구가 더 효율적입니다
3. **단일 파일 내 검색**: 2-3개 파일 내에서만 검색하는 경우 Read 도구 사용이 더 적합합니다

### 병렬 실행

여러 독립적인 작업이 있을 때, 하나의 메시지에서 여러 Subagent를 동시에 실행할 수 있습니다:

```
한 번에 여러 에이전트 실행:
- Code Reviewer Agent
- Test Runner Agent
- Documentation Generator Agent
```

### 마치며

Claude Code의 Subagent 시스템은 복잡한 개발 작업을 더욱 효율적으로 만들어줍니다. 각 에이전트의 특성을 이해하고 적절히 활용하면, 코드베이스 탐색부터 문서 작성까지 다양한 작업을 빠르고 정확하게 수행할 수 있습니다.

AI 개발 도구의 발전은 단순히 코드를 작성하는 것을 넘어, 프로젝트 전체를 이해하고 관리하는 방식까지 변화시키고 있습니다. Claude Code의 Subagent 시스템은 그러한 변화의 좋은 예시라고 할 수 있습니다.
