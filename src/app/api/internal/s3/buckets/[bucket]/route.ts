import { workerbeeS3Proxy } from '@utils/s3/workerbee'

type Context = {
    params: Promise<{ bucket: string }>
}
export async function DELETE(_: Request, context: Context) {
    const { bucket } = await context.params
    return workerbeeS3Proxy({
        method: 'DELETE',
        path: `buckets/${encodeURIComponent(decodeURIComponent(bucket))}`,
    })
}
