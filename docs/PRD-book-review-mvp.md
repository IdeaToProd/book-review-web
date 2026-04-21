# 북 리뷰 웹 PRD (MVP v0.1)

> 소규모 독서 모임을 위한 노션 기반 북 리뷰 & 토론 웹 애플리케이션

---

## 1. 문서 정보

| 항목 | 내용 |
|---|---|
| 문서명 | 북 리뷰 웹 MVP PRD |
| 버전 | v0.1 (MVP) |
| 작성일 | 2026-04-21 |
| 최종 수정일 | 2026-04-21 |
| 작성자 | 1인 개발자 (포트폴리오/학습 프로젝트 오너) |
| 상태 | Draft — 개발 착수 가능 |
| 대상 독자 | 개발자 본인, 소모임 운영자, 코드 리뷰어 |

---

## 2. 개요 & 배경

본 프로젝트는 **약 50명 규모의 초대제 독서 모임**을 위한 북 리뷰 웹 애플리케이션이다. 멤버들은 기존 업무/개인 워크플로우인 **노션(Notion)에서 리뷰를 직접 작성**하고, 웹에서는 읽기 최적화된 UI와 **댓글 기반의 토론 레이어**를 제공한다. 별도의 CMS를 구축하지 않고 노션을 공용 에디터 겸 데이터 소스로 사용함으로써, 개발 범위를 "뷰어 + 댓글"로 좁히고 1인 개발자가 **2~3주 내 릴리스 가능한 학습/포트폴리오 프로젝트**로 정의한다.

목표는 두 축이다:
1. **포트폴리오 가치** — Next.js 16 / React 19 / RSC / Notion API / Tailwind v4 / base-ui 기반의 최신 스택 실전 케이스 구축.
2. **실사용 가치** — 기존 카톡·메모에 흩어진 리뷰를 한 곳에서 검색·재독·토론 가능한 아카이브로 정리.

---

## 3. 문제 정의

현재 소모임의 리뷰/토론은 다음과 같은 불편을 겪는다.

| # | 현재 상황 | 불편 |
|---|---|---|
| P1 | 리뷰가 카톡·개인 노션·블로그에 분산 | 과거 리뷰 검색·재독 불가 |
| P2 | 누가 어떤 책을 읽었는지 파악 어려움 | 모임 내 취향·활동 파악 불가 |
| P3 | 태그·주제별 탐색 수단 부재 | "판타지 추천" 같은 큐레이션 불가 |
| P4 | 멤버가 리뷰 작성 툴을 새로 배워야 함 | 참여 장벽이 높아 리뷰 수 저조 |

**핵심 인사이트**: 멤버 대부분이 이미 노션을 쓰고 있다. 새 에디터를 만들 것이 아니라, **노션을 살리고 웹을 뷰어+토론 레이어로** 포지셔닝해야 채택률이 올라간다.

---

## 4. 목표 & 비목표

### 4.1 목표 (In Scope)

- **G1** 노션 DB에 작성된 리뷰를 웹에서 가독성 있게 렌더링
- **G2** 웹에서 댓글 작성/조회 → 노션 댓글 DB에 저장 (단일 데이터 소스)
- **G3** 초대 기반 인증으로 약 50명 허용 멤버만 접근
- **G4** 태그·검색으로 과거 리뷰 재발견 가능

### 4.2 비목표 (Out of Scope — MVP에서 명시적으로 제외)

| 제외 항목 | 사유 |
|---|---|
| 공개 회원가입 | 50명 폐쇄 커뮤니티. 초대 목록 + 수동 승인으로 충분 |
| 네이티브 모바일 앱 | 반응형 웹으로 커버 |
| 실시간 채팅/푸시 알림 | 댓글은 비동기로 충분. 알림은 v0.2 이후 |
| 웹 내 리뷰 에디터 | 노션이 에디터. 중복 투자 금지 |
| 소셜 로그인 전면 지원 (Google/Kakao 등) | Notion OAuth 또는 매직 링크 1개로 시작 |
| 좋아요/추천/랭킹 | 50명 규모에서 유의미한 시그널 안 나옴 |
| 결제/프리미엄 | 학습 프로젝트. 수익 모델 없음 |
| 다국어 | 한국어 단일 |
| 관리자 대시보드 | 노션 자체가 관리자 UI. 별도 구축 불필요 |

---

## 5. 타겟 사용자 & 페르소나

### 5.1 페르소나 A — 모임 운영자 "수진" (34세)

