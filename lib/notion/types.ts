/** 노션 리치 텍스트 단일 항목 */
export interface NotionRichText {
  type: "text" | "mention" | "equation";
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  text?: {
    content: string;
    link: { url: string } | null;
  };
}

/** 리뷰 게시 상태 */
export type ReviewStatus = "Draft" | "Published" | "Archived";

/** 북 리뷰 */
export interface Review {
  id: string;
  title: string;
  author: string;
  slug: string;
  reviewer: string;
  reviewerEmail: string;
  rating: number;
  tags: string[];
  cover: string | null;
  status: ReviewStatus;
  publishedAt: string;
  summary: string | null;
  /** 노션 페이지 블록 (상세 페이지에서만 포함) */
  blocks?: NotionBlock[];
}

/** 노션 블록 (렌더링용 최소 타입) */
export interface NotionBlock {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** 댓글 */
export interface Comment {
  id: string;
  reviewId: string;
  author: string;
  authorEmail: string;
  body: string;
  createdAt: string;
  deleted: boolean;
}
