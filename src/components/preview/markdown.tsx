'use client'

import { MarkdownRender } from 'uibee/components'
import './discord.css'

type MarkdownProps = {
    markdown: string
    className?: string
}

export function Markdown({ markdown, className }: MarkdownProps) {
    const processedMarkdown = markdown.replace(/^(\s*)$/mg, '\u00A0')

    return (
        <MarkdownRender
            MDstr={processedMarkdown}
            className={`markdown-preview text-foreground text-md h-full wrap-break-word ${className}`}
            components={{
                img({ src, alt }) {
                    return <img src={src} alt={alt ?? ''} width={300} />
                },
                a({ href, title, children }) {
                    return (
                        <a
                            href={href}
                            title={title ?? undefined}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 underline'>
                            {children}
                        </a>
                    )
                },
            }}
        />
    )
}
