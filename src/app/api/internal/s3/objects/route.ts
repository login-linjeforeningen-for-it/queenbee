import { NextRequest, NextResponse } from 'next/server'
import { appendSearch, workerbeeS3Proxy } from '@utils/s3/workerbee'

export async function GET(req: NextRequest) {
    try {
        const bucket = req.nextUrl.searchParams.get('bucket') || ''
        if (!bucket) {
            return NextResponse.json({ error: 'Missing bucket.' }, { status: 400 })
        }

        return workerbeeS3Proxy({ path: appendSearch('objects', req.nextUrl.searchParams) })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list objects.' }, { status: 500 })
    }
}
export async function POST(req: NextRequest) {
    try {
        const form = await req.formData()
        const bucket = String(form.get('bucket') || '')
        const key = String(form.get('key') || '')
        const file = form.get('file')

        if (!bucket || !key || !(file instanceof File)) {
            return NextResponse.json({ error: 'Bucket, key, and file are required.' }, { status: 400 })
        }

        return workerbeeS3Proxy({
            method: 'POST',
            path: 'objects',
            body: form,
        })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to upload object.' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
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

        return workerbeeS3Proxy({
            method: 'PATCH',
            path: 'objects',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceBucket, sourceKey, targetBucket, targetKey, mode }),
        })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to move object.' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const bucket = req.nextUrl.searchParams.get('bucket') || ''
        const key = req.nextUrl.searchParams.get('key') || ''
        if (!bucket || !key) {
            return NextResponse.json({ error: 'Bucket and key are required.' }, { status: 400 })
        }

        return workerbeeS3Proxy({
            method: 'DELETE',
            path: appendSearch('objects', req.nextUrl.searchParams),
        })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to delete object.' }, { status: 500 })
    }
}