- **역할**: 독서 모임 호스트, 큐레이션·초대 관리
- **도구**: 노션 파워유저, 맥북 + 아이패드
- **니즈**: 모임 아카이브를 "소개 가능한 자산"으로 만들고 싶음. 신규 멤버에게 "저희 이런 책 읽어요" 링크 하나 주고 싶음
- **성공 정의**: 외부인에게 공유할 만한 아카이브 페이지가 생김

### 5.2 페르소나 B — 일반 멤버 "현우" (29세)

- **역할**: 주 1회 리뷰 작성, 다른 멤버 리뷰에 댓글
- **도구**: 노션은 쓰지만 파워유저는 아님. 주로 모바일에서 열람
- **니즈**: 새 리뷰를 편하게 훑고, 공감되는 부분에 짧게 댓글 남기기. 과거에 읽은 책 다시 찾기
- **성공 정의**: 모바일에서 1분 내로 최신 리뷰 열람 + 댓글 작성 가능

---

## 6. 핵심 사용자 여정 (User Journey)

### 6.1 여정 A — 리뷰 작성 (노션 → 웹 반영)

```
1. 멤버가 노션 Reviews DB에 신규 페이지 생성
2. 책 제목·저자·별점·태그·커버 이미지 입력
3. 본문 작성 (노션 에디터)
4. Status 속성을 "Published"로 변경
   ↓
5. 웹이 ISR revalidate (태그: "reviews") 로 60초 내 반영
6. 멤버에게 "게시되었습니다" 확인은 노션에서 Status 변경 순간으로 충분
```

### 6.2 여정 B — 리뷰 탐색·열람

```
1. 멤버 접속 → 로그인 (매직 링크 or Notion OAuth)
2. 홈: 최신 리뷰 카드 그리드 (커버 + 제목 + 별점 + 작성자)
   ↓
3. [분기1] 태그 필터 클릭 → 필터링된 목록
   [분기2] 검색 → 제목·저자·본문 매칭 결과
   [분기3] 카드 클릭 → 리뷰 상세 페이지
   ↓
4. 리뷰 상세: 노션 블록 렌더링 + 메타(별점/태그/작성자) + 댓글 영역
```

### 6.3 여정 C — 댓글 토론

```
1. 리뷰 상세 페이지 하단 댓글 영역
2. 기존 댓글 목록 (작성자 + 시각 + 본문)
   ↓
3. 로그인된 멤버만 입력창 활성
4. 댓글 작성 → Server Action → Notion Comments DB에 생성
   ↓
5. 낙관적 업데이트로 즉시 노출 + revalidate
6. 본인 댓글은 수정·삭제 가능 (편집은 v0.2로 미룰지 검토)
```

---

## 7. 기능 요구사항 (MVP 범위)

### 7.1 우선순위 정의

- **P0** — MVP 릴리스에 반드시 포함. 빠지면 출시 불가
- **P1** — MVP에 포함되면 좋음. 일정상 밀릴 수 있음
- **P2** — v0.2 이후 고려. 본 PRD에서는 참고용

### 7.2 기능 목록

| ID | 기능 | 우선순위 | 설명 | 수용 기준 |
|---|---|---|---|---|
| F-01 | Notion Reviews DB 연동 | P0 | 정의된 스키마로 리뷰 목록/상세 조회 | Status=Published인 페이지만 노출. 60초 이내 반영 |
| F-02 | 리뷰 목록 페이지 (`/`) | P0 | 카드 그리드, 최신순 정렬 | LCP < 2.5s, 12개 페이지네이션 or 무한스크롤 |
| F-03 | 리뷰 상세 페이지 (`/reviews/[slug]`) | P0 | Notion blocks → React 렌더링 | 코드·인용·이미지·리스트·헤딩 블록 최소 지원 |
| F-04 | 초대 기반 인증 | P0 | 허용 이메일 목록 + 매직 링크 | 미허용 이메일은 로그인 요청 자체 차단 |
| F-05 | 댓글 조회 | P0 | Comments DB에서 해당 리뷰의 댓글 로드 | 작성 시각 오름차순 |
| F-06 | 댓글 작성 | P0 | Server Action으로 Comments DB에 row 추가 | 낙관적 UI. 실패 시 롤백+에러 토스트 |
| F-07 | 본인 댓글 삭제 | P1 | 작성자 본인만 삭제 가능 | Notion row의 Author 속성과 세션 이메일 일치 검증 |
| F-08 | 태그 필터 | P1 | 태그 선택 시 목록 필터링 | URL 쿼리 기반 (`?tag=SF`) |
| F-09 | 검색 | P1 | 제목/저자/본문 텍스트 매칭 | 서버 사이드 검색, 간단한 includes로 시작 |
| F-10 | 기본 SEO | P1 | OG 태그, 메타 description, sitemap | 리뷰 상세 공유 시 카드 미리보기 정상 노출 |
| F-11 | 다크모드 토글 | P1 | 기존 ThemeProvider 재사용 | 시스템 설정 follow + 수동 토글 |
| F-12 | 404/에러 바운더리 | P1 | 없는 리뷰·네트워크 에러 핸들링 | 친화적 안내 문구 |
| F-13 | 본인 댓글 수정 | P2 | 편집 UI | v0.2 검토 |
| F-14 | 멤버 프로필 페이지 | P2 | 해당 멤버가 쓴 리뷰 모음 | v0.2 |
| F-15 | 알림 | P2 | 내 리뷰에 댓글 달리면 이메일 | v0.2 |

