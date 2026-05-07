# Task 016: 성능 최적화 및 Lighthouse 90+ 달성

## 목표

Lighthouse Performance 점수 90+ 달성. LCP 목록 < 2.5s / 상세 < 2.8s.

---

## 현황 분석

| 항목 | 현재 상태 | 조치 |
|---|---|---|
| `next/image` | ✅ ReviewCard에서 사용 중, sizes 지정 완료 | 유지 |
| 폰트 | ✅ `next/font/google` self-hosted | 유지 |
| ISR 캐시 | ⚠️ `getPublishedReviews`만 적용, `getReviewBySlug` 미적용 | 수정 |
| 첫 카드 priority | ✅ `priority={i < 3}` 구현 | 유지 |
| generateStaticParams | ❌ 없음 — 상세 페이지 ISR만 (첫 방문 느림) | 추가 |
| 번들 분석 | ❌ 미수행 | 확인 |

---

## 구현 항목

### 1. `getReviewBySlug` unstable_cache 적용

**파일**: `lib/notion/reviews.ts`

```ts
// 현재 — 캐시 없이 직접 호출
export async function getReviewBySlug(slug: string) {
  return fetchReviewBySlug(slug);
}

// 수정 — unstable_cache 적용
export const getReviewBySlug = unstable_cache(
  fetchReviewBySlug,
  ["getReviewBySlug"],
  { tags: ["reviews"], revalidate: 60 }
);
```

주의: `revalidateTag("reviews")` 호출 시 함께 무효화되어야 하므로 동일 태그 사용.

### 2. `generateStaticParams` 추가

**파일**: `app/reviews/[slug]/page.tsx`

```ts
export async function generateStaticParams() {
  const { reviews } = await getPublishedReviews({});
  return reviews.map((r) => ({ slug: r.slug }));
}
```

빌드 시 Published 리뷰 전체를 정적 생성. 새 리뷰는 ISR 60초로 처리.

### 3. 이미지 최적화 점검

- `next.config.ts`의 `remotePatterns`는 이미 설정되어 있으나 와일드카드(`*.amazonaws.com`)는 보안상 넓음
  - 필요 최소 도메인만 유지: `prod-files-secure.s3.us-west-2.amazonaws.com`만 남기고 와일드카드 제거
- `ReviewCard`의 `sizes` 속성 재확인:
  ```tsx
  sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
  ```
  ✅ 현재 적절. xl(4열)에서도 약 384px이므로 유지.

### 4. 번들 분석

```bash
ANALYZE=true npm run build
```

- `@next/bundle-analyzer` 설치 필요 시 추가
- `react-syntax-highlighter`: 코드 블록 렌더러에서 사용 — 무거울 경우 동적 임포트 검토
  ```ts
  const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"), { ssr: false });
  ```

### 5. 코드 블록 렌더러 동적 임포트

**파일**: `lib/notion/render/index.tsx`

`react-syntax-highlighter`는 약 300KB+ 번들. 코드 블록이 없는 페이지에서도 로드됨.

```tsx
import dynamic from "next/dynamic";
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter"),
  { loading: () => <pre><code>{children}</code></pre>, ssr: false }
);
```

### 6. Lighthouse CI 실행 방법

```bash
# 1. 빌드 & 서버 실행
npm run build && npm run start

# 2. 브라우저에서 DevTools → Lighthouse 탭 실행
#    또는 CLI:
npx lighthouse http://localhost:3000 --output=html --output-path=lighthouse-report.html
npx lighthouse http://localhost:3000/reviews/[slug] --output=html
```

목표: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90

---

## 완료 기준

- [ ] `getReviewBySlug`에 unstable_cache 적용 완료
- [ ] `generateStaticParams`로 빌드 시 Published 리뷰 사전 생성
- [ ] `remotePatterns` 최소 도메인으로 정리
- [ ] `react-syntax-highlighter` 동적 임포트 적용
- [ ] Lighthouse Performance 목록 ≥ 90 / 상세 ≥ 90
- [ ] LCP 목록 < 2.5s / 상세 < 2.8s 확인

---

## 참고

- Next.js 16 정적 생성: `app/reviews/[slug]/page.tsx`에 `export async function generateStaticParams()`
- unstable_cache 시그니처: `unstable_cache(fn, keyParts, options)`
- 와일드카드 remotePatterns는 Vercel 보안 정책에서 경고 발생 가능
