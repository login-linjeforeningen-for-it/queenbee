import { NextRequest, NextResponse } from 'next/server'
import { workerbeeS3Proxy } from '@utils/s3/workerbee'

export async function GET() {
    return workerbeeS3Proxy({ path: 'buckets' })
}

export async function POST(req: NextRequest) {
    try {
        const { bucket } = await req.json()
        if (!isValidBucketName(bucket)) {
            return NextResponse.json({
                error: 'Bucket name must be 3-63 lowercase characters, numbers, dots, or hyphens.'
            }, { status: 400 })
        }

        return workerbeeS3Proxy({
            method: 'POST',
            path: 'buckets',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bucket }),
        })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create bucket.' }, { status: 500 })
    }
}

function isValidBucketName(value: unknown) {
    return typeof value === 'string' && /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(value)
}
