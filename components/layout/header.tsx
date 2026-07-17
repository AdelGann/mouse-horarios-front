"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeCustomizerDialog } from "@/components/custom/theme-customizer-dialog"

export function Header() {
  const router = useRouter()
  const [customizerOpen, setCustomizerOpen] = React.useState(false)
  const [user, setUser] = React.useState<{
    username: string;
    fullname?: string;
    email?: string;
    role?: string;
    img_url?: string;
  } | null>(null)

  React.useEffect(() => {
    const loadSession = () => {
      try {
        const session = localStorage.getItem("user_session")
        if (session) {
          setUser(JSON.parse(session))
        } else {
          setUser({ username: "estudiante_dcyt", email: "cgomez@ucla.edu.ve", role: "USER" })
        }
      } catch (_) {}
    }

    loadSession()
    window.addEventListener("storage", loadSession)
    window.addEventListener("profile_updated", loadSession)

    return () => {
      window.removeEventListener("storage", loadSession)
      window.removeEventListener("profile_updated", loadSession)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("user_session")
      router.push("/")
    } catch (_) {}
  }

  return (
    <header className="h-14 border-b border-border bg-card/45 backdrop-blur-xs flex items-center justify-between px-6 shrink-0 relative z-20 font-sans">
      {/* Left side: Breadcrumb info */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground font-medium">UCLA DCYT</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-semibold uppercase tracking-wider text-[10px]">
          Planificador
        </span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Dynamic Theme Customizer Trigger */}
        <div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setCustomizerOpen(true)}
            className="gap-1.5 text-[10px] font-semibold border-border hover:bg-muted shadow-xs"
          >
            <Palette className="size-3.5" />
            <span>Personalizar Tema</span>
          </Button>

          {/* Theme customizer modal */}
          <ThemeCustomizerDialog 
            isOpen={customizerOpen} 
            onClose={() => setCustomizerOpen(false)} 
          />
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-border/60" />

        {/* User profile action */}
        {(() => {
          const avatarUrl = user?.img_url 
            ? (user.img_url.startsWith("http") ? user.img_url : `http://localhost:3001${user.img_url}`)
            : null
          const displayRole = user?.role === "ADMIN" ? "Administrador" : "Estudiante"

          return (
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-foreground overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={user?.fullname || user?.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="size-4" />
                )}
              </div>

              <div className="flex flex-col text-left hidden xs:flex">
                <span className="text-[10px] font-bold text-foreground truncate max-w-[140px]">
                  {user?.fullname || user?.username || "Usuario"}
                </span>
                <span className="text-[8px] text-muted-foreground -mt-0.5 truncate max-w-[140px] font-mono">
                  @{user?.username} • {displayRole}
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="icon-xs" 
                onClick={handleLogout} 
                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                title="Cerrar Sesión"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          )
        })()}
      </div>
    </header>
  )
}
