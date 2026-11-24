'use client'

import { useState } from 'react'
import { Film, Globe, Image, Tv } from 'lucide-react'
import { Button, ExpandableCard, Input, toast } from 'uibee/components'

type Asset = {
    asset_id: string
    name: string
    uri: string
    mimetype: string
    is_enabled: boolean
    is_active: boolean
}

type Props = {
    asset: Asset
    show: (formData: FormData) => Promise<void>
    edit: (formData: FormData) => Promise<void>
}

const icons = { webpage: Globe, image: Image, video: Film }

export default function AssetCard({ asset, show, edit }: Props) {
    const [expanded, setExpanded] = useState(false)

    async function save(formData: FormData) {
        try {
            await edit(formData)
            setExpanded(false)
            toast.success('Saved')
        } catch {
            toast.error('Could not save to the TV')
        }
    }

    return (
        <ExpandableCard
            icon={icons[asset.mimetype as keyof typeof icons] ?? Tv}
            title={asset.name}
            subtitle={asset.mimetype === 'webpage' ? asset.uri : asset.mimetype}
            pulse={asset.is_active
                ? { variant: 'online', label: 'Live' }
                : asset.is_enabled
                    ? { variant: 'warning', label: 'Outside schedule' }
                    : { variant: 'offline', label: 'Off' }}
            trailing={!asset.is_enabled && (
                <form action={show}>
                    <input type='hidden' name='id' value={asset.asset_id} />
                    <Button type='submit' text='Show' variant='secondary' icon={<Tv className='h-4 w-4' />} />
                </form>
            )}
            isExpanded={expanded}
            onToggle={() => setExpanded(prev => !prev)}
        >
            <form action={save} className='flex flex-col gap-3'>
                <input type='hidden' name='id' value={asset.asset_id} />
                <Input name='name' label='Name' defaultValue={asset.name} required />
                {asset.mimetype === 'webpage' && (
                    <Input name='uri' label='URL' type='url' defaultValue={asset.uri} required />
                )}
                <Button type='submit' text='Save' className='self-end' />
            </form>
        </ExpandableCard>
    )
}
