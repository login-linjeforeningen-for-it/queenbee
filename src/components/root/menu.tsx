import Services from '../root/services'

export default function Menu() {
    return (
        <div className='grid menu absolute md:hidden grid-rows-9 left-0 top-0 h-full w-full bg-login-50/5'>
            <div />
            <div className='row-span-8'>
                <Services />
            </div>
        </div>
    )
}
