"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeCustomizerDialog } from "@/components/custom/theme-customizer-dialog"

export function Header() {
  const router = useRouter()
  const [customizerOpen, setCustomizerOpen] = React.useState(false)
  const [user, setUser] = React.useState<{ username: string; email?: string } | null>(null)

  React.useEffect(() => {
    // Read session
    try {
      const session = localStorage.getItem("user_session")
      if (session) {
        setUser(JSON.parse(session))
      } else {
        setUser({ username: "estudiante_dcyt", email: "cgomez@ucla.edu.ve" })
      }
    } catch (_) {}
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
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden xs:flex">
            <span className="text-[10px] font-bold text-foreground truncate max-w-[120px]">
              {user?.username || "Usuario"}
            </span>
            <span className="text-[8px] text-muted-foreground -mt-0.5 truncate max-w-[120px]">
              {user?.email || "estudiante@ucla.edu.ve"}
            </span>
          </div>
          
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-foreground">
            <User className="size-4" />
          </div>

          <Button 
            variant="ghost" 
            size="icon-xs" 
            onClick={handleLogout} 
            className="text-destructive hover:bg-destructive/10"
            title="Cerrar Sesión"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
