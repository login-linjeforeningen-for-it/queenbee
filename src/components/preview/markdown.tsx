'use client'

import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import './discord.css'

type MarkdownProps = {
    markdown: string
    className?: string
}

marked.use({
    renderer: {
        code(token) {
            const language = hljs.getLanguage(typeof token.lang === 'string'
                ? token.lang : 'plaintext')
                ? token.lang
                || 'plaintext'
                : 'plaintext'
            const text = hljs.highlight(token.text, { language }).value
            const style = 'padding: 5px 10px; margin: 0;'
            const className = 'inline-block rounded-lg overflow-auto whitespace-pre-wrap break-words w-full'
            return `<pre class='${className}'><code style='${style}' class='hljs ${language}'>${text}</code></pre>`
        },
        image(token) {
            const width = 'width="300"'
            return `<img src='${token.href}' alt='${token.title}' ${width} />`
        },
        link(token) {
            const style = 'text-blue-500 underline'
            const rel = 'noopener noreferrer'
            return `<a href='${token.href}' title='${token.title}' target='_blank' rel='${rel}' class='${style}'>${token.text}</a>`
        },
        codespan(token) {
            return `<code class='break-all bg-login-300 p-0.3 rounded-xs'>${token.text}</code>`
        }
    }
})

export function Markdown({ markdown, className }: MarkdownProps) {
    return (
        <div
            className={`markdown-preview text-foreground text-md h-full wrap-break-word ${className}`}
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
    )
}
