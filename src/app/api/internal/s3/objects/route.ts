import { NextRequest, NextResponse } from 'next/server'
import { copyObject, deleteObject, listObjects, moveObject, putObject } from '@utils/s3/client'
import { requireTekkomS3Access } from '@utils/s3/auth'

export async function GET(req: NextRequest) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const bucket = req.nextUrl.searchParams.get('bucket') || ''
        const prefix = req.nextUrl.searchParams.get('prefix') || ''
        if (!bucket) {
            return NextResponse.json({ error: 'Missing bucket.' }, { status: 400 })
        }

        return NextResponse.json({ objects: await listObjects(bucket, prefix) })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list objects.' }, { status: 500 })
    }
}
export async function POST(req: NextRequest) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const form = await req.formData()
        const bucket = String(form.get('bucket') || '')
        const key = String(form.get('key') || '')
        const file = form.get('file')

        if (!bucket || !key || !(file instanceof File)) {
            return NextResponse.json({ error: 'Bucket, key, and file are required.' }, { status: 400 })
        }

        await putObject(bucket, key, file)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to upload object.' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const body = await req.json()
        const sourceBucket = String(body.sourceBucket || '')
        const sourceKey = String(body.sourceKey || '')
        const targetBucket = String(body.targetBucket || '')
        const targetKey = String(body.targetKey || '')
        const mode = body.mode === 'copy' ? 'copy' : 'move'

        if (!sourceBucket || !sourceKey || !targetBucket || !targetKey) {
            return NextResponse.json({ error: 'Source and target bucket/key are required.' }, { status: 400 })
        }

        if (mode === 'copy') {
            await copyObject(sourceBucket, sourceKey, targetBucket, targetKey)
        } else {
            await moveObject(sourceBucket, sourceKey, targetBucket, targetKey)
        }

        return NextResponse.json({ ok: true, mode })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to move object.' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const access = await requireTekkomS3Access()
    if (!access.ok) {
        return NextResponse.json({ error: access.message }, { status: access.status })
    }

    try {
        const bucket = req.nextUrl.searchParams.get('bucket') || ''
        const key = req.nextUrl.searchParams.get('key') || ''
        if (!bucket || !key) {
            return NextResponse.json({ error: 'Bucket and key are required.' }, { status: 400 })
        }

        await deleteObject(bucket, key)
        return NextResponse.json({ ok: true })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete object.' }, { status: 500 })
    }
}
