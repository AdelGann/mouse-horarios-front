"use client"

import * as React from "react"
import { 
  Plus, 
  Trash2, 
  Calendar, 
  HelpCircle,
  Save,
  FolderOpen,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useSchedules } from "@/lib/hooks/useSchedules"
import { useAcademic } from "@/lib/hooks/useAcademic"
import { toast } from "react-hot-toast"

// Types
interface TimeSlot {
  day: number
  blockIndex: number
  timeLabel: string
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  section: string
  teacher: string
  color: string
  slots: TimeSlot[]
}

const TIME_BLOCKS = [
  { label: "07:00 - 07:45", index: 0 },
  { label: "07:45 - 08:30", index: 1 },
  { label: "08:45 - 09:30", index: 2 },
  { label: "09:30 - 10:15", index: 3 },
  { label: "10:30 - 11:15", index: 4 },
  { label: "11:15 - 12:00", index: 5 },
  { label: "12:15 - 13:00", index: 6 },
  { label: "13:00 - 13:45", index: 7 },
  { label: "14:00 - 14:45", index: 8 },
  { label: "14:45 - 15:30", index: 9 },
  { label: "15:45 - 16:30", index: 10 },
  { label: "16:30 - 17:15", index: 11 },
  { label: "17:30 - 18:15", index: 12 },
  { label: "18:15 - 19:00", index: 13 },
]

const DAYS = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
  { label: "Sábado", value: 6 },
]

const SUBJECT_COLORS = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
  "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
  "bg-teal-500/10 text-teal-500 border-teal-500/20 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30",
  "bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
  "bg-purple-500/10 text-purple-500 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30",
  "bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30",
  "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:border-fuchsia-500/30",
]

interface MockSchedulerPreviewProps {
  initialDraftId?: string | null
}

