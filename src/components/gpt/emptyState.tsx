import { Bot } from 'lucide-react'
import { Card, EmptyState } from 'uibee/components'

export default function GPT_EmptyState() {
    return (
        <Card className='w-full px-6 py-4'>
            <EmptyState
                icon={Bot}
                title='No GPTs connected'
                description='The dashboard will populate automatically when a client joins the room.'
            />
        </Card>
    )
}