### 7.3 페이지 구성 (MVP)

| 라우트 | 렌더 | 기능 ID |
|---|---|---|
| `/` | RSC + ISR | F-02, F-08, F-09 |
| `/reviews/[slug]` | RSC + ISR | F-03, F-05, F-06, F-07 |
| `/login` | 클라이언트 | F-04 |
| `/api/auth/*` or Route Handler | 서버 | F-04 |
| `/not-found`, `error.tsx` | - | F-12 |

---

## 8. 비기능 요구사항

| 카테고리 | 요구사항 |
|---|---|
| 성능 | 리뷰 목록 LCP < 2.5s (3G Fast), 상세 LCP < 2.8s. Lighthouse Performance ≥ 90 |
| 접근성 | WCAG 2.1 AA 지향. 시맨틱 HTML, 키보드 내비게이션, aria-label, 다크모드 대비비 통과 |
| 반응형 | Mobile First. Breakpoint 640/768/1024/1280. 모바일에서 카드 1열, 태블릿 2열, 데스크톱 3~4열 |
| 보안 | Notion Integration Token은 **서버 전용 env**. 클라이언트 번들 노출 금지. Server Action에서만 Notion 호출 |
| 인증 | 세션은 httpOnly 쿠키. 허용 이메일 목록은 env 또는 별도 Notion DB로 관리 |
| 캐싱 | ISR revalidate 60초 + Server Action 성공 시 `revalidateTag` 명시적 무효화 |
| 관측성 | Vercel Analytics + Web Vitals. 에러는 `error.tsx`에서 서버 로그로 전달 |
| 브라우저 | 최신 2버전: Chrome, Safari, Edge, Firefox |
| 언어 | UI/주석/문서 모두 한국어 |

---

## 9. 데이터 모델

노션 DB **2개**로 모든 도메인 데이터 보관. 모임 운영자가 노션 UI로 직접 관리 가능.

### 9.1 Reviews DB

| 속성명 | Notion 타입 | 필수 | 설명 |
|---|---|---|---|
| `Title` | Title | O | 책 제목 (페이지 타이틀) |
| `Author` | Rich text | O | 책 저자 |
| `Slug` | Rich text (unique) | O | URL 슬러그. 수동 입력 또는 formula로 생성 |
| `Reviewer` | People | O | 리뷰 작성자 (노션 멤버) |
| `ReviewerEmail` | Email | O | 인증 매칭용 이메일 |
| `Rating` | Number (1~5) | O | 별점 |
| `Tags` | Multi-select | - | 장르/주제 태그 (예: SF, 에세이, 경영) |
| `Cover` | Files & media | - | 책 표지 이미지 |
| `Status` | Select | O | `Draft` / `Published` / `Archived`. `Published`만 웹 노출 |
| `PublishedAt` | Date | O | 게시 시각 (정렬 기준) |
| `Summary` | Rich text | - | 1~2줄 요약 (카드/OG용) |
| `Body` | (페이지 본문 블록) | O | Notion blocks 트리로 저장 |

### 9.2 Comments DB

| 속성명 | Notion 타입 | 필수 | 설명 |
|---|---|---|---|
| `ID` | Title | O | 자동 생성 (timestamp + hash) |
| `Review` | Relation → Reviews DB | O | 댓글이 달린 리뷰 |
| `Author` | Rich text | O | 작성자 표시 이름 |
| `AuthorEmail` | Email | O | 세션 이메일 (삭제 권한 검증용) |
| `Body` | Rich text | O | 댓글 본문 (일반 텍스트, 최대 1000자) |
| `CreatedAt` | Created time | O | 작성 시각 (자동) |
| `Deleted` | Checkbox | - | soft delete 플래그 (v0.1은 hard delete로 시작해도 무방) |

### 9.3 관계 및 제약

