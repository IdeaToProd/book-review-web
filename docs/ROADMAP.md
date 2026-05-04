# 북 리뷰 웹 (Book Review Web) 개발 로드맵

50명 규모 초대제 독서 모임을 위한 노션 기반 북 리뷰 + 토론 플랫폼

## 개요

본 프로젝트는 **약 50명 규모의 초대제 독서 모임 멤버**를 위한 북 리뷰 웹 애플리케이션으로, **노션을 콘텐츠 에디터 겸 데이터 소스로 활용**하고 웹은 뷰어 + 댓글(토론) 레이어 역할을 수행합니다. 다음 핵심 기능을 제공합니다.

- **노션 기반 리뷰 뷰어**: 노션에서 작성된 리뷰를 ISR(60초)로 가져와 카드 그리드와 상세 페이지로 렌더링
- **초대제 인증 + 토론 댓글**: 매직 링크 기반 인증과 노션 Comments DB 연동 댓글 시스템
- **검색/필터/SEO/다크모드**: 태그 필터, 본문 검색, 기본 SEO 메타, 시스템 follow 다크모드 지원

**전체 일정**: 2~3주 (1인 개발 학습/포트폴리오 프로젝트)
**현재 상태**: 초기 셋업 완료 (Next.js 16.2.4 + React 19 + Tailwind v4 + base-nova shadcn 부트스트랩 완료)

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.4 (App Router, RSC) |
| 라이브러리 | React 19.2.4 |
| UI 프리미티브 | `@base-ui/react` (Radix 아님 — `render` prop 패턴) |
| 디자인 시스템 | shadcn/ui style: `base-nova` |
| 스타일링 | Tailwind CSS v4 (CSS-first, `tailwind.config.*` 없음) |
| 데이터 소스 | Notion API (Reviews DB + Comments DB) |
| 인증 | 매직 링크 (Resend + 서명 토큰) + 허용 이메일 env |
| 세션 | JWT → httpOnly cookie (14일) |
| 배포 | Vercel (ISR revalidate 60초) |

---

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-app-skeleton.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 시나리오 작성)**
   - 직전 완료 작업(`011`, `010` 등)을 예시로 참조하고, 초기 상태 샘플은 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시
   - Phase 단위 완료 시 Phase 제목에도 ✅ 부여

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 (1~2일)

전체 라우트, 빈 페이지 껍데기, 타입 정의, 노션 데이터 모델 계약을 먼저 확정한다.

- **Task 001: 프로젝트 구조 및 라우팅 설정** — 우선순위 / 예상 0.5일 / 담당 F-02·F-03·F-04·F-12
  - `app/page.tsx` (리뷰 목록), `app/reviews/[slug]/page.tsx` (상세), `app/login/page.tsx`, `app/api/auth/verify/route.ts` 빈 껍데기 생성
  - `app/not-found.tsx`, `app/error.tsx` 글로벌 에러 바운더리 골격 추가
  - `app/actions/comments.ts`, `app/actions/auth.ts` Server Action 파일 골격 생성
  - 기존 `Header`/`Footer`/`ThemeProvider` 레이아웃 흐름 검증 (변경 금지)

- **Task 002: 타입 정의 및 노션 데이터 모델 계약** — 예상 0.5일 / 담당 F-01·F-05
  - `lib/notion/types.ts`: `Review`, `Comment`, `ReviewStatus`, `NotionRichText` 타입 정의
  - `lib/notion/client.ts` 빈 껍데기 (env 검증 only, 실제 호출 X)
  - `lib/notion/reviews.ts`, `lib/notion/comments.ts` 함수 시그니처 정의 (`getPublishedReviews`, `getReviewBySlug`, `getCommentsByReviewId`, `createComment`, `softDeleteComment`)
  - `lib/auth/session.ts`, `lib/auth/magicLink.ts` 함수 시그니처 정의 (`getSession`, `signSessionToken`, `verifyMagicToken`)
  - `.env.example` 작성 (NOTION_TOKEN, NOTION_REVIEWS_DB_ID, NOTION_COMMENTS_DB_ID, RESEND_API_KEY, JWT_SECRET, ALLOWED_EMAILS, APP_URL)

