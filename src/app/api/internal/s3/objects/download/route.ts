import { NextRequest, NextResponse } from 'next/server'
import { appendSearch, workerbeeS3Proxy } from '@utils/s3/workerbee'

export async function GET(req: NextRequest) {
    try {
        const bucket = req.nextUrl.searchParams.get('bucket') || ''
        const key = req.nextUrl.searchParams.get('key') || ''
        if (!bucket || !key) {
            return NextResponse.json({ error: 'Bucket and key are required.' }, { status: 400 })
        }

        return workerbeeS3Proxy({ path: appendSearch('objects/download', req.nextUrl.searchParams) })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to download object.' }, { status: 500 })
    }
}
