'use client'

import { MarkdownRender } from 'uibee/components'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
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
                code({ className: cls, children }) {
                    const match = /language-(\w+)/.exec(cls || '')
                    if (match) {
                        const language = hljs.getLanguage(match[1]) ? match[1] : 'plaintext'
                        const highlighted = hljs.highlight(String(children).replace(/\n$/, ''), { language }).value
                        return (
                            <pre className='inline-block rounded-lg overflow-auto whitespace-pre-wrap wrap-break-word w-full'>
                                <code
                                    className={`hljs ${language}`}
                                    style={{ padding: '5px 10px', margin: 0 }}
                                    dangerouslySetInnerHTML={{ __html: highlighted }}
                                />
                            </pre>
                        )
                    }
                    return <code className='break-all bg-login-300 p-0.3 rounded-xs'>{children}</code>
                },
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
