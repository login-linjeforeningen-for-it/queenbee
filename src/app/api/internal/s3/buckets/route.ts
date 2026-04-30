import { NextRequest, NextResponse } from 'next/server'
import { createBucket, listBuckets } from '@utils/s3/client'
import { requireTekkomS3Access } from '@utils/s3/auth'

export async function GET() {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        return NextResponse.json({ buckets: await listBuckets() })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list buckets.' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const { bucket } = await req.json()
        if (!isValidBucketName(bucket)) {
            return NextResponse.json({
                error: 'Bucket name must be 3-63 lowercase characters, numbers, dots, or hyphens.'
            }, { status: 400 })
        }

        await createBucket(bucket)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create bucket.' }, { status: 500 })
    }
}

function isValidBucketName(value: unknown) {
    return typeof value === 'string' && /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(value)
}
