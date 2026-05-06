# Development Guidelines

## 프로젝트 개요

50명 규모 초대제 독서 모임을 위한 노션 기반 북 리뷰 + 토론 웹 애플리케이션.  
노션이 에디터 겸 데이터 소스, 웹은 뷰어 + 댓글 레이어 역할.

| 항목 | 값 |
|---|---|
| Next.js | **16.2.4** — 훈련 데이터에 없는 버전. 코드 작성 전 `node_modules/next/dist/docs/` 반드시 참조 |
| React | 19.2.4 |
| UI 프리미티브 | `@base-ui/react` (Radix UI **아님**) |
| shadcn 스타일 | `base-nova` (`default`/`new-york` **아님**) |
| Tailwind | **v4** CSS-first — `tailwind.config.*` 파일 **없음** |
| 데이터 소스 | Notion API (Reviews DB + Comments DB) |
| 인증 | 매직 링크 (Resend + HMAC 서명 토큰) + httpOnly JWT cookie |
| 배포 | Vercel (ISR revalidate 60초) |

---

## 디렉토리 구조 & 파일 책임

```
app/
├─ layout.tsx              ← 절대 ThemeProvider 설정 변경 금지
├─ page.tsx                ← 리뷰 목록 (RSC, ISR)
├─ globals.css             ← 색상 토큰 & 테마 변수 유일 수정 파일
├─ reviews/[slug]/
│  └─ page.tsx             ← 리뷰 상세 (RSC, ISR)
├─ login/page.tsx          ← 매직 링크 요청 폼 (클라이언트)
├─ api/auth/verify/
│  └─ route.ts             ← 토큰 검증 → cookie 발급
└─ actions/
   ├─ comments.ts          ← createComment, softDeleteComment (Server Action)
   └─ auth.ts              ← requestMagicLink (Server Action)

lib/
├─ notion/
│  ├─ client.ts            ← Notion 클라이언트 싱글턴 (서버 전용)
│  ├─ types.ts             ← Review, Comment 타입 정의 집중
│  ├─ reviews.ts           ← getPublishedReviews, getReviewBySlug
│  ├─ comments.ts          ← getCommentsByReviewId, createComment, softDeleteComment
│  └─ render/              ← Notion 블록 → React 컴포넌트 매핑
├─ auth/
│  ├─ session.ts           ← getSession() (cookie → JWT verify)
│  └─ magicLink.ts         ← 토큰 생성/검증
└─ utils.ts                ← cn() 유틸리티 (수정 금지)

components/
├─ layout/
│  ├─ header.tsx           ← 수정 시 render prop 패턴 준수
│  └─ footer.tsx
├─ theme-provider.tsx      ← 수정 금지
├─ theme-toggle.tsx        ← 수정 금지
├─ ui/                     ← 기존 컴포넌트: avatar, badge, button, card,
│                             dropdown-menu, navigation-menu, separator,
│                             sheet, switch
├─ review/
│  ├─ ReviewCard.tsx
│  ├─ ReviewGrid.tsx
│  ├─ ReviewBody.tsx       ← 노션 블록 렌더러
│  ├─ TagFilter.tsx
│  └─ SearchBox.tsx
└─ comment/
   ├─ CommentList.tsx
   └─ CommentForm.tsx
```

---

## 렌더링 결정 규칙 (RSC vs "use client")

### RSC로 유지해야 하는 것
- 노션 API 호출이 있는 모든 컴포넌트
- 정적 UI (레이아웃, 텍스트, 이미지)
- `lib/notion/*` 를 import 하는 컴포넌트

### "use client" 선언이 필요한 것
- `useState`, `useEffect`, `useRef` 등 React 훅 사용 시
- `useTheme`, `useRouter`, `useSearchParams` 등 브라우저/Next.js 훅 사용 시
- 이벤트 핸들러가 있는 인터랙티브 폼
- `useOptimistic` 을 사용하는 댓글 폼

### 결정 기준
```
컴포넌트에 브라우저 상태/훅이 필요한가?
  YES → "use client" 선언
  NO  → RSC 유지 (기본값)
```

