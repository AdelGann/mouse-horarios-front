import { MockSchedulerPreview } from "@/components/custom/mock-scheduler-preview"
import { Calendar } from "lucide-react"

export default function NewSchedulePage() {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] font-sans">
      {/* Page Header */}
      <div className="flex items-center gap-3 border-b border-border/50 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Calendar className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">
            Diseñador de Horario Personal
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Crea borradores agregando secciones y validando colisiones de horas.
          </p>
        </div>
      </div>

      <MockSchedulerPreview />
    </div>
  )
}
