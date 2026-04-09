import { LayoutGrid, Rows3 } from 'lucide-react'

export default function LayoutToggle({ areAllExpanded, toggleExpandAll }: { areAllExpanded: boolean, toggleExpandAll: () => void }) {
    const active = 'bg-login-200 text-login-950 shadow'
    const idle = 'text-login-200 hover:bg-login-50/10 hover:text-login-50'

    return (
        <div className='flex items-center rounded-full border border-login-100/10 bg-login-50/5 p-1'>
            <button
                type='button'
                onClick={() => areAllExpanded && toggleExpandAll()}
                aria-label='Compact vulnerability list'
                aria-pressed={!areAllExpanded}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${!areAllExpanded ? active : idle}`}
            >
                <Rows3 className='h-4.5 w-4.5' />
            </button>
            <button
                type='button'
                onClick={() => !areAllExpanded && toggleExpandAll()}
                aria-label='Expanded vulnerability cards'
                aria-pressed={areAllExpanded}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${areAllExpanded ? active : idle}`}
            >
                <LayoutGrid className='h-4.5 w-4.5' />
            </button>
        </div>
    )
}
