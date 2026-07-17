import { MockSchedulerPreview } from "@/components/custom/mock-scheduler-preview"
import { Calendar } from "lucide-react"

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function CanvasPage({ searchParams }: PageProps) {
  const params = await searchParams
  // id=new → create mode (no draft loaded); any real UUID → edit mode
  const draftId = params.id && params.id !== "new" ? params.id : null
  const isEditing = !!draftId

  return (
    <div className="flex-1 p-6 space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Calendar className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            {isEditing ? "Editar Borrador de Horario" : "Diseñador de Horario Personal"}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEditing
              ? "Modifica tu borrador existente y guarda los cambios cuando estés listo."
              : "Crea borradores agregando secciones y validando colisiones de horas."}
          </p>
        </div>
      </div>

      <MockSchedulerPreview initialDraftId={draftId} />
    </div>
  )
}
