'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getCookie, setCookie } from '@/utils/cookies'
import './toggle.css'

export default function ThemeSwitch() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showExitPopup, setShowExitPopup] = useState(false)
    const [pendingTheme, setPendingTheme] = useState<'dark' | 'light' | null>(
        null
    )

    useEffect(() => {
        const savedTheme = getCookie('theme') as 'dark' | 'light'
        if (savedTheme) {
            setTheme(savedTheme)
        }

        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)
    }, [theme])

    function toggleTheme() {
        if (theme === 'dark') {
            setPendingTheme('light')
            setShowConfirmation(true)
        } else {
            confirmToggle('dark')
        }
    }

    function confirmToggle(newTheme: 'dark' | 'light') {
        setShowConfirmation(false)
        if (newTheme === 'light') {
            setShowExitPopup(true)
        } else {
            setCookie('theme', 'dark')
            setTheme('dark')
        }
    }

    function cancelToggle() {
        setShowConfirmation(false)
    }

    function closeExitPopup() {
        setShowExitPopup(false)
        if (pendingTheme) {
            setCookie('theme', pendingTheme)
            setTheme(pendingTheme)
            setPendingTheme(null)
        }
    }

    return (
        <div className='grid place-items-center justify-end'>
            <label>
                <input
                    type='checkbox'
                    checked={theme === 'light'}
                    onChange={toggleTheme}
                    className='sr-only'
                />
                <ThemeIcon />
            </label>

            {showConfirmation && (
                <div
                    className={
                        'fixed inset-0 bg-black bg-opacity-50 flex ' +
                        'justify-center items-center z-50'
                    }
                >
                    <div
                        className={
                            'bg-login-700 p-6 rounded-lg shadow-lg ' +
                            'w-90 text-center'
                        }
                    >
                        <p className='mb-4 text-lg font-semibold'>
                            Have you put on your sunglasses?
                        </p>
                        <div className='flex items-center justify-around'>
                            <button
                                onClick={() =>
                                    confirmToggle(
                                        theme === 'dark' ? 'light' : 'dark'
                                    )
                                }
                                className={
                                    'bg-login-500 before:content-["Yes"] ' +
                                    'w-12 h-[2.6rem] text-xs  rounded-lg ' +
                                    'hover:bg-red-600 ' +
                                    'hover:before:content-["Sure?"] ' +
                                    'cursor-pointer'
                                }
                            ></button>
                            <button
                                onClick={cancelToggle}
                                className={
                                    'bg-login py-2 px-4 w-56 ' +
                                    'rounded-lg hover:bg-orange-500 ' +
                                    'cursor-pointer'
                                }
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExitPopup && (
                <div
                    className={
                        'fixed inset-0 bg-black bg-opacity-50 flex ' +
                        'justify-center items-center z-50'
                    }
                >
                    <div
                        className={
                            'bg-login-700 p-6 rounded-lg shadow-lg ' +
                            'w-80 text-center'
                        }
                    >
                        <Image
                            src={'/images/lightTheme.gif'}
                            className='mb-2'
                            width={500}
                            height={500}
                            alt='blind'
                        />
                        <p className='mb-4 text-login text-lg font-semibold'>
                            Proceed with extreme caution!
                        </p>
                        <div className='flex flex-row items-center gap-4'>
                            <button
                                onClick={() => {
                                    closeExitPopup()
                                }}
                                className={
                                    'bg-login-500 w-12 h-[2.6rem] ' +
                                    'rounded-lg text-sm hover:bg-red-600 ' +
                                    'cursor-pointer'
                                }
                            >
                                Exit
                            </button>
                            <button
                                onClick={() => {
                                    setCookie('theme', 'dark')
                                    setTheme('dark')
                                    setShowExitPopup(false)
                                }}
                                className={
                                    'bg-login  py-2 px-4 w-56 ' +
                                    'rounded-lg hover:bg-green-600 ' +
                                    'cursor-pointer'
                                }
                            >
                                GO BACK!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ThemeIcon() {
    return (
        <svg
            className='theme-toggle_svg cursor-pointer'
            viewBox='0 0 100 100'
            xmlns='http://www.w3.org/2000/svg'
        >
            <mask id='theme-toggle_clip-path'>
                <rect x='0' y='0' width='100' height='100' fill='white' />
                <circle
                    className='theme-toggle_mask-circle'
                    cx='68'
                    cy='40'
                    r='18'
                />
            </mask>
            <circle
                className='theme-toggle_sun-moon'
                mask='url(#theme-toggle_clip-path)'
                cx='50'
                cy='50'
                r='23'
            />
            <rect
                className='theme-toggle_sun-ray'
                x='86'
                y='47'
                width='14'
                height='6'
            />
            <rect
                className='theme-toggle_sun-ray'
                y='47'
                width='14'
                height='6'
            />
            <rect
                className='theme-toggle_sun-ray'
                x='47'
                y='86'
                width='6'
                height='14'
            />
            <path
                className='theme-toggle_sun-ray'
                d={
                    'M75 78.2426L79.2426 74L89.1421 83.8995L84.8995 ' +
                    '88.1421L75 78.2426Z'
                }
            />
            <rect
                className='theme-toggle_sun-ray'
                x='84.8995'
                y='12'
                width='6'
                height='14'
                transform='rotate(45 84.8995 12)'
            />
            <rect
                className='theme-toggle_sun-ray'
                x='22.8995'
                y='74'
                width='6'
                height='14'
                transform='rotate(45 22.8995 74)'
            />
            <rect
                className='theme-toggle_sun-ray'
                x='13'
                y='16.2426'
                width='6'
                height='14'
                transform='rotate(-45 13 16.2426)'
            />
            <path className='theme-toggle_sun-ray' d='M47 0H53V14H47V0Z' />
        </svg>
    )
}
