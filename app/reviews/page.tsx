import { redirect } from "next/navigation";

/** /reviews → / 리다이렉트 (리뷰 목록 홈은 루트 경로) */
export default function ReviewsIndexPage() {
  redirect("/");
}
