import { SearchX } from 'lucide-react'

export default function VulnerabilityErrorState({ error }: { error: string }) {
    return (
        <div className='w-full py-16 text-center flex flex-col items-center justify-center opacity-80'>
            <SearchX className='h-8 w-8 text-rose-300 mb-4' />
            <h2 className='font-semibold text-login-50'>Failed to load vulnerability report</h2>
            <p className='mt-1 text-sm text-login-100 max-w-sm'>
                The page could not read a valid vulnerability payload from the internal API.
            </p>
            <div className='mt-6 text-sm text-rose-300 max-w-xl text-left'>
                <code>{error}</code>
            </div>
        </div>
    )
}
