'use client'

import { useEffect } from 'react'

export default function Login() {
    useEffect(() => {
        const path = '/service/prod/global'
        window.location.href = path
    }, [])
}
