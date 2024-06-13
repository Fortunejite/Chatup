"use client"

import { SessionProvider } from "next-auth/react"
const AuthProivider = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthProivider