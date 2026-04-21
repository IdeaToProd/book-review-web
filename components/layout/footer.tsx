import { Code2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

/**
 * 글로벌 푸터
 * 기술 스택 크레딧 및 저작권 표시
 */
export function Footer() {
  const techStack = [
    { label: "Next.js", href: "https://nextjs.org" },
    { label: "Tailwind CSS", href: "https://tailwindcss.com" },
    { label: "shadcn/ui", href: "https://ui.shadcn.com" },
    { label: "TypeScript", href: "https://www.typescriptlang.org" },
  ];

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Code2 className="h-4 w-4 text-primary" />
            <span>Next Starter Kit</span>
          </div>

          {/* 기술 스택 링크 */}
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((item, index) => (
              <span key={item.label} className="flex items-center gap-4">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
                {index < techStack.length - 1 && (
                  <Separator orientation="vertical" className="h-3" />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Built with Next.js {new Date().getFullYear()}. Open source starter kit.
        </div>
      </div>
    </footer>
  );
}
