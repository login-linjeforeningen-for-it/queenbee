import { Bug } from 'lucide-react'

export default function VulnerabilityEmptyState() {
    return (
        <div className='w-full py-16 text-center flex flex-col items-center justify-center opacity-60'>
            <Bug className='h-8 w-8 text-login-200 mb-4' />
            <h2 className='font-semibold text-login-50'>No matches found</h2>
            <p className='mt-1 text-sm text-login-100 max-w-sm'>Try another image, CVE, package, or source search.</p>
        </div>
    )
}
