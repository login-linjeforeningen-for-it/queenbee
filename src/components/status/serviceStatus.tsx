import smallDate from '@utils/date/smallDate'
import barColor from '@utils/status/barColor'
import TrashShift from './trashShift'

type ServiceStatusProps = {
    item?: ServiceRow
}

export default function ServiceStatus({ item }: ServiceStatusProps) {
    if (!item) {
        return <></>
    }

    return (
        <>
            <div className='flex w-full justify-between items-center'>
                <h1 className='text-xl font-semibold'>{item.name}</h1>
                <TrashShift />
            </div>
            <table className='rounded-lg w-full p-2 bg-white/5'>
                <thead>
                    <tr className='text-left'>
                        <th className='pl-2 w-30'>Name</th>
                        <th className='pl-2 w-20'>Status</th>
                        <th className='pl-2 w-40'>Date</th>
                        <th className='pl-2'>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {item.bars.map((bar, i) => (
                        <tr key={i}>
                            <td className='px-2 overflow-auto noscroll'>{item.name}</td>
                            <td className='px-2 py-1'>
                                <span className={`
                                    inline-flex items-center justify-center text-xs w-full
                                    px-2 rounded-md py-0.5 font-medium ${barColor(bar.status)}
                                    `}>
                                    {bar.status}
                                </span>
                            </td>
                            <td className='px-2 py-1'>{smallDate(bar.date)}</td>
                            <td className='px-2 overflow-auto noscroll'>{bar.message}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
