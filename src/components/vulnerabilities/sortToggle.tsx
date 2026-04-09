import type { SortMode } from './types'

export default function SortToggle({ sortMode, setSortMode }: { sortMode: SortMode, setSortMode: (mode: SortMode) => void }) {
    const base = 'rounded-full px-3 py-2 text-sm font-medium transition'
    const active = 'bg-login-200 text-login-950 shadow'
    const idle = 'text-login-200 hover:bg-login-50/10 hover:text-login-50'

    return (
        <div className='flex items-center rounded-full border border-login-100/10 bg-login-50/5 p-1'>
            <button
                type='button'
                onClick={() => setSortMode('impact')}
                aria-pressed={sortMode === 'impact'}
                className={`${base} ${sortMode === 'impact' ? active : idle}`}
            >
                Impact
            </button>
            <button
                type='button'
                onClick={() => setSortMode('alphabetical')}
                aria-pressed={sortMode === 'alphabetical'}
                className={`${base} ${sortMode === 'alphabetical' ? active : idle}`}
            >
                A-Z
            </button>
        </div>
    )
}
