import config from '@config'
import { NextRequest } from 'next/server'
import { authCallback } from 'uibee/utils'

export async function GET(request: NextRequest) {
    return await authCallback({
        req: request,
        tokenURL: config.authentik.url.token,
        clientID: config.authentik.client.id,
        clientSecret: config.authentik.client.secret,
        redirectURL: config.auth.url.redirect,
        userInfoURL: config.authentik.url.userinfo,
        tokenRedirectURL: config.auth.url.token
    })
}
