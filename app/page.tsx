import {
  Zap,
  Shield,
  Palette,
  LayoutTemplate,
  Moon,
  Smartphone,
  Package,
  Code2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/** 기술 스택 목록 */
const techStack = [
  {
    icon: Zap,
    name: "Next.js 16",
    description: "App Router, Turbopack 기본 탑재. 최신 React 19 지원.",
    badge: "v16.2.4",
    badgeVariant: "default" as const,
  },
  {
    icon: Shield,
    name: "TypeScript",
    description: "타입 안전성으로 버그를 미리 방지하고 생산성을 향상.",
    badge: "v5+",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Palette,
    name: "Tailwind CSS v4",
    description: "CSS-first 설정, tailwind.config 불필요. OKLCH 색상 지원.",
    badge: "v4.2",
    badgeVariant: "default" as const,
  },
  {
    icon: LayoutTemplate,
    name: "shadcn/ui",
    description: "접근성 높은 UI 컴포넌트. Radix UI 기반, 완전히 커스터마이징 가능.",
    badge: "v4.3.0",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Package,
    name: "lucide-react",
    description: "일관된 디자인의 아이콘 라이브러리. 1,000개 이상의 아이콘 제공.",
    badge: "최신",
    badgeVariant: "outline" as const,
  },
];

/** 주요 기능 목록 */
const features = [
  {
    icon: Moon,
    title: "다크모드",
    description: "next-themes 기반. 라이트 / 다크 / 시스템 테마 자동 전환.",
  },
  {
    icon: Smartphone,
    title: "반응형 디자인",
    description: "Mobile First 접근법. 모든 화면 크기에 최적화된 레이아웃.",
  },
  {
    icon: Zap,
    title: "빠른 성능",
    description: "Turbopack 기반 개발 서버. 프로덕션 빌드 최적화 내장.",
  },
  {
    icon: Code2,
    title: "타입 안전",
    description: "TypeScript strict mode. IDE 자동완성과 타입 추론 완벽 지원.",
  },
  {
    icon: Shield,
    title: "접근성",
    description: "Radix UI 기반 shadcn/ui로 WAI-ARIA 접근성 기준 준수.",
  },
  {
    icon: LayoutTemplate,
    title: "컴포넌트 라이브러리",
    description: "Button, Card, Badge, Avatar 등 핵심 UI 컴포넌트 사전 설치.",
  },
];

/**
 * 랜딩 페이지
 * Hero → 기술 스택 → 기능 소개 → 컴포넌트 데모 순서로 구성
 */
export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ──────────────── Hero 섹션 ──────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          Next.js 16 · Tailwind CSS v4 · shadcn/ui
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          빠르게 시작하는
          <br />
          <span className="text-primary">Next.js 스타터 키트</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          최신 기술 스택으로 사전 구성된 프로덕션 레디 템플릿.
          <br />
          설정 없이 바로 개발을 시작하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="gap-2">
            시작하기
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </section>

      <Separator />

      {/* ──────────────── 기술 스택 섹션 ──────────────── */}
      <section
        id="tech-stack"
        className="container mx-auto max-w-5xl px-4 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">기술 스택</h2>
          <p className="text-muted-foreground">
            공식 문서 기준 최신 버전으로 구성된 검증된 조합
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech) => (
            <Card
              key={tech.name}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <tech.icon className="h-6 w-6 text-primary" />
                  <Badge variant={tech.badgeVariant}>{tech.badge}</Badge>
                </div>
                <CardTitle className="text-lg">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tech.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ──────────────── 기능 소개 섹션 ──────────────── */}
      <section
        id="features"
        className="container mx-auto max-w-5xl px-4 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">포함된 기능</h2>
          <p className="text-muted-foreground">
            개발을 바로 시작할 수 있도록 사전 구성된 기능들
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ──────────────── 컴포넌트 데모 섹션 ──────────────── */}
      <section
        id="components"
        className="container mx-auto max-w-5xl px-4 py-16"
      >
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold">컴포넌트 데모</h2>
          <p className="text-muted-foreground">
            shadcn/ui 핵심 컴포넌트 미리보기
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Button 데모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Button 변형</CardTitle>
              <CardDescription>다양한 버튼 스타일</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>기본</Button>
              <Button variant="secondary">보조</Button>
              <Button variant="outline">아웃라인</Button>
              <Button variant="ghost">고스트</Button>
              <Button variant="destructive">위험</Button>
            </CardContent>
          </Card>

          {/* Badge 데모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badge 변형</CardTitle>
              <CardDescription>상태 표시 배지</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>기본</Badge>
              <Badge variant="secondary">보조</Badge>
              <Badge variant="outline">아웃라인</Badge>
              <Badge variant="destructive">위험</Badge>
            </CardContent>
          </Card>

          {/* Avatar 데모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avatar</CardTitle>
              <CardDescription>사용자 아바타</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Avatar>
                <AvatarFallback>김</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>이</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>박</AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          {/* Card 데모 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Card 구성</CardTitle>
              <CardDescription>헤더, 콘텐츠, 액션이 있는 카드</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                카드는 관련 정보를 그룹화하는 컨테이너입니다.
                Header, Content, Footer로 구성됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
