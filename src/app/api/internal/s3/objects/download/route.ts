import { NextRequest, NextResponse } from 'next/server'
import { getObject } from '@utils/s3/client'
import { requireTekkomS3Access } from '@utils/s3/auth'

export async function GET(req: NextRequest) {
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

        const response = await getObject(bucket, key)
        const headers = new Headers()
        headers.set('content-type', response.headers.get('content-type') || 'application/octet-stream')
        headers.set('content-disposition', `attachment; filename="${encodeURIComponent(key.split('/').pop() || key)}"`)
        const length = response.headers.get('content-length')
        if (length) {
            headers.set('content-length', length)
        }

        return new NextResponse(response.body, { headers })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to download object.' }, { status: 500 })
    }
}
