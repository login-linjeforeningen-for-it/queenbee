import { revalidatePath } from 'next/cache'
import { Alert } from 'uibee/components'
import config from '@config'
import AssetCard from '@components/tv/assetCard'

type Asset = {
    asset_id: string
    name: string
    is_enabled: boolean
    is_active: boolean
    uri: string
    mimetype: string
}

async function anthias(path: string, init?: RequestInit) {
    const auth = Buffer.from(`${config.anthias.user}:${config.anthias.password}`).toString('base64')
    const res = await fetch(`${config.url.anthias}/api/v2/assets${path}`, {
        ...init,
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`Anthias responded ${res.status}`)
    return res.json()
}

async function show(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const assets: Asset[] = await anthias('')
    if (!assets.some(asset => asset.asset_id === id)) throw new Error('Unknown asset')
    await Promise.all(assets.map(asset => anthias(`/${asset.asset_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_enabled: asset.asset_id === id }),
    })))
    revalidatePath('/tv')
}

async function edit(formData: FormData) {
    'use server'
    const id = formData.get('id')
    const assets: Asset[] = await anthias('')
    const asset = assets.find(asset => asset.asset_id === id)
    if (!asset) throw new Error('Unknown asset')
    const name = String(formData.get('name')).trim()
    if (!name) throw new Error('Name is required')
    const changes: Partial<Asset> = { name }
    // ponytail: only webpage URLs are editable; image/video uri is a file path on the Pi
    if (asset.mimetype === 'webpage') {
        const uri = new URL(String(formData.get('uri')))
        if (uri.protocol !== 'http:' && uri.protocol !== 'https:') throw new Error('URL must be http(s)')
        changes.uri = uri.href
    }
    await anthias(`/${asset.asset_id}`, { method: 'PATCH', body: JSON.stringify(changes) })
    revalidatePath('/tv')
}

export default async function Page() {
    let assets: Asset[] = []
    let error = ''
    try {
        assets = await anthias('')
    } catch (err) {
        error = err instanceof Error ? err.message : String(err)
    }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='flex min-h-9 items-center font-semibold text-lg'>TV</h1>
            {error && <Alert>Could not reach the TV. {error}</Alert>}
            <div className='flex flex-col gap-2 max-w-2xl'>
                {assets.map(asset => <AssetCard key={asset.asset_id} asset={asset} show={show} edit={edit} />)}
            </div>
        </div>
    )
}
