# Task 018: Vercel 배포 및 운영 셋업

## 목표

Vercel에 프로덕션 배포 완료. 환경변수, ISR, 도메인, 모니터링 설정.

---

## 현황 분석

| 항목 | 현재 상태 | 조치 |
|---|---|---|
| `.env.example` | ✅ 작성 완료 | 유지 |
| `next.config.ts` | ✅ remotePatterns 설정 완료 | 보안 강화 |
| `vercel.json` | ❌ 없음 | 생성 (선택) |
| Vercel Analytics | ❌ 미연동 | 추가 |
| `sitemap.ts` | ✅ 있음 | 확인 |
| `robots.ts` | ✅ 있음 | 확인 |
| 빌드 스크립트 | `npm run build` | 확인 |

---

## 구현 항목

### 1. 배포 전 체크리스트

```bash
# 로컬에서 프로덕션 빌드 검증
npm run build
npm run start
```

- [ ] 빌드 오류 없음
- [ ] `npm run lint` 통과
- [ ] 환경변수 없을 때 빌드 실패 여부 확인 (env 검증 로직)

### 2. 환경변수 필수값 검증 추가

**파일**: `lib/notion/client.ts` (또는 별도 `lib/env.ts`)

Vercel 배포 시 환경변수 누락을 빌드 타임에 감지.

```ts
// lib/env.ts
const requiredEnvVars = [
  "NOTION_TOKEN",
  "NOTION_REVIEWS_DB_ID",
  "NOTION_COMMENTS_DB_ID",
  "RESEND_API_KEY",
  "JWT_SECRET",
  "ALLOWED_EMAILS",
  "APP_URL",
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다.`);
  }
}
```

### 3. Vercel 프로젝트 설정

**Vercel Dashboard → Settings → Environment Variables**

| 변수명 | 환경 | 값 |
|---|---|---|
| `NOTION_TOKEN` | Production, Preview | Notion Integration Token |
| `NOTION_REVIEWS_DB_ID` | Production, Preview | Reviews DB ID |
| `NOTION_COMMENTS_DB_ID` | Production, Preview | Comments DB ID |
| `RESEND_API_KEY` | Production, Preview | Resend API Key |
| `JWT_SECRET` | Production | `openssl rand -base64 32` 생성값 |
| `ALLOWED_EMAILS` | Production | 허용 이메일 쉼표 구분 목록 |
| `APP_URL` | Production | `https://your-domain.vercel.app` |

**Preview 환경**: `JWT_SECRET`은 별도 값 사용 권장 (운영 세션 분리)

### 4. `next.config.ts` 보안 강화

와일드카드 remotePatterns 제거:

```ts
// 현재 — 와일드카드 포함
{ protocol: "https", hostname: "*.amazonaws.com" }

// 수정 — 최소 도메인만
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    // Notion 내부 이미지 (S3, 만료 주기 60초 ISR과 맞춤)
    { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
    { protocol: "https", hostname: "notion.so" },
    { protocol: "https", hostname: "*.notion.so" },
  ],
},
```

### 5. Vercel Analytics 연동

```bash
npm install @vercel/analytics
```

**파일**: `app/layout.tsx`

```tsx
import { Analytics } from "@vercel/analytics/react";

// <body> 내 </ThemeProvider> 위에 추가
<Analytics />
```

Web Vitals 자동 수집 (LCP, FID, CLS 등).

### 6. `vercel.json` (선택)

헤더 설정이 필요한 경우에만 생성. 기본 Vercel 설정으로 충분하면 생략.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### 7. sitemap.ts / robots.ts 검증

**파일**: `app/sitemap.ts`

- `APP_URL` 환경변수 기반으로 URL 생성 여부 확인
- Published 리뷰 전체가 sitemap에 포함되는지 확인

**파일**: `app/robots.ts`

- `Disallow: /api/` — API 라우트 크롤링 차단
- `Sitemap:` 항목에 절대 URL 포함 여부 확인

### 8. ISR revalidate 동작 확인

Vercel 배포 후:
1. 노션에서 리뷰 Status 변경
2. 60초 후 웹 반영 여부 확인
3. 댓글 작성 후 즉시 반영 여부 확인 (revalidateTag)

```bash
# Vercel 로그에서 ISR revalidation 확인
vercel logs --follow
```

### 9. 커스텀 도메인 설정 (선택)

Vercel Dashboard → Domains → Add Domain:
- `APP_URL` 환경변수를 커스텀 도메인으로 업데이트
- DNS CNAME 설정: `cname.vercel-dns.com`

---

## 배포 절차

```bash
# 1. Vercel CLI 설치 (선택)
npm i -g vercel

# 2. 로그인
vercel login

# 3. 프로젝트 연결
vercel link

# 4. 환경변수 설정 (Dashboard 또는 CLI)
vercel env add NOTION_TOKEN production

# 5. 프로덕션 배포
vercel --prod

# 또는 GitHub 연동 후 main 브랜치 push로 자동 배포
```

---

## 완료 기준

- [ ] `npm run build` 로컬 빌드 성공
- [ ] 환경변수 전체 Vercel Dashboard에 설정 완료
- [ ] Vercel 프로덕션 배포 성공 (빌드 로그 오류 없음)
- [ ] `APP_URL` 기반 매직 링크 이메일 수신 확인
- [ ] ISR 60초 내 노션 변경사항 웹 반영 확인
- [ ] 댓글 작성·삭제 후 즉시 반영 확인
- [ ] `remotePatterns` 와일드카드 제거 완료
- [ ] Vercel Analytics 연동 후 Web Vitals 수집 확인
- [ ] sitemap.xml 정상 접근 확인 (`/sitemap.xml`)
- [ ] robots.txt 정상 확인 (`/robots.txt`)

---

## 운영 참고사항

- **Notion 이미지 만료**: S3 서명 URL은 1시간 만료 → ISR 60초 revalidate로 커버
- **ALLOWED_EMAILS 갱신**: 새 멤버 추가 시 Vercel 환경변수 업데이트 + 재배포 필요
- **JWT_SECRET 로테이션**: 변경 시 모든 활성 세션 만료됨 (의도적 로그아웃)
- **Notion API Rate Limit**: 3 req/s — 현재 규모(50명)에서는 문제없음