- **Task 003: 노션 DB 스키마 문서화 및 검증 스크립트** — 예상 0.5일 / 담당 F-01
  - `docs/notion-schema.md`에 Reviews/Comments DB 속성 정의 문서화 (Title, Author, Slug, Reviewer, ReviewerEmail, Rating, Tags, Cover, Status, PublishedAt, Summary, Body / ID, Review, Author, AuthorEmail, Body, CreatedAt, Deleted)
  - `scripts/notion-check.ts` 작성 — DB 연결 + 필수 속성 존재 검증 (구현은 Phase 3에서 활성화)
  - 노션 워크스페이스에 실제 Reviews/Comments DB 생성 및 Integration 권한 공유

---

### Phase 2: UI/UX 완성 (더미 데이터 활용) (3~4일)

노션 연동 전에 더미 데이터로 모든 화면과 사용자 플로우를 완성한다. UI팀과 백엔드 작업을 병렬로 가능하게 한다.

- **Task 004: 더미 데이터 및 fixture 유틸리티** — 우선순위 / 예상 0.5일 / 담당 F-02·F-03·F-05
  - `lib/dummy/reviews.ts`: 12개 이상 더미 리뷰(다양한 태그/평점/커버) fixture
  - `lib/dummy/comments.ts`: 리뷰별 5~10개 더미 댓글 fixture
  - `lib/dummy/index.ts`: 노션 함수와 동일한 시그니처의 mock provider (Phase 3에서 실제 함수로 swap)

- **Task 005: 공통 컴포넌트 라이브러리 확장** — 예상 1일 / 담당 F-02·F-03·F-08·F-09·F-11·F-12
  - shadcn `base-nova` 추가 컴포넌트: input, textarea, skeleton, toast(sonner), pagination, alert
  - `@base-ui/react`의 `render` prop 패턴 준수 (asChild 금지)
  - 다크모드 토글 검증 (이미 구현된 `ThemeToggle` 활용)
  - `cn()` 사용 일관성 점검

- **Task 006: 리뷰 목록 페이지 UI** — 예상 1일 / 담당 F-02·F-08·F-09
  - `components/review/ReviewCard.tsx` (Cover, Title, Author, Reviewer, Rating, Tags, Summary)
  - `components/review/ReviewGrid.tsx` (반응형 그리드: 모바일 1열, sm 2열, lg 3열, xl 4열)
  - `components/review/TagFilter.tsx` (URL `?tag=` 동기화)
  - `components/review/SearchBox.tsx` (URL `?q=` 동기화, debounce)
  - `app/page.tsx`: 12개 페이지네이션 + 더미 데이터 연결
  - LCP 최적화 (next/image, priority 처리)

- **Task 007: 리뷰 상세 페이지 UI 및 노션 블록 렌더러 골격** — 예상 1일 / 담당 F-03
  - `components/review/ReviewBody.tsx`: 헤더(타이틀/저자/리뷰어/평점/태그/Cover) + 본문 영역
  - `lib/notion/render/index.tsx`: heading_1/2/3, paragraph, bulleted_list_item, numbered_list_item, code, quote, image 블록 렌더러 (더미 블록 JSON 입력 기준)
  - 코드 블록 신택스 하이라이팅 적용 (가벼운 라이브러리 또는 prism)
  - `app/reviews/[slug]/page.tsx`: 더미 데이터 + 블록 렌더러 연결

- **Task 008: 인증 및 댓글 UI** — 예상 1일 / 담당 F-04·F-05·F-06·F-07
  - `app/login/page.tsx`: 이메일 입력 폼 + 매직 링크 발송 안내 UI
  - `components/comment/CommentList.tsx`: 시간 오름차순 댓글 목록, 본인 댓글 삭제 버튼 노출 조건부 UI
  - `components/comment/CommentForm.tsx`: 1000자 제한 textarea + 제출 버튼 + 미인증 시 로그인 유도
  - 더미 세션(`__dev_session` 쿠키)으로 본인/타인 케이스 모두 시각 검증

- **Task 009: 404/에러/로딩 상태 및 반응형 점검** — 예상 0.5일 / 담당 F-12
  - `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`, `app/reviews/[slug]/loading.tsx` 디자인 정리
  - 모바일 우선 검증 (640/768/1024/1280 breakpoint)
  - 키보드 네비게이션 + ARIA 라벨 1차 점검

