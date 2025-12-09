import React from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none break-words text-sm',
        'prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-muted-foreground',
        className,
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
