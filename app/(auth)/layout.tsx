"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checking, setChecking] = React.useState(true)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("user_session")
      if (session) {
        router.push("/home")
      } else {
        setChecking(false)
      }
    }
  }, [router])

  if (checking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground font-sans">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs font-mono">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {children}
    </div>
  )
}