---

### Phase 3: 핵심 기능 구현 (P0/P1) (5~7일)

더미 데이터를 실제 노션 API로 교체하고, 인증·댓글 비즈니스 로직을 구현한다. 모든 Server Action에 Playwright MCP E2E 테스트 필수.

- **Task 010: 노션 클라이언트 + Reviews DB 연동** — 우선순위 / 예상 1일 / 담당 F-01·F-02·F-03
  - `lib/notion/client.ts`: `@notionhq/client` 인스턴스화, env 검증
  - `lib/notion/reviews.ts`: `getPublishedReviews({ tag, q, page })` (Status=Published 필터, PublishedAt desc, 12개 페이지네이션, q 시 title/author/summary includes)
  - `lib/notion/reviews.ts`: `getReviewBySlug(slug)` (Slug unique 조회 + 페이지 블록 가져오기)
  - `lib/notion/render/`: 실제 노션 블록 응답 형태에 맞춰 렌더러 보정
  - `app/page.tsx` / `app/reviews/[slug]/page.tsx`에서 더미 → 실제 호출로 swap, ISR `revalidate = 60` 설정
  - **Playwright MCP 테스트**: 목록 로드 / 상세 진입 / 태그·검색 쿼리 / 존재하지 않는 slug 시 404

- **Task 011: 매직 링크 인증 시스템** — 예상 1.5일 / 담당 F-04
  - `lib/auth/magicLink.ts`: HMAC 서명 토큰 생성/검증 (만료 15분)
  - `app/actions/auth.ts`: `requestMagicLink(email)` Server Action — `ALLOWED_EMAILS` 화이트리스트 검증 후 Resend로 발송
  - `app/api/auth/verify/route.ts`: 토큰 검증 → JWT 발급 → httpOnly cookie(14일) → `/`로 redirect
  - `lib/auth/session.ts`: `getSession()` (cookie → JWT verify → `{ email }` 반환)
  - 미인증/허용되지 않은 이메일 케이스 동일한 에러 메시지로 통일 (이메일 존재 추측 방지)
  - **Playwright MCP 테스트**: 허용 이메일 발송 성공 / 비허용 이메일 동일 응답 / 만료 토큰 거부 / verify 후 cookie 설정 / 보호된 액션 접근

- **Task 012: 댓글 조회 + 작성 (Server Action)** — 예상 1.5일 / 담당 F-05·F-06
  - `lib/notion/comments.ts`: `getCommentsByReviewId(reviewId)` (Deleted=false, CreatedAt asc)
  - `app/actions/comments.ts`: `createComment({ reviewId, body })` — 세션 검증 → 1000자/공백 검증 → Comments DB insert → `revalidateTag('comments:'+reviewId)`
  - `components/comment/CommentForm.tsx`: 낙관적 UI (`useOptimistic`) + 실패 시 롤백 + 에러 토스트
  - 리뷰 상세 페이지에서 댓글 영역을 별도 RSC로 분리 + `cache` 태그 적용
  - **Playwright MCP 테스트**: 댓글 작성 성공 / 1000자 초과 거부 / 빈 본문 거부 / 미인증 작성 차단 / 낙관적 UI 표시 → 실제 반영 확인

- **Task 013: 본인 댓글 삭제 + 태그 필터 + 검색** — 예상 1일 / 담당 F-07·F-08·F-09
  - `app/actions/comments.ts`: `softDeleteComment(commentId)` — `AuthorEmail === session.email` 검증 후 Deleted=true 업데이트
  - `components/comment/CommentList.tsx`: 본인 댓글에만 삭제 버튼 노출
  - `components/review/TagFilter.tsx`: 노션 태그 목록 동기화, URL `?tag=` 토글
  - `components/review/SearchBox.tsx`: `?q=` 서버 사이드 includes 연결
  - **Playwright MCP 테스트**: 본인 댓글 삭제 성공 / 타인 댓글 삭제 차단 / 태그 필터 결과 검증 / 검색 결과 검증 / 빈 결과 UI

