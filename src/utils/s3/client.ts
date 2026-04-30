import { createHash, createHmac } from 'crypto'

const EMPTY_HASH = createHash('sha256').update('').digest('hex')

export type S3BucketSummary = {
    name: string
    createdAt: string | null
    objectCount: number
    sizeBytes: number
    sizeLabel: string
}

export type S3ObjectSummary = {
    key: string
    sizeBytes: number
    sizeLabel: string
    lastModified: string | null
    etag: string | null
    storageClass: string | null
}

type S3Config = {
    endpoint: URL
    accessKey: string
    secretKey: string
    region: string
}

type S3RequestOptions = {
    method?: string
    bucket?: string
    key?: string
    query?: Record<string, string | undefined>
    headers?: HeadersInit
    body?: BodyInit | null
}

export function getS3Config(): S3Config {
    const endpoint = process.env.QUEENBEE_S3_ENDPOINT
        || process.env.S3_ENDPOINT
        || process.env.RUSTFS_ENDPOINT
        || 'https://s3.login.no'
    const accessKey = process.env.QUEENBEE_S3_ACCESS_KEY
        || process.env.S3_ACCESS_KEY
        || process.env.RUSTFS_ACCESS_KEY
        || ''
    const secretKey = process.env.QUEENBEE_S3_SECRET_KEY
        || process.env.S3_SECRET_KEY
        || process.env.RUSTFS_SECRET_KEY
        || ''
    const region = process.env.QUEENBEE_S3_REGION
        || process.env.S3_REGION
        || process.env.RUSTFS_REGION
        || 'us-east-1'

    if (!accessKey || !secretKey) {
        throw new Error('Missing S3 credentials. Configure QUEENBEE_S3_ACCESS_KEY/QUEENBEE_S3_SECRET_KEY or S3_ACCESS_KEY/S3_SECRET_KEY.')
    }

    return {
        endpoint: new URL(endpoint),
        accessKey,
        secretKey,
        region
    }
}

export async function listBuckets(): Promise<S3BucketSummary[]> {
    const xml = await s3Text({})
    const buckets = matches(xml, /<Bucket>([\s\S]*?)<\/Bucket>/g).map((bucket) => ({
        name: text(bucket, 'Name'),
        createdAt: text(bucket, 'CreationDate') || null,
        objectCount: 0,
        sizeBytes: 0,
        sizeLabel: '0 B'
    })).filter(bucket => bucket.name)

    const withSizes = await Promise.all(buckets.map(async (bucket) => {
        const objects = await listObjects(bucket.name)
        const sizeBytes = objects.reduce((sum, object) => sum + object.sizeBytes, 0)
        return {
            ...bucket,
            objectCount: objects.length,
            sizeBytes,
            sizeLabel: formatBytes(sizeBytes)
        }
    }))

    return withSizes.sort((a, b) => b.sizeBytes - a.sizeBytes || a.name.localeCompare(b.name))
}

export async function listObjects(bucket: string, prefix = ''): Promise<S3ObjectSummary[]> {
    const objects: S3ObjectSummary[] = []
    let continuationToken: string | undefined

    do {
        const xml = await s3Text({
            bucket,
            query: {
                'list-type': '2',
                prefix: prefix || undefined,
                'continuation-token': continuationToken
            }
        })

        objects.push(...matches(xml, /<Contents>([\s\S]*?)<\/Contents>/g).map((item) => {
            const sizeBytes = Number(text(item, 'Size')) || 0
            return {
                key: decodeXml(text(item, 'Key')),
                sizeBytes,
                sizeLabel: formatBytes(sizeBytes),
                lastModified: text(item, 'LastModified') || null,
                etag: decodeXml(text(item, 'ETag')) || null,
                storageClass: text(item, 'StorageClass') || null
            }
        }))

        const truncated = text(xml, 'IsTruncated') === 'true'
        continuationToken = truncated ? text(xml, 'NextContinuationToken') : undefined
    } while (continuationToken)

    return objects.sort((a, b) => a.key.localeCompare(b.key))
}

export async function createBucket(bucket: string) {
    await s3Request({ method: 'PUT', bucket })
}

export async function deleteBucket(bucket: string) {
    await s3Request({ method: 'DELETE', bucket })
}

export async function deleteObject(bucket: string, key: string) {
    await s3Request({ method: 'DELETE', bucket, key })
}

export async function putObject(bucket: string, key: string, file: File) {
    await s3Request({
        method: 'PUT',
        bucket,
        key,
        body: file,
        headers: {
            'content-type': file.type || 'application/octet-stream'
        }
    })
}