export function MockSchedulerPreview({ initialDraftId }: MockSchedulerPreviewProps = {}) {
  const [user, setUser] = React.useState<any>(null)
  
  // Custom hooks
  const { getCareers } = useAcademic()
  const { getSectionsSchedules, getPersonalSchedules, savePersonalSchedule } = useSchedules()

  // Selection/Search filters
  const [careers, setCareers] = React.useState<any[]>([])
  const [selectedCareer, setSelectedCareer] = React.useState("")
  const [selectedSemester, setSelectedSemester] = React.useState<number>(1)
  const [selectedSection, setSelectedSection] = React.useState<string>("All")

  // Live Database subjects loaded
  const [dbSubjects, setDbSubjects] = React.useState<Subject[]>([])
  const [mySchedule, setMySchedule] = React.useState<Subject[]>([])
  const [personalDrafts, setPersonalDrafts] = React.useState<any[]>([])
  
  // Save draft state
  const [draftName, setDraftName] = React.useState("Mi Borrador de Horario")
  const [activeDraftId, setActiveDraftId] = React.useState<string | null>(null)

  // UI States
  const [loading, setLoading] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Map Time Block index from HH:MM string to 14 blocks of 45 mins
  const getBlockIndex = (startTime: string) => {
    if (!startTime) return 0
    const [hh, mm] = startTime.split(":").map(Number)
    const minutes = hh * 60 + mm

    if (minutes < 7 * 60 + 45) return 0      // 07:00 - 07:45
    if (minutes < 8 * 60 + 30) return 1      // 07:45 - 08:30
    if (minutes < 9 * 60 + 30) return 2      // 08:45 - 09:30
    if (minutes < 10 * 60 + 15) return 3     // 09:30 - 10:15
    if (minutes < 11 * 60 + 15) return 4     // 10:30 - 11:15
    if (minutes < 12 * 60 + 0) return 5      // 11:15 - 12:00
    if (minutes < 13 * 60 + 0) return 6      // 12:15 - 13:00
    if (minutes < 13 * 60 + 45) return 7     // 13:00 - 13:45
    if (minutes < 14 * 60 + 45) return 8     // 14:00 - 14:45
    if (minutes < 15 * 60 + 30) return 9     // 14:45 - 15:30
    if (minutes < 16 * 60 + 30) return 10    // 15:45 - 16:30
    if (minutes < 17 * 60 + 15) return 11    // 16:30 - 17:15
    if (minutes < 18 * 60 + 15) return 12    // 17:30 - 18:15
    return 13                                // 18:15 - 19:00
  }

  // Load user session and careers list
  React.useEffect(() => {
    try {
      const session = localStorage.getItem("user_session")
      if (session) {
        setUser(JSON.parse(session))
      }
    } catch (_) {}

    // Fetch Careers
    getCareers()
      .then(res => {
        setCareers(res)
        if (res.length > 0) setSelectedCareer(res[0].id)
      })
      .catch(console.error)
  }, [])

  // Load section-based schedules
  const fetchSchedules = React.useCallback(async () => {
    if (!selectedCareer) return
    setLoading(true)
    try {
      const res = await getSectionsSchedules(selectedCareer, selectedSemester)
      
      const parsedSubjects: Subject[] = []
      let colorIdx = 0

      for (const sched of res) {
        const sectionName = sched.section?.name || "N/A"
        
        for (const sub of sched.subjects) {
          const slots: TimeSlot[] = (sub.slots || []).map((slot: any) => ({
            day: slot.dayOfWeek,
            blockIndex: getBlockIndex(slot.startTime),
            timeLabel: `${slot.startTime} - ${slot.endTime}`
          }))

          parsedSubjects.push({
            id: sub.id,
            name: sub.course?.name || "Materia",
            code: sub.id.slice(0, 6).toUpperCase(), // mock code from UUID
            semester: sub.course?.semester || selectedSemester,
            section: sectionName,
            teacher: sub.teacher?.name || "Sin Profesor",
            color: SUBJECT_COLORS[colorIdx % SUBJECT_COLORS.length],
            slots
          })
          colorIdx++
        }
      }

      setDbSubjects(parsedSubjects)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [selectedCareer, selectedSemester])

  // Fetch drafts if user logged in
  const fetchDrafts = React.useCallback(async () => {
    if (!user) return
    try {
      const res = await getPersonalSchedules()
      setPersonalDrafts(res)
    } catch (e) {
      console.error(e)
    }
  }, [user])

  React.useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  React.useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  // Filter local section selection
  const availableSubjects = React.useMemo(() => {
    return dbSubjects.filter((sub) => {
      return selectedSection === "All" || sub.section === selectedSection
    })
  }, [dbSubjects, selectedSection])

  // Conflict Checking
  const checkCollision = (subjectToAdd: Subject): boolean => {
    for (const added of mySchedule) {
      for (const slotAdded of added.slots) {
        for (const slotNew of subjectToAdd.slots) {
          if (slotAdded.day === slotNew.day && slotAdded.blockIndex === slotNew.blockIndex) {
            return true
          }
        }
      }
    }
    return false
  }

  // Add subject
  const addSubject = (subject: Subject) => {
    if (mySchedule.some((s) => s.id === subject.id)) {
      toast.error("Esta materia ya está agregada en tu horario.")
      return
    }

    const hasSameCourse = mySchedule.some((s) => s.name === subject.name)
    if (hasSameCourse) {
      toast.error(`Ya agregaste otra sección de ${subject.name}. Remuévela primero.`)
      return
    }

    if (checkCollision(subject)) {
      toast.error("¡Choque de Horario! Los bloques coinciden con otra materia seleccionada.")
      return
    }

    setMySchedule([...mySchedule, subject])
    toast.success(`${subject.name} agregada al canvas`)
  }

  // Remove subject
  const removeSubject = (subject: Subject) => {
    setMySchedule(mySchedule.filter((sub) => sub.id !== subject.id))
    toast.success(`${subject.name} removida del canvas`)
  }

  // Clear canvas
  const clearSchedule = () => {
    setMySchedule([])
    setActiveDraftId(null)
    setDraftName("Mi Borrador de Horario")
    toast.success("Canvas de horario limpiado")
  }

  // Helper to query slot content
  const getPersonalSlotContent = (day: number, blockIndex: number) => {
    return mySchedule.find((sub) =>
      sub.slots.some((slot) => slot.day === day && slot.blockIndex === blockIndex)
    )
  }

  // Save draft schedule
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para guardar borradores de horarios.")
      return
    }
    if (mySchedule.length === 0) {
      toast.error("Agrega al menos una materia a tu horario antes de guardar.")
      return
    }

    setSaving(true)
    try {
      const res = await savePersonalSchedule({
        id: activeDraftId || undefined,
        name: draftName,
        subjectIds: mySchedule.map(s => s.id)
      })
      
      toast.success("¡Borrador de horario guardado exitosamente!")
      setActiveDraftId(res.id)
      fetchDrafts()
    } catch (e: any) {
      toast.error(e.message || "Error al guardar borrador")
    } finally {
      setSaving(false)
    }
  }

  // Load selected draft
  const handleLoadDraft = (draft: any) => {
    const loadedSubjects: Subject[] = (draft.subjects || []).map((sub: any, idx: number) => {
      const slots = (sub.slots || []).map((slot: any) => ({
        day: slot.dayOfWeek,
        blockIndex: getBlockIndex(slot.startTime),
        timeLabel: `${slot.startTime} - ${slot.endTime}`
      }))

      return {
        id: sub.id,
        name: sub.course?.name || "Materia",
        code: sub.id.slice(0, 6).toUpperCase(),
        semester: sub.course?.semester || 1,
        section: sub.schedule?.section?.name || "N/A",
        teacher: sub.teacher?.name || "Sin Profesor",
        color: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
        slots
      }
    })

    setMySchedule(loadedSubjects)
    setActiveDraftId(draft.id)
    setDraftName(draft.name)
    toast.success(`Cargado borrador: ${draft.name}`)
  }

  // Auto-load draft if initialDraftId was provided (must be after handleLoadDraft is defined)
  const [autoLoaded, setAutoLoaded] = React.useState(false)
  React.useEffect(() => {
    if (!autoLoaded && initialDraftId && personalDrafts.length > 0) {
      const targetDraft = personalDrafts.find((d: any) => d.id === initialDraftId)
      if (targetDraft) {
        handleLoadDraft(targetDraft)
        setAutoLoaded(true)
      }
    }
  }, [initialDraftId, personalDrafts, autoLoaded])

  return (
    <div id="demo" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-20 font-sans">
      
      {/* LEFT: Canvas grid scheduler (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* Controls header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Canvas de Horario Personal
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {mySchedule.length > 0 && (
              <Button variant="ghost" size="xs" onClick={clearSchedule} className="text-destructive">
                Limpiar Canvas
              </Button>
            )}

            {user && (
              <div className="flex items-center gap-2">
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="h-7 text-[10px] w-40"
                  placeholder="Nombre de borrador"
                />
                <Button 
                  size="xs" 
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="gap-1 shadow-xs cursor-pointer"
                >
                  {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                  <span>{activeDraftId ? "Actualizar" : "Guardar"}</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Weekly schedule Table Grid */}
        <div className="border border-border bg-card rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-2.5 font-heading text-[10px] font-semibold text-muted-foreground uppercase w-28 border-r border-border">
                  Bloque
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d.value}
                    className="p-2.5 font-heading text-[10px] font-semibold text-foreground uppercase border-r border-border last:border-0 text-center"
                  >
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_BLOCKS.map((block) => (
                <tr key={block.index} className="border-b border-border last:border-0">
                  <td className="p-2.5 font-mono text-[10px] font-medium bg-muted/20 border-r border-border text-muted-foreground whitespace-nowrap">
                    {block.label}
                  </td>
                  {DAYS.map((day) => {
                    const subject = getPersonalSlotContent(day.value, block.index)
                    return (
                      <td
                        key={day.value}
                        className={cn(
                          "p-1 border-r border-border last:border-0 h-16 w-32 transition-all relative group",
                          subject ? "bg-background" : "bg-muted/5 hover:bg-muted/10"
                        )}
                      >
                        {subject ? (
                          <div
                            className={cn(
                              "h-full w-full p-1.5 border text-[10px]/tight font-medium flex flex-col justify-between overflow-hidden shadow-xs",
                              subject.color
                            )}
                          >
                            <div className="font-semibold truncate">{subject.name}</div>
                            <div className="flex items-center justify-between text-[9px] mt-1 text-muted-foreground">
                              <span>Sec {subject.section}</span>
                              <span>{subject.code}</span>
                            </div>
                            <button
                              onClick={() => removeSubject(subject)}
                              className="absolute top-1 right-1 p-0.5 bg-background border border-border text-destructive hover:bg-destructive hover:text-white rounded-none hidden group-hover:block transition-all shadow-xs cursor-pointer"
                              title="Remover materia"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground/30 font-mono select-none">
                            -
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
          <HelpCircle className="size-3" />
          <span>Tip: Posiciona el cursor sobre una materia del canvas para eliminarla.</span>
        </div>

        {/* Load Drafts block */}
        {user && personalDrafts.length > 0 && (
          <div className="mt-2 space-y-2 border-t border-border pt-4">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <FolderOpen className="size-3.5" />
              Tus borradores guardados
            </h4>
            <div className="flex flex-wrap gap-2">
              {personalDrafts.map((d) => (
                <Button
                  key={d.id}
                  variant="outline"
                  size="xs"
                  onClick={() => handleLoadDraft(d)}
                  className={cn(
                    "text-[10px] py-1 h-7 border-border cursor-pointer",
                    activeDraftId === d.id ? "bg-primary/10 border-primary text-primary font-semibold" : ""
                  )}
                >
                  {d.name} ({d.subjects?.length || 0} mat)
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Sections list & filters (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="border-b border-border pb-3">
          <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
            Búsqueda de Secciones
          </h3>
        </div>

        {/* Filters */}
        <div className="space-y-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
              Carrera del Decanato
            </label>
            <Select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
            >
              {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
                Semestre
              </label>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(s => (
                  <option key={s} value={s}>{s}er Semestre</option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-muted-foreground uppercase font-mono font-medium">
                Sección
              </label>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="All">Todas</option>
                <option value="Sección 1">Sección 1</option>
                <option value="Sección 2">Sección 2</option>
                <option value="Sección 3">Sección 3</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Available Subjects Cards Container */}
        <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-xs text-muted-foreground gap-2 font-mono">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>Buscando horarios...</span>
            </div>
          ) : availableSubjects.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-center text-xs text-muted-foreground font-mono">
              No hay materias cargadas para este filtro en el servidor.
            </div>
          ) : (
            availableSubjects.map((sub) => {
              const isAdded = mySchedule.some((s) => s.id === sub.id)
              const hasOtherSec = mySchedule.some((s) => s.name === sub.name && s.id !== sub.id)

              return (
                <div
                  key={sub.id}
                  className={cn(
                    "border p-3 transition-colors flex flex-col gap-2 relative bg-card rounded-xl",
                    isAdded
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
                      : "border-border hover:border-foreground/20 shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-foreground">{sub.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {sub.code} • {sub.section}
                      </div>
                    </div>
                    {isAdded ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        <CheckCircle2 className="size-3" />
                        Agregado
                      </span>
                    ) : (
                      <Button
                        size="xs"
                        variant={hasOtherSec ? "outline" : "default"}
                        onClick={() => addSubject(sub)}
                        className="gap-0.5 shrink-0 cursor-pointer"
                      >
                        <Plus className="size-3" />
                        Agregar
                      </Button>
                    )}
                  </div>

                  <div className="text-[10px] border-t border-border/60 pt-2 flex flex-col gap-1 text-muted-foreground">
                    <div className="font-semibold text-foreground/80">{sub.teacher}</div>
                    <div className="font-mono text-[9px] bg-muted/40 p-1 flex flex-col gap-0.5 rounded-sm">
                      <span className="font-bold text-[8px] text-foreground uppercase tracking-wider">
                        Horarios:
                      </span>
                      {sub.slots.map((sl, idx) => (
                        <span key={idx} className="block">
                          • {DAYS.find((d) => d.value === sl.day)?.label}: {sl.timeLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