---

## 스타일링 규칙 (Tailwind v4)

- **색상/반경 토큰 수정**: `app/globals.css` 의 `:root` / `.dark` / `@theme inline` 블록만 수정
- **`tailwind.config.*` 생성 절대 금지** — Tailwind v4는 CSS-first 설정
- **className 병합**: 반드시 `cn()` 사용 (`import { cn } from "@/lib/utils"`)
- **다크모드 클래스**: `.dark` 기반 (`@custom-variant dark (&:is(.dark *))`)
- **반응형**: Mobile First. breakpoint `sm(640)` / `md(768)` / `lg(1024)` / `xl(1280)`
- **반응형 그리드 표준**: 모바일 1열 → `sm:grid-cols-2` → `lg:grid-cols-3` → `xl:grid-cols-4`

---

## UI 컴포넌트 규칙 (@base-ui/react)

### ⚠️ render prop 패턴 — asChild 절대 금지

```tsx
// ❌ 금지 (Radix 패턴)
<DropdownMenuTrigger asChild>
  <Button variant="outline">메뉴</Button>
</DropdownMenuTrigger>

// ✅ 필수 (Base UI 패턴)
<DropdownMenuTrigger render={<Button variant="outline">메뉴</Button>}>
  메뉴
</DropdownMenuTrigger>
```

참고 파일: `components/theme-toggle.tsx`, `components/layout/header.tsx`, `components/ui/sheet.tsx`

### 새 UI 컴포넌트 추가 순서
1. `components/ui/` 에 이미 존재하는지 먼저 확인
2. `shadcn add <컴포넌트명>` 실행
3. **실행 후 `package.json` 검토** — `@radix-ui/*` 의존성이 추가되면 즉시 제거하고 수동으로 재작성
4. `components.json` 의 `"style": "base-nova"` 유지 확인

### lucide-react 아이콘 사용
- `lucide-react@^1.8.0` 은 비표준 버전. 사용 전 해당 아이콘이 실제로 export 되는지 확인
- 확인 방법: `node_modules/lucide-react/dist/esm/icons/` 디렉토리 확인

---

## Notion 연동 규칙

### 절대 규칙
- `lib/notion/client.ts` 는 서버 전용. 클라이언트 컴포넌트에서 **절대 import 금지**
- `NOTION_TOKEN` env 변수는 서버에서만 접근 (`NEXT_PUBLIC_` 접두사 절대 금지)
- 모든 Notion API 호출은 RSC 또는 Server Action 에서만 수행

### ISR 캐싱 패턴
```tsx
// 페이지 컴포넌트
export const revalidate = 60; // 60초 ISR

// 또는 fetch 레벨
fetch(url, { next: { revalidate: 60, tags: ['reviews'] } })
```

### revalidateTag 호출 위치
- `createComment` Server Action 성공 후: `revalidateTag('comments:' + reviewId)`
- `softDeleteComment` Server Action 성공 후: `revalidateTag('comments:' + reviewId)`
- 리뷰 목록 캐시 태그: `'reviews'`
- 리뷰 상세 캐시 태그: `'review:' + slug`

### Reviews DB 필터
- **항상** `Status = "Published"` 필터 적용. Draft/Archived 노출 금지

### 노션 블록 렌더러 (`lib/notion/render/`)
- 지원 블록 타입: `heading_1`, `heading_2`, `heading_3`, `paragraph`, `bulleted_list_item`, `numbered_list_item`, `code`, `quote`, `image`
- 지원하지 않는 블록 타입은 무시 (throw 금지)

---

## 인증/세션 규칙

### 매직 링크 플로우
```
requestMagicLink(email)           ← Server Action (app/actions/auth.ts)
  → ALLOWED_EMAILS 화이트리스트 검증
  → HMAC 서명 토큰 생성 (만료 15분)
  → Resend로 발송
  → 허용/비허용 이메일 모두 동일한 성공 메시지 반환 (이메일 존재 추측 방지)

GET /api/auth/verify?token=...    ← Route Handler
  → 토큰 검증
  → JWT 발급 → httpOnly cookie (14일)
  → / 로 redirect
```