export async function copyObject(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string) {
    await s3Request({
        method: 'PUT',
        bucket: targetBucket,
        key: targetKey,
        headers: {
            'x-amz-copy-source': `/${encodeURIComponent(sourceBucket)}/${sourceKey.split('/').map(encodeURIComponent).join('/')}`
        }
    })
}

export async function moveObject(sourceBucket: string, sourceKey: string, targetBucket: string, targetKey: string) {
    await copyObject(sourceBucket, sourceKey, targetBucket, targetKey)
    await deleteObject(sourceBucket, sourceKey)
}

export async function getObject(bucket: string, key: string) {
    return await s3Request({ bucket, key })
}

async function s3Text(options: S3RequestOptions) {
    const response = await s3Request(options)
    return await response.text()
}

async function s3Request(options: S3RequestOptions) {
    const config = getS3Config()
    const method = options.method || 'GET'
    const url = buildS3URL(config.endpoint, options.bucket, options.key, options.query)
    const headers = new Headers(options.headers)
    const payloadHash = options.body ? 'UNSIGNED-PAYLOAD' : EMPTY_HASH
    headers.set('x-amz-content-sha256', payloadHash)
    signRequest({ config, method, url, headers, payloadHash })

    const response = await fetch(url, {
        method,
        headers,
        body: options.body,
        cache: 'no-store',
        signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new Error(`S3 ${method} ${url.pathname} failed with ${response.status}: ${body || response.statusText}`)
    }

    return response
}

function buildS3URL(endpoint: URL, bucket?: string, key?: string, query?: Record<string, string | undefined>) {
    const url = new URL(endpoint)
    const path = [bucket, key].filter(Boolean).map((part) =>
        String(part).split('/').map(encodeURIComponent).join('/')
    ).join('/')
    url.pathname = path ? `/${path}` : '/'

    Object.entries(query || {}).forEach(([name, value]) => {
        if (value !== undefined && value !== '') {
            url.searchParams.set(name, value)
        }
    })

    return url
}

function signRequest(props: { config: S3Config, method: string, url: URL, headers: Headers, payloadHash: string }) {
    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
    const dateStamp = amzDate.slice(0, 8)
    const scope = `${dateStamp}/${props.config.region}/s3/aws4_request`
    const host = props.url.host

    props.headers.set('host', host)
    props.headers.set('x-amz-date', amzDate)

    const signedHeaderNames = Array.from(props.headers.keys()).map(key => key.toLowerCase()).sort()
    const canonicalHeaders = signedHeaderNames.map((name) =>
        `${name}:${props.headers.get(name)?.trim().replace(/\s+/g, ' ')}\n`
    ).join('')
    const canonicalQuery = Array.from(props.url.searchParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, value]) => `${encodeRFC3986(name)}=${encodeRFC3986(value)}`)
        .join('&')
    const canonicalRequest = [
        props.method,
        canonicalPath(props.url),
        canonicalQuery,
        canonicalHeaders,
        signedHeaderNames.join(';'),
        props.payloadHash
    ].join('\n')
    const stringToSign = [
        'AWS4-HMAC-SHA256',
        amzDate,
        scope,
        sha256(canonicalRequest)
    ].join('\n')
    const signingKey = hmacBuffer(
        hmacBuffer(hmacBuffer(hmacBuffer(`AWS4${props.config.secretKey}`, dateStamp), props.config.region), 's3'),
        'aws4_request'
    )
    const signature = hmacHex(signingKey, stringToSign)

    props.headers.set(
        'Authorization',
        `AWS4-HMAC-SHA256 Credential=${props.config.accessKey}/${scope}, `
        + `SignedHeaders=${signedHeaderNames.join(';')}, Signature=${signature}`
    )
}

function sha256(value: string) {
    return createHash('sha256').update(value).digest('hex')
}

function canonicalPath(url: URL) {
    return url.pathname.split('/').map((segment) => {
        try {
            return encodeRFC3986(decodeURIComponent(segment))
        } catch {
            return encodeRFC3986(segment)
        }
    }).join('/')
}

function hmacBuffer(key: string | Buffer, value: string) {
    return createHmac('sha256', key).update(value).digest()
}

function hmacHex(key: string | Buffer, value: string) {
    return createHmac('sha256', key).update(value).digest('hex')
}

function matches(value: string, pattern: RegExp) {
    return Array.from(value.matchAll(pattern)).map(match => match[1])
}

function text(value: string, tag: string) {
    return decodeXml(value.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1] || '')
}

function decodeXml(value: string) {
    return value
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
}

function encodeRFC3986(value: string) {
    return encodeURIComponent(value).replace(/[!'()*]/g, char =>
        `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    )
}

export function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0 B'
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
