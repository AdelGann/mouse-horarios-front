"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Plus, FileText, ChevronRight, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useSchedules } from "@/lib/hooks/useSchedules"
import { toast } from "react-hot-toast"

export default function SchedulesPage() {
  const { getPersonalSchedules, deletePersonalSchedule, loading } = useSchedules()
  const [drafts, setDrafts] = React.useState<any[]>([])

  const loadDrafts = async () => {
    try {
      const res = await getPersonalSchedules()
      setDrafts(res)
    } catch (e: any) {
      console.error(e)
    }
  }

  React.useEffect(() => {
    loadDrafts()
  }, [])

  const handleDeleteDraft = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar el borrador "${name}"?`)) return
    try {
      await deletePersonalSchedule(id)
      toast.success("Borrador de horario eliminado")
      loadDrafts()
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar borrador")
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6 font-sans max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Calendar className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
              Mis Borradores de Horarios
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visualiza y gestiona las propuestas de horarios guardadas para el periodo actual.
            </p>
          </div>
        </div>

        <Link href="/schedules/canvas?id=new">
          <Button size="sm" className="gap-1.5 cursor-pointer">
            <Plus className="size-4" />
            Nuevo Horario
          </Button>
        </Link>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-xs text-muted-foreground font-mono">
          <Loader2 className="size-5 animate-spin text-primary mr-2" />
          <span>Cargando borradores...</span>
        </div>
      ) : drafts.length === 0 ? (
        <div className="border border-dashed border-border p-16 text-center text-xs text-muted-foreground rounded-2xl bg-card/20 font-mono">
          No tienes ningún borrador guardado en tu cuenta.
          <div className="mt-4">
            <Link href="/schedules/canvas?id=new">
              <Button size="xs" variant="outline" className="cursor-pointer">
                Crear mi primer borrador
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drafts.map((draft) => (
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
                <Link href={`/schedules/canvas?id=${draft.id}`}>
                  <Button variant="ghost" size="xs" className="gap-1 cursor-pointer">
                    Editar en Canvas
                    <ChevronRight className="size-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
