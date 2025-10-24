"use client"

import type React from "react"

import { Auth0Provider } from "@auth0/auth0-react"
import AuthProvider from "@/components/providers/AuthProvider"
import ThemeProvider from "@/components/providers/ThemeProvider"

const auth0Config = {
  domain: "dev-z2jf7uzzciuxplvw.us.auth0.com",
  clientId: "HkQ31hDP1HYCdHMtBHHEGtZ8CGMX8HJv",
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? `${window.location.origin}/callback` : "",
      }}
      cacheLocation="localstorage"
    >
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </Auth0Provider>
  )
}