### 세션 검증
- `lib/auth/session.ts` 의 `getSession()` 을 Server Action/RSC에서 호출
- `getSession()` 반환값: `{ email: string } | null`
- `null` 이면 미인증 상태

### 댓글 보안 규칙
- `createComment` 에서 `AuthorEmail` 은 반드시 `session.email` 로 강제 세팅 (클라이언트 전달값 신뢰 금지)
- `softDeleteComment` 에서 `commentId` 의 `AuthorEmail === session.email` 검증 필수

---

## app/layout.tsx 불변 규칙

다음 코드를 절대 수정하지 말 것 (수정 시 하이드레이션 불일치 발생):

```tsx
<html lang="ko" suppressHydrationWarning>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
```

- `suppressHydrationWarning` 제거 금지
- `ThemeProvider` props 변경 금지
- `lang="ko"` 변경 금지

---

## 파일 상호작용 규칙

| 작업 | 수정/생성 파일 |
|---|---|
| 새 페이지 라우트 추가 | `app/<경로>/page.tsx` 생성 |
| 새 Server Action 추가 | `app/actions/*.ts` 에 함수 추가 (`"use server"` 선언) |
| 새 Notion 쿼리 함수 | `lib/notion/reviews.ts` 또는 `lib/notion/comments.ts` |
| 색상/테마 변경 | `app/globals.css` 의 `:root` / `.dark` / `@theme inline` 만 |
| 새 타입 정의 | `lib/notion/types.ts` 에 집중 |
| 새 UI 컴포넌트 (shadcn) | `components/ui/*.tsx` |
| 도메인 컴포넌트 | `components/review/*.tsx` 또는 `components/comment/*.tsx` |
| 환경변수 추가 | `.env.local` 추가 + `.env.example` 동기화 필수 |

---

## AI 결정 기준

### 컴포넌트 파일 위치 결정
```
UI 프리미티브 (버튼/인풋 등)?
  → components/ui/

리뷰 관련 도메인 UI?
  → components/review/

댓글 관련 도메인 UI?
  → components/comment/

페이지 레이아웃?
  → components/layout/
```

### Notion 데이터 페치 위치 결정
```
페이지 컴포넌트에서 초기 데이터 로드?
  → RSC page.tsx 에서 직접 호출 + ISR revalidate

사용자 액션(작성/삭제)으로 트리거?
  → Server Action (app/actions/*.ts)
```

### 새 라이브러리 추가 결정
```
UI 컴포넌트 관련?
  → shadcn add 먼저 시도. @radix-ui 유입 시 수동 구현

인증 관련?
  → 기존 lib/auth/ 패턴 확장. 외부 auth 라이브러리 추가 금지

이미지 처리?
  → next/image 만 사용. 외부 이미지 라이브러리 추가 금지
```

---

## 금지 사항

- **`tailwind.config.js` / `tailwind.config.ts` 생성** — Tailwind v4는 CSS-first
- **`asChild` prop 사용** — @base-ui/react에 존재하지 않음. `render` prop 사용
- **클라이언트 컴포넌트에서 `lib/notion/*` import** — 서버 전용 모듈
- **`NOTION_TOKEN` 을 `NEXT_PUBLIC_` 로 노출** — 보안 위반
- **`app/layout.tsx` ThemeProvider 설정 변경** — 하이드레이션 오류 발생
- **`@radix-ui/*` 패키지 추가** — @base-ui/react와 충돌
- **`shadcn add` 이후 package.json 확인 생략** — Radix 의존성 자동 유입 위험
- **`cn()` 없이 className 문자열 직접 연결** — 우선순위 충돌 발생
- **상대경로 import (`../../`)** — 반드시 `@/` 별칭 사용
- **댓글 작성/삭제 시 클라이언트 전달 AuthorEmail 신뢰** — 반드시 서버에서 세션으로 검증
- **지원하지 않는 노션 블록 타입 throw** — 무시 처리
- **`console.log` 사용** — 서버: 적절한 로거, 클라이언트: 제거
