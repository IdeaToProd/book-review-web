"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * 다크모드 테마 프로바이더
 * next-themes의 ThemeProvider를 래핑하여 앱 전체에 테마 컨텍스트를 제공
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
