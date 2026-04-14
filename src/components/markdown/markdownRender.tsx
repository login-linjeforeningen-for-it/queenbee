import { ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// import EventItem from '@components/event/eventItem'
// import JobadCard from '@components/jobad/JobadCard'
// import Alert from '@components/shared/alert/Alert'
// import { getEventRow, getJobRow } from '@utils/api'
import './markdownRender.css'
// import Link from 'next/link'
// TODO: Add embeds

const components = {
    // The md string should not contain a main header (#), the h1 header is
    // rendered by the parent component. If by mistake it cointains
    // a '# main header' this returns h2 instead.
    h1: ({ children }: { children: ReactNode }) => (
        <h2 className='markdown-render_h2'>{children}</h2>
    ),
    h2: ({ children }: { children: ReactNode }) => (
        <h2 className='markdown-render_h2'>{children}</h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
        <h3 className='markdown-render_h3'>{children}</h3>
    ),
    h4: ({ children }: { children: ReactNode }) => (
        <h4 className='markdown-render_h4'>{children}</h4>
    ),
    h5: ({ children }: { children: ReactNode }) => (
        <h5 className='markdown-render_h5'>{children}</h5>
    ),
    h6: ({ children }: { children: ReactNode }) => (
        <h6 className='markdown-render_h6'>{children}</h6>
    ),
    p: ({ children }: { children: ReactNode }) => (
        <section className='markdown-render_section'>{children}</section>
    ),
    em: ({ children }: { children: ReactNode }) => (
        <em className='markdown-render_em'>{children}</em>
    ),
    strong: ({ children }: { children: ReactNode }) => (
        <strong className='markdown-render_strong'>{children}</strong>
    ),
    table: ({ children }: { children: ReactNode }) => (
        <table className='markdown-render_table'>{children}</table>
    ),
    th: ({ children }: { children: ReactNode }) => (
        <th className='markdown-render_th'>{children}</th>
    ),
    td: ({ children }: { children: ReactNode }) => (
        <td className='markdown-render_td'>{children}</td>
    ),
    ul: ({ children }: { children: ReactNode }) => (
        <ul className='markdown-render_ul'>{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
        <ol className='markdown-render_ol'>{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
        <li className='markdown-render_li'>{children}</li>
    ),
    // a: CustomLink
}

export default function MarkdownRender({ MDstr }: { MDstr: string }) {
    return (
        // @ts-expect-error
        <Markdown components={components} remarkPlugins={[remarkGfm]}>
            {MDstr.replace(/\\n/g, '\n')}
        </Markdown>
    )
}

// function CustomLink({ href, children }: CustomLinkProps) {
//     if (typeof children === 'string') {
//         if (children === ':event') {
//             return EventEmbed(href)
//         }
//         if (children === ':jobad') {
//             return JobadEmbed(href)
//         }
//     }

//     return (
//         <Link
//             className='link link--primary link--underscore-hover'
//             href={String(href)}
//             target='_blank'
//             rel='noopener noreferrer'
//         >
//             {children}
//         </Link>
//     )
// }

// function ErrorMessage({ err, title }: ErrorMessageProps) {
//     if (!err.error) {
//         return 'Unknown error'
//     }

//     return (
//     // @ts-ignore
//         <Alert variant='danger'>
//             {title}
//             <br/>
//             {err.status && <p>Status: {err.status}</p>}
//             {err.error && <p>Error: {err.error}</p>}
//         </Alert>
//     )
// }

// async function EventEmbed(id: number) {
//     const event = await getEventRow(id)
//     if (typeof event === 'string') {
//         <ErrorMessage err={event} title={'Error Fetching Event #' + id} />
//     }

//     return (
//         <div className='markdown-render_card'>
//             {event
//                 ? <EventItem event={event} variant='card' highlight={false} />
//                 : <p>Event not found</p>
//             }
//         </div>
//     )
// }

// async function JobadEmbed(id: number) {
//     const jobad = await getJobRow(id)
//     if (typeof jobad === 'string') {
//         <ErrorMessage err={jobad} title={'Error Fetching Event #' + id} />
//     }
//     return (
//         <div className='markdown-render_card'>
//             {jobad
//                 ? <JobadCard jobad={jobad} disableTags={true} />
//                 : <p>Job ad not found</p>
//             }
//         </div>
//     )
// }
