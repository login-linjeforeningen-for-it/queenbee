'use client'

import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '@/utils/cookies'
import './toggle.css'

export default function ThemeSwitch() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [showConfirmation, setShowConfirmation] = useState(false)

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
            setShowConfirmation(true)
        } else {
            confirmToggle('dark')
        }
    }

    function confirmToggle(newTheme: 'dark' | 'light') {
        setCookie('theme', newTheme)
        setTheme(newTheme)
        setShowConfirmation(false)
    }

    function cancelToggle() {
        setShowConfirmation(false)
    }

    return (
        <div className="grid place-items-center justify-end">
            <label>
                <input
                    type="checkbox"
                    checked={theme === 'light'}
                    onChange={toggleTheme}
                    className="sr-only"
                />
                <ThemeIcon />
            </label>

            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-dark p-6 rounded-lg shadow-lg w-80 text-center">
                        <p className="mb-4 text-lg font-semibold">Har du tatt på solbrillene?</p>
                        <div className="flex justify-around">
                            <button
                                onClick={() => confirmToggle(theme === 'dark' ? 'light' : 'dark')}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            >
                                Ja
                            </button>
                            <button
                                onClick={cancelToggle}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                            >
                                Nei
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
            className="theme-toggle_svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask id="theme-toggle_clip-path">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                <circle
                    className="theme-toggle_mask-circle"
                    cx="68"
                    cy="40"
                    r="18"
                />
            </mask>
            <circle
                className="theme-toggle_sun-moon"
                mask="url(#theme-toggle_clip-path)"
                cx="50"
                cy="50"
                r="23"
            />
            <rect
                className="theme-toggle_sun-ray"
                x="86"
                y="47"
                width="14"
                height="6"
            />
            <rect className="theme-toggle_sun-ray" y="47" width="14" height="6" />
            <rect
                className="theme-toggle_sun-ray"
                x="47"
                y="86"
                width="6"
                height="14"
            />
            <path
                className="theme-toggle_sun-ray"
                d="M75 78.2426L79.2426 74L89.1421 83.8995L84.8995 88.1421L75 78.2426Z"
            />
            <rect
                className="theme-toggle_sun-ray"
                x="84.8995"
                y="12"
                width="6"
                height="14"
                transform="rotate(45 84.8995 12)"
            />
            <rect
                className="theme-toggle_sun-ray"
                x="22.8995"
                y="74"
                width="6"
                height="14"
                transform="rotate(45 22.8995 74)"
            />
            <rect
                className="theme-toggle_sun-ray"
                x="13"
                y="16.2426"
                width="6"
                height="14"
                transform="rotate(-45 13 16.2426)"
            />
            <path className="theme-toggle_sun-ray" d="M47 0H53V14H47V0Z" />
        </svg>
    )
}
