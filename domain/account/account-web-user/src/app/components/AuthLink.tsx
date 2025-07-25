'use client'
import { createClient } from "@openauthjs/openauth/client"
// import { Resource } from "sst"

export const AuthLink = async ({auth_url, redirect_to, children}: {auth_url: string, redirect_to: string, children: React.ReactNode}) => {
    const client = createClient({
        clientID: "exp-aws-game",
        issuer: auth_url
      })
    const { url } = await client.authorize(redirect_to, 'code')
  return <a href={url}>{children}</a>
}
