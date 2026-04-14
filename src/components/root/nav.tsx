import Image from 'next/image'
import Link from 'next/link'
import { RightSide } from './clientNav'
import ArrowOutward from '@/components/svg/arrowOutward'

export default function Navbar() {
    return (
        <div className='flex justify-between bg-black h-full w-full md:px-4 gap-2 overflow-hidden'>
            {/* logo */}
            <div className='flex items-center h-12 md:w-40'>
                <Link href='/' className='relative block h-8 w-8'>
                    <Image
                        src='/images/logo/logo.svg'
                        className='object-cover'
                        alt='logo'
                        fill={true}
                    />
                </Link>
            </div>
            <nav className='flex justify-between items-center w-fill max-w-160'>
                <Link href='https://login.no'>
                    <li className={`
                        text-white flex flex-row items-center list-none 
                        no-underline leading-4 p-3 pr-6 font-medium 
                        cursor-pointer link--corner-hover
                    `}>
                        Login
                        <ArrowOutward className='absolute right-1 w-4 h-4 fill-login'/>
                    </li>
                </Link>
            </nav>
            {/* account, login */}
            <RightSide />
        </div>
    )
}
