import Link from "next/link";
import { BookX, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

/**
 * 글로벌 404 페이지
 * notFound() 호출 또는 매칭되지 않는 URL 접근 시 렌더링
 */
export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {/* 아이콘 */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
        <BookX className="size-10 text-muted-foreground" aria-hidden />
      </div>

      {/* 에러 코드 */}
      <p
        className="text-7xl font-black tracking-tighter text-muted-foreground/30"
        aria-hidden
      >
        404
      </p>

      {/* 제목 */}
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        페이지를 찾을 수 없습니다
      </h1>

      {/* 설명 */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
        <br />
        URL을 다시 확인해 주세요.
      </p>

      {/* 버튼 그룹 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button render={<Link href="/" />} nativeButton={false} className="gap-2">
          <Home className="size-4" aria-hidden />
          홈으로 돌아가기
        </Button>

        <BackButton />
      </div>
    </div>
  );
}
