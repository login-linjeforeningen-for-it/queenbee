'use client'

export function Burger() {
    function handleClick() {
        const menu = document.querySelector('.menu')

        if (menu) {
            menu.classList.toggle('hidden')
        }
    }

    return (
        <div className='lg:hidden grid place-self-center w-[4vh] h-[4vh] relative' onClick={handleClick}>
            <div className='bg-login-50 rounded-lg h-0.75 self-center' />
            <div className='bg-login-50 rounded-lg h-0.75 self-center' />
            <div className='bg-login-50 rounded-lg h-0.75 self-center' />
        </div>
    )
}
