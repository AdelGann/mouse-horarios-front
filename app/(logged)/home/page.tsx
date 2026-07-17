"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Plus, LogOut, FileText, ChevronRight, User, Trash2, Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useSchedules } from "@/lib/hooks/useSchedules"
import { useNotices } from "@/lib/hooks/useNotices"
import { toast } from "react-hot-toast"

export default function HomeRoute() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  
  // Custom hooks
  const { getPersonalSchedules, deletePersonalSchedule, loading: schedLoading } = useSchedules()
  const { getNotices, loading: noticesLoading } = useNotices()

  const [drafts, setDrafts] = React.useState<any[]>([])
  const [notices, setNotices] = React.useState<any[]>([])

  const loadData = async () => {
    try {
      const personalDrafts = await getPersonalSchedules()
      setDrafts(personalDrafts)

      const activeNotices = await getNotices()
      setNotices(activeNotices)
    } catch (e: any) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    const session = localStorage.getItem("user_session")
    if (session) {
      setUser(JSON.parse(session))
    } else {
      router.push("/login")
      return
    }

    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user_session")
    toast.success("Sesión cerrada correctamente")
    router.push("/")
  }

  const handleDeleteDraft = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar el borrador "${name}"?`)) return
    try {
      await deletePersonalSchedule(id)
      toast.success("Borrador de horario eliminado")
      loadData()
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar borrador")
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] font-sans">
      {/* Main Content: Split Grid for News and Drafts */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Inscriptions & News widget (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bell className="size-4.5 text-primary" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Avisos del Decanato (Inscripciones)
            </h2>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {noticesLoading ? (
              <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary mr-2" />
                <span>Cargando anuncios...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="border border-dashed border-border p-6 text-center text-xs text-muted-foreground font-mono">
                No hay comunicados vigentes en este momento.
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="p-3.5 border border-primary/20 bg-primary/5 rounded-xl text-xs space-y-2 animate-in fade-in slide-in-from-left-2 duration-100">
                  <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                    <span className="font-bold text-primary uppercase">UCLA DCYT</span>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-xs">{notice.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[11px] whitespace-pre-wrap">{notice.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Saved Drafts (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <h1 className="text-xs font-bold uppercase tracking-wider text-foreground">Mis Borradores de Horarios</h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Administra y edita tus propuestas para el semestre.</p>
            </div>
            <Link href="/schedules/new">
              <Button size="sm" className="gap-1.5 cursor-pointer">
                <Plus className="size-4" />
                Crear Horario en Canvas
              </Button>
            </Link>
          </div>

          {/* Drafts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedLoading ? (
              <div className="col-span-2 flex items-center justify-center py-12 text-xs text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary mr-2" />
                <span>Cargando borradores...</span>
              </div>
            ) : drafts.length === 0 ? (
              <div className="col-span-2 border border-dashed border-border p-12 text-center text-xs text-muted-foreground font-mono">
                No tienes borradores creados en tu cuenta. ¡Haz clic en "Crear Horario en Canvas" para comenzar!
              </div>
            ) : (
              drafts.map((draft) => (
                <Card key={draft.id} className="border border-border bg-card hover:border-foreground/20 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide truncate">
                        {draft.name}
                      </CardTitle>
                      <button
                        onClick={() => handleDeleteDraft(draft.id, draft.name)}
                        className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-transparent cursor-pointer"
                        title="Eliminar borrador"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <CardDescription className="text-[9px] text-muted-foreground font-mono">
                      Creado: {new Date(draft.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText className="size-3.5" />
                      <span>{draft.subjects?.length || 0} materias seleccionadas</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 border border-border rounded-sm">
                      Formato: Digital
                    </span>
                    <Link href="/schedules/new">
                      <Button variant="ghost" size="xs" className="gap-1 cursor-pointer">
                        Editar en Canvas
                        <ChevronRight className="size-3" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
