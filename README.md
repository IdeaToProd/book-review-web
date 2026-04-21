# 북 리뷰 웹 (Book Review Web)

소규모 독서 모임을 위한 **노션 기반 북 리뷰 & 토론 웹 애플리케이션**입니다.  
멤버들이 노션에서 리뷰를 작성하면, 이 앱이 읽기 최적화된 UI와 댓글 토론 레이어를 제공합니다.

> 상세 기획은 [`docs/PRD-book-review-mvp.md`](./docs/PRD-book-review-mvp.md)를 참고하세요.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| Next.js | 16.2.4 (App Router, RSC) |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | v4 (CSS-first, 설정 파일 없음) |
| UI 프리미티브 | @base-ui/react (shadcn `base-nova` 스타일) |
| 데이터 소스 | Notion API (Reviews DB + Comments DB) |

---

## 시작하기

### 의존성 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 채웁니다.

```env
NOTION_TOKEN=          # Notion Integration 토큰
NOTION_REVIEWS_DB_ID=  # Reviews DB ID
NOTION_COMMENTS_DB_ID= # Comments DB ID
ALLOWED_EMAILS=        # 콤마로 구분한 허용 이메일 목록
JWT_SECRET=            # 세션 서명용 랜덤 문자열
RESEND_API_KEY=        # 매직 링크 이메일 발송 (Resend)
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 확인합니다.

---

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 빌드된 앱 실행
npm run lint     # ESLint 검사
```

---

## 프로젝트 구조

```
book-review-web/
├── app/
│   ├── layout.tsx               # 루트 레이아웃 (ThemeProvider, Header, Footer)
│   ├── page.tsx                 # 리뷰 목록 (RSC + ISR)
│   ├── reviews/[slug]/page.tsx  # 리뷰 상세
│   ├── login/page.tsx           # 매직 링크 로그인
│   └── actions/
│       ├── comments.ts          # 댓글 Server Action
│       └── auth.ts              # 인증 Server Action
├── components/
│   ├── layout/                  # Header, Footer
│   ├── review/                  # ReviewCard, ReviewGrid, ReviewBody
│   ├── comment/                 # CommentList, CommentForm
│   └── ui/                     # shadcn/ui 프리미티브
├── lib/
│   ├── notion/                  # Notion API 클라이언트 + 쿼리
│   └── auth/                   # 매직 링크 + 세션
├── docs/
│   └── PRD-book-review-mvp.md  # MVP 기획 문서
└── public/
```

---

## 주의사항

### @base-ui/react (Radix 아님)

이 프로젝트의 shadcn 컴포넌트는 `@base-ui/react` 위에 구축되어 있습니다.  
Radix의 `asChild` prop은 **존재하지 않으며**, 대신 `render` prop을 사용합니다.

```tsx
// ❌ 잘못된 방식
<DropdownMenuTrigger asChild><Button>메뉴</Button></DropdownMenuTrigger>

// ✅ 올바른 방식
<DropdownMenuTrigger render={<Button>메뉴</Button>}>
```

### Tailwind CSS v4

`tailwind.config.*` 파일이 없습니다. 테마 토큰은 `app/globals.css` 에서만 수정합니다.

---

## 라이선스

MIT
