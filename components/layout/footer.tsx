import Link from "next/link";
import { BookOpen } from "lucide-react";

/** 북 리뷰 글로벌 푸터 */
export function Footer() {
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "홈" },
    { href: "/about", label: "소개" },
  ];

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>북 리뷰</span>
            </div>
            <p className="text-xs text-muted-foreground">
              작은 독서 모임의 리뷰 아카이브
            </p>
          </div>

          {/* 내부 링크 */}
          <nav className="flex items-center gap-4" aria-label="푸터 링크">
            {navLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
                {i < navLinks.length - 1 && (
                  <span className="text-border">·</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {year} 북 리뷰. 작은 독서 모임을 위한 비공개 아카이브.
        </div>
      </div>
    </footer>
  );
}
