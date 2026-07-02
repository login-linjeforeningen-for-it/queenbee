import Metric from './metric'

export default function ResourceRow({ name, load }: { name: string; load: number }) {
    return (
        <div className='flex items-center justify-between gap-3 rounded-lg border border-login-100/10 bg-login-900/40 px-3 py-2'>
            <h1 className='text-sm text-login-100'>{name}</h1>
            <Metric metric={Math.ceil(load * 100)} />
        </div>
    )
}
