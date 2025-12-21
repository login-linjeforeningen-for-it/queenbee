export default function Statistics({ services }: { services: Service[] }) {
    return (
        <div className='bg-white/10 p-2 rounded-lg flex gap-2 h-fit justify-evenly'>
            <div className='text-center text-lg font-semibold'>
                <h1>Up</h1>
                <h1 className='text-2xl text-green-500'>
                    {services.filter(item => item.bars.length && item.bars[item.bars.length - 1].status === 'up').length}
                </h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Down</h1>
                <h1 className='text-2xl text-red-500'>
                    {services.filter(item => !item.bars.length || item.bars[item.bars.length - 1].status === 'down').length}
                </h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Maintenance</h1>
                <h1 className='text-2xl text-purple-500'>
                    {services.filter(item => item.bars.length && item.bars[item.bars.length - 1].status === 'maintenance').length}
                </h1>
            </div>
            <div className='text-center text-lg font-semibold'>
                <h1>Pending</h1>
                <h1 className='text-2xl text-login'>
                    {services.filter(item => item.bars.length && item.bars[item.bars.length - 1].status === 'pending').length}
                </h1>
            </div>
        </div>
    )
}
