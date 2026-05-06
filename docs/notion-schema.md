# 노션 DB 스키마 정의

> 실제 노션 워크스페이스 Export(2026-05-06) 기반 문서. 코드와 반드시 일치시킬 것.

---

## 1. Reviews DB — `Book Reviews`

노션 DB 이름: **Book Reviews**  
환경 변수: `NOTION_REVIEWS_DB_ID`

### 속성 정의

| 속성명 | Notion 타입 | 필수 | 실제 값 예시 | 설명 |
|---|---|---|---|---|
| `Title` | Title | O | `사피엔스` | 책 제목 (페이지 타이틀) |
| `Author` | Rich text | O | `가명의저자` | 책 저자 |
| `Slug` | Rich text | O | `sapiens-review` | URL 슬러그 (unique). 수동 입력 |
| `Reviewer` | People | O | `soyeon park` | 리뷰 작성자 (노션 멤버) |
| `ReviewerEmail` | Email | O | `soyeon12012@hufs.ac.kr` | 인증 세션 매칭용 이메일 |
| `Rating` | Number (1~5) | O | `5` | 별점 |
| `Tags` | Multi-select | - | `인문학` | 장르/주제 태그 |
| `Cover` | Files & media | - | — | 책 표지 이미지 (**현재 DB에 없음 — 추가 필요**) |
| `Status` | Select | O | `완료` | 게시 상태 (아래 값 참고) |
| `PublishedAt` | Date | O | `2026-05-06T16:01:00+09:00` | 게시 시각 (정렬 기준) |
| `Summary` | Rich text | - | `최고의 인문학 책` | 1~2줄 요약 (카드/OG용) |
| `Body` | 페이지 본문 블록 | O | — | 리뷰 전문 (Notion blocks 트리) |

### Status 선택 값

> ⚠️ 실제 DB의 Status 값이 한국어로 설정되어 있음. 코드에서 필터 시 아래 실제 값을 사용할 것.

| PRD 정의 | **실제 노션 값** | 의미 |
|---|---|---|
| `Draft` | `초안` (또는 미설정) | 작성 중 — 웹 미노출 |
| `Published` | `완료` | 게시됨 — **웹에 노출** |
| `Archived` | `보관됨` (또는 미설정) | 숨김 — 웹 미노출 |

> 코드에서 `Status === "완료"` 필터로 Published 리뷰를 조회한다.  
> `lib/notion/types.ts`의 `ReviewStatus`를 실제 값으로 유지하거나 매핑 레이어를 둔다.

---

## 2. Comments DB — `Book Comments`

노션 DB 이름: **Book Comments**  
환경 변수: `NOTION_COMMENTS_DB_ID`

### 속성 정의

| 속성명 | Notion 타입 | 필수 | 실제 값 예시 | 설명 |
|---|---|---|---|---|
| `ID` | Title (자동) | O | — | 페이지 타이틀 (timestamp + hash 자동 생성) |
| `Book Reviews` | Relation → Reviews DB | O | `사피엔스` | 댓글이 달린 리뷰 (**관계 필드명 주의: "Review" 아님**) |
| `Author` | Rich text | O | `가명의저자` | 작성자 표시 이름 |
| `AuthorEmail` | Email | O | `user@example.com` | 세션 이메일 — 삭제 권한 검증용 |
| `Body` | Rich text | O | — | 댓글 본문 (최대 1000자) (**현재 DB에 없음 — 추가 필요**) |
| `CreatedAt` | Created time | O | `2026-05-06T16:02:00+09:00` | 작성 시각 (자동) |
| `Deleted` | Checkbox | - | `No` | soft delete 플래그 (v0.1은 hard delete) |

---

## 3. 누락 속성 — 노션에서 수동 추가 필요

아래 속성은 PRD에 정의되어 있으나 현재 DB Export에 없음. **Phase 3 시작 전 노션에서 직접 추가할 것.**

| DB | 속성명 | Notion 타입 | 이유 |
|---|---|---|---|
| Reviews | `Cover` | Files & media | 책 표지 이미지, 카드 UI에 필요 |
| Comments | `Body` | Rich text | 댓글 본문 저장 |

---

## 4. 관계 및 제약

- `Comments["Book Reviews"]` → `Reviews` 1:N 관계
- 웹은 `Status = "완료"` 인 리뷰만 조회
- 댓글 작성 시 서버에서 `AuthorEmail = session.email` 강제 세팅 (클라이언트 값 신뢰 금지)
- 노션 Integration 권한: Reviews DB (Read), Comments DB (Read + Insert + Delete)
- Notion 이미지 URL은 약 1시간 후 만료 → ISR revalidate=60과 맞춰 갱신

---

## 5. 환경 변수 목록

`.env.local` 에 아래 변수 설정 필요:

```
NOTION_TOKEN=secret_xxxx
NOTION_REVIEWS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_COMMENTS_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxx
JWT_SECRET=최소32자_랜덤_문자열
ALLOWED_EMAILS=email1@example.com,email2@example.com
APP_URL=http://localhost:3000
```

> DB ID는 노션 DB 페이지 URL에서 추출:  
> `notion.so/workspace/{DB_ID}?v=...` 형식

---

## 6. lib/notion/types.ts 매핑

```ts
// Status 필드 매핑 (실제 노션 값)
const NOTION_STATUS_PUBLISHED = "완료";

// Comments 관계 필드명
const NOTION_COMMENTS_RELATION_FIELD = "Book Reviews";
```
