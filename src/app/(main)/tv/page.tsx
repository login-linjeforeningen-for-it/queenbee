import { revalidatePath } from 'next/cache'
import { Tv } from 'lucide-react'
import { Alert, Badge, Button, Card, PulseDot } from 'uibee/components'
import config from '@config'

type Asset = {
    asset_id: string
    name: string
    is_enabled: boolean
    is_active: boolean
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
                {assets.map(asset => (
                    <Card key={asset.asset_id} className='p-4'>
                        <form action={show} className='flex items-center gap-3'>
                            <input type='hidden' name='id' value={asset.asset_id} />
                            <PulseDot variant={asset.is_active ? 'online' : asset.is_enabled ? 'warning' : 'offline'} />
                            <span className='flex-1 font-semibold truncate'>{asset.name}</span>
                            {asset.is_enabled && !asset.is_active && <Badge text='Outside schedule' variant='warning' />}
                            {asset.is_enabled
                                ? <Badge text='Live' variant='success' />
                                : <Button type='submit' text='Show' variant='secondary' icon={<Tv className='h-4 w-4' />} />}
                        </form>
                    </Card>
                ))}
            </div>
        </div>
    )
}
