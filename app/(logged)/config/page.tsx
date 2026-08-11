"use client"

import * as React from "react"
import { User, Palette, KeyRound, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { cn } from "@/lib/utils"
import { ProfileTab } from "@/components/pages/config/profile-tab"
import { ThemeTab } from "@/components/pages/config/theme-tab"
import { SecurityTab } from "@/components/pages/config/security-tab"

export default function ConfigPage() {
  const [user, setUser] = React.useState<any>(null)
  const { getProfile, updateProfile, uploadPhoto, changePassword, loading } = useAuth()
  
  // Navigation State (profile, temas, seguridad)
  const [activeTab, setActiveTab] = React.useState("profile")

  // Sync state with URL hash (hashchange)
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash === "temas" || hash === "seguridad") {
        setActiveTab(hash)
      } else {
        setActiveTab("profile")
      }
    }
    handleHash()
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [])

  // Load profile data
  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setUser(data)
    } catch (_) {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("user_session")
        if (session) {
          setUser(JSON.parse(session))
        }
      }
    }
  }

  React.useEffect(() => {
    fetchProfile()
  }, [])

  if (!user) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center text-xs text-muted-foreground font-sans">
        <Loader2 className="size-4 animate-spin text-primary mr-2" />
        Cargando configuración...
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-h-[calc(100vh-3.5rem)] overflow-y-auto font-sans max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <User className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Configuración del Sistema
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administra tu información personal, académica, temas visuales y seguridad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Column: Local Page Navigation */}
        <div className="md:col-span-1 flex flex-col gap-1 border border-border bg-card/60 backdrop-blur-xs rounded-xl p-2">
          <button
            onClick={() => { setActiveTab("profile"); window.location.hash = "profile"; }}
            className={cn(
              "w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors",
              activeTab === "profile" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <User className="size-4" />
            <span>Datos Personales</span>
          </button>
          <button
            onClick={() => { setActiveTab("temas"); window.location.hash = "temas"; }}
            className={cn(
              "w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors",
              activeTab === "temas" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <Palette className="size-4" />
            <span>Preferencias de Tema</span>
          </button>
          <button
            onClick={() => { setActiveTab("seguridad"); window.location.hash = "seguridad"; }}
            className={cn(
              "w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors",
              activeTab === "seguridad" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <KeyRound className="size-4" />
            <span>Seguridad y Accesos</span>
          </button>
        </div>

        {/* Right Columns: Forms & Settings Cards */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              setUser={setUser}
              updateProfile={updateProfile}
              uploadPhoto={uploadPhoto}
              loading={loading}
            />
          )}

          {activeTab === "temas" && (
            <ThemeTab />
          )}

          {activeTab === "seguridad" && (
            <SecurityTab changePassword={changePassword} />
          )}
        </div>
      </div>
    </div>
  )
}