- **Task 014: SEO + 다크모드 + 에러 바운더리 마무리** — 예상 0.5일 / 담당 F-10·F-11·F-12
  - `app/layout.tsx`: 기본 OG / description / favicon 메타 보완 (기존 `ThemeProvider` 설정은 변경 금지)
  - `app/reviews/[slug]/page.tsx`: `generateMetadata`로 동적 OG (제목, 요약, Cover)
  - `app/sitemap.ts`, `app/robots.ts` 추가
  - 다크모드 시스템 follow 동작 회귀 테스트
  - `error.tsx` reset 동작, `not-found.tsx` UX 점검

- **Task 015: 핵심 기능 통합 E2E 테스트** — 예상 1일 / 담당 P0/P1 전체
  - Playwright MCP로 전체 사용자 시나리오 실행:
    1) 비로그인 방문 → 목록 → 상세 → 댓글 폼은 로그인 유도
    2) 매직 링크 요청 → verify → 댓글 작성/삭제
    3) 태그 필터 + 검색 + 페이지네이션 조합
    4) 다크/라이트 토글 + 시스템 모드
  - 에러 핸들링 + 엣지 케이스 (노션 timeout, 잘못된 slug, 만료 세션)

---

### Phase 4: 성능 최적화 및 배포 (2~3일)

- **Task 016: 성능 최적화 및 Lighthouse 90+ 달성** — 예상 1일 / 담당 비기능
  - 리뷰 목록 LCP < 2.5s, 상세 LCP < 2.8s 검증
  - next/image 적절한 sizes/priority, 폰트 preload, 불필요한 클라이언트 컴포넌트 RSC 전환
  - ISR revalidate 60초 + Server Action 후 `revalidateTag` 정확성 점검
  - 번들 크기 측정 및 미사용 lucide 아이콘 정리

- **Task 017: 접근성 (WCAG 2.1 AA) 점검** — 예상 0.5일 / 담당 비기능
  - 색상 대비, 포커스 링, 스킵 링크, 시맨틱 마크업, 폼 라벨/에러 연결
  - 스크린 리더 흐름 확인 + 키보드 only 시나리오

- **Task 018: Vercel 배포 및 운영 셋업** — 예상 1일 / 담당 배포
  - Vercel 프로젝트 연결, env 등록 (NOTION_TOKEN, NOTION_*_DB_ID, RESEND_API_KEY, JWT_SECRET, ALLOWED_EMAILS, APP_URL)
  - 프로덕션 도메인 매직 링크 redirect 검증
  - 로그 + 기본 에러 모니터링 (Vercel 내장) 확인
  - README에 운영 가이드 추가

---

### Phase 5 (v0.2 이후 백로그)

- **Task 019: F-13 본인 댓글 수정** — 백로그
- **Task 020: F-14 멤버 프로필 페이지** — 백로그
- **Task 021: F-15 신규 리뷰/댓글 이메일 알림** — 백로그

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

## 비기능 요구사항 추적

- **성능**: 리뷰 목록 LCP < 2.5s, 상세 LCP < 2.8s, Lighthouse ≥ 90 → Task 016에서 검증
- **접근성**: WCAG 2.1 AA → Task 009 1차 점검 + Task 017 최종 점검
- **반응형**: Mobile First, 640/768/1024/1280 → Phase 2 전반
- **보안**: Notion Token 서버 전용 (`lib/notion/client.ts`만 사용), 클라이언트 import 금지 → Task 010 코드 리뷰 체크
- **캐싱**: ISR 60초 + Server Action 성공 시 `revalidateTag` → Task 010, 012, 016

---

## 일정 요약 (목표 2~3주)

| 주차 | Phase | 산출물 |
|---|---|---|
| W1 전반 | Phase 1 | 라우트 골격, 타입, 노션 DB 스키마 확정 |
| W1 후반 ~ W2 전반 | Phase 2 | 더미 데이터 기반 전 화면 UI 완성 |
| W2 전반 ~ W3 전반 | Phase 3 | 노션 연동 + 인증 + 댓글 + 통합 E2E |
| W3 후반 | Phase 4 | 성능/접근성/배포 |

> 모든 Phase 완료 시 본 문서의 Phase 제목 및 Task 항목에 ✅를 표기한다. 완료된 Task는 `See: /tasks/XXX-xxx.md` 참조 라인을 추가한다.
