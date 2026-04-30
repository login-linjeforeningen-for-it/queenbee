import { NextResponse } from 'next/server'
import { deleteBucket } from '@utils/s3/client'
import { requireTekkomS3Access } from '@utils/s3/auth'

type Context = {
    params: Promise<{ bucket: string }>
}
export async function DELETE(_: Request, context: Context) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const { bucket } = await context.params
        await deleteBucket(decodeURIComponent(bucket))
        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete bucket.' }, { status: 500 })
    }
}
