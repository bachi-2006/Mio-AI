"use client"

import type React from "react"
import { AuthProvider as AuthContextProvider, useAuth as useAuthContext } from "@/lib/auth-context"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}

// Re-export the useAuth hook so it can be imported from either location
export const useAuth = useAuthContext

export default AuthProvider
