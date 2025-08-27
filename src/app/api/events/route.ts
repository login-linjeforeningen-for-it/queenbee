import fetchWrapper from '@utils/fetchWrapper'
import appConfig from '@config'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
    runtime: 'nodejs'
}

const baseUrl = appConfig.url.API_URL

export async function GET(req: NextRequest) {
    const body = await req.json()
    const { path, options = {} } = body
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetchWrapper({ url: `${baseUrl}${path}`, options: finalOptions })
        if (!response.ok) {
            throw new Error(await response.json())
        }

        const data = await response.json()
        return NextResponse.json(data)
        // eslint-disable-next-line
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            error: JSON.stringify(error.error) || JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { path, data = {} } = body
    const defaultOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetchWrapper({ url: `${baseUrl}${path}`, options: defaultOptions })
        if (!response.ok) {
            throw new Error(await response.json())
        }

        const data = await response.json()
        return NextResponse.json(data)
        // eslint-disable-next-line
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            error: JSON.stringify(error.error) || JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
        }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const body = await req.json()
    const { path, options = {} } = body
    const defaultOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetchWrapper({ url: `${baseUrl}${path}`, options: finalOptions })
        if (!response.ok) {
            throw new Error(await response.json())
        }

        const data = await response.json()
        return NextResponse.json(data)
        // eslint-disable-next-line
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            error: JSON.stringify(error.error) || JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
        }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const { path, data = {}, options = {} } = body
    const defaultOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    const finalOptions = { ...defaultOptions, ...options }

    try {
        const response = await fetchWrapper({ url: `${baseUrl}${path}`, options: finalOptions })
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return NextResponse.json(data)
        // eslint-disable-next-line
    } catch (error: any) {
        return NextResponse.json({
            error: JSON.stringify(error.error) || JSON.stringify(error.message) || 'Unknown error! Please contact TekKom'
        }, { status: 500 })
    }
}
