'use client'

import { useState } from 'react'
import { Database } from 'lucide-react'
import { Button, toast } from 'uibee/components'
import triggerBackup from '@utils/api/internal/backups/triggerBackup'

export default function BackupAllButton() {
    const [loading, setLoading] = useState(false)

    async function handleBackup() {
        setLoading(true)
        try {
            const result = await triggerBackup()
            if (typeof result === 'string') {
                toast.error(`Error: ${result}`)
            } else {
                toast.success(result.message || 'Backup triggered successfully')
            }
        } catch (error) {
            toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            icon={<Database className='w-5' />}
            text={loading ? 'Backing up...' : 'Backup All'}
            onClick={handleBackup}
            disabled={loading}
            className='self-start'
        />
    )
}
