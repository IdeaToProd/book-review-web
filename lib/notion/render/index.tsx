/**
 * 노션 블록 → React 렌더러
 * 지원 블록: heading_1/2/3, paragraph, bulleted_list_item,
 *           numbered_list_item, code, quote, image
 * Phase 3에서 실제 Notion API 응답에 맞게 보정 예정
 */

import Image from "next/image"
// 클라이언트 번들 최소화를 위해 light 빌드 사용
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs"
// 자주 쓰는 언어만 등록해 번들 크기 최소화
import ts from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript"
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript"
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python"
import bash from "react-syntax-highlighter/dist/cjs/languages/hljs/bash"
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json"
import css from "react-syntax-highlighter/dist/cjs/languages/hljs/css"

import { cn } from "@/lib/utils"
import type { NotionBlock, NotionRichText } from "@/lib/notion/types"

// 언어 등록
SyntaxHighlighter.registerLanguage("typescript", ts)
SyntaxHighlighter.registerLanguage("javascript", js)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("css", css)

/**
 * 리치 텍스트 배열을 인라인 React 노드로 변환
 * bold, italic, code, strikethrough, underline 어노테이션 지원
 */
function renderRichText(richText: NotionRichText[]): React.ReactNode {
  if (!richText || richText.length === 0) return null

  return richText.map((rt, index) => {
    let node: React.ReactNode = rt.plain_text

    const { annotations } = rt
    if (annotations.code) {
      node = (
        <code
          key={index}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {node}
        </code>
      )
    } else {
      // bold, italic 등을 span으로 조합
      const classNames = cn(
        annotations.bold && "font-bold",
        annotations.italic && "italic",
        annotations.strikethrough && "line-through",
        annotations.underline && "underline"
      )

      if (classNames) {
        node = (
          <span key={index} className={classNames}>
            {node}
          </span>
        )
      } else {
        node = <span key={index}>{node}</span>
      }
    }

    // 링크 처리
    if (rt.href) {
      node = (
        <a
          key={index}
          href={rt.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {node}
        </a>
      )
    }

    return node
  })
}

/**
 * 단일 노션 블록을 React 요소로 변환
 */
function renderBlock(block: NotionBlock, index: number): React.ReactNode {
  const { type } = block

  switch (type) {
    case "heading_1": {
      const rt = block.heading_1?.rich_text ?? []
      return (
        <h1
          key={block.id}
          className="mt-8 mb-3 text-2xl font-bold tracking-tight text-foreground first:mt-0"
        >
          {renderRichText(rt)}
        </h1>
      )
    }

    case "heading_2": {
      const rt = block.heading_2?.rich_text ?? []
      return (
        <h2
          key={block.id}
          className="mt-6 mb-2 text-xl font-semibold tracking-tight text-foreground first:mt-0"
        >
          {renderRichText(rt)}
        </h2>
      )
    }

    case "heading_3": {
      const rt = block.heading_3?.rich_text ?? []
      return (
        <h3
          key={block.id}
          className="mt-5 mb-2 text-lg font-semibold text-foreground first:mt-0"
        >
          {renderRichText(rt)}
        </h3>
      )
    }

    case "paragraph": {
      const rt = block.paragraph?.rich_text ?? []
      if (rt.length === 0) {
        // 빈 단락은 여백으로 처리
        return <div key={block.id} className="my-3" aria-hidden />
      }
      return (
        <p
          key={block.id}
          className="my-3 leading-7 text-foreground/90"
        >
          {renderRichText(rt)}
        </p>
      )
    }

    case "bulleted_list_item": {
      const rt = block.bulleted_list_item?.rich_text ?? []
      return (
        <li
          key={block.id}
          className="ml-2 leading-7 text-foreground/90 marker:text-muted-foreground"
        >
          {renderRichText(rt)}
        </li>
      )
    }

    case "numbered_list_item": {
      const rt = block.numbered_list_item?.rich_text ?? []
      return (
        <li
          key={block.id}
          className="ml-2 leading-7 text-foreground/90"
        >
          {renderRichText(rt)}
        </li>
      )
    }

    case "code": {
      const rt = block.code?.rich_text ?? []
      const language: string = block.code?.language ?? "plaintext"
      const codeText = rt.map((r: NotionRichText) => r.plain_text).join("")

      return (
        <div key={block.id} className="my-4 overflow-hidden rounded-lg border border-border">
          {/* 언어 레이블 */}
          <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">{language}</span>
          </div>
          <SyntaxHighlighter
            language={language}
            style={githubGist}
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.6",
            }}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      )
    }

    case "quote": {
      const rt = block.quote?.rich_text ?? []
      return (
        <blockquote
          key={block.id}
          className="my-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground"
        >
          {renderRichText(rt)}
        </blockquote>
      )
    }

    case "image": {
      // 노션 이미지는 external(URL)과 file(S3) 두 가지 타입
      const imgData = block.image
      const src: string | null =
        imgData?.type === "external"
          ? imgData.external?.url ?? null
          : imgData?.file?.url ?? null

      const caption: NotionRichText[] = imgData?.caption ?? []
      const altText = caption.map((r: NotionRichText) => r.plain_text).join("") || "리뷰 이미지"

      if (!src) return null

      return (
        <figure key={block.id} className="my-6">
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted sm:h-80">
            <Image
              src={src}
              alt={altText}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
          {caption.length > 0 && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {renderRichText(caption)}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      // 지원하지 않는 블록 타입 — 개발 중에만 표시
      if (process.env.NODE_ENV === "development") {
        return (
          <div
            key={block.id ?? index}
            className="my-2 rounded border border-dashed border-muted-foreground/30 px-3 py-2 text-xs text-muted-foreground"
          >
            [미지원 블록 타입: {type}]
          </div>
        )
      }
      return null
  }
}

/**
 * 연속된 불릿/넘버 리스트 아이템을 ul/ol로 감싸는 그루핑 처리
 */
function groupBlocks(blocks: NotionBlock[]): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === "bulleted_list_item") {
      // 연속된 bulleted 아이템 수집
      const items: React.ReactNode[] = []
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(renderBlock(blocks[i], i))
        i++
      }
      result.push(
        <ul key={`ul-${i}`} className="my-3 list-disc space-y-1 pl-6">
          {items}
        </ul>
      )
    } else if (block.type === "numbered_list_item") {
      // 연속된 numbered 아이템 수집
      const items: React.ReactNode[] = []
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(renderBlock(blocks[i], i))
        i++
      }
      result.push(
        <ol key={`ol-${i}`} className="my-3 list-decimal space-y-1 pl-6">
          {items}
        </ol>
      )
    } else {
      result.push(renderBlock(block, i))
      i++
    }
  }

  return result
}

interface NotionBlockRendererProps {
  blocks: NotionBlock[]
  className?: string
}

/**
 * 노션 블록 목록을 렌더링하는 메인 컴포넌트
 * 연속된 리스트 아이템을 ul/ol로 자동 그루핑
 */
export function NotionBlockRenderer({ blocks, className }: NotionBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-muted-foreground italic">본문이 없습니다.</p>
    )
  }

  return (
    <div className={cn("prose-custom", className)}>
      {groupBlocks(blocks)}
    </div>
  )
}
