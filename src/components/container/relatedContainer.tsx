export default function RelatedContainer({ container }: { container: RelatedContainer }) {
    return (
        <div className='rounded-lg p-2 grid grid-cols-4 gap-2 bg-login-50/5 w-full'>
            <div>
                <h1 className='text-sm'>ID</h1>
                <h1>{container.id}</h1>
            </div>
            <div>
                <h1 className='text-sm'>Name</h1>
                <h1>{container.name}</h1>
            </div>
            <div>
                <h1 className='text-sm'>Status</h1>
                <h1>{container.status}</h1>
            </div>
            <div>
                <h1 className='text-sm'>Uptime</h1>
                <h1>{container.uptime}</h1>
            </div>
        </div>
    )
}
