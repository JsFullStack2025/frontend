"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

import type { CardStyle } from "../../types/card.types"

interface EditorPreviewProps {
  content: string
  style: CardStyle
}

export function EditorPreview({ content, style }: EditorPreviewProps) {
  const themeClass = `theme-${style.theme || "light"}`
  const layoutClass = `layout-${style.layout || "default"}`

  return (
    <div className={`prose prose-slate max-w-none dark:prose-invert ${themeClass} ${layoutClass}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content || "### Предпросмотр\nЗдесь отображается предварительный просмотр вашего контента."}
      </ReactMarkdown>
    </div>
  )
} 