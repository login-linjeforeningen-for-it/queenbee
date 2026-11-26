'use server'

import { postWrapper } from '@utils/apiWrapper'

export type CardComponent = { type: number, [key: string]: unknown }

export type CardPreviewInput = {
    title?: string[]
    description?: string[]
    roles?: string[]
    color?: string
    event_id?: number | null
    event?: Record<string, unknown> | null
}

export type CardPreview = {
    components: CardComponent[]
    files: Record<string, string>
}

export default async function previewAnnouncement(body: CardPreviewInput): Promise<CardPreview | string> {
    return await postWrapper({
        path: 'announcements/preview',
        data: body,
        service: 'bot'
    })
}
