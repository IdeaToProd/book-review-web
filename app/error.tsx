"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * 글로벌 에러 바운더리 (클라이언트 컴포넌트 필수)
 * React Error Boundary로 런타임 에러를 잡아 친화적 UI 표시
 * Next.js 16.2.x: unstable_retry prop으로 재시도 지원
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // 에러를 개발 콘솔에 기록
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <div
      role="alert"
      className="container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center"
    >
      {/* 아이콘 */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle
          className="size-10 text-destructive"
          aria-hidden
        />
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        문제가 발생했습니다
      </h1>

      {/* 설명 */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        예기치 않은 오류가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>

      {/* 에러 코드 (있을 경우) */}
      {error.digest && (
        <p className="mt-2 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
          오류 코드: {error.digest}
        </p>
      )}

      {/* 버튼 그룹 */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        {/* 다시 시도 버튼 — reset 함수 연결 */}
        <Button onClick={unstable_retry} className="gap-2">
          <RotateCcw className="size-4" aria-hidden />
          다시 시도
        </Button>

        <Button variant="outline" render={<Link href="/" />} className="gap-2">
          <Home className="size-4" aria-hidden />
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