- `Comments.Review` → `Reviews` 1:N 관계
- 웹은 `Status = "Published"` 인 리뷰만 읽음
- 댓글 작성 시 서버에서 `AuthorEmail = session.email` 로 강제 세팅 (클라이언트 값 신뢰 금지)
- 노션 Integration에는 **두 DB 모두 Read + Insert 권한** 필요. Update/Delete는 댓글 삭제 기능에만 사용

---

## 10. 기술 아키텍처 (간단히)

### 10.1 구성 요소

```
[Browser]
   │  (HTTPS, httpOnly cookie 세션)
   ▼
[Next.js 16 App Router on Vercel]
  ├─ RSC: 리뷰 목록/상세 → Notion API (Reviews DB query, page blocks)
  ├─ Server Action: 댓글 작성/삭제 → Notion API (Comments DB)
  ├─ Route Handler: 매직 링크 발급/검증
  └─ ISR: revalidate=60, tag=["reviews","review:{slug}","comments:{slug}"]
   │
   ▼
[Notion API]
  ├─ Reviews DB
  └─ Comments DB
```

### 10.2 핵심 결정

| 이슈 | 결정 | 이유 |
|---|---|---|
| 데이터 페칭 위치 | **RSC에서 Notion API 직접 호출** | 토큰 서버 보관, 클라이언트 번들 축소 |
| 캐시 전략 | ISR `revalidate: 60` + 댓글 작성 시 `revalidateTag` | 60초 반영 KPI 충족 + 댓글은 즉시 반영 |
| 댓글 작성 | **Server Action** (`"use server"`) | API Route 추가 없이 타입 안전, 폼 진보적 향상 |
| 노션 블록 렌더 | 자체 최소 구현 (heading/paragraph/list/code/quote/image) | react-notion-x는 번들 크고 스타일 충돌 우려. 필요 블록만 선택 구현 |
| 인증 | 매직 링크 (Resend + 서명 토큰) + 허용 이메일 env | OAuth 등록 복잡도 회피. 50명 규모에 충분 |
| 세션 | JWT → httpOnly cookie (서명/만료 14일) | 외부 세션 스토어 불필요 |
| 이미지 | Notion S3 URL을 `next/image` loader로 프록시 (만료 대비 revalidate로 refresh) | Notion 이미지 URL은 1시간 만료 → ISR 주기와 맞추기 |

### 10.3 base-ui/react 제약 (주의)

- shadcn 프리미티브는 `@base-ui/react` 기반. **`asChild` prop 없음**, `render` prop 사용
- `components.json` style은 `base-nova` 고정. `shadcn add` 이후 Radix 의존성 유입 금지
- Tailwind v4 CSS-first. 토큰은 `app/globals.css` 의 `@theme inline` / `:root` / `.dark` 에서만 수정

### 10.4 폴더 구조 제안

```
app/
├─ layout.tsx              # 기존 (ThemeProvider, Header, Footer)
├─ page.tsx                # 리뷰 목록 (RSC)
├─ reviews/[slug]/page.tsx # 리뷰 상세 (RSC)
├─ login/page.tsx          # 매직 링크 요청 폼
├─ api/auth/verify/route.ts
└─ actions/
   ├─ comments.ts          # createComment, deleteComment (Server Action)
   └─ auth.ts              # requestMagicLink
lib/
├─ notion/
│  ├─ client.ts            # Notion client 싱글턴
│  ├─ reviews.ts           # getReviews, getReviewBySlug
│  ├─ comments.ts          # listComments, addComment, deleteComment
│  └─ render/              # block → React 매핑
├─ auth/
│  ├─ magicLink.ts
│  └─ session.ts
└─ utils.ts                # cn() 등
components/
├─ review/
│  ├─ ReviewCard.tsx
│  ├─ ReviewGrid.tsx
│  ├─ ReviewBody.tsx       # 노션 블록 렌더러
│  ├─ TagFilter.tsx
│  └─ SearchBox.tsx
└─ comment/
   ├─ CommentList.tsx
   └─ CommentForm.tsx      # Server Action 연동
```

---

## 11. 성공 지표 (KPI)

학습 프로젝트 스케일에 맞춰 **가볍고 측정 가능**하게.

| 지표 | 목표 | 측정 방법 | 비고 |
|---|---|---|---|
| WAU (주간 활성 사용자) | ≥ 20명 | 세션 쿠키 기반 집계 or Vercel Analytics | 전체 50명 중 40% |
| 리뷰당 평균 댓글 수 | ≥ 2 | Comments DB / Reviews DB | 출시 후 4주 평균 |

---

**문서 끝 — v0.1 승인 시 W1 착수.**
