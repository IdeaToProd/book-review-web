# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@docs/PRD-book-review-mvp.md
@docs/ROADMAP.md

---

## ⚠️ 이 저장소의 특이점 — 코드 작성 전 반드시 읽기

이 프로젝트는 **표준 Next.js와 다릅니다.** 훈련 데이터에 없는 버전 및 API 조합을 사용합니다.

| 항목 | 버전/값 |
|---|---|
| Next.js | **16.2.4** (훈련 데이터에 없는 버전) |
| React | 19.2.4 |
| UI 프리미티브 | `@base-ui/react` (Radix **아님**) |
| shadcn/ui style | `base-nova` (`default`/`new-york` **아님**) |
| Tailwind CSS | **v4** (CSS-first, `tailwind.config.*` 없음) |

**코드를 작성하기 전에** `node_modules/next/dist/docs/` 의 관련 가이드를 확인하세요.  
특히 App Router 가이드는 `node_modules/next/dist/docs/01-app/` 에 있습니다.  
해당 디렉터리의 `index.md` 에는 에이전트 전용 힌트(예: `unstable_instant` 등 신규 API)가 포함되어 있습니다.

---

## 개발 명령어

```bash
# 개발
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 빌드된 앱 실행
npm run lint     # ESLint 검사 (flat config, next@16 기준)
npm run check-all   # 모든 검사 통합 실행 (권장)

# UI 컴포넌트
npx shadcn@latest add button    # 새 컴포넌트 추가
```

## ✅ 작업 완료 체크리스트

```bash
npm run check-all   # 모든 검사 통과 확인
npm run build       # 빌드 성공 확인
```

---

## 아키텍처 개요

**렌더링 흐름 (`app/layout.tsx` 기준):**

```
<html lang="ko" suppressHydrationWarning>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Header />          ← components/layout/header.tsx
    <main>{children}</main>
    <Footer />          ← components/layout/footer.tsx
  </ThemeProvider>
</html>
```

- **모든 컴포넌트는 서버 컴포넌트(RSC)가 기본**입니다. 클라이언트 상태·훅·브라우저 API가 필요한 경우에만 `"use client"`를 선언합니다.  
  (현재 클라이언트 컴포넌트: `ThemeProvider`, `ThemeToggle`, `Sheet`를 포함한 일부 UI 컴포넌트)
- **경로 별칭**: `@/*` → 프로젝트 루트 (`tsconfig.json`)  
  예) `import { cn } from "@/lib/utils"`
- 새 shadcn 프리미티브를 추가하기 전에 `components/ui/` 를 먼저 확인하세요(이미 생성된 컴포넌트: avatar, badge, button, card, dropdown-menu, navigation-menu, separator, sheet, switch).

---

## UI 작업 규칙

### Base UI의 `render` prop — `asChild` 사용 금지

이 프로젝트의 shadcn 컴포넌트는 Radix가 아닌 **`@base-ui/react`** 위에 구축되어 있습니다.  
Radix의 `asChild` prop은 **존재하지 않습니다.** 대신 `render` prop을 사용합니다.

```tsx
// ❌ 잘못된 방식 (Radix 패턴)
<DropdownMenuTrigger asChild>
  <Button variant="outline">메뉴</Button>
</DropdownMenuTrigger>

// ✅ 올바른 방식 (Base UI 패턴)
<DropdownMenuTrigger render={<Button variant="outline">메뉴</Button>}>
```

실제 사용 예: `components/theme-toggle.tsx`, `components/layout/header.tsx`

### shadcn CLI로 컴포넌트 추가 시

`components.json`의 `style: "base-nova"` 가 유지되는지 확인하세요. `shadcn add` 명령 실행 후 Radix 의존성이 추가되지 않았는지 `package.json` 을 검토하세요.

### lucide-react 아이콘

`lucide-react@^1.8.0` 은 비표준 버전 번호입니다. 사용하지 않은 아이콘을 import 하기 전에 실제 export가 존재하는지 확인하세요.

---

## 스타일링 규칙 (Tailwind v4)

- **`tailwind.config.*` 파일이 없습니다.** 토큰과 테마 변수는 `app/globals.css` 에서만 수정합니다.
  - 색상 토큰: `globals.css` 의 `:root` / `.dark` OKLCH 팔레트
  - 테마 변수: `@theme inline { ... }` 블록
- **className 병합**: 항상 `cn()` 을 사용합니다. (`import { cn } from "@/lib/utils"`)
- **다크모드**: `.dark` 클래스 기반 (`@custom-variant dark (&:is(.dark *))`)

---

## 테마 & 하이드레이션

`app/layout.tsx` 의 다음 설정을 변경하지 마세요. 하이드레이션 불일치가 발생합니다.

```tsx
<html lang="ko" suppressHydrationWarning>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
```
