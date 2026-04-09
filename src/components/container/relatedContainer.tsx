export default function RelatedContainer({ container }: { container: RelatedContainer }) {
    return (
        <div className='grid w-full gap-3 rounded-xl border border-login-100/10 bg-login-50/5 p-4 md:grid-cols-4'>
            <div>
                <h1 className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>ID</h1>
                <h1 className='mt-2 wrap-break-word font-mono text-sm text-login-50'>{container.id}</h1>
            </div>
            <div>
                <h1 className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>Name</h1>
                <h1 className='mt-2 wrap-break-word text-sm font-medium text-login-50'>{container.name}</h1>
            </div>
            <div>
                <h1 className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>Status</h1>
                <h1 className='mt-2 text-sm text-login-50'>{container.status}</h1>
            </div>
            <div>
                <h1 className='text-[11px] font-medium uppercase tracking-[0.18em] text-login-200'>Uptime</h1>
                <h1 className='mt-2 text-sm text-login-50'>{container.uptime}</h1>
            </div>
        </div>
    )
}
