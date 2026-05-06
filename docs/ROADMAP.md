# 북 리뷰 웹 (Book Review Web) 개발 로드맵

50명 규모 초대제 독서 모임을 위한 노션 기반 북 리뷰 + 토론 플랫폼

## 개요

노션을 콘텐츠 에디터 겸 데이터 소스로 활용, 웹은 뷰어 + 댓글(토론) 레이어 역할.

- 노션 기반 리뷰 뷰어 (ISR 60초)
- 초대제 인증 + 댓글 시스템
- 검색/필터/SEO/다크모드

**전체 일정**: 2~3주 | **현재 상태**: Phase 2 완료 (UI/UX 완성)

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.4 (App Router, RSC) |
| 라이브러리 | React 19.2.4 |
| UI 프리미티브 | `@base-ui/react` (`render` prop 패턴) |
| 디자인 시스템 | shadcn/ui style: `base-nova` |
| 스타일링 | Tailwind CSS v4 (CSS-first) |
| 데이터 소스 | Notion API (Reviews DB + Comments DB) |
| 인증 | 매직 링크 (Resend + HMAC 서명 토큰) |
| 세션 | JWT → httpOnly cookie (14일) |
| 배포 | Vercel (ISR revalidate 60초) |

---

## 개발 워크플로우

1. 코드베이스 파악 → 로드맵 업데이트
2. `tasks/XXX-기능명.md` 작업 명세 생성
3. 명세 기반 구현 → 핵심 기능은 Playwright MCP E2E 테스트
4. 완료 후 로드맵 Task에 ✅ 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- Task 001: 프로젝트 구조 및 라우팅 설정
- ✅ Task 002: 타입 정의 및 노션 데이터 모델 계약
- ✅ Task 003: 노션 DB 스키마 문서화 및 검증 스크립트

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- ✅ Task 004: 더미 데이터 및 fixture 유틸리티
- ✅ Task 005: 공통 컴포넌트 라이브러리 확장
- ✅ Task 006: 리뷰 목록 페이지 UI
- ✅ Task 007: 리뷰 상세 페이지 UI 및 노션 블록 렌더러 골격
- ✅ Task 008: 인증 및 댓글 UI
- ✅ Task 009: 404/에러/로딩 상태 및 반응형 점검

### Phase 3: 핵심 기능 구현 (P0/P1)

더미 데이터를 실제 노션 API로 교체하고 인증·댓글 비즈니스 로직을 구현한다. 모든 Server Action에 Playwright MCP E2E 테스트 필수.

- Task 010: 노션 클라이언트 + Reviews DB 연동
- Task 011: 매직 링크 인증 시스템
- Task 012: 댓글 조회 + 작성 (Server Action)
- Task 013: 본인 댓글 삭제 + 태그 필터 + 검색
- Task 014: SEO + 다크모드 + 에러 바운더리 마무리
- Task 015: 핵심 기능 통합 E2E 테스트

### Phase 4: 성능 최적화 및 배포

- Task 016: 성능 최적화 및 Lighthouse 90+ 달성
- Task 017: 접근성 (WCAG 2.1 AA) 점검
- Task 018: Vercel 배포 및 운영 셋업

### Phase 5 (v0.2 이후 백로그)

- Task 019: F-13 본인 댓글 수정
- Task 020: F-14 멤버 프로필 페이지
- Task 021: F-15 신규 리뷰/댓글 이메일 알림

---

## 우선순위 요약 (PRD 매핑)

| 우선순위 | 기능 ID | 매핑 Task |
|---|---|---|
| P0 | F-01 노션 Reviews DB 연동 | Task 002, 003, 010 |
| P0 | F-02 리뷰 목록 페이지 | Task 006, 010 |
| P0 | F-03 리뷰 상세 페이지 | Task 007, 010 |
| P0 | F-04 초대 기반 인증 | Task 008, 011 |
| P0 | F-05 댓글 조회 | Task 008, 012 |
| P0 | F-06 댓글 작성 | Task 008, 012 |
| P1 | F-07 본인 댓글 삭제 | Task 013 |
| P1 | F-08 태그 필터 | Task 006, 013 |
| P1 | F-09 검색 | Task 006, 013 |
| P1 | F-10 기본 SEO | Task 014 |
| P1 | F-11 다크모드 토글 | Task 005, 014 |
| P1 | F-12 404/에러 바운더리 | Task 001, 009, 014 |
| P2 | F-13 댓글 수정 | Task 019 (백로그) |
| P2 | F-14 멤버 프로필 | Task 020 (백로그) |
| P2 | F-15 알림 | Task 021 (백로그) |

---

## 비기능 요구사항

- **성능**: LCP 목록 < 2.5s / 상세 < 2.8s / Lighthouse ≥ 90 → Task 016
- **접근성**: WCAG 2.1 AA → Task 009 + Task 017
- **반응형**: Mobile First, 640/768/1024/1280
- **보안**: Notion 토큰 서버 전용 env (클라이언트 노출 금지)
- **캐싱**: ISR 60초 + 댓글 작성·삭제 후 즉시 revalidate

---

## 일정 요약 (목표 2~3주)

| 주차 | Phase | 산출물 |
|---|---|---|
| W1 전반 | Phase 1 | 라우트 골격, 타입, 노션 DB 스키마 확정 |
| W1 후반 ~ W2 전반 | Phase 2 | 더미 데이터 기반 전 화면 UI 완성 |
| W2 전반 ~ W3 전반 | Phase 3 | 노션 연동 + 인증 + 댓글 + 통합 E2E |
| W3 후반 | Phase 4 | 성능/접근성/배포 |
