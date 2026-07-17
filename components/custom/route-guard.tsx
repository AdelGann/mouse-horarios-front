"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = React.useState(false)

  const checkAuth = React.useCallback(() => {
    const session = localStorage.getItem("user_session")
    
    if (!session) {
      setAuthorized(false)
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(session)
      
      // Admin route protection
      if (pathname?.startsWith("/admin") && user.role !== "ADMIN") {
        setAuthorized(false)
        router.push("/home")
        return
      }

      setAuthorized(true)
    } catch (_) {
      setAuthorized(false)
      router.push("/login")
    }
  }, [pathname, router])

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!authorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground font-sans">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs font-mono">Verificando acceso seguro...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
