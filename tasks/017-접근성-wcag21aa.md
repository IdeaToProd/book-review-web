# Task 017: 접근성 (WCAG 2.1 AA) 점검

## 목표

WCAG 2.1 AA 기준 충족. Lighthouse Accessibility ≥ 90.

---

## 현황 분석

| 항목 | 파일 | 현재 상태 | 조치 |
|---|---|---|---|
| aria-label (링크) | `ReviewCard.tsx` | ✅ `aria-label="제목 - 저자 리뷰 보기"` | 유지 |
| aria-label (별점) | `ReviewCard.tsx` | ✅ `aria-label="별점 N점"` | 유지 |
| section aria-label | `reviews/[slug]/page.tsx` | ✅ `aria-label="토론 댓글"` | 유지 |
| focus-visible | `ReviewCard.tsx` | ✅ `focus-visible:ring-2` | 유지 |
| 스킵 내비게이션 | `layout.tsx` | ❌ 없음 | 추가 |
| main id | `layout.tsx` | ❌ `<main>`에 id 없음 | 추가 |
| 이미지 alt | `ReviewCard.tsx` | ✅ `alt="제목 표지"` | 유지 |
| 폼 label | `CommentForm.tsx` | 점검 필요 | 확인 |
| 색상 대비비 | globals.css | 점검 필요 | 확인 |
| lang 속성 | `layout.tsx` | ✅ `lang="ko"` | 유지 |
| 시맨틱 HTML | 전체 | 점검 필요 | 확인 |

---

## 구현 항목

### 1. 스킵 내비게이션 링크 추가

**파일**: `app/layout.tsx`

스크린 리더 및 키보드 사용자가 반복 내비게이션을 건너뛸 수 있도록 추가.

```tsx
<body className="min-h-full flex flex-col">
  {/* 스킵 내비게이션 — 키보드 포커스 시 표시 */}
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-md focus:ring-2 focus:ring-ring"
  >
    본문으로 바로가기
  </a>
  <ThemeProvider ...>
    <Header />
    <main id="main-content" className="flex-1">{children}</main>
    ...
  </ThemeProvider>
</body>
```

### 2. CommentForm 레이블 점검

**파일**: `components/comment/CommentForm.tsx`

- `<textarea>` 또는 `<input>`에 `<label>` 또는 `aria-label` 누락 여부 확인
- `id`/`htmlFor` 쌍 또는 `aria-labelledby` 사용

```tsx
<label htmlFor="comment-body" className="sr-only">댓글 내용</label>
<Textarea id="comment-body" ... />
```

### 3. SearchBox 접근성 점검

**파일**: `components/review/SearchBox.tsx`

- `<input type="search">`에 `aria-label` 또는 연결된 `<label>` 확인
- `role="search"` wrapper 추가 검토

```tsx
<form role="search" ...>
  <label htmlFor="search-input" className="sr-only">리뷰 검색</label>
  <input id="search-input" type="search" aria-label="리뷰 검색" ... />
</form>
```

### 4. TagFilter 접근성 점검

**파일**: `components/review/TagFilter.tsx`

- 태그 버튼에 현재 선택 상태 표시: `aria-pressed={selectedTag === tag}`
- 또는 `aria-current`

```tsx
<button
  aria-pressed={selectedTag === tag}
  ...
>
  {tag}
</button>
```

### 5. DeleteCommentButton 확인

**파일**: `components/comment/DeleteCommentButton.tsx`

- 삭제 버튼에 `aria-label="댓글 삭제"` 확인 (아이콘만 있을 경우 필수)

### 6. InfiniteReviewList 로딩 상태

**파일**: `components/review/InfiniteReviewList.tsx`

```tsx
{/* 스크린 리더에 로딩 상태 알림 */}
{isLoading && (
  <div role="status" aria-live="polite" className="sr-only">
    리뷰를 불러오는 중입니다.
  </div>
)}
```

### 7. 색상 대비비 점검 대상

`globals.css`의 OKLCH 토큰 기준으로 대비비 확인:

| 요소 | 클래스 | 점검 항목 |
|---|---|---|
| 본문 텍스트 | `text-foreground` on `bg-background` | ≥ 4.5:1 |
| muted 텍스트 | `text-muted-foreground` | ≥ 4.5:1 (일반 텍스트) |
| primary 버튼 | `text-primary-foreground` on `bg-primary` | ≥ 4.5:1 |
| 태그 칩 | `text-primary` on `bg-primary/5` | ≥ 4.5:1 |
| 별점 | `text-yellow-400` on `bg-background` | ≥ 3:1 (그래픽 요소) |
| 다크모드 | 모든 위 항목의 `.dark` 변형 | 동일 기준 |

점검 도구: Chrome DevTools → CSS Overview 또는 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 8. 키보드 내비게이션 순서 확인

- Tab 순서가 시각적 흐름과 일치하는지 확인
- `tabIndex` 양수 값 사용 금지 (자연 흐름 유지)
- Modal/Dialog 있을 경우 포커스 트랩 확인

---

## 완료 기준

- [ ] 스킵 내비게이션 링크 추가 (`#main-content`)
- [ ] CommentForm 입력 필드에 label 연결 확인
- [ ] SearchBox `role="search"` 및 label 추가
- [ ] TagFilter `aria-pressed` 상태 표시
- [ ] InfiniteReviewList 로딩 `aria-live` 추가
- [ ] 색상 대비비 4.5:1 이상 (일반 텍스트), 3:1 이상 (그래픽) 확인 — 라이트/다크 모두
- [ ] Lighthouse Accessibility ≥ 90
- [ ] axe DevTools 또는 WAVE로 오류 0건 확인

---

## 점검 도구

```bash
# axe-core CLI (선택)
npx axe http://localhost:3000
npx axe http://localhost:3000/reviews/[slug]

# 또는 브라우저 확장: axe DevTools, WAVE
```
