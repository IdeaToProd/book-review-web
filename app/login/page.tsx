"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Mail, BookOpen, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginFormValues {
  email: string
}

/**
 * 매직 링크 로그인 페이지
 * 이메일 입력 → 제출 → "이메일을 확인하세요" 안내 상태 전환 UI
 * Phase 3에서 requestMagicLink() Server Action 연결
 */
export default function LoginPage() {
  const [isSent, setIsSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "" },
  })

  /** 매직 링크 요청 핸들러 */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // TODO: Phase 3 — requestMagicLink(data.email) Server Action 호출
      // 개발 중 더미 성공 처리 (성공/실패 모두 동일 응답으로 이메일 존재 여부 숨김)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSentEmail(data.email)
      setIsSent(true)
    } catch {
      toast.error("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="container mx-auto max-w-sm px-4 py-20">
      {/* 로고/브랜드 영역 */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
          <BookOpen className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">멤버 로그인</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            이메일로 로그인 링크를 발송합니다.
            <br />
            초대된 멤버만 이용 가능합니다.
          </p>
        </div>
      </div>

      {isSent ? (
        /* 이메일 발송 완료 안내 상태 */
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <CheckCircle className="size-10 text-green-500" aria-hidden />
          <div>
            <h2 className="text-base font-semibold text-foreground">
              이메일을 확인하세요
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{sentEmail}</span>으로
              <br />
              로그인 링크를 발송했습니다.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            이메일이 오지 않으면 스팸 폴더를 확인하거나,
            <br />
            아래 버튼으로 다시 시도해주세요.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSent(false)}
          >
            다시 시도하기
          </Button>
        </div>
      ) : (
        /* 이메일 입력 폼 */
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm"
          noValidate
          aria-label="로그인 폼"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              이메일 주소
            </label>

            {/* 이메일 입력 */}
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                autoFocus
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className="pl-8"
                disabled={isSubmitting}
                {...register("email", {
                  required: "이메일 주소를 입력해주세요.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "올바른 이메일 형식을 입력해주세요.",
                  },
                })}
              />
            </div>

            {/* 유효성 에러 메시지 */}
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 안내 문구 */}
          <Alert>
            <AlertDescription className="text-xs">
              허용된 이메일 주소가 아니더라도 동일하게 처리됩니다.
              모임 운영자에게 초대를 요청해주세요.
            </AlertDescription>
          </Alert>

          {/* 제출 버튼 */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "발송 중..." : "로그인 링크 받기"}
          </Button>
        </form>
      )}
    </div>
  )
}
