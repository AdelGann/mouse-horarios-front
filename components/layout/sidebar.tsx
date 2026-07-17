"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Home, 
  Calendar, 
  PlusCircle, 
  User, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  MousePointerClick,
  HelpCircle,
  ShieldCheck,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types for customizable navigation options
export interface SidebarSubOption {
  name: string
  href: string
}

export interface SidebarOption {
  name: string
  href?: string
  icon: React.ComponentType<any>
  subOptions?: SidebarSubOption[]
}

// Editable Array of navigation options
const NAVIGATION_OPTIONS: SidebarOption[] = [
  {
    name: "Inicio",
    href: "/home",
    icon: Home,
  },
  {
    name: "Mis Horarios",
    href: "/schedules",
    icon: Calendar,
  },
  {
    name: "Nuevo Horario",
    href: "/schedules/canvas?id=new",
    icon: PlusCircle,
  },
  {
    name: "Configuración",
    icon: Settings,
    subOptions: [
      { name: "Mi Perfil", href: "/profile" },
      { name: "Preferencias de Tema", href: "/profile#temas" },
      { name: "Seguridad y Accesos", href: "/profile#seguridad" },
    ],
  },
  {
    name: "Soporte Técnico",
    href: "https://dcyt.ucla.edu.ve",
    icon: HelpCircle,
  }
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    Configuración: false,
    Administración: false,
  })

  // Handle clean navigation for suboptions, preventing hash stacking issues (e.g. /admin#horarios#materias)
  const handleSubOptionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes("#")) {
      e.preventDefault()
      const [path, hash] = href.split("#")

      if (pathname === path) {
        window.location.hash = hash
      } else {
        router.push(href)
      }
    }
    if (onClose) {
      onClose()
    }
  }

  React.useEffect(() => {
    try {
      const session = localStorage.getItem("user_session")
      if (session) {
        setUser(JSON.parse(session))
      }
    } catch (_) {}

    // Auto expand config or admin categories on mount/pathname load
    if (pathname.startsWith("/profile")) {
      setExpandedMenus(prev => ({ ...prev, Configuración: true }))
    } else if (pathname.startsWith("/admin")) {
      setExpandedMenus(prev => ({ ...prev, Administración: true }))
    }
  }, [pathname])

  const toggleSubmenu = (name: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  // Build options list dynamically based on role
  const optionsToRender = [...NAVIGATION_OPTIONS]
  if (user?.role === "ADMIN") {
    // Insert Administration option before technical support
    const supportIndex = optionsToRender.findIndex(opt => opt.name === "Soporte Técnico")
    const adminOption: SidebarOption = {
      name: "Administración",
      icon: ShieldCheck,
      subOptions: [
        { name: "Cargar Horarios", href: "/admin#horarios" },
        { name: "Materias Base", href: "/admin#materias" },
        { name: "Profesores", href: "/admin#profesores" },
        { name: "Secciones", href: "/admin#secciones" },
        { name: "Aulas", href: "/admin#aulas" },
        { name: "Logs de Auditoría", href: "/admin#logs" },
        { name: "Gestionar Usuarios", href: "/admin#usuarios" },
      ]
    }
    
    if (supportIndex >= 0) {
      optionsToRender.splice(supportIndex, 0, adminOption)
    } else {
      optionsToRender.push(adminOption)
    }
  }

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen shrink-0 font-sans overflow-hidden transition-transform duration-300 ease-in-out z-50",
        "fixed inset-y-0 left-0 md:sticky md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand logo header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-sidebar">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
              <MousePointerClick className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                Mi<span className="text-muted-foreground font-light">Horario</span>
              </span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-widest -mt-0.5">
                {user?.role === "ADMIN" ? "Panel Administrativo" : "Panel Estudiantil"}
              </span>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Cerrar menú"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {optionsToRender.map((option) => {
          const hasSubOptions = !!option.subOptions
          const isExpanded = expandedMenus[option.name]
          
          // Check if parent or any child is currently active
          const isParentActive = option.href ? pathname === option.href : false
          const isChildActive = option.subOptions?.some(sub => pathname === sub.href || (typeof window !== "undefined" && pathname + window.location.hash === sub.href)) || false
          const isActive = isParentActive || isChildActive

          return (
            <div key={option.name} className="flex flex-col gap-1">
              {hasSubOptions ? (
                // Collapsible trigger button
                <button
                  onClick={() => toggleSubmenu(option.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <option.icon className="size-4 shrink-0" />
                    <span>{option.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                  )}
                </button>
              ) : (
                // Single navigation link
                <Link
                  href={option.href || "#"}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                    isParentActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                  )}
                >
                  <option.icon className="size-4 shrink-0" />
                  <span>{option.name}</span>
                </Link>
              )}

              {/* Submenu rendering */}
              {hasSubOptions && isExpanded && (
                <div className="pl-9 pr-2 py-1 flex flex-col gap-1 border-l border-border/60 ml-5 animate-in fade-in slide-in-from-top-1 duration-100">
                  {option.subOptions?.map((sub) => {
                    const isSubActive = pathname === sub.href || (typeof window !== "undefined" && pathname + window.location.hash === sub.href)
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={(e) => handleSubOptionClick(e, sub.href)}
                        className={cn(
                          "py-1 px-2 text-[11px] rounded-md transition-colors",
                          isSubActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/30"
                        )}
                      >
                        {sub.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-border bg-sidebar-accent/10 flex flex-col gap-1 text-[9px] text-muted-foreground font-sans">
        <div className="flex items-center gap-1">
          <ShieldCheck className="size-3 text-emerald-500" />
          <span>Servidor Seguro DCYT</span>
        </div>
        <span>Usuario: {user?.fullname || user?.username || "Invitado"}</span>
      </div>
    </aside>
  </>
)
}
